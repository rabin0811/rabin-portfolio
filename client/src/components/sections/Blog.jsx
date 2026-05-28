const blogs = [
    {
        title: 'Linux Basics for Beginners',
        category: 'Linux',
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
    },
    {
        title: 'Understanding CRUD Operations',
        category: 'Backend',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    },
    {
        title: 'GitHub Workflow Guide',
        category: 'GitHub',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    },
]

const Blog = () => {
    return (
        <section
            id="blog"
            /* FIX 1: Changed hardcoded bg-black. 
               Uses white background for light mode and your custom deep darkbg token for dark mode.
            */
            className="py-24 px-6 bg-zinc-50 dark:bg-darkbg text-zinc-900 dark:text-white transition-colors duration-300 font-poppins"
        >
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-16">
                    {/* FIX 2: Replaced text-white behavior with an adaptive heading color */}
                    <h2 className="text-4xl font-bold text-zinc-950 dark:text-white">
                        Latest Blogs
                    </h2>

                    {/* FIX 3: Adjusted description paragraph contrast */}
                    <p className="text-zinc-600 dark:text-zinc-400 mt-4 transition-colors duration-300">
                        Articles about development, Linux, networking, and backend technologies.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {blogs.map((blog, index) => (
                        <div
                            key={index}
                            /* FIX 4: Replaced bg-zinc-900 and border-zinc-800.
                               Cards turn white with a faint shadow in light mode, and dark gray (softdark) in dark mode.
                            */
                            className="bg-white dark:bg-softdark border border-zinc-200 dark:border-borderColor rounded-3xl overflow-hidden hover:-translate-y-2 transition duration-300 shadow-sm"
                        >

                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-[220px] object-cover"
                            />

                            <div className="p-6">
                                {/* FIX 5: Replaced text-red-700 with your primary brand theme color */}
                                <span className="text-sm font-semibold text-primary capitalize">
                                    {blog.category}
                                </span>

                                {/* FIX 6: Made card titles cleanly readable in light mode */}
                                <h3 className="text-2xl font-semibold mt-3 text-zinc-900 dark:text-white">
                                    {blog.title}
                                </h3>

                                {/* FIX 7: Replaced hardcoded red button styles with your primary brand variables */}
                                <button className="mt-6 px-5 py-3 bg-primary text-white font-medium rounded-xl hover:opacity-90 transition shadow-md active:scale-95">
                                    Read More
                                </button>
                            </div>

                        </div>
                    ))}

                </div>

            </div>
        </section>
    )
}

export default Blog