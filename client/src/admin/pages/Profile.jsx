import { useEffect, useState } from 'react'

import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Profile = () => {

    const [admin, setAdmin] = useState(null)

    const [image, setImage] = useState(null)

    const [preview, setPreview] = useState('')

    const [loading, setLoading] = useState(false)

    const token = localStorage.getItem('token')

    /* =========================================
       FETCH ADMIN PROFILE
    ========================================= */

    useEffect(() => {

        const fetchAdmin = async () => {

            try {

                const res = await axios.get(

                    `${API}/api/admin/profile`,

                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }

                )

                setAdmin(res.data)
                if (res.data.profileImage) {
                    setPreview(`${API}${res.data.profileImage}`)
                }

            } catch (error) {

                console.log(error)

            }

        }

        fetchAdmin()

    }, [])

    /* =========================================
       HANDLE IMAGE SELECT
    ========================================= */

    const handleImageChange = (e) => {

        const file = e.target.files[0]

        if (!file) return

        setImage(file)

        setPreview(URL.createObjectURL(file))

    }

    /* =========================================
       UPLOAD PROFILE IMAGE
    ========================================= */

    const uploadImage = async () => {

        try {

            if (!image) {

                return alert('Please select image')

            }

            setLoading(true)

            const formData = new FormData()

            formData.append('profileImage', image)

            const res = await axios.post(

                `${API}/api/upload/profile-image`,

                formData,

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }

            )

            alert('Profile uploaded successfully')

            console.log(res.data)

        } catch (error) {

            console.log(error)

            alert('Upload failed')

        } finally {

            setLoading(false)

        }

    }

    /* =========================================
       REMOVE PROFILE IMAGE
    ========================================= */

    const removeImage = async () => {

        if (admin && admin.profileImage) {
            try {
                const filename = admin.profileImage.split('/').pop()
                await axios.delete(`${API}/api/upload/profile/${filename}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                alert('Profile image removed')
            } catch (error) {
                console.log(error)
                alert('Failed to remove image')
                return
            }
        }

        setImage(null)

        setPreview('')
        
        setAdmin({ ...admin, profileImage: null })

    }

    return (

        <div className='min-h-screen bg-zinc-100 dark:bg-black text-black dark:text-white p-8'>

            <div className='max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8 border border-zinc-200 dark:border-zinc-800'>

                <h1 className='text-4xl font-bold mb-10'>
                    Admin Profile
                </h1>

                {
                    admin && (

                        <div className='space-y-4 mb-10'>

                            <div>
                                <p className='text-zinc-500 text-sm'>
                                    Name
                                </p>

                                <h2 className='text-xl font-semibold'>
                                    {admin.name}
                                </h2>
                            </div>

                            <div>
                                <p className='text-zinc-500 text-sm'>
                                    Email
                                </p>

                                <h2 className='text-xl font-semibold'>
                                    {admin.email}
                                </h2>
                            </div>

                        </div>

                    )
                }

                {/* PROFILE PREVIEW */}

                <div className='mb-8'>

                    <p className='text-lg font-semibold mb-4'>
                        Profile Image
                    </p>

                    {
                        preview ? (

                            <div className='flex flex-col items-start gap-4'>

                                <img
                                    src={preview}
                                    alt='Preview'
                                    className='w-40 h-40 rounded-full object-cover border-4 border-primary shadow-lg'
                                />

                                <button
                                    onClick={removeImage}
                                    className='bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition'
                                >
                                    Remove Image
                                </button>

                            </div>

                        ) : (

                            <div className='w-40 h-40 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500'>
                                No Image
                            </div>

                        )
                    }

                </div>

                {/* FILE INPUT */}

                <div className='space-y-6'>

                    <input
                        type='file'
                        accept='image/*'
                        onChange={handleImageChange}
                        className='block w-full border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 bg-white dark:bg-zinc-900'
                    />

                    <button
                        onClick={uploadImage}
                        disabled={loading}
                        className='bg-primary hover:opacity-90 text-white px-8 py-3 rounded-xl transition font-medium'
                    >
                        {
                            loading
                                ? 'Uploading...'
                                : 'Upload Profile'
                        }
                    </button>

                </div>

            </div>

        </div>

    )

}

export default Profile