import { useEffect, useState, useCallback, useRef } from 'react'
import axios from 'axios'
import Cropper from 'react-easy-crop'
import AdminLayout from '../layout/AdminLayout'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const ASPECT_OPTIONS = [
    { label: 'Free', value: undefined },
    { label: 'Square', value: 1 / 1 },
    { label: 'Portrait', value: 4 / 5 },
    { label: 'Landscape', value: 16 / 9 },
    { label: 'Original', value: 'original' },
]

const getRadianAngle = (deg) => (deg * Math.PI) / 180

const rotateSize = (width, height, rotation) => {
    const rad = getRadianAngle(rotation)
    return {
        width: Math.abs(Math.cos(rad) * width) + Math.abs(Math.sin(rad) * height),
        height: Math.abs(Math.sin(rad) * width) + Math.abs(Math.cos(rad) * height),
    }
}

const createCroppedImage = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = imageSrc
    })
    const rotRad = getRadianAngle(rotation)
    const { width: bBoxW, height: bBoxH } = rotateSize(image.width, image.height, rotation)
    const canvas = document.createElement('canvas')
    canvas.width = bBoxW
    canvas.height = bBoxH
    const ctx = canvas.getContext('2d')
    ctx.translate(bBoxW / 2, bBoxH / 2)
    ctx.rotate(rotRad)
    ctx.drawImage(image, -image.width / 2, -image.height / 2)
    const cropCanvas = document.createElement('canvas')
    cropCanvas.width = pixelCrop.width
    cropCanvas.height = pixelCrop.height
    const cropCtx = cropCanvas.getContext('2d')
    cropCtx.drawImage(
        canvas,
        pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
        0, 0, pixelCrop.width, pixelCrop.height
    )
    return new Promise((resolve) => {
        cropCanvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92)
    })
}

const Gallery = () => {
    const [admin, setAdmin] = useState(null)
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState({ text: '', type: '' })
    const token = localStorage.getItem('token')
    const inputRef = useRef(null)

    const [file, setFile] = useState(null)
    const [fileUrl, setFileUrl] = useState('')
    const [fileName, setFileName] = useState('')
    const [showCrop, setShowCrop] = useState(false)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [aspect, setAspect] = useState(1)
    const [cropShape, setCropShape] = useState('round')
    const [pixelCrop, setPixelCrop] = useState(null)
    const [cropLoading, setCropLoading] = useState(false)
    const [originalSize, setOriginalSize] = useState(null)

    const showMsg = (text, type) => {
        setMsg({ text, type })
        setTimeout(() => setMsg({ text: '', type: '' }), 3000)
    }

    const fetchImages = async () => {
        try {
            const res = await axios.get(`${API}/api/gallery`)
            setImages(res.data.images)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchImages()
        const fetchAdmin = async () => {
            try {
                const res = await axios.get(`${API}/api/admin/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setAdmin(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        if (token) fetchAdmin()
    }, [])

    const handleFileSelect = (e) => {
        const selected = e.target.files[0]
        if (!selected) return
        setFile(selected)
        setFileName(selected.name)
        const url = URL.createObjectURL(selected)
        setFileUrl(url)
        setZoom(1)
        setRotation(0)
        setAspect(1)
        setCropShape('round')
        setCrop({ x: 0, y: 0 })
        const img = new Image()
        img.onload = () => setOriginalSize({ w: img.width, h: img.height })
        img.src = url
        setShowCrop(true)
    }

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setPixelCrop(croppedAreaPixels)
    }, [])

    const handleAspectChange = (val) => {
        if (val === 'original' && originalSize) {
            setAspect(originalSize.w / originalSize.h)
        } else {
            setAspect(val)
        }
        if (val === undefined) setCropShape('rect')
        else setCropShape('round')
    }

    const handleRotate = (dir) => {
        setRotation((prev) => (dir === 'left' ? prev - 90 : prev + 90))
    }

    const handleReset = () => {
        setZoom(1)
        setRotation(0)
        setAspect(1)
        setCropShape('round')
        setCrop({ x: 0, y: 0 })
    }

    const handleSave = async () => {
        if (!pixelCrop || !file) return
        setCropLoading(true)
        try {
            const blob = await createCroppedImage(fileUrl, pixelCrop, rotation)
            const formData = new FormData()
            formData.append('galleryImage', blob, file.name || 'image.jpg')
            await axios.post(`${API}/api/gallery/upload`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setShowCrop(false)
            setFile(null)
            setFileUrl('')
            if (inputRef.current) inputRef.current.value = ''
            showMsg('Image uploaded successfully', 'success')
            fetchImages()
        } catch (error) {
            showMsg(error.response?.data?.message || 'Upload failed', 'error')
        }
        setCropLoading(false)
    }

    const handleCropCancel = () => {
        setShowCrop(false)
        if (fileUrl) URL.revokeObjectURL(fileUrl)
        setFile(null)
        setFileUrl('')
        setFileName('')
        if (inputRef.current) inputRef.current.value = ''
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this image?')) return
        try {
            await axios.delete(`${API}/api/gallery/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            showMsg('Image deleted', 'success')
            fetchImages()
        } catch (error) {
            showMsg('Delete failed', 'error')
        }
    }

    const moveUp = async (index) => {
        if (index === 0) return
        const ids = images.map((img) => img.id)
        ;[ids[index - 1], ids[index]] = [ids[index], ids[index - 1]]
        try {
            await axios.put(`${API}/api/gallery/reorder`, { orderedIds: ids }, {
                headers: { Authorization: `Bearer ${token}` },
            })
            fetchImages()
        } catch (error) {
            console.log(error)
        }
    }

    const moveDown = async (index) => {
        if (index === images.length - 1) return
        const ids = images.map((img) => img.id)
        ;[ids[index], ids[index + 1]] = [ids[index + 1], ids[index]]
        try {
            await axios.put(`${API}/api/gallery/reorder`, { orderedIds: ids }, {
                headers: { Authorization: `Bearer ${token}` },
            })
            fetchImages()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AdminLayout>
            <div className='max-w-6xl mx-auto'>
                {admin && (
                    <div className='bg-[#0D0D12] rounded-3xl p-4 sm:p-5 mb-6 border border-white/[0.06] shadow-xl flex items-center gap-4'>
                        <div className='w-11 h-11 rounded-full bg-red-600/20 flex items-center justify-center text-lg font-bold text-red-400 shrink-0'>
                            {(admin.name || admin.email)?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h2 className='text-base font-semibold text-white/90'>{admin.name || 'Admin'}</h2>
                            <p className='text-xs text-white/40'>{admin.email}</p>
                        </div>
                    </div>
                )}

                <div className='flex items-center justify-between mb-8'>
                    <h1 className='text-3xl sm:text-4xl font-bold text-white/90'>Gallery</h1>
                    <button
                        onClick={() => inputRef.current?.click()}
                        className='bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 shadow-lg shadow-red-600/20 hover:shadow-red-500/40 active:scale-[0.98] text-sm'
                    >
                        Add Image
                    </button>
                </div>
                <p className='text-white/40 text-sm mb-8'>Images appear in the hero slideshow on your portfolio.</p>
                <input ref={inputRef} type='file' className='hidden' accept='image/*' onChange={handleFileSelect} />

                {msg.text && (
                    <div className={`mb-6 px-5 py-3.5 rounded-2xl text-sm font-medium ${
                        msg.type === 'error'
                            ? 'bg-red-900/40 border border-red-800/50 text-red-300'
                            : 'bg-emerald-900/40 border border-emerald-800/50 text-emerald-300'
                    }`}>
                        {msg.text}
                    </div>
                )}

                {images.length === 0 ? (
                    <div className='text-center py-20'>
                        <p className='text-white/30 text-lg'>No images uploaded yet</p>
                        <p className='text-white/20 text-sm mt-2'>Click "Add Image" to upload your first gallery image</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                        {images.map((img, index) => (
                            <div key={img.id} className='relative group bg-white/[0.03] rounded-2xl overflow-hidden border border-white/[0.06]'>
                                <img src={`${API}${img.filepath}`} alt={img.filename} className='w-full h-48 object-cover' />
                                <div className='p-3 flex items-center justify-between gap-2 bg-[#0D0D12]'>
                                    <div className='flex gap-1'>
                                        <button
                                            onClick={() => moveUp(index)}
                                            disabled={index === 0}
                                            className='bg-white/[0.05] hover:bg-white/[0.1] disabled:opacity-20 p-1.5 rounded-lg text-sm text-white/50 hover:text-white/80 transition'
                                            title="Move up"
                                        >
                                            <svg className='w-3.5 h-3.5' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                                        </button>
                                        <button
                                            onClick={() => moveDown(index)}
                                            disabled={index === images.length - 1}
                                            className='bg-white/[0.05] hover:bg-white/[0.1] disabled:opacity-20 p-1.5 rounded-lg text-sm text-white/50 hover:text-white/80 transition'
                                            title="Move down"
                                        >
                                            <svg className='w-3.5 h-3.5' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(img.id)}
                                        className='bg-red-600/80 hover:bg-red-600 p-1.5 rounded-lg text-sm text-white transition'
                                        title="Delete"
                                    >
                                        <svg className='w-3.5 h-3.5' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showCrop && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-6' onClick={handleCropCancel}>
                    <div
                        className='bg-[#0D0D12] rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden border border-white/[0.08] shadow-2xl shadow-red-900/10 flex flex-col'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-white/[0.06]'>
                            <div>
                                <h2 className='text-lg sm:text-xl font-bold text-white/90'>Crop Image</h2>
                                <p className='text-white/40 text-xs sm:text-sm mt-0.5'>{fileName || 'Adjust before saving'}</p>
                            </div>
                            <button onClick={handleCropCancel} className='w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition text-white/40 hover:text-white/70'>
                                <svg className='w-4 h-4' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className='flex flex-col lg:flex-row flex-1 min-h-0'>
                            <div className='flex-1 flex flex-col min-h-0'>
                                <div className='relative flex-1 min-h-[300px] lg:min-h-[400px] bg-black/40'>
                                    <Cropper
                                        image={fileUrl}
                                        crop={crop}
                                        zoom={zoom}
                                        rotation={rotation}
                                        aspect={aspect}
                                        cropShape={cropShape}
                                        showGrid={true}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={onCropComplete}
                                        style={{
                                            containerStyle: { background: '#0a0a0f' },
                                        }}
                                    />
                                </div>

                                <div className='p-4 sm:p-5 border-t border-white/[0.06] space-y-4'>
                                    <div className='flex flex-wrap gap-2'>
                                        {ASPECT_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.label}
                                                onClick={() => handleAspectChange(opt.value)}
                                                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                                                    aspect === opt.value || (opt.value === 1 && aspect === 1 && opt.label === 'Square')
                                                        ? 'bg-red-600/20 text-red-400 border border-red-500/40 shadow-sm shadow-red-600/10'
                                                        : 'bg-white/[0.04] text-white/50 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white/70'
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className='flex items-center gap-4 flex-wrap'>
                                        <div className='flex items-center gap-3 flex-1 min-w-[140px]'>
                                            <span className='text-xs text-white/40 w-10 shrink-0'>Zoom</span>
                                            <input
                                                type="range"
                                                min={1}
                                                max={3}
                                                step={0.05}
                                                value={zoom}
                                                onChange={(e) => setZoom(Number(e.target.value))}
                                                className='flex-1 h-1.5 appearance-none bg-white/[0.08] rounded-full accent-red-500 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:shadow-red-600/30'
                                            />
                                            <span className='text-xs text-white/40 w-8 text-right'>{zoom.toFixed(1)}x</span>
                                        </div>
                                        <div className='flex gap-2'>
                                            <button onClick={() => handleRotate('left')} className='w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition text-white/50 hover:text-white/80' title="Rotate left">
                                                <svg className='w-3.5 h-3.5' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M1 4v6h6M23 20v-6h-6" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" /></svg>
                                            </button>
                                            <button onClick={() => handleRotate('right')} className='w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition text-white/50 hover:text-white/80' title="Rotate right">
                                                <svg className='w-3.5 h-3.5' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M23 4v6h-6M1 20v-6h6" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>
                                            </button>
                                            <button onClick={handleReset} className='w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition text-white/50 hover:text-white/80' title="Reset">
                                                <svg className='w-3.5 h-3.5' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='lg:w-56 xl:w-64 p-4 sm:p-5 border-t lg:border-t-0 lg:border-l border-white/[0.06] flex lg:flex-col items-center lg:items-stretch gap-4 lg:gap-0'>
                                {fileUrl && (
                                    <div className='lg:mb-5'>
                                        <p className='text-xs text-white/40 uppercase tracking-wider font-medium mb-3'>Preview</p>
                                        <div className={`overflow-hidden border-2 border-red-500/40 shadow-lg shadow-red-500/5 ${cropShape === 'round' ? 'w-24 h-24 sm:w-28 sm:h-28 rounded-full' : 'w-28 h-28 rounded-xl'}`}>
                                            <img
                                                src={fileUrl}
                                                alt=""
                                                className='w-full h-full object-cover'
                                                style={{
                                                    transform: `translate(${-crop.x}px, ${-crop.y}px) scale(${zoom})`,
                                                    transformOrigin: 'center',
                                                    transition: 'transform 0.1s',
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className='flex lg:flex-col gap-3 lg:mt-auto w-full'>
                                    <button onClick={handleCropCancel} className='flex-1 lg:w-full bg-white/[0.06] hover:bg-white/[0.1] text-white/70 hover:text-white/90 font-medium py-3 px-5 rounded-xl transition-all duration-200 text-sm active:scale-[0.98]'>
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={cropLoading || !pixelCrop}
                                        className='flex-1 lg:w-full bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300 shadow-lg shadow-red-600/20 hover:shadow-red-500/40 active:scale-[0.98] text-sm'
                                    >
                                        {cropLoading ? (
                                            <span className='flex items-center justify-center gap-2'>
                                                <svg className='animate-spin w-4 h-4' viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                                Saving...
                                            </span>
                                        ) : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

export default Gallery
