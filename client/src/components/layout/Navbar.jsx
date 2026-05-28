import { useContext, useState } from 'react'
import { ThemeContext } from '../../context/ThemeContext'

const Navbar = () => {
    const { theme, toggleTheme } = useContext(ThemeContext)
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav
            /* FIX 1: Handled theme switching for background and borders explicitly.
               We use standard Tailwind 'dark:' selectors to make sure the navbar matches 
               the hero section perfectly when toggled.
            */
            className="bg-white dark:bg-black text-zinc-900 dark:text-white px-4 sm:px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300 sticky top-0 z-50 font-poppins"
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* BRAND LOGO TITLE */}
                <h1 className="text-xl sm:text-2xl font-bold text-primary shrink-0 z-50">
                    Rabin Humagain
                </h1>

                {/* DESKTOP NAVIGATION ROW (Visible on large screens) */}
                <div className="hidden lg:flex gap-8 items-center">
                    <a href="#about" className="hover:text-primary transition text-zinc-600 dark:text-zinc-300 font-medium text-sm">About</a>
                    <a href="#skills" className="hover:text-primary transition text-zinc-600 dark:text-zinc-300 font-medium text-sm">Skills</a>
                    <a href="#projects" className="hover:text-primary transition text-zinc-600 dark:text-zinc-300 font-medium text-sm">Projects</a>
                    <a href="#contact" className="hover:text-primary transition text-zinc-600 dark:text-zinc-300 font-medium text-sm">Contact</a>

                    {/* DESKTOP TOGGLE BUTTON */}
                    <button
                        onClick={toggleTheme}
                        className="bg-primary hover:opacity-90 text-white px-5 py-2 rounded-xl transition font-medium text-sm flex items-center gap-2 shadow-md active:scale-95 ml-2 whitespace-nowrap"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </div>

                {/* MOBILE UTILITY CONTROLS (Visible below lg breakpoint) */}
                <div className="flex items-center gap-3 lg:hidden z-50">
                    {/* Compact Mobile Theme Switcher Icon */}
                    <button
                        onClick={toggleTheme}
                        className="bg-primary hover:opacity-90 text-white p-2.5 rounded-xl transition text-sm shadow-md active:scale-95"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>

                    {/* HAMBURGER / CLOSE TRIGGER */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition active:scale-95"
                    >
                        {/* FIX 2: Fixed class conflict warning by applying 'sm:h-6' cleanly */}
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

            </div>

            {/* SMOOTH SLIDING MOBILE DRAWER OVERLAY */}
            {/* Dark blur backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Menu Slide Drawer panel */}
            <div
                className={`fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-white dark:bg-black border-l border-zinc-200 dark:border-zinc-800 p-8 pt-24 flex flex-col gap-3 lg:hidden shadow-2xl transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2 px-4">
                    Navigation
                </span>

                <a
                    href="#about"
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-primary dark:hover:text-primary px-4 py-3.5 rounded-xl transition-all font-medium text-zinc-600 dark:text-zinc-300 text-lg"
                >About</a>
                <a
                    href="#skills"
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-primary dark:hover:text-primary px-4 py-3.5 rounded-xl transition-all font-medium text-zinc-600 dark:text-zinc-300 text-lg"
                >Skills</a>
                <a
                    href="#projects"
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-primary dark:hover:text-primary px-4 py-3.5 rounded-xl transition-all font-medium text-zinc-600 dark:text-zinc-300 text-lg"
                >Projects</a>
                <a
                    href="#contact"
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-primary dark:hover:text-primary px-4 py-3.5 rounded-xl transition-all font-medium text-zinc-600 dark:text-zinc-300 text-lg"
                >Contact</a>
            </div>
        </nav>
    )
}

export default Navbar