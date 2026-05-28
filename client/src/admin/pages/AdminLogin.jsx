import { useState } from 'react'
import axios from 'axios'

const AdminLogin = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e) => {

        e.preventDefault()

        try {

            const res = await axios.post(
                'http://localhost:5000/api/auth/login',
                {
                    email,
                    password,
                }
            )

            localStorage.setItem(
                'token',
                res.data.token
            )

            window.location.href = '/admin/dashboard'

        } catch (error) {

            alert('Login failed')

        }

    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-black text-white">

            <form
                onSubmit={handleLogin}
                className="bg-zinc-900 p-10 rounded-2xl w-full max-w-md border border-zinc-800"
            >

                <h1 className="text-3xl font-bold mb-8 text-center">
                    Admin Login
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 mb-4 rounded-xl bg-zinc-800 outline-none"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 mb-6 rounded-xl bg-zinc-800 outline-none"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="w-full bg-red-600 hover:bg-red-700 transition p-3 rounded-xl"
                >
                    Login
                </button>

            </form>

        </div>

    )

}

export default AdminLogin