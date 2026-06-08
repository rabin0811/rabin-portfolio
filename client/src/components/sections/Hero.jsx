import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Hero = () => {

    const [profileImages, setProfileImages] = useState([])
    const [fallbackImage, setFallbackImage] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [imageError, setImageError] = useState(false)
    const [adminName, setAdminName] = useState('Rabin Humagain')
    const [hasResume, setHasResume] = useState(false)

    useEffect(() => {

        const fetchAll = async () => {

            try {

                const galleryRes = await axios.get(`${API}/api/gallery`)

                const galleryImgs = (galleryRes.data.images || []).map(
                    (img) => img.filepath
                )

                setProfileImages(galleryImgs)

            } catch (error) {

                console.log(error)

                try {
                    const fallback = await axios.get(
                        `${API}/api/auth/public-profile`
                    )
                    if (fallback.data && fallback.data.profileImage) {
                        setFallbackImage(fallback.data.profileImage)
                    }
                    if (fallback.data && fallback.data.name) {
                        setAdminName(fallback.data.name)
                    }
                } catch {}
            }

        }

        const fetchResume = async () => {
            try {
                const res = await axios.get(`${API}/api/resume/info`)
                if (res.data.exists) setHasResume(true)
            } catch { setHasResume(false) }
        }

        fetchAll()
        fetchResume()

    }, [])

    useEffect(() => {
        if (profileImages.length < 2) return
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % profileImages.length)
        }, 1500)
        return () => clearInterval(interval)
    }, [profileImages.length])

    const currentImage = profileImages.length > 0
        ? `${API}${profileImages[currentIndex]}`
        : fallbackImage
            ? `${API}${fallbackImage}`
            : null

    return (

        <section
            id='home'
            className='w-full bg-zinc-50 dark:bg-darkbg text-zinc-900 dark:text-white flex items-center px-4 sm:px-8 pt-6 pb-16 md:py-20 transition-colors duration-300'
        >

            <div className='max-w-7xl mx-auto w-full flex flex-col items-center justify-center text-center'>

                {/* PROFILE IMAGE */}

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

                        {currentImage && !imageError ? (
                            <motion.img
                                key={currentImage}
                                src={currentImage}
                                alt='Rabin Humagain'
                                className='w-full h-full object-cover'
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className='w-full h-full flex items-center justify-center text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-primary'>
                                {adminName.charAt(0)}
                            </div>
                        )}

                    </div>

                </motion.div>

                {/* NAME */}

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className='w-full max-w-xl sm:max-w-4xl px-2'
                >

                    <p className='text-primary mb-2 text-xs sm:text-sm md:text-lg tracking-wide uppercase font-semibold'>
                        Hello, I am
                    </p>

                    <Link to="/admin">
                        <h1
                            className='text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-zinc-950 dark:text-white break-words sm:whitespace-nowrap hover:text-primary transition-colors cursor-pointer'
                        >
                            {adminName}
                        </h1>
                    </Link>

                </motion.div>

                {/* CONTENT */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className='mt-6 w-full flex flex-col items-center justify-center'
                >

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

                    <p
                        className='text-zinc-600 dark:text-zinc-400 text-xs sm:text-base lg:text-lg leading-relaxed md:leading-8 max-w-2xl mx-auto px-2 transition-colors duration-300'
                    >
                        Motivated and self-driven Computer Engineering student
                        with interest in software development, networking,
                        Linux systems, CRUD applications, backend technologies,
                        and modern web development.
                    </p>

                    {/* BUTTONS */}

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

                        <a
                            href={hasResume ? `${API}/api/resume/download` : '#'}
                            target='_blank'
                            rel='noreferrer'
                            className={`
                                px-5 py-2.5
                                sm:px-7 sm:py-3
                                text-xs sm:text-base
                                font-semibold
                                rounded-xl
                                transition
                                duration-300
                                shadow-md
                                active:scale-95
                                ${hasResume
                                    ? 'bg-primary hover:opacity-90 hover:scale-105 text-white'
                                    : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 cursor-not-allowed'
                                }
                            `}
                        >
                            {hasResume ? 'View CV' : 'No CV Available'}
                        </a>

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
                                hover:scale-105
                                transition-all
                                duration-300
                                active:scale-95
                            '
                        >
                            Projects
                        </a>

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
                                hover:scale-105
                                transition-all
                                duration-300
                                active:scale-95
                            '
                        >
                            Contact
                        </a>

                    </div>

                </motion.div>

            </div>

        </section>
    )

}

export default Hero
