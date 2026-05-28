import { useState } from 'react'

const Contact = () => {
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

                <form
                    onSubmit={handleSubmit}
                    className='grid gap-6 max-w-3xl mx-auto'
                >
                    {/* INPUT FIELDS UPDATED: 
                       Changes from light gray borders/backgrounds to softdark options in dark mode.
                       Uses border-borderColor tokens to match the rest of your app's wireframes.
                    */}
                    <input
                        type='text'
                        name='name'
                        placeholder='Your Name'
                        value={formData.name}
                        onChange={handleChange}
                        className='w-full bg-white dark:bg-softdark p-4 rounded-xl border border-zinc-200 dark:border-borderColor text-zinc-900 dark:text-white outline-none focus:border-primary dark:focus:border-primary transition-colors duration-300'
                        required
                    />

                    <input
                        type='email'
                        name='email'
                        placeholder='Your Email'
                        value={formData.email}
                        onChange={handleChange}
                        className='w-full bg-white dark:bg-softdark p-4 rounded-xl border border-zinc-200 dark:border-borderColor text-zinc-900 dark:text-white outline-none focus:border-primary dark:focus:border-primary transition-colors duration-300'
                        required
                    />

                    <input
                        type='text'
                        name='subject'
                        placeholder='Subject'
                        value={formData.subject}
                        onChange={handleChange}
                        className='w-full bg-white dark:bg-softdark p-4 rounded-xl border border-zinc-200 dark:border-borderColor text-zinc-900 dark:text-white outline-none focus:border-primary dark:focus:border-primary transition-colors duration-300'
                        required
                    />

                    <textarea
                        rows='6'
                        name='message'
                        placeholder='Message'
                        value={formData.message}
                        onChange={handleChange}
                        className='w-full bg-white dark:bg-softdark p-4 rounded-xl border border-zinc-200 dark:border-borderColor text-zinc-900 dark:text-white outline-none focus:border-primary dark:focus:border-primary transition-colors duration-300 resize-none'
                        required
                    />

                    {/* UPDATED: Uses unified bg-primary token with active scale feedback */}
                    <button
                        type='submit'
                        className='w-full bg-primary hover:opacity-90 text-white font-semibold py-4 rounded-xl transition duration-300 shadow-md active:scale-[0.98]'
                    >
                        Send Message
                    </button>

                </form>
            </div>
        </section>
    )
}

export default Contact