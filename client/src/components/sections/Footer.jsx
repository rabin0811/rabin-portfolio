const Footer = () => {
    return (
        <footer
            /* FIX 1: Changed hardcoded background and border colors. 
               Uses white background for light mode and your custom softdark token for dark mode.
            */
            className='bg-white dark:bg-softdark border-t border-zinc-200 dark:border-borderColor py-8 text-center transition-colors duration-300 font-poppins'
        >
            {/* FIX 2: Replaced text-red-700 with your primary brand theme color token */}
            <h2 className='text-2xl font-bold text-primary'>
                Rabin Humagain
            </h2>

            {/* FIX 3: Balanced paragraph contrasts for clean readability across themes */}
            <p className='text-zinc-600 dark:text-zinc-400 mt-4 transition-colors duration-300'>
                Computer Engineering Student
            </p>

            <p className='text-zinc-400 dark:text-zinc-500 mt-6 text-sm transition-colors duration-300'>
                © 2026 Rabin Humagain. All rights reserved.
            </p>
        </footer>
    )
}

export default Footer