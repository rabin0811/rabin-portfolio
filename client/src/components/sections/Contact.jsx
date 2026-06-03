import { useState, useRef } from 'react'

const Contact = () => {
    const nameRef = useRef(null)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // Updated to use environment variables with fallback
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            const response = await fetch(
                `${apiUrl}/api/contact`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }
            )

            const data = await response.json()
            alert(data.message)

            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            })

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section
            id='contact'
            /* UPDATED: Changes from off-white (bg-zinc-50) to deep dark (dark:bg-darkbg) 
               and adjusts text colors smoothly based on theme settings.
            */
            className='w-full bg-zinc-50 dark:bg-darkbg text-zinc-900 dark:text-white py-16 md:py-20 px-4 sm:px-8 transition-colors duration-300'
        >
            <div className='max-w-5xl mx-auto'>

                {/* UPDATED: Changed text-red-600 to your brand text-primary token */}
                <h1
                    className='text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-12 text-center tracking-tight'
                >
                    Contact Me
                </h1>

                <div
                    className='max-w-3xl mx-auto'
                    onMouseEnter={() => setShowForm(true)}
                    onMouseLeave={() => setShowForm(false)}
                >
                    <div className='bg-white dark:bg-softdark border border-zinc-200 dark:border-borderColor rounded-3xl shadow-sm transition-all duration-500 hover:shadow-lg hover:shadow-red-900/10 dark:hover:shadow-red-900/5 hover:border-red-300 dark:hover:border-red-800'>
                        {/* HEADER */}
                        <div className='flex items-center gap-5 p-8 md:p-10'>
                            <div className='w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-2xl shrink-0'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='text-primary'><path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'/><polyline points='22,6 12,13 2,6'/></svg>
                            </div>
                            <div>
                                <h3 className='text-xl font-bold text-zinc-900 dark:text-white'>
                                    Get in Touch
                                </h3>
                                <p className='text-zinc-500 dark:text-zinc-400 text-sm mt-0.5'>
                                    Hover to send me a message
                                </p>
                            </div>
                        </div>

                        {/* FORM */}
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-out ${
                                showForm ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className='border-t border-zinc-200 dark:border-borderColor mx-8 md:mx-10' />
                            <form
                                onSubmit={handleSubmit}
                                className='grid gap-5 p-8 md:p-10 pt-6'
                            >
                                <input
                                    ref={nameRef}
                                    type='text'
                                    name='name'
                                    placeholder='Your Name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    className='w-full bg-zinc-50 dark:bg-darkbg p-4 rounded-xl border border-zinc-200 dark:border-borderColor text-zinc-900 dark:text-white outline-none focus:border-primary dark:focus:border-primary transition-colors duration-300'
                                    required
                                />

                                <input
                                    type='email'
                                    name='email'
                                    placeholder='Your Email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    className='w-full bg-zinc-50 dark:bg-darkbg p-4 rounded-xl border border-zinc-200 dark:border-borderColor text-zinc-900 dark:text-white outline-none focus:border-primary dark:focus:border-primary transition-colors duration-300'
                                    required
                                />

                                <input
                                    type='text'
                                    name='subject'
                                    placeholder='Subject'
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className='w-full bg-zinc-50 dark:bg-darkbg p-4 rounded-xl border border-zinc-200 dark:border-borderColor text-zinc-900 dark:text-white outline-none focus:border-primary dark:focus:border-primary transition-colors duration-300'
                                    required
                                />

                                <textarea
                                    rows='5'
                                    name='message'
                                    placeholder='Message'
                                    value={formData.message}
                                    onChange={handleChange}
                                    className='w-full bg-zinc-50 dark:bg-darkbg p-4 rounded-xl border border-zinc-200 dark:border-borderColor text-zinc-900 dark:text-white outline-none focus:border-primary dark:focus:border-primary transition-colors duration-300 resize-none'
                                    required
                                />

                                <button
                                    type='submit'
                                    className='w-full bg-primary hover:opacity-90 hover:scale-[1.02] text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-md active:scale-[0.98]'
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className='mt-12 text-center'>
                    <p className='text-zinc-500 dark:text-zinc-400 text-sm mb-5'>Or reach me on</p>
                    <div className='flex justify-center gap-4 flex-wrap'>
                        <a href='https://www.linkedin.com/in/rabin-humagain-417a35410' target='_blank' rel='noopener noreferrer' className='group flex flex-col items-center gap-1 text-red-800 dark:text-white transition-all duration-300' aria-label='LinkedIn'>
                            <span className='w-11 h-11 rounded-xl bg-zinc-200 dark:bg-softdark border border-zinc-300 dark:border-borderColor flex items-center justify-center group-hover:text-white group-hover:border-[#0077B5] group-hover:bg-[#0077B5] transition-all duration-300'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='currentColor'><path d='M22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28z'/></svg>
                            </span>
                            <span className='text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 -mb-1'>rabin-humagain</span>
                        </a>
                        <a href='https://github.com/rabin0811' target='_blank' rel='noopener noreferrer' className='group flex flex-col items-center gap-1 text-red-800 dark:text-white transition-all duration-300' aria-label='GitHub'>
                            <span className='w-11 h-11 rounded-xl bg-zinc-200 dark:bg-softdark border border-zinc-300 dark:border-borderColor flex items-center justify-center group-hover:text-white group-hover:border-zinc-600 group-hover:bg-zinc-700 transition-all duration-300'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='currentColor'><path d='M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z'/></svg>
                            </span>
                            <span className='text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 -mb-1'>rabin0811</span>
                        </a>
                        <a href='https://facebook.com/rabin.humagai' target='_blank' rel='noopener noreferrer' className='group flex flex-col items-center gap-1 text-red-800 dark:text-white transition-all duration-300' aria-label='Facebook'>
                            <span className='w-11 h-11 rounded-xl bg-zinc-200 dark:bg-softdark border border-zinc-300 dark:border-borderColor flex items-center justify-center group-hover:text-white group-hover:border-[#1877F2] group-hover:bg-[#1877F2] transition-all duration-300'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='currentColor'><path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/></svg>
                            </span>
                            <span className='text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 -mb-1'>rabin.humagai</span>
                        </a>
                        <a href='https://instagram.com/__ra_bin__' target='_blank' rel='noopener noreferrer' className='group flex flex-col items-center gap-1 text-red-800 dark:text-white transition-all duration-300' aria-label='Instagram'>
                            <span className='w-11 h-11 rounded-xl bg-zinc-200 dark:bg-softdark border border-zinc-300 dark:border-borderColor flex items-center justify-center group-hover:text-white group-hover:border-[#E4405F] group-hover:bg-[#E4405F] transition-all duration-300'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='currentColor'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z'/></svg>
                            </span>
                            <span className='text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 -mb-1'>__ra_bin__</span>
                        </a>
                        <a href='https://wa.me/9779762342058' target='_blank' rel='noopener noreferrer' className='group flex flex-col items-center gap-1 text-red-800 dark:text-white transition-all duration-300' aria-label='WhatsApp'>
                            <span className='w-11 h-11 rounded-xl bg-zinc-200 dark:bg-softdark border border-zinc-300 dark:border-borderColor flex items-center justify-center group-hover:text-white group-hover:border-[#25D366] group-hover:bg-[#25D366] transition-all duration-300'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='currentColor'><path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z'/></svg>
                            </span>
                            <span className='text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 -mb-1'>9762342058</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact