const About = () => {
    return (
        <section
            id='about'
            /* FIX 1: Removed hardcoded hex bg-[#111111]. 
               Uses white background for light mode, and your softdark token for dark mode layout depth.
            */
            className='py-24 px-6 bg-white dark:bg-softdark text-zinc-900 dark:text-white transition-colors duration-300'
        >
            <div className='max-w-7xl mx-auto'>

                {/* FIX 2: Replaced default title color state so it reads well on both themes */}
                <h2 className='text-4xl font-bold text-center mb-16 text-zinc-950 dark:text-white'>
                    About Me
                </h2>

                <div className='grid md:grid-cols-2 gap-12'>

                    {/* BIO DETAILS CARD BLOCK */}
                    {/* FIX 3: Swapped bg-zinc-900 and border-zinc-800 for adaptive card styles */}
                    <div className='bg-zinc-50 dark:bg-darkbg p-8 rounded-3xl border border-zinc-200 dark:border-borderColor shadow-sm transition-colors duration-300'>
                        <p className='text-zinc-600 dark:text-zinc-400 leading-8 transition-colors duration-300'>
                            Motivated and self-driven Computer Engineering student with interest in software development, networking, Linux systems, and modern web technologies.
                        </p>
                    </div>

                    {/* EDUCATION TIMELINE ITEMS */}
                    <div className='space-y-6'>

                        {/* SEE CARD */}
                        {/* FIX 4: Replaced hardcoded inner background/borders and applied the 'text-primary' token */}
                        <div className='bg-zinc-50 dark:bg-darkbg p-6 rounded-2xl border border-zinc-200 dark:border-borderColor shadow-sm transition-colors duration-300'>
                            <h3 className='text-primary text-xl font-semibold'>SEE</h3>
                            <p className='text-zinc-800 dark:text-zinc-200 font-medium'>Shree Karthari Secondary School</p>
                            <span className='text-zinc-500 dark:text-zinc-400 text-sm'>Passed 2073</span>
                        </div>

                        {/* +2 CARD */}
                        <div className='bg-zinc-50 dark:bg-darkbg p-6 rounded-2xl border border-zinc-200 dark:border-borderColor shadow-sm transition-colors duration-300'>
                            <h3 className='text-primary text-xl font-semibold'>+2</h3>
                            <p className='text-zinc-800 dark:text-zinc-200 font-medium'>Balnikital Higher Secondary School</p>
                            <span className='text-zinc-500 dark:text-zinc-400 text-sm'>2074 to 2076</span>
                        </div>

                        {/* BACHELOR CARD */}
                        <div className='bg-zinc-50 dark:bg-darkbg p-6 rounded-2xl border border-zinc-200 dark:border-borderColor shadow-sm transition-colors duration-300'>
                            <h3 className='text-primary text-xl font-semibold'>Bachelor</h3>
                            <p className='text-zinc-800 dark:text-zinc-200 font-medium'>ISMT College</p>
                            <span className='text-zinc-500 dark:text-zinc-400 text-sm'>2081 to Present</span>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    )
}

export default About