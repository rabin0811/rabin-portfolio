import { useState } from 'react'
import Sidebar from '../components/Sidebar'

const Uploads = () => {
    const [resume, setResume] = useState(null)
    const [image, setImage] = useState(null)

    const uploadResume = async () => {
        if (!resume) {
            return alert('Select resume file')
        }

        const formData = new FormData()
        formData.append('resume', resume)

        try {
            const response = await fetch(
                'http://localhost:5000/api/upload/resume',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                }
            )

            const data = await response.json()
            alert(data.message || 'Resume uploaded')
        } catch (error) {
            console.log(error)
        }
    }

    const uploadImage = async () => {
        if (!image) {
            return alert('Select image')
        }

        const formData = new FormData()
        formData.append('projectImage', image)

        try {
            const response = await fetch(
                'http://localhost:5000/api/upload/project-image',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                }
            )

            const data = await response.json()
            alert(data.message || 'Image uploaded')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='flex bg-black text-white min-h-screen'>
            <Sidebar />

            <div className='flex-1 p-6 md:p-10 overflow-x-hidden'>
                <h1 className='text-4xl md:text-5xl font-bold text-red-600 mb-10'>
                    Upload Center
                </h1>

                <div className='grid xl:grid-cols-2 gap-8 max-w-6xl'>

                    {/* RESUME CARD */}
                    <div className='bg-zinc-900 p-6 md:p-8 rounded-3xl border border-zinc-800 flex flex-col justify-between'>
                        <div>
                            <h2 className='text-2xl md:text-3xl font-semibold mb-6 text-zinc-100'>
                                Resume Upload
                            </h2>

                            {/* Custom Styled Upload Dropzone Box */}
                            <label className='border-2 border-dashed border-zinc-700 hover:border-red-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition bg-zinc-950/50 group mb-6 min-h-[160px] text-center'>
                                <input
                                    type='file'
                                    className='hidden' // Hides the broken default text input completely
                                    accept='.pdf,.doc,.docx'
                                    onChange={(e) => setResume(e.target.files[0])}
                                />
                                <span className='text-red-500 font-medium group-hover:text-red-400 text-sm md:text-base'>
                                    {resume ? '✓ File Selected' : 'Choose Resume File'}
                                </span>
                                <span className='text-zinc-500 text-xs mt-2 max-w-[200px] block truncate text-ellipsis overflow-hidden font-mono'>
                                    {resume ? resume.name : 'PDF, DOCX up to 5MB'}
                                </span>
                            </label>
                        </div>

                        <button
                            onClick={uploadResume}
                            className='w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-red-900/20 active:scale-95'
                        >
                            Upload Resume
                        </button>
                    </div>

                    {/* PROJECT IMAGE CARD */}
                    <div className='bg-zinc-900 p-6 md:p-8 rounded-3xl border border-zinc-800 flex flex-col justify-between'>
                        <div>
                            <h2 className='text-2xl md:text-3xl font-semibold mb-6 text-zinc-100'>
                                Project Image Upload
                            </h2>

                            {/* Custom Styled Upload Dropzone Box */}
                            <label className='border-2 border-dashed border-zinc-700 hover:border-red-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition bg-zinc-950/50 group mb-6 min-h-[160px] text-center'>
                                <input
                                    type='file'
                                    className='hidden' // Hides the broken default text input completely
                                    accept='image/*'
                                    onChange={(e) => setImage(e.target.files[0])}
                                />
                                <span className='text-red-500 font-medium group-hover:text-red-400 text-sm md:text-base'>
                                    {image ? '✓ Image Selected' : 'Choose Project Image'}
                                </span>
                                <span className='text-zinc-500 text-xs mt-2 max-w-[200px] block truncate text-ellipsis overflow-hidden font-mono'>
                                    {image ? image.name : 'PNG, JPG, WEBP up to 5MB'}
                                </span>
                            </label>
                        </div>

                        <button
                            onClick={uploadImage}
                            className='w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-red-900/20 active:scale-95'
                        >
                            Upload Image
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Uploads