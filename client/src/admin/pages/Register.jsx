import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Register = () => {

    const navigate = useNavigate()

    useEffect(() => {
        const check = async () => {
            try {
                const res = await fetch(`${API}/api/auth/check-admin`)
                const data = await res.json()
                if (data.exists) {
                    navigate('/admin')
                }
            } catch {
                navigate('/admin')
            }
        }
        check()
    }, [navigate])

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="bg-zinc-900 rounded-2xl w-full max-w-md border border-zinc-800 p-8 sm:p-10 text-center shadow-2xl">
                <div className="text-5xl mb-4">🔒</div>
                <h1 className="text-2xl font-bold mb-3">Registration Disabled</h1>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    Registration is now handled via Google Sign-In on the admin login page.
                </p>
                <Link
                    to="/admin"
                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition"
                >
                    Go to Admin Login
                </Link>
            </div>
        </div>
    )
}

export default Register
