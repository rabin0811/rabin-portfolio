import {
    createContext,
    useEffect,
    useState,
} from 'react'

export const ThemeContext = createContext()

const ThemeProvider = ({ children }) => {

    // Default strictly to 'dark' mode out-of-the-box if no cached preference exists
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 'dark'
    )

    useEffect(() => {
        const root = window.document.documentElement

        // Clean slate reset
        root.classList.remove('light', 'dark')

        if (theme === 'dark') {
            root.classList.add('dark')
            root.style.colorScheme = 'dark'
        } else {
            root.classList.add('light')
            root.style.colorScheme = 'light'
        }

        localStorage.setItem('theme', theme)
    }, [theme])

    // Clean structural binary switcher function
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
    }

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme, // Exposing our binary toggle function instead of setTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider