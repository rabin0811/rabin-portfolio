import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../layout/AdminLayout'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Resumes = () => {

    const [resumes, setResumes] = useState([])
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const token = localStorage.getItem('token')

    const fetchResumes = async () => {
        try {
            const res = await axios.get(`${API}/api/resume/list`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setResumes(res.data.resumes)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { fetchResumes() }, [])

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!file) return alert('Select a file')
        setLoading(true)
        const formData = new FormData()
        formData.append('resume', file)
        try {
            await axios.post(`${API}/api/resume/upload`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setFile(null)
            fetchResumes()
        } catch (error) {
            alert(error.response?.data?.message || 'Upload failed')
        }
        setLoading(false)
    }

    const setActive = async (id) => {
        try {
            await axios.put(`${API}/api/resume/${id}/active`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            })
            fetchResumes()
        } catch (error) {
            console.log(error)
        }
    }

    const deleteResume = async (id) => {
        if (!confirm('Delete this resume?')) return
        try {
            await axios.delete(`${API}/api/resume/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            fetchResumes()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AdminLayout>
            <h1 className="text-4xl font-bold mb-8">Resume Management</h1>

            <form onSubmit={handleUpload} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-10">
                <label className="border-2 border-dashed border-zinc-700 hover:border-red-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition bg-zinc-950/50 mb-4 min-h-[120px] text-center">
                    <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <span className="text-red-500 font-medium text-sm">
                        {file ? file.name : 'Choose Resume File'}
                    </span>
                    <span className="text-zinc-500 text-xs mt-2">PDF, DOCX up to 10MB</span>
                </label>
                <button
                    type="submit"
                    disabled={loading || !file}
                    className="bg-red-600 px-6 py-3 rounded-xl hover:bg-red-700 transition disabled:opacity-50"
                >
                    {loading ? 'Uploading...' : 'Upload Resume'}
                </button>
            </form>

            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-800 text-zinc-400 text-sm">
                                <th className="p-4">Name</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Uploaded</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resumes.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-zinc-500">
                                        No resumes uploaded yet
                                    </td>
                                </tr>
                            ) : (
                                resumes.map((resume) => (
                                    <tr key={resume.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                                        <td className="p-4 font-medium">{resume.name}</td>
                                        <td className="p-4 text-zinc-400 text-sm">{resume.mimeType}</td>
                                        <td className="p-4">
                                            {resume.isActive ? (
                                                <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">Active</span>
                                            ) : (
                                                <span className="bg-zinc-700 text-zinc-400 text-xs px-3 py-1 rounded-full">Inactive</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-zinc-400 text-sm">
                                            {new Date(resume.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                {!resume.isActive && (
                                                    <button
                                                        onClick={() => setActive(resume.id)}
                                                        className="bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs transition"
                                                    >
                                                        Set Active
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteResume(resume.id)}
                                                    className="bg-red-700 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
}

export default Resumes
