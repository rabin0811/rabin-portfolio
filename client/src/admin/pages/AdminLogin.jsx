import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const AdminLogin = () => {
    const navigate = useNavigate()
    const [mode, setMode] = useState('login')
    const [authMethod, setAuthMethod] = useState('password')
    const [adminExists, setAdminExists] = useState(null)
    const [config, setConfig] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({ email: '', password: '', name: '' })
    const buttonRef = useRef(null)
    const gisReady = useRef(false)

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/admin/dashboard', { replace: true })
        }
    }, [navigate])

    useEffect(() => {
        const init = async () => {
            try {
                const [adminRes, configRes] = await Promise.all([
                    fetch(`${API}/api/auth/check-admin`),
                    fetch(`${API}/api/auth/google-config`),
                ])
                setAdminExists((await adminRes.json()).exists)
                setConfig(await configRes.json())
            } catch {
                setAdminExists(false)
                setConfig({ configured: false, clientId: null })
            }
        }
        init()
    }, [])

    const handleCredential = useCallback(async (credential) => {
        setIsLoading(true)
        setError('')
        setSuccess('')

        try {
            const res = await fetch(`${API}/api/auth/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential }),
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
    }, [mode, navigate])

    useEffect(() => {
        if (authMethod !== 'google' || !config?.configured || !config?.clientId || gisReady.current) return

        const checkGIS = () => {
            if (window.google?.accounts?.id) {
                gisReady.current = true
                window.google.accounts.id.initialize({
                    client_id: config.clientId,
                    callback: (response) => {
                        if (response.credential) handleCredential(response.credential)
                    },
                    cancel_on_tap_outside: false,
                })
                if (buttonRef.current) {
                    window.google.accounts.id.renderButton(buttonRef.current, {
                        type: 'standard',
                        shape: 'rectangular',
                        theme: 'outline',
                        text: mode === 'register' ? 'signup_with' : 'signin_with',
                        size: 'large',
                        width: buttonRef.current.offsetWidth || 320,
                        logo_alignment: 'left',
                    })
                }
            } else {
                setTimeout(checkGIS, 300)
            }
        }
        checkGIS()
    }, [config, mode, handleCredential, authMethod])

    useEffect(() => {
        if (!gisReady.current || !buttonRef.current || authMethod !== 'google') return
        buttonRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(buttonRef.current, {
            type: 'standard',
            shape: 'rectangular',
            theme: 'outline',
            text: mode === 'register' ? 'signup_with' : 'signin_with',
            size: 'large',
            width: buttonRef.current.offsetWidth || 320,
            logo_alignment: 'left',
        })
    }, [mode, authMethod])

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handlePasswordAuth = async (e) => {
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

    const toggleMode = () => {
        setMode((prev) => (prev === 'login' ? 'register' : 'login'))
        setError('')
        setSuccess('')
        setFormData({ email: '', password: '', name: '' })
    }

    const switchAuthMethod = (method) => {
        setAuthMethod(method)
        setError('')
        setSuccess('')
    }

    if (adminExists === null || config === null) {
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
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold mb-1">
                            {isRegister ? 'Register Admin Account' : 'Admin Login'}
                        </h1>
                        <p className="text-zinc-400 text-sm">
                            {isRegister
                                ? 'Create the system administrator account'
                                : 'Sign in to manage your portfolio'}
                        </p>
                    </div>

                    {/* Auth method tabs */}
                    <div className="flex mb-6 bg-zinc-800 rounded-xl p-1">
                        <button
                            onClick={() => switchAuthMethod('password')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${authMethod === 'password' ? 'bg-red-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                        >
                            Email & Password
                        </button>
                        <button
                            onClick={() => switchAuthMethod('google')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${authMethod === 'google' ? 'bg-red-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                        >
                            Google Sign-In
                        </button>
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

                    {showLocked ? (
                        <div className="text-center py-8">
                            <div className="text-5xl mb-4">🔒</div>
                            <p className="text-zinc-300 text-sm leading-relaxed px-2">
                                An admin account is already registered.<br />
                                Please log in with your admin credentials.
                            </p>
                        </div>
                    ) : authMethod === 'google' && !config.configured ? (
                        <div className="text-center py-8">
                            <div className="text-5xl mb-4">⚙️</div>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Google Sign-In is not configured.
                            </p>
                            <p className="text-zinc-600 text-xs mt-3 leading-relaxed">
                                Set <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-red-400">GOOGLE_CLIENT_ID</code> in your server environment variables.
                            </p>
                        </div>
                    ) : authMethod === 'password' ? (
                        <form onSubmit={handlePasswordAuth} className="flex flex-col gap-4">
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
                    ) : (
                        <div className="flex flex-col items-center gap-5">
                            <div ref={buttonRef} className="w-full min-h-[40px] flex justify-center" />

                            {isLoading && (
                                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                    {isRegister ? 'Creating account...' : 'Signing in...'}
                                </div>
                            )}

                            {!isRegister && (
                                <a
                                    href="https://support.google.com/accounts/answer/41078"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-500 hover:text-zinc-300 text-xs transition mt-1 underline underline-offset-2"
                                >
                                    Forgot Google Account Password?
                                </a>
                            )}
                        </div>
                    )}
                </div>

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

            </div>
        </div>
    )
}

export default AdminLogin
