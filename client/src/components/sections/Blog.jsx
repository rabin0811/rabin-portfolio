import { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Blog = () => {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get(`${API}/api/blogs`)
                setBlogs(res.data.blogs)
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
        }
        fetchBlogs()
    }, [])

    const imageSrc = (img) => {
        if (!img) return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'
        if (img.startsWith('http')) return img
        return `${API}${img}`
    }

    if (loading) return null

    return (
        <section id="blog" className="py-24 px-6 bg-zinc-50 dark:bg-darkbg text-zinc-900 dark:text-white transition-colors duration-300 font-poppins">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-zinc-950 dark:text-white">
                        Latest Blogs
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-4 transition-colors duration-300">
                        Articles about development, Linux, networking, and backend technologies.
                    </p>
                </div>

                {blogs.length === 0 ? (
                    <p className='text-center text-zinc-500 dark:text-zinc-400'>No blogs yet.</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <div
                                key={blog.id}
                                className="bg-white dark:bg-softdark border border-zinc-200 dark:border-borderColor rounded-3xl overflow-hidden hover:-translate-y-2 transition duration-300 shadow-sm"
                            >
                                <img
                                    src={imageSrc(blog.image)}
                                    alt={blog.title}
                                    className="w-full h-[220px] object-cover"
                                />
                                <div className="p-6">
                                    <span className="text-sm font-semibold text-primary capitalize">
                                        {blog.category}
                                    </span>
                                    <h3 className="text-2xl font-semibold mt-3 text-zinc-900 dark:text-white">
                                        {blog.title}
                                    </h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-sm leading-6 line-clamp-3">
                                        {blog.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default Blog
