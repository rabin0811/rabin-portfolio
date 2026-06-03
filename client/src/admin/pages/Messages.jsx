import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

import Sidebar from '../components/Sidebar'

const Messages = () => {

    const [messages, setMessages] = useState([])



    const fetchMessages = async () => {

        try {

            const response = await fetch(

                `${API}/api/contact`,

                {
                    headers: {

                        Authorization:
                            `Bearer ${localStorage.getItem('token')}`

                    }
                }
            )

            const data = await response.json()

            setMessages(data)

        } catch (error) {

            console.log(error)

        }

    }

    useEffect(() => {
        fetchMessages()
    }, [])

    const deleteMessage = async (id) => {
        try {
            await fetch(`${API}/api/contact/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setMessages(messages.filter(msg => msg.id !== id))
        } catch (error) {
            console.log(error)
        }
    }

    const markAsRead = async (id) => {
        try {
            await fetch(`${API}/api/contact/${id}/read`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setMessages(messages.map(msg => 
                msg.id === id ? { ...msg, isRead: true } : msg
            ))
        } catch (error) {
            console.log(error)
        }
    }

    return (

        <div className='flex bg-black text-white min-h-screen'>

            <Sidebar />

            <div className='flex-1 p-10'>

                <h1
                    className='text-5xl font-bold text-red-600 mb-10'
                >
                    Contact Messages
                </h1>

                <div className='grid gap-6'>

                    {messages.map((msg) => (

                        <div
                            key={msg.id}
                            className='bg-zinc-900 p-6 rounded-2xl'
                        >

                            <div className='flex justify-between items-start'>
                                <div>
                                    <h2 className='text-2xl font-bold flex items-center gap-2'>
                                        {msg.name}
                                        {!msg.isRead && (
                                            <span className='bg-red-600 text-white text-xs px-2 py-1 rounded-full'>
                                                New
                                            </span>
                                        )}
                                    </h2>

                                    <p className='text-zinc-400 mt-2'>
                                        {msg.email}
                                    </p>

                                    <p className='text-red-500 mt-4'>
                                        {msg.subject}
                                    </p>
                                </div>

                                <div className='flex gap-3'>
                                    {!msg.isRead && (
                                        <button
                                            onClick={() => markAsRead(msg.id)}
                                            className='bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm transition'
                                        >
                                            Mark Read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteMessage(msg.id)}
                                        className='bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm transition'
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <p className='mt-4 text-zinc-300'>
                                {msg.message}
                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    )

}

export default Messages