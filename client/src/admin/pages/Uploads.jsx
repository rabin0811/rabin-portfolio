import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'

const Uploads = () => {
    const [resume, setResume] = useState(null)
    const [image, setImage] = useState(null)
    const [resumeInfo, setResumeInfo] = useState(null)
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState({ text: '', type: '' })

    const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

    const showMsg = (text, type) => {
        setMsg({ text, type })
        setTimeout(() => setMsg({ text: '', type: '' }), 3000)
    }

    const fetchResumeInfo = async () => {
        try {
            const res = await fetch(`${API}/api/resume/info`)
            const data = await res.json()
            if (data.exists) setResumeInfo(data)
            else setResumeInfo(null)
        } catch { setResumeInfo(null) }
    }

    useEffect(() => { fetchResumeInfo() }, [])

    const uploadResume = async () => {
        if (!resume) return showMsg('Select resume file', 'error')
        setLoading(true)
        const formData = new FormData()
        formData.append('resume', resume)
        try {
            const res = await fetch(`${API}/api/resume/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                body: formData,
            })
            const data = await res.json()
            if (data.success) {
                showMsg('Resume uploaded successfully', 'success')
                setResume(null)
                fetchResumeInfo()
            } else {
                showMsg(data.message || 'Upload failed', 'error')
            }
        } catch (error) {
            showMsg('Upload failed', 'error')
        }
        setLoading(false)
    }

    const deleteResume = async () => {
        if (!confirm('Delete resume?')) return
        setLoading(true)
        try {
            const res = await fetch(`${API}/api/resume/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            const data = await res.json()
            if (data.success) {
                showMsg('Resume deleted', 'success')
                setResumeInfo(null)
            } else {
                showMsg(data.message || 'Delete failed', 'error')
            }
        } catch { showMsg('Delete failed', 'error') }
        setLoading(false)
    }

    const uploadImage = async () => {
        if (!image) return showMsg('Select image', 'error')
        setLoading(true)
        const formData = new FormData()
        formData.append('projectImage', image)
        try {
            const res = await fetch(`${API}/api/upload/project-image`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                body: formData,
            })
            const data = await res.json()
            showMsg(data.message || 'Image uploaded', 'success')
            setImage(null)
        } catch (error) {
            showMsg('Upload failed', 'error')
        }
        setLoading(false)
    }

    return (
        <div className='flex bg-black text-white min-h-screen'>
            <Sidebar />
            <div className='flex-1 p-6 md:p-10 overflow-x-hidden'>
                <h1 className='text-4xl md:text-5xl font-bold text-red-600 mb-10'>
                    Upload Center
                </h1>

                {msg.text && (
                    <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${msg.type === 'error' ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>
                        {msg.text}
                    </div>
                )}

                <div className='grid xl:grid-cols-2 gap-8 max-w-6xl'>

                    {/* RESUME CARD */}
                    <div className='bg-zinc-900 p-6 md:p-8 rounded-3xl border border-zinc-800 flex flex-col justify-between'>
                        <div>
                            <h2 className='text-2xl md:text-3xl font-semibold mb-6 text-zinc-100'>
                                Resume Upload
                            </h2>

                            {resumeInfo ? (
                                <div className='mb-6 p-4 bg-zinc-800 rounded-2xl'>
                                    <p className='text-sm text-zinc-400'>Current resume:</p>
                                    <p className='text-zinc-200 font-medium truncate'>{resumeInfo.name}</p>
                                </div>
                            ) : (
                                <div className='mb-6 p-4 bg-zinc-800/50 rounded-2xl'>
                                    <p className='text-sm text-zinc-500'>No resume uploaded</p>
                                </div>
                            )}

                            <label className='border-2 border-dashed border-zinc-700 hover:border-red-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition bg-zinc-950/50 group mb-6 min-h-[120px] text-center'>
                                <input
                                    type='file'
                                    className='hidden'
                                    accept='.pdf,.doc,.docx'
                                    onChange={(e) => setResume(e.target.files[0])}
                                />
                                <span className='text-red-500 font-medium group-hover:text-red-400 text-sm md:text-base'>
                                    {resume ? '\u2713 File Selected' : 'Choose Resume File'}
                                </span>
                                <span className='text-zinc-500 text-xs mt-2 max-w-[200px] block truncate text-ellipsis overflow-hidden font-mono'>
                                    {resume ? resume.name : 'PDF, DOCX up to 10MB'}
                                </span>
                            </label>
                        </div>

                        <div className='flex gap-3'>
                            <button
                                onClick={uploadResume}
                                disabled={loading}
                                className='flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-red-900/20 active:scale-95'
                            >
                                {loading ? 'Uploading...' : 'Upload Resume'}
                            </button>
                            {resumeInfo && (
                                <button
                                    onClick={deleteResume}
                                    disabled={loading}
                                    className='bg-zinc-700 hover:bg-red-800 disabled:opacity-50 text-white font-semibold px-4 py-3 rounded-xl transition active:scale-95'
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>

                    {/* PROJECT IMAGE CARD */}
                    <div className='bg-zinc-900 p-6 md:p-8 rounded-3xl border border-zinc-800 flex flex-col justify-between'>
                        <div>
                            <h2 className='text-2xl md:text-3xl font-semibold mb-6 text-zinc-100'>
                                Project Image Upload
                            </h2>

                            <label className='border-2 border-dashed border-zinc-700 hover:border-red-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition bg-zinc-950/50 group mb-6 min-h-[160px] text-center'>
                                <input
                                    type='file'
                                    className='hidden'
                                    accept='image/*'
                                    onChange={(e) => setImage(e.target.files[0])}
                                />
                                <span className='text-red-500 font-medium group-hover:text-red-400 text-sm md:text-base'>
                                    {image ? '\u2713 Image Selected' : 'Choose Project Image'}
                                </span>
                                <span className='text-zinc-500 text-xs mt-2 max-w-[200px] block truncate text-ellipsis overflow-hidden font-mono'>
                                    {image ? image.name : 'PNG, JPG, WEBP up to 5MB'}
                                </span>
                            </label>
                        </div>

                        <button
                            onClick={uploadImage}
                            disabled={loading}
                            className='w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-red-900/20 active:scale-95'
                        >
                            {loading ? 'Uploading...' : 'Upload Image'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Uploads
