import { useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext' // Adjust this path if your folder structure varies

const Projects = () => {
    // Consume the current theme token to dynamically swap GitHub card style graphics
    const { theme } = useContext(ThemeContext)

    return (
        <section
            id='projects'
            /* FIX 1: Replaced bg-[#111111]. Alternates beautifully with your 
               other custom public display blocks.
            */
            className='py-24 px-6 bg-zinc-50 dark:bg-darkbg text-zinc-900 dark:text-white transition-colors duration-300 font-poppins'
        >
            <div className='max-w-7xl mx-auto'>

                <h2 className='text-4xl font-bold text-center mb-16 text-zinc-950 dark:text-white'>
                    Projects
                </h2>

                {/* Main section structural grid */}
                <div className='grid lg:grid-cols-2 gap-12 items-start'>

                    {/* PROJECT DISPLAY CARD */}
                    {/* FIX 2: Replaced dark hardcoded styles with adaptive border variations */}
                    <div className='bg-white dark:bg-softdark rounded-3xl overflow-hidden border border-zinc-200 dark:border-borderColor shadow-sm transition-colors duration-300'>

                        <img
                            src='https://images.unsplash.com/photo-1498050108023-c5249f4df085'
                            className='w-full h-[250px] object-cover'
                            alt="Project banner"
                        />

                        <div className='p-8'>
                            <h3 className='text-2xl font-bold mb-4 text-zinc-900 dark:text-white'>
                                Job Portal Management System
                            </h3>

                            <p className='text-zinc-600 dark:text-zinc-400 leading-8 transition-colors duration-300'>
                                Built using .NET Framework with CRUD operations and object-oriented programming concepts including abstraction.
                            </p>

                            {/* FIX 3: Replaced hardcoded red badge tags with unified brand styles */}
                            <div className='flex gap-3 mt-6 flex-wrap'>
                                <span className='bg-primary/10 text-primary dark:bg-primary/20 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase'>.NET</span>
                                <span className='bg-primary/10 text-primary dark:bg-primary/20 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase'>CRUD</span>
                                <span className='bg-primary/10 text-primary dark:bg-primary/20 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase'>OOP</span>
                            </div>

                            {/* FIX 4: Replaced action buttons using your theme values */}
                            <div className='flex gap-4 mt-8'>
                                <a
                                    href="https://github.com/rabin0811/job-portal/tree/main/JobPortal"
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='px-6 py-3 bg-primary text-white font-medium rounded-xl hover:opacity-90 transition shadow-md active:scale-95 inline-block text-center'
                                >
                                    GitHub
                                </a>
                                {/* <button className='px-6 py-3 border border-primary text-primary font-medium rounded-xl hover:bg-primary hover:text-white transition active:scale-95'>
                                Live Demo
                                </button> */}
                            </div>

                        </div>
                    </div>
                    <div className='bg-white dark:bg-softdark rounded-3xl overflow-hidden border border-zinc-200 dark:border-borderColor shadow-sm transition-colors duration-300'>

                        <img
                            src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3'
                            className='w-full h-[250px] object-cover'
                            alt="Portfolio project banner"
                        />

                        <div className='p-8'>

                            <h3 className='text-2xl font-bold mb-4 text-zinc-900 dark:text-white'>
                                Full Stack Portfolio Website
                            </h3>

                            <p className='text-zinc-600 dark:text-zinc-400 leading-8 transition-colors duration-300'>

                                Developed a modern full stack portfolio website using React.js,
                                Vite, Tailwind CSS, Node.js, Express.js, Prisma ORM, PostgreSQL,
                                JWT authentication, and REST API integration.

                                Implemented protected admin dashboard, CRUD operations,
                                blog management, project management, image uploads,
                                resume uploads, responsive mobile-first design,
                                SEO optimization, and dark/light theme functionality.

                            </p>

                            <div className='flex gap-3 mt-6 flex-wrap'>

                                <span className='bg-primary/10 text-primary dark:bg-primary/20 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase'>
                                    React
                                </span>

                                <span className='bg-primary/10 text-primary dark:bg-primary/20 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase'>
                                    Node.js
                                </span>

                                <span className='bg-primary/10 text-primary dark:bg-primary/20 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase'>
                                    PostgreSQL
                                </span>

                                <span className='bg-primary/10 text-primary dark:bg-primary/20 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase'>
                                    Prisma
                                </span>

                                <span className='bg-primary/10 text-primary dark:bg-primary/20 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase'>
                                    Tailwind
                                </span>

                            </div>

                            <div className='flex gap-4 mt-8 flex-wrap'>

                                <a
                                    href="https://github.com/Rabin0811/rabin-portfolio"
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='px-6 py-3 bg-primary text-white font-medium rounded-xl hover:opacity-90 transition shadow-md active:scale-95 inline-block text-center'
                                >
                                    GitHub
                                </a>

                                <a
                                    href="#contact"
                                    className='px-6 py-3 border border-primary text-primary font-medium rounded-xl hover:bg-primary hover:text-white transition active:scale-95 inline-block text-center'
                                >
                                    Contact
                                </a>

                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default Projects