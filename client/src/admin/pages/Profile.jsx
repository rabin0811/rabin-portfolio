import { useEffect, useState, useCallback, useRef } from 'react'
import axios from 'axios'
import Cropper from 'react-easy-crop'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const ASPECT_OPTIONS = [
    { label: 'Free', value: undefined },
    { label: 'Square', value: 1 / 1 },
    { label: 'Portrait', value: 4 / 5 },
    { label: 'Landscape', value: 16 / 9 },
    { label: 'Original', value: 'original' },
]

const createCroppedImage = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = imageSrc
    })
    const canvas = document.createElement('canvas')
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    const ctx = canvas.getContext('2d')
    if (rotation) {
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.translate(-canvas.width / 2, -canvas.height / 2)
    }
    ctx.drawImage(
        image,
        pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
        0, 0, pixelCrop.width, pixelCrop.height
    )
    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92)
    })
}

const Profile = () => {
    const [admin, setAdmin] = useState(null)
    const [images, setImages] = useState([])
    const [file, setFile] = useState(null)
    const [fileUrl, setFileUrl] = useState('')
    const [preview, setPreview] = useState('')
    const [croppedBlob, setCroppedBlob] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [msg, setMsg] = useState({ text: '', type: '' })
    const token = localStorage.getItem('token')

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [adminRes, imagesRes] = await Promise.all([
                    axios.get(`${API}/api/admin/profile`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${API}/api/profile-images`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ])
                setAdmin(adminRes.data)
                setImages(imagesRes.data.images)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    const handleFileChange = (e) => {
        const selected = e.target.files[0]
        if (!selected) return
        setFile(selected)
        const url = URL.createObjectURL(selected)
        setFileUrl(url)
        setPreview('')
        setCroppedBlob(null)
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

    const handleCropConfirm = async () => {
        if (!pixelCrop) return
        setCropLoading(true)
        try {
            const blob = await createCroppedImage(fileUrl, pixelCrop, rotation)
            setCroppedBlob(blob)
            setPreview(URL.createObjectURL(blob))
            setShowCrop(false)
            URL.revokeObjectURL(fileUrl)
        } catch (error) {
            showMsg('Failed to crop image', 'error')
        }
        setCropLoading(false)
    }

    const handleCropCancel = () => {
        setShowCrop(false)
        setFile(null)
        setFileUrl('')
        setPreview('')
        setCroppedBlob(null)
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        const uploadFile = croppedBlob || file
        if (!uploadFile) return showMsg('Select an image', 'error')
        setUploading(true)
        const formData = new FormData()
        formData.append('profileImage', uploadFile, file?.name || 'profile.jpg')
        try {
            const res = await axios.post(`${API}/api/profile-images/upload`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setImages((prev) => [res.data.image, ...prev])
            setFile(null)
            setFileUrl('')
            setPreview('')
            setCroppedBlob(null)
            showMsg('Image updated successfully', 'success')
        } catch (error) {
            showMsg(error.response?.data?.message || 'Upload failed', 'error')
        }
        setUploading(false)
    }

    const deleteImage = async (id) => {
        if (!confirm('Delete this image?')) return
        try {
            await axios.delete(`${API}/api/profile-images/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setImages((prev) => prev.filter((img) => img.id !== id))
            showMsg('Image deleted', 'success')
        } catch (error) {
            showMsg('Delete failed', 'error')
        }
    }

    return (
        <div className='min-h-screen bg-[#0D0D12] text-white p-4 sm:p-8'>
            <div className='max-w-4xl mx-auto'>
                <h1 className='text-3xl sm:text-4xl font-bold mb-8 text-white/90'>Admin Profile</h1>

                {msg.text && (
                    <div className={`mb-6 px-5 py-3.5 rounded-2xl text-sm font-medium ${
                        msg.type === 'error'
                            ? 'bg-red-900/40 border border-red-800/50 text-red-300'
                            : 'bg-emerald-900/40 border border-emerald-800/50 text-emerald-300'
                    }`}>
                        {msg.text}
                    </div>
                )}

                {admin && (
                    <div className='bg-[#0D0D12] rounded-3xl p-6 sm:p-8 mb-8 border border-white/[0.06] shadow-xl'>
                        <div className='flex items-center gap-5'>
                            <div className='w-14 h-14 rounded-full bg-red-600/20 flex items-center justify-center text-xl font-bold text-red-400'>
                                {(admin.name || admin.email)?.[0]?.toUpperCase()}
                            </div>
                            <div>
                                <h2 className='text-lg font-semibold text-white/90'>{admin.name || 'Admin'}</h2>
                                <p className='text-sm text-white/40'>{admin.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className='bg-[#0D0D12] rounded-3xl p-6 sm:p-8 border border-white/[0.06] shadow-xl'>
                    <h2 className='text-2xl font-bold mb-2 text-white/90'>Profile Pictures</h2>
                    <p className='text-white/40 text-sm mb-8'>Uploaded images appear in the animated hero slideshow on your portfolio.</p>

                    <form onSubmit={handleUpload}>
                        <div
                            onClick={() => document.getElementById('profileInput')?.click()}
                            className='border-2 border-dashed border-white/[0.08] hover:border-red-500/60 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.04] group mb-5'
                        >
                            <input
                                id="profileInput"
                                type='file'
                                className='hidden'
                                accept='image/*'
                                onChange={handleFileChange}
                            />
                            <div className='w-12 h-12 rounded-full bg-red-600/10 flex items-center justify-center mb-3 group-hover:bg-red-600/20 transition'>
                                <svg className='w-5 h-5 text-red-400' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <span className='text-white/60 text-sm group-hover:text-white/80 transition'>
                                {file ? file.name : 'Click to choose an image'}
                            </span>
                            <span className='text-white/30 text-xs mt-1'>PNG, JPG, WEBP</span>
                        </div>

                        {preview && (
                            <div className='flex items-center gap-5 mb-6 p-4 bg-white/[0.03] rounded-2xl border border-white/[0.06]'>
                                <div className='w-16 h-16 rounded-full overflow-hidden border-2 border-red-500/50 shadow-lg shadow-red-500/10 shrink-0'>
                                    <img src={preview} alt="" className='w-full h-full object-cover' />
                                </div>
                                <div>
                                    <p className='text-sm text-white/60'>Cropped image ready</p>
                                    <p className='text-xs text-white/30'>Click upload to save</p>
                                </div>
                            </div>
                        )}

                        <button
                            type='submit'
                            disabled={uploading || !file}
                            className='w-full bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-red-600/20 hover:shadow-red-500/40 active:scale-[0.98]'
                        >
                            {uploading ? (
                                <span className='flex items-center justify-center gap-2'>
                                    <svg className='animate-spin w-4 h-4' viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                    Uploading...
                                </span>
                            ) : 'Upload Picture'}
                        </button>
                    </form>

                    <div className='mt-10'>
                        <h3 className='text-lg font-semibold text-white/70 mb-5'>Saved Pictures</h3>
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                            {images.map((img) => (
                                <div key={img.id} className='relative group bg-white/[0.03] rounded-2xl overflow-hidden border border-white/[0.06] aspect-square'>
                                    <img src={`${API}${img.filepath}`} alt="" className='w-full h-full object-cover' />
                                    <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm'>
                                        <button onClick={() => deleteImage(img.id)} className='bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm transition-all duration-200 active:scale-95 backdrop-blur-sm'>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {images.length === 0 && (
                                <p className='col-span-full text-center text-white/30 py-12 text-sm'>No profile pictures yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== CROP MODAL ===== */}
            {showCrop && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-6' onClick={handleCropCancel}>
                    <div
                        className='bg-[#0D0D12] rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden border border-white/[0.08] shadow-2xl shadow-red-900/10 flex flex-col'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* HEADER */}
                        <div className='flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-white/[0.06]'>
                            <div>
                                <h2 className='text-lg sm:text-xl font-bold text-white/90'>Crop & Update Image</h2>
                                <p className='text-white/40 text-xs sm:text-sm mt-0.5'>Adjust the image before saving</p>
                            </div>
                            <button onClick={handleCropCancel} className='w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition text-white/40 hover:text-white/70'>
                                <svg className='w-4 h-4' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* BODY */}
                        <div className='flex flex-col lg:flex-row flex-1 min-h-0'>
                            {/* CROP AREA */}
                            <div className='flex-1 flex flex-col min-h-0'>
                                <div className='relative flex-1 min-h-[300px] lg:min-h-[400px] bg-black/40'>
                                    <Cropper
                                        image={fileUrl}
                                        crop={crop}
                                        zoom={zoom}
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

                                {/* CONTROLS */}
                                <div className='p-4 sm:p-5 border-t border-white/[0.06] space-y-4'>
                                    {/* ASPECT RATIOS */}
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

                                    {/* ZOOM + ROTATE */}
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

                            {/* PREVIEW SIDEBAR */}
                            <div className='lg:w-56 xl:w-64 p-4 sm:p-5 border-t lg:border-t-0 lg:border-l border-white/[0.06] flex lg:flex-col items-center lg:items-stretch gap-5 lg:gap-0'>
                                <div className='lg:mb-5'>
                                    <p className='text-xs text-white/40 uppercase tracking-wider font-medium mb-3'>Preview</p>
                                    <div className={`overflow-hidden border-2 border-white/[0.08] shadow-lg ${cropShape === 'round' ? 'w-24 h-24 sm:w-28 sm:h-28 rounded-full' : 'w-full aspect-square rounded-xl'}`}>
                                        {fileUrl && (
                                            <img
                                                src={fileUrl}
                                                alt=""
                                                className='w-full h-full object-cover'
                                                style={{
                                                    transform: `scale(${zoom}) translate(${crop.x}px, ${crop.y}px)`,
                                                    transition: 'transform 0.1s',
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className='flex lg:flex-col gap-3 lg:mt-auto w-full'>
                                    <button onClick={handleCropCancel} className='flex-1 lg:w-full bg-white/[0.06] hover:bg-white/[0.1] text-white/70 hover:text-white/90 font-medium py-3 px-5 rounded-xl transition-all duration-200 text-sm active:scale-[0.98]'>
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCropConfirm}
                                        disabled={cropLoading || !pixelCrop}
                                        className='flex-1 lg:w-full bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300 shadow-lg shadow-red-600/20 hover:shadow-red-500/40 active:scale-[0.98] text-sm'
                                    >
                                        {cropLoading ? (
                                            <span className='flex items-center justify-center gap-2'>
                                                <svg className='animate-spin w-4 h-4' viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                                Cropping...
                                            </span>
                                        ) : 'Crop & Update'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile
