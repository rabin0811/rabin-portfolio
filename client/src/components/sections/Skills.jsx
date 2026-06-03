const skillCategories = [
    {
        title: 'Languages & Frameworks',
        skills: ['HTML', 'CSS', 'JavaScript', '.NET Framework'],
    },
    {
        title: 'Development Concepts',
        skills: ['CRUD Operations', 'OOP', 'Abstraction'],
    },
    {
        title: 'Tools & Version Control',
        skills: ['Git', 'GitHub'],
    },
    {
        title: 'Systems & Infrastructure',
        skills: ['Windows', 'Linux', 'Networking', 'Hardware Troubleshooting'],
    },
]

const Skills = () => {
    return (
        <section
            id='skills'
            className='py-24 px-6 bg-white dark:bg-softdark text-zinc-900 dark:text-white transition-colors duration-300 font-poppins'
        >
            <div className='max-w-7xl mx-auto'>
                <h2 className='text-4xl font-bold text-center mb-16 text-zinc-950 dark:text-white'>
                    Skills
                </h2>

                <div className='grid md:grid-cols-2 gap-x-16 gap-y-12 max-w-5xl mx-auto'>
                    {skillCategories.map((cat, i) => (
                        <div key={i}>
                            <h3 className='text-sm font-semibold text-zinc-400 dark:text-zinc-500 mb-4 uppercase tracking-widest'>
                                {cat.title}
                            </h3>
                            <div className='flex flex-wrap gap-2.5'>
                                {cat.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className='px-4 py-2 text-sm font-medium bg-zinc-100 dark:bg-darkbg text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-borderColor rounded-xl hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-colors cursor-default'
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Skills
