import { useEffect, useState, useRef } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const PortfolioSlideshow = () => {

    const [images, setImages] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [fade, setFade] = useState(true)
    const intervalRef = useRef(null)

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await axios.get(`${API}/api/gallery`)
                setImages(res.data.images)
            } catch (error) {
                console.log(error)
            }
        }
        fetchImages()
    }, [])

    useEffect(() => {
        if (images.length < 2) return

        intervalRef.current = setInterval(() => {
            setFade(false)
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length)
                setFade(true)
            }, 300)
        }, 1000)

        return () => clearInterval(intervalRef.current)
    }, [images.length])

    if (images.length === 0) return null

    return (
        <section className="w-full bg-zinc-50 dark:bg-darkbg py-16 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-zinc-900 dark:text-white">
                    Gallery
                </h2>
                <div className="relative w-full max-w-3xl mx-auto h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-2xl bg-zinc-200 dark:bg-zinc-900">
                    {images.map((img, index) => (
                        <img
                            key={img.id}
                            src={`${API}${img.filepath}`}
                            alt={img.filename}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                                index === currentIndex && fade
                                    ? 'opacity-100'
                                    : 'opacity-0'
                            }`}
                        />
                    ))}
                </div>
                <div className="flex justify-center gap-2 mt-6">
                    {images.map((_, index) => (
                        <span
                            key={index}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                index === currentIndex
                                    ? 'bg-primary w-6'
                                    : 'bg-zinc-400 dark:bg-zinc-600'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default PortfolioSlideshow
