import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'

import profile from '../../assets/profile.jpeg'

const Hero = () => {

    return (
        <section
            id='home'
            className='w-full bg-zinc-50 dark:bg-darkbg text-zinc-900 dark:text-white flex items-center px-4 sm:px-8 pt-6 pb-16 md:py-20 transition-colors duration-300'
        >

            <div className='max-w-7xl mx-auto w-full flex flex-col items-center justify-center text-center'>

                {/* PROFILE PICTURE */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className='shrink-0 mb-4 md:mb-6'
                >
                    <div
                        className='
                            w-28 h-28 
                            sm:w-36 sm:h-36 
                            md:w-52 md:h-52 
                            lg:w-64 lg:h-64 
                            rounded-full 
                            border-2 md:border-4 
                            border-primary 
                            shadow-2xl 
                            bg-white dark:bg-softdark 
                            overflow-hidden
                            transition-colors duration-300
                        '
                    >
                        <img
                            src={profile}
                            alt='Rabin Humagain'
                            className='w-full h-full object-cover'
                        />
                    </div>
                </motion.div>

                {/* NAME TEXT CONTAINER */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className='w-full max-w-xl sm:max-w-4xl px-2'
                >
                    <p className='text-primary mb-2 text-xs sm:text-sm md:text-lg tracking-wide uppercase font-semibold'>
                        Hello, I am
                    </p>

                    <h1
                        className='text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-zinc-950 dark:text-white break-words sm:whitespace-nowrap'
                    >
                        Rabin Humagain
                    </h1>
                </motion.div>

                {/* BOTTOM CONTENT BLOCK */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className='mt-6 w-full flex flex-col items-center justify-center'
                >

                    {/* TYPING ANIMATION */}
                    <div
                        className='text-sm sm:text-xl md:text-2xl lg:text-3xl text-zinc-700 dark:text-zinc-300 font-medium min-h-[32px]'
                    >
                        <TypeAnimation
                            sequence={[
                                'Computer Engineering Student',
                                2000,
                                'Full Stack Developer',
                                2000,
                                'Backend Enthusiast',
                                2000,
                                'Linux Learner',
                                2000,
                            ]}
                            speed={50}
                            repeat={Infinity}
                        />
                    </div>

                    <hr className='border-zinc-200 dark:border-borderColor my-6 w-full max-w-xl mx-auto transition-colors duration-300' />

                    {/* BIO DESCRIPTION */}
                    <p
                        className='text-zinc-600 dark:text-zinc-400 text-xs sm:text-base lg:text-lg leading-relaxed md:leading-8 max-w-2xl mx-auto px-2 transition-colors duration-300'
                    >
                        Motivated and self-driven Computer Engineering student
                        with interest in software development, networking,
                        Linux systems, CRUD applications, backend technologies,
                        and modern web development.
                    </p>

                    {/* ACTION BUTTONS Container - Fixed tracking flow */}
                    <div
                        className='
        flex
        flex-wrap
        gap-3
        mt-8
        justify-center
        w-full
    '
                    >

                        {/* DOWNLOAD CV */}
                        <a
                            href='http://localhost:5000/uploads/resume/resume.pdf'
                            target='_blank'
                            rel='noreferrer'
                            className='
            px-5 py-2.5
            sm:px-7 sm:py-3
            text-xs sm:text-base
            font-semibold
            bg-primary
            rounded-xl
            hover:opacity-90
            text-white
            transition
            duration-300
            shadow-md
            active:scale-95
        '
                        >
                            Download CV
                        </a>

                        {/* PROJECT BUTTON */}
                        <a
                            href='#projects'
                            className='
            px-5 py-2.5
            sm:px-7 sm:py-3
            text-xs sm:text-base
            font-semibold
            border
            border-primary
            text-primary
            rounded-xl
            hover:bg-primary
            hover:text-white
            transition
            duration-300
            active:scale-95
        '
                        >
                            Projects
                        </a>

                        {/* CONTACT BUTTON */}
                        <a
                            href='#contact'
                            className='
            px-5 py-2.5
            sm:px-7 sm:py-3
            text-xs sm:text-base
            font-semibold
            bg-zinc-200
            dark:bg-softdark
            text-zinc-900
            dark:text-white
            border
            border-zinc-300
            dark:border-borderColor
            rounded-xl
            hover:bg-zinc-300
            dark:hover:bg-zinc-800
            transition
            duration-300
            active:scale-95
        '
                        >
                            Contact
                        </a>

                    </div>

                    {/* SOCIAL MEDIA LINKS ROW - Placed perfectly inside the flex flow layout */}
                    <div className="flex items-center justify-center gap-6 mt-10 w-full">

                        {/* GitHub */}
                        <a
                            href="https://github.com/Rabin0811"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-all duration-300 transform hover:-translate-y-1 block"
                            aria-label="GitHub"
                        >
                            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                        </a>

                        {/* LinkedIn */}
                        <a
                            href="https://www.linkedin.com/in/rabin-humagain-417a35410"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-all duration-300 transform hover:-translate-y-1 block"
                            aria-label="LinkedIn"
                        >
                            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                        </a>

                        {/* Facebook */}
                        <a
                            href="https://www.facebook.com/rabin.humagai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-all duration-300 transform hover:-translate-y-1 block"
                            aria-label="Facebook"
                        >
                            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>

                        {/* Twitter / X */}
                        <a
                            href="https://twitter.com/@abi081126"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-all duration-300 transform hover:-translate-y-1 block"
                            aria-label="Twitter"
                        >
                            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>

                        {/* Instagram */}
                        <a
                            href="https://www.instagram.com/__ra_bin__/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-all duration-300 transform hover:-translate-y-1 block"
                            aria-label="Instagram"
                        >
                            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                            </svg>
                        </a>

                        {/* WhatsApp */}
                        <a
                            href="https://wa.me/9779762342058" /* Replace with your full phone number including country code, no symbols or spaces (e.g., 9779812345678) */
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-all duration-300 transform hover:-translate-y-1 block"
                            aria-label="WhatsApp"
                        >
                            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.411 0 11.973 0c3.178.001 6.165 1.24 8.413 3.494 2.25 2.253 3.487 5.244 3.487 8.423 0 6.567-5.351 11.914-11.912 11.914-2.002-.001-3.974-.505-5.731-1.46L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.858.002-2.634-1.023-5.11-2.887-6.974E-3.86-1.865-6.334-2.89-8.965-2.891-5.44 0-9.865 4.421-9.869 9.86-.001 1.693.456 3.348 1.322 4.813l-.995 3.636 3.737-.981zM17.16 14.37c-.285-.143-1.687-.832-1.947-.927-.261-.096-.451-.143-.641.143-.19.285-.736.927-.903 1.116-.166.19-.332.214-.617.071-.285-.143-1.204-.443-2.294-1.415-.848-.756-1.42-1.69-1.587-1.975-.166-.285-.018-.44.125-.581.128-.127.285-.333.428-.499.143-.166.19-.285.285-.476.095-.19.047-.356-.024-.499-.071-.142-.641-1.543-.878-2.114-.23-.556-.465-.48-.641-.489-.166-.008-.356-.01-.546-.01-.19 0-.5.071-.76.356-.261.285-.998.975-.998 2.376s1.022 2.753 1.165 2.943c.143.19 2.011 3.071 4.872 4.307.681.294 1.213.469 1.627.6a3.896 3.896 0 0 0 1.737.108c.517-.077 1.687-.689 1.924-1.355.237-.665.237-1.235.166-1.354-.071-.119-.261-.19-.546-.333z" />
                            </svg>
                        </a>

                    </div>

                </motion.div>

            </div>

        </section>
    )

}

export default Hero