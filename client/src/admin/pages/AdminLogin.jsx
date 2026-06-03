import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const AdminLogin = () => {

    const navigate = useNavigate()
    const [mode, setMode] = useState('login')
    const [adminExists, setAdminExists] = useState(null)
    const [config, setConfig] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)
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
                if (res.status === 403) {
                    setError(data.message)
                } else {
                    setError(data.message || 'Authentication failed')
                }
                setIsLoading(false)
                return
            }

            localStorage.setItem('token', data.token)
            setSuccess(mode === 'register' ? 'Account created successfully! Redirecting...' : 'Login successful! Redirecting...')
            setTimeout(() => navigate('/admin/dashboard'), 800)
        } catch (err) {
            setError('Network error. Please try again.')
            setIsLoading(false)
        }
    }, [mode, navigate])

    useEffect(() => {
        if (!config?.configured || !config?.clientId || gisReady.current) return

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
    }, [config, mode, handleCredential])

    useEffect(() => {
        if (!gisReady.current || !buttonRef.current) return
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
    }, [mode])

    const toggleMode = () => {
        setMode((prev) => (prev === 'login' ? 'register' : 'login'))
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
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-1">
                            {isRegister ? 'Register Admin Account' : 'Admin Login'}
                        </h1>
                        <p className="text-zinc-400 text-sm">
                            {isRegister
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

                    {showLocked ? (
                        <div className="text-center py-8">
                            <div className="text-5xl mb-4">🔒</div>
                            <p className="text-zinc-300 text-sm leading-relaxed px-2">
                                An admin account is already registered.<br />
                                Please log in with your admin credentials.
                            </p>
                        </div>
                    ) : !config.configured ? (
                        <div className="text-center py-8">
                            <div className="text-5xl mb-4">⚙️</div>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Google Sign-In is not configured.
                            </p>
                            <p className="text-zinc-600 text-xs mt-3 leading-relaxed">
                                Set <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-red-400">GOOGLE_CLIENT_ID</code> in your server environment variables.
                            </p>
                        </div>
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
