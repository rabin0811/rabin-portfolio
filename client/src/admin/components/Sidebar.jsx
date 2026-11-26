import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { clearAuthToken } from '../authSession'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Sidebar = () => {
    const [logoImage, setLogoImage] = useState(null)

    useEffect(() => {
        let isActive = true

        const loadLatestGalleryImage = async () => {
            try {
                const response = await fetch(`${API}/api/gallery`)
                if (!response.ok) {
                    throw new Error(`Gallery request failed with status ${response.status}`)
                }

                const { images } = await response.json()
                if (!Array.isArray(images)) {
                    throw new Error('Gallery response did not contain an image list')
                }

                const latestImage = images.reduce((latest, image) => (
                    !latest || Date.parse(image.createdAt) > Date.parse(latest.createdAt)
                        ? image
                        : latest
                ), null)

                if (isActive) {
                    setLogoImage(latestImage?.filepath ? `${API}${latestImage.filepath}` : null)
                }
            } catch (error) {
                console.error('Failed to load the latest gallery image for the admin logo', error)
            }
        }

        loadLatestGalleryImage()
        return () => {
            isActive = false
        }
    }, [])

    const logout = () => {

        clearAuthToken()

        window.location.href = '/admin'
    }

    return (

        <aside
            className='
                w-72
                min-h-screen
                bg-zinc-950
                border-r
                border-zinc-800
                p-6
                text-white
            '
        >

            <div className='flex items-center gap-3 mb-10'>
                <div className='w-12 h-12 rounded-full overflow-hidden border border-red-500/40 bg-red-600/20 flex items-center justify-center shrink-0'>
                    {logoImage ? (
                        <img
                            src={logoImage}
                            alt='Latest gallery photo'
                            className='w-full h-full object-cover'
                            onError={() => setLogoImage(null)}
                        />
                    ) : (
                        <span className='text-lg font-bold text-red-400'>RH</span>
                    )}
                </div>
                <h1 className='text-2xl font-bold text-red-600'>Admin Panel</h1>
            </div>

            <nav className='flex flex-col gap-4'>

                <Link
                    to='/admin/dashboard'
                    className='bg-zinc-900 hover:bg-zinc-800 px-5 py-3 rounded-xl transition'
                >
                    Dashboard
                </Link>

                <Link
                    to='/admin/blogs'
                    className='bg-zinc-900 hover:bg-zinc-800 px-5 py-3 rounded-xl transition'
                >
                    Blogs
                </Link>

                <Link
                    to='/admin/messages'
                    className='bg-zinc-900 hover:bg-zinc-800 px-5 py-3 rounded-xl transition'
                >
                    Messages
                </Link>

                <Link
                    to='/admin/projects'
                    className='bg-zinc-900 hover:bg-zinc-800 px-5 py-3 rounded-xl transition'
                >
                    Projects
                </Link>

                <Link
                    to='/admin/gallery'
                    className='bg-zinc-900 hover:bg-zinc-800 px-5 py-3 rounded-xl transition'
                >
                    Gallery
                </Link>

                <Link
                    to='/admin/resumes'
                    className='bg-zinc-900 hover:bg-zinc-800 px-5 py-3 rounded-xl transition'
                >
                    Resumes
                </Link>

            </nav>

            <Link
                to='/'
                className='
                    mt-10
                    block
                    text-center
                    bg-zinc-800
                    hover:bg-zinc-700
                    px-5
                    py-3
                    rounded-xl
                    w-full
                    transition
                '
            >
                Back to Portfolio
            </Link>

            <button
                onClick={logout}
                className='
                    mt-4
                    bg-red-600
                    hover:bg-red-700
                    px-5
                    py-3
                    rounded-xl
                    w-full
                    transition
                '
            >
                Logout
            </button>

        </aside>

    )

}

export default Sidebar