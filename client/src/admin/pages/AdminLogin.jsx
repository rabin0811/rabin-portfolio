import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const AdminLogin = () => {
    const navigate = useNavigate()
    const [mode, setMode] = useState('login')
    const [adminExists, setAdminExists] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({ email: '', password: '', name: '' })
    const [forgotEmail, setForgotEmail] = useState('')
    const [resetCode, setResetCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [codeSent, setCodeSent] = useState(false)

    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const res = await fetch(`${API}/api/auth/verify`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    if (res.ok) {
                        navigate('/admin/dashboard', { replace: true })
                        return
                    }
                } catch {}
                localStorage.removeItem('token')
            }
            try {
                const adminRes = await fetch(`${API}/api/auth/check-admin`)
                setAdminExists((await adminRes.json()).exists)
            } catch {
                setAdminExists(false)
            }
        }
        init()
    }, [navigate])

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        setSuccess('')

        try {
            const endpoint = mode === 'register' ? 'register' : 'login'
            const body = mode === 'register'
                ? { email: formData.email, password: formData.password, name: formData.name }
                : { email: formData.email, password: formData.password }

            const res = await fetch(`${API}/api/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || 'Authentication failed')
                setIsLoading(false)
                return
            }

            localStorage.setItem('token', data.token)
            setSuccess(mode === 'register' ? 'Account created successfully! Redirecting...' : 'Login successful! Redirecting...')
            setTimeout(() => navigate('/admin/dashboard'), 800)
        } catch {
            setError('Network error. Please try again.')
            setIsLoading(false)
        }
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        setSuccess('')

        try {
            const res = await fetch(`${API}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail }),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.message || 'Failed to send code')
                setIsLoading(false)
                return
            }
            setCodeSent(true)
            setSuccess('Reset code sent! Check your email.')
        } catch {
            setError('Network error. Please try again.')
        }
        setIsLoading(false)
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        setSuccess('')

        try {
            const res = await fetch(`${API}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail, code: resetCode, newPassword }),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.message || 'Reset failed')
                setIsLoading(false)
                return
            }
            setSuccess('Password reset successfully! Redirecting to login...')
            setTimeout(() => {
                setMode('login')
                setCodeSent(false)
                setForgotEmail('')
                setResetCode('')
                setNewPassword('')
                setSuccess('')
            }, 2000)
        } catch {
            setError('Network error. Please try again.')
        }
        setIsLoading(false)
    }

    const toggleMode = () => {
        setMode((prev) => (prev === 'login' ? 'register' : 'login'))
        setError('')
        setSuccess('')
        setFormData({ email: '', password: '', name: '' })
    }

    if (adminExists === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-400 text-sm">Loading authentication...</p>
                </div>
            </div>
        )
    }

    const isRegister = mode === 'register'
    const showLocked = isRegister && adminExists === true

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="bg-zinc-900 rounded-2xl w-full max-w-md border border-zinc-800 overflow-hidden shadow-2xl transition-all duration-300">

                <div className="p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-1">
                            {mode === 'forgot' ? 'Reset Password' : isRegister ? 'Register Admin Account' : 'Admin Login'}
                        </h1>
                        <p className="text-zinc-400 text-sm">
                            {mode === 'forgot'
                                ? codeSent ? 'Enter the code sent to your email' : 'Enter your email to receive a reset code'
                                : isRegister
                                    ? 'Create the system administrator account'
                                    : 'Sign in to manage your portfolio'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3.5 rounded-xl mb-6 text-sm text-center leading-relaxed">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3.5 rounded-xl mb-6 text-sm text-center">
                            {success}
                        </div>
                    )}

                    {mode === 'forgot' ? (
                        codeSent ? (
                            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="6-digit code"
                                    value={resetCode}
                                    onChange={(e) => setResetCode(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 text-white outline-none focus:border-red-500 transition-colors placeholder-zinc-500 text-center text-2xl tracking-[0.5em]"
                                    required
                                    maxLength={6}
                                />
                                <input
                                    type="password"
                                    placeholder="New password (min 6 characters)"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 text-white outline-none focus:border-red-500 transition-colors placeholder-zinc-500"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setMode('login'); setCodeSent(false); setError(''); setSuccess('') }}
                                    className="text-zinc-400 hover:text-white text-sm transition text-center mt-2"
                                >
                                    Back to login
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 text-white outline-none focus:border-red-500 transition-colors placeholder-zinc-500"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isLoading ? 'Sending...' : 'Send Reset Code'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                                    className="text-zinc-400 hover:text-white text-sm transition text-center mt-2"
                                >
                                    Back to login
                                </button>
                            </form>
                        )
                    ) : showLocked ? (
                        <div className="text-center py-8">
                            <div className="text-5xl mb-4">&#x1f512;</div>
                            <p className="text-zinc-300 text-sm leading-relaxed px-2">
                                An admin account is already registered.<br />
                                Please log in with your admin credentials.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {isRegister && (
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 text-white outline-none focus:border-red-500 transition-colors placeholder-zinc-500"
                                />
                            )}
                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 text-white outline-none focus:border-red-500 transition-colors placeholder-zinc-500"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 text-white outline-none focus:border-red-500 transition-colors placeholder-zinc-500"
                                required
                                minLength={6}
                            />
                            {mode === 'login' && (
                                <button
                                    type="button"
                                    onClick={() => { setMode('forgot'); setError(''); setSuccess(''); setForgotEmail(formData.email) }}
                                    className="text-zinc-400 hover:text-red-400 text-sm text-right transition"
                                >
                                    Forgot password?
                                </button>
                            )}
                            <button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md active:scale-[0.98] disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        {isRegister ? 'Creating account...' : 'Signing in...'}
                                    </span>
                                ) : (
                                    isRegister ? 'Create Account' : 'Sign In'
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {mode !== 'forgot' && (
                    <div className="border-t border-zinc-800 px-8 sm:px-10 py-4 bg-zinc-950/50">
                        <p className="text-center text-zinc-400 text-sm">
                            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button
                                onClick={toggleMode}
                                className="text-red-500 hover:text-red-400 font-semibold transition underline underline-offset-2"
                            >
                                {isRegister ? 'Admin Login' : 'Register Admin Account'}
                            </button>
                        </p>
                    </div>
                )}

            </div>
        </div>
    )
}

export default AdminLogin
