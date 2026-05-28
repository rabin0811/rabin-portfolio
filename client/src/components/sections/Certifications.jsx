const certifications = [
    {
        title: 'Cisco Networking Academy',
        description: 'Networking and cybersecurity fundamentals certification.',
    },
    {
        title: 'Computer Hardware Training Level 2',
        description: 'Hardware troubleshooting and system maintenance training.',
    },
]

const Certifications = () => {
    return (
        <section
            id="certifications"
            /* FIX 1: Removed hardcoded hex bg-[#111111]. 
               Uses white background for light mode, and your softdark token for dark mode layout depth.
            */
            className="py-24 px-6 bg-white dark:bg-softdark text-zinc-900 dark:text-white transition-colors duration-300 font-poppins"
        >
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-16">
                    {/* FIX 2: Replaced default title color state so it reads well on both themes */}
                    <h2 className="text-4xl font-bold text-zinc-950 dark:text-white">
                        Certifications
                    </h2>

                    {/* FIX 3: Adjusted description text contrast for light mode */}
                    <p className="text-zinc-600 dark:text-zinc-400 mt-4 transition-colors duration-300">
                        Professional training and technical certifications.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">

                    {certifications.map((item, index) => (
                        <div
                            key={index}
                            /* FIX 4: Replaced bg-zinc-900 and border-zinc-800.
                               Cards turn light gray with a faint shadow in light mode, and deep gray (darkbg) in dark mode.
                            */
                            className="bg-zinc-50 dark:bg-darkbg border border-zinc-200 dark:border-borderColor rounded-3xl p-8 hover:-translate-y-2 transition duration-300 shadow-sm"
                        >
                            {/* FIX 5: Replaced text-red-700 with your primary brand theme color */}
                            <h3 className="text-2xl font-semibold text-primary">
                                {item.title}
                            </h3>

                            {/* FIX 6: Made card description text color shift gracefully for high readability */}
                            <p className="text-zinc-600 dark:text-zinc-400 mt-4 leading-7 transition-colors duration-300">
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