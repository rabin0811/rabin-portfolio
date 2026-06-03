import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../layout/AdminLayout'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Gallery = () => {

    const [images, setImages] = useState([])
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const token = localStorage.getItem('token')

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
    }, [])

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!file) {
            return toast.error('Select an image first')
        }

        const formData = new FormData()
        formData.append('galleryImage', file)

        try {
            setLoading(true)
            await axios.post(`${API}/api/gallery/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            toast.success('Image uploaded')
            setFile(null)
            fetchImages()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API}/api/gallery/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            toast.success('Image deleted')
            fetchImages()
        } catch (error) {
            toast.error('Delete failed')
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
            <ToastContainer position="top-right" theme="dark" />
            <h1 className="text-4xl font-bold mb-8">Gallery Management</h1>

            <form onSubmit={handleUpload} className="bg-zinc-900 p-6 rounded-2xl mb-10 max-w-xl">
                <label className="border-2 border-dashed border-zinc-700 hover:border-red-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition bg-zinc-950/50 group mb-6 min-h-[120px] text-center">
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <span className="text-red-500 font-medium group-hover:text-red-400 text-sm md:text-base">
                        {file ? '✓ ' + file.name : 'Choose Gallery Image'}
                    </span>
                    <span className="text-zinc-500 text-xs mt-2">
                        PNG, JPG, WEBP, GIF, SVG
                    </span>
                </label>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-6 py-3 rounded-xl transition"
                >
                    {loading ? 'Uploading...' : 'Upload Image'}
                </button>
            </form>

            {images.length === 0 ? (
                <p className="text-zinc-500">No images uploaded yet.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                        <div key={img.id} className="bg-zinc-900 rounded-2xl overflow-hidden group relative">
                            <img
                                src={`${API}${img.filepath}`}
                                alt={img.filename}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-3 flex items-center justify-between gap-2">
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => moveUp(index)}
                                        disabled={index === 0}
                                        className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 p-1.5 rounded-lg text-sm"
                                        title="Move up"
                                    >
                                        &#9650;
                                    </button>
                                    <button
                                        onClick={() => moveDown(index)}
                                        disabled={index === images.length - 1}
                                        className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 p-1.5 rounded-lg text-sm"
                                        title="Move down"
                                    >
                                        &#9660;
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleDelete(img.id)}
                                    className="bg-red-800 hover:bg-red-700 p-1.5 rounded-lg text-sm"
                                    title="Delete"
                                >
                                    &#10005;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    )
}

export default Gallery
