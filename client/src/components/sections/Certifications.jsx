const certifications = [
    {
        title: 'Cisco Networking Academy',
        description: 'Networking and cybersecurity fundamentals certification covering routing, switching, and network security principles.',
        icon: '🌐',
    },
    {
        title: 'Computer Hardware Training Level 2',
        description: 'Hardware troubleshooting and system maintenance training focused on diagnostics, repair, and component-level understanding.',
        icon: '⚙️',
    },
]

const Certifications = () => {
    return (
        <section
            id="certifications"
            className="py-24 px-6 bg-zinc-50 dark:bg-darkbg text-zinc-900 dark:text-white transition-colors duration-300 font-poppins"
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-zinc-950 dark:text-white">
                        Certifications
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-4 transition-colors duration-300">
                        Professional training and technical certifications.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {certifications.map((item, index) => (
                        <div
                            key={index}
                            className="group bg-white dark:bg-softdark border border-zinc-200 dark:border-borderColor rounded-3xl p-8 hover:-translate-y-2 transition duration-300 shadow-sm hover:shadow-lg hover:shadow-red-900/10 dark:hover:shadow-red-900/5 hover:border-red-300 dark:hover:border-red-800"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                                {item.title}
                            </h3>
                            <div className="w-10 h-1 bg-primary rounded-full mt-3 mb-4" />
                            <p className="text-zinc-600 dark:text-zinc-400 leading-7 transition-colors duration-300 text-sm">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Certifications
