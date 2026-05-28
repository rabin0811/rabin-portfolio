const skills = [
    'HTML',
    'CSS',
    'JavaScript',
    '.NET Framework',
    'CRUD Operations',
    'OOP',
    'Abstraction',
    'Git',
    'GitHub',
    'Linux',
    'Windows',
    'Networking',
    'Hardware Troubleshooting'
]

const Skills = () => {
    return (
        <section
            id='skills'
            /* FIX 1: Removed hardcoded bg-black layout color. 
               Swaps between standard white background and your custom softdark token seamlessly.
            */
            className='py-24 px-6 bg-white dark:bg-softdark text-zinc-900 dark:text-white transition-colors duration-300 font-poppins'
        >
            <div className='max-w-7xl mx-auto'>

                {/* FIX 2: Added dynamic text coloring for the main header section */}
                <h2 className='text-4xl font-bold text-center mb-16 text-zinc-950 dark:text-white'>
                    Skills
                </h2>

                <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {skills.map((skill, index) => (
                        <div
                            key={index}
                            /* FIX 3: Replaced hardcoded bg-zinc-900 and border-zinc-800 colors.
                               Cards now turn to a soft light gray with a darkbg color shift on theme toggles.
                            */
                            className='bg-zinc-50 dark:bg-darkbg border border-zinc-200 dark:border-borderColor p-6 rounded-2xl hover:-translate-y-2 transition duration-300 shadow-sm'
                        >
                            {/* FIX 4: Ensured typography text color shifts nicely for clean readability */}
                            <h3 className='text-xl font-semibold text-zinc-800 dark:text-zinc-200'>
                                {skill}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Skills