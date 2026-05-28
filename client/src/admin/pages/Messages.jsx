import { useEffect, useState } from 'react'

import Sidebar from '../components/Sidebar'

const Messages = () => {

    const [messages, setMessages] = useState([])

    useEffect(() => {

        fetchMessages()

    }, [])

    const fetchMessages = async () => {

        try {

            const response = await fetch(

                'http://localhost:5000/api/contact',

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

                            <h2 className='text-2xl font-bold'>
                                {msg.name}
                            </h2>

                            <p className='text-zinc-400 mt-2'>
                                {msg.email}
                            </p>

                            <p className='text-red-500 mt-4'>
                                {msg.subject}
                            </p>

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