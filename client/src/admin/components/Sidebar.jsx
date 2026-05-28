import { Link } from 'react-router-dom'

const Sidebar = () => {

    const logout = () => {

        localStorage.removeItem('token')

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

            <h1
                className='
                    text-3xl
                    font-bold
                    text-red-600
                    mb-10
                '
            >
                Admin Panel
            </h1>

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
                    to='/admin/uploads'
                    className='bg-zinc-900 hover:bg-zinc-800 px-5 py-3 rounded-xl transition'
                >
                    Uploads
                </Link>

            </nav>

            <button
                onClick={logout}
                className='
                    mt-10
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