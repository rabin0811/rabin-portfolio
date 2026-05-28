import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../layout/AdminLayout'

const Blogs = () => {

    const [blogs, setBlogs] = useState([])

    const [form, setForm] = useState({
        title: '',
        content: '',
        category: '',
    })

    const [image, setImage] = useState(null)

    const token = localStorage.getItem('token')

    const fetchBlogs = async () => {

        try {

            const res = await axios.get(
                'http://localhost:5000/api/blogs'
            )

            setBlogs(res.data.blogs)

        } catch (error) {

            console.log(error)

        }

    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    const uploadImage = async () => {

        const formData = new FormData()

        formData.append('blogImage', image)

        const res = await axios.post(
            'http://localhost:5000/api/upload/blog-image',
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        return res.data.path

    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            let imagePath = ''

            if (image) {
                imagePath = await uploadImage()
            }

            await axios.post(
                'http://localhost:5000/api/blogs/add',
                {
                    ...form,
                    image: imagePath,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setForm({
                title: '',
                content: '',
                category: '',
            })

            setImage(null)

            fetchBlogs()

        } catch (error) {

            console.log(error)

        }

    }

    const deleteBlog = async (id) => {

        try {

            await axios.delete(
                `http://localhost:5000/api/blogs/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            fetchBlogs()

        } catch (error) {

            console.log(error)

        }

    }

    return (

        <AdminLayout>

            <h1 className="text-4xl font-bold mb-8">
                Blog Management
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-10"
            >

                <input
                    type="text"
                    placeholder="Title"
                    className="w-full p-3 rounded-xl bg-zinc-800 mb-4 outline-none"
                    value={form.title}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            title: e.target.value,
                        })
                    }
                />

                <textarea
                    placeholder="Content"
                    className="w-full p-3 rounded-xl bg-zinc-800 mb-4 outline-none"
                    rows="5"
                    value={form.content}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            content: e.target.value,
                        })
                    }
                />

                <input
                    type="text"
                    placeholder="Category"
                    className="w-full p-3 rounded-xl bg-zinc-800 mb-4 outline-none"
                    value={form.category}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            category: e.target.value,
                        })
                    }
                />

                <input
                    type="file"
                    className="mb-4"
                    onChange={(e) =>
                        setImage(e.target.files[0])
                    }
                />

                <button
                    className="bg-red-600 px-6 py-3 rounded-xl hover:bg-red-700 transition"
                >
                    Add Blog
                </button>

            </form>

            <div className="grid md:grid-cols-2 gap-6">

                {blogs.map((blog) => (

                    <div
                        key={blog.id}
                        className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800"
                    >

                        {blog.image && (

                            <img
                                src={`http://localhost:5000${blog.image}`}
                                alt={blog.title}
                                className="w-full h-52 object-cover"
                            />

                        )}

                        <div className="p-5">

                            <span className="text-red-500 text-sm">
                                {blog.category}
                            </span>

                            <h2 className="text-2xl font-bold mt-2 mb-3">
                                {blog.title}
                            </h2>

                            <p className="text-zinc-400 mb-5">
                                {blog.content}
                            </p>

                            <button
                                onClick={() => deleteBlog(blog.id)}
                                className="bg-red-600 px-5 py-2 rounded-xl hover:bg-red-700 transition"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </AdminLayout>

    )

}

export default Blogs