import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../layout/AdminLayout'

const Projects = () => {

    const [projects, setProjects] = useState([])

    const [form, setForm] = useState({
        title: '',
        description: '',
        github: '',
        liveDemo: '',
    })

    const [image, setImage] = useState(null)

    const token = localStorage.getItem('token')

    const fetchProjects = async () => {

        try {

            const res = await axios.get(
                'http://localhost:5000/api/projects'
            )

            setProjects(res.data.projects)

        } catch (error) {

            console.log(error)

        }

    }

    useEffect(() => {
        fetchProjects()
    }, [])

    const uploadImage = async () => {

        const formData = new FormData()

        formData.append('projectImage', image)

        const res = await axios.post(
            'http://localhost:5000/api/upload/project-image',
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
                'http://localhost:5000/api/projects/add',
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

            fetchProjects()

        } catch (error) {

            console.log(error)

        }

    }

    const deleteProject = async (id) => {

        try {

            await axios.delete(
                `http://localhost:5000/api/projects/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            fetchProjects()

        } catch (error) {

            console.log(error)

        }

    }

    return (

        <AdminLayout>

            <h1 className="text-4xl font-bold mb-8">
                Project Management
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-zinc-900 p-6 rounded-2xl mb-10"
            >

                <input
                    type="text"
                    placeholder="Title"
                    className="w-full p-3 mb-4 rounded-xl bg-zinc-800"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            title: e.target.value,
                        })
                    }
                />

                <textarea
                    placeholder="Description"
                    className="w-full p-3 mb-4 rounded-xl bg-zinc-800"
                    rows="5"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            description: e.target.value,
                        })
                    }
                />

                <input
                    type="text"
                    placeholder="GitHub URL"
                    className="w-full p-3 mb-4 rounded-xl bg-zinc-800"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            github: e.target.value,
                        })
                    }
                />

                <input
                    type="text"
                    placeholder="Live Demo URL"
                    className="w-full p-3 mb-4 rounded-xl bg-zinc-800"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            liveDemo: e.target.value,
                        })
                    }
                />

                <input
                    type="file"
                    className="mb-5"
                    onChange={(e) =>
                        setImage(e.target.files[0])
                    }
                />

                <button
                    className="bg-red-600 px-6 py-3 rounded-xl"
                >
                    Add Project
                </button>

            </form>

            <div className="grid md:grid-cols-2 gap-6">

                {projects.map((project) => (

                    <div
                        key={project.id}
                        className="bg-zinc-900 rounded-2xl overflow-hidden"
                    >

                        {project.image && (

                            <img
                                src={`http://localhost:5000${project.image}`}
                                alt={project.title}
                                className="w-full h-52 object-cover"
                            />

                        )}

                        <div className="p-5">

                            <h2 className="text-2xl font-bold mb-3">
                                {project.title}
                            </h2>

                            <p className="text-zinc-400 mb-5">
                                {project.description}
                            </p>

                            <div className="flex gap-3">

                                <a
                                    href={project.github}
                                    target="_blank"
                                    className="bg-zinc-800 px-4 py-2 rounded-xl"
                                >
                                    GitHub
                                </a>

                                <a
                                    href={project.liveDemo}
                                    target="_blank"
                                    className="bg-red-600 px-4 py-2 rounded-xl"
                                >
                                    Live Demo
                                </a>

                                <button
                                    onClick={() =>
                                        deleteProject(project.id)
                                    }
                                    className="bg-red-800 px-4 py-2 rounded-xl"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </AdminLayout>

    )

}

export default Projects