const education = [
    {
        level: 'SEE',
        institution: 'Shree Karthari Secondary School',
        period: 'Passed 2073',
        description: 'Completed secondary education with a focus on basic sciences and mathematics.',
    },
    {
        level: '+2',
        institution: 'Balnikital Higher Secondary School',
        period: '2074 – 2076',
        description: 'Higher secondary education in the science stream, building foundation for engineering.',
    },
    {
        level: 'Bachelor',
        institution: 'ISMT College',
        period: '2081 – Present',
        description: 'Pursuing a degree in Computer Engineering with coursework in programming, networking, and systems.',
    },
]

const About = () => {
    return (
        <section
            id='about'
            className='py-24 px-6 bg-white dark:bg-softdark text-zinc-900 dark:text-white transition-colors duration-300'
        >
            <div className='max-w-7xl mx-auto'>
                <h2 className='text-4xl font-bold text-center mb-16 text-zinc-950 dark:text-white'>
                    About Me
                </h2>

                <div className='grid md:grid-cols-2 gap-12'>
                    {/* BIO */}
                    <div className='bg-zinc-50 dark:bg-darkbg p-8 md:p-10 rounded-3xl border border-zinc-200 dark:border-borderColor shadow-sm transition-colors duration-300 flex flex-col justify-center'>
                        <div className='w-14 h-1 bg-primary rounded-full mb-6' />
                        <p className='text-zinc-600 dark:text-zinc-400 leading-8 text-base'>
                            Motivated and self-driven Computer Engineering student with interest in software development,
                            networking, Linux systems, and modern web technologies. I enjoy building full-stack applications,
                            learning new technologies, and solving real-world problems through code.
                        </p>
                        <div className='flex gap-4 mt-6 text-sm text-zinc-500 dark:text-zinc-400'>
                            <span className='flex items-center gap-1.5'>
                                <span className='w-2 h-2 bg-primary rounded-full' />
                                Full Stack Dev
                            </span>
                            <span className='flex items-center gap-1.5'>
                                <span className='w-2 h-2 bg-primary rounded-full' />
                                Backend Enthusiast
                            </span>
                            <span className='flex items-center gap-1.5'>
                                <span className='w-2 h-2 bg-primary rounded-full' />
                                Linux Learner
                            </span>
                        </div>
                    </div>

                    {/* EDUCATION TIMELINE */}
                    <div className='relative pl-8 border-l-2 border-red-600/30 dark:border-red-500/20 space-y-8'>
                        {education.map((item, i) => (
                            <div key={i} className='relative'>
                                {/* Timeline dot */}
                                <div className='absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-red-600 border-4 border-white dark:border-softdark shadow-sm' />
                                {/* Period badge */}
                                <span className='inline-block text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full mb-2'>
                                    {item.period}
                                </span>
                                <div className='bg-zinc-50 dark:bg-darkbg p-6 rounded-2xl border border-zinc-200 dark:border-borderColor shadow-sm transition-colors duration-300 hover:border-red-300 dark:hover:border-red-800'>
                                    <h3 className='text-xl font-bold text-zinc-900 dark:text-white'>
                                        {item.level}
                                    </h3>
                                    <p className='text-zinc-700 dark:text-zinc-300 font-medium mt-1'>
                                        {item.institution}
                                    </p>
                                    <p className='text-zinc-500 dark:text-zinc-400 text-sm mt-2 leading-6'>
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
