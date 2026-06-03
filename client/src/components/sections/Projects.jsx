import { useEffect, useState } from 'react'

const GITHUB_USER = 'rabin0811'

const languageColors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    'C#': '#178600',
    'C++': '#f34b7d',
    C: '#555555',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Kotlin: '#A97BFF',
    Swift: '#F05138',
    Dart: '#00B4AB',
    Vue: '#41b883',
    'Jupyter Notebook': '#DA5B0B',
}

const Projects = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const res = await fetch(
                    `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=20`
                )
                const repos = await res.json()
                const filtered = repos
                    .filter((r) => !r.fork && r.name !== GITHUB_USER)
                    .map((r) => ({
                        id: r.id,
                        name: r.name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
                        description: r.description || 'No description provided.',
                        html_url: r.html_url,
                        homepage: r.homepage,
                        language: r.language,
                        topics: r.topics || [],
                        stars: r.stargazers_count,
                        forks: r.forks_count,
                        updated_at: r.updated_at,
                    }))
                setProjects(filtered)
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
        }
        fetchRepos()
    }, [])

    if (loading) return null

    return (
        <section id='projects' className='py-24 px-6 bg-zinc-50 dark:bg-darkbg text-zinc-900 dark:text-white transition-colors duration-300 font-poppins'>
            <div className='max-w-7xl mx-auto'>
                <h2 className='text-4xl font-bold text-center mb-4 text-zinc-950 dark:text-white'>
                    Projects
                </h2>
                <p className='text-center text-zinc-500 dark:text-zinc-400 mb-16'>
                    My open-source repositories on{' '}
                    <a href={`https://github.com/${GITHUB_USER}`} target='_blank' rel='noopener noreferrer' className='text-primary hover:underline'>
                        GitHub
                    </a>
                </p>

                {projects.length === 0 ? (
                    <p className='text-center text-zinc-500 dark:text-zinc-400'>No repositories found.</p>
                ) : (
                    <div className='grid md:grid-cols-2 gap-8'>
                        {projects.map((project) => (
                            <div key={project.id} className='group bg-white dark:bg-softdark rounded-3xl overflow-hidden border border-zinc-200 dark:border-borderColor shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:border-red-500/40'>
                                <div className='h-2' style={{ backgroundColor: languageColors[project.language] || '#6b7280' }} />
                                <div className='p-8'>
                                    <div className='flex items-center justify-between mb-2'>
                                        <h3 className='text-xl font-bold text-zinc-900 dark:text-white'>
                                            {project.name}
                                        </h3>
                                        <div className='flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400'>
                                            {project.stars > 0 && (
                                                <span>★ {project.stars}</span>
                                            )}
                                            {project.forks > 0 && (
                                                <span>⑂ {project.forks}</span>
                                            )}
                                        </div>
                                    </div>

                                    <p className='text-zinc-600 dark:text-zinc-400 leading-7 text-sm line-clamp-3'>
                                        {project.description}
                                    </p>

                                    <div className='flex gap-2 mt-4 flex-wrap items-center'>
                                        {project.language && (
                                            <span className='flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400'>
                                                <span
                                                    className='w-2.5 h-2.5 rounded-full'
                                                    style={{ backgroundColor: languageColors[project.language] || '#6b7280' }}
                                                />
                                                {project.language}
                                            </span>
                                        )}
                                        {project.topics.slice(0, 4).map((topic) => (
                                            <span
                                                key={topic}
                                                className='bg-primary/10 text-primary dark:bg-primary/20 px-2.5 py-0.5 rounded-full text-xs font-medium'
                                            >
                                                {topic}
                                            </span>
                                        ))}
                                    </div>

                                    <div className='flex gap-3 mt-6 flex-wrap'>
                                        <a
                                            href={project.html_url}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-md active:scale-95'
                                        >
                                            GitHub
                                        </a>
                                        {project.homepage && (
                                            <a
                                                href={project.homepage}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='px-5 py-2.5 border border-primary text-primary text-sm font-medium rounded-xl hover:bg-primary hover:text-white hover:scale-105 transition-all duration-300 active:scale-95'
                                            >
                                                Live Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className='h-1 bg-white dark:bg-zinc-800 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left' />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default Projects
