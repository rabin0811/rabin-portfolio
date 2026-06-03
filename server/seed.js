const prisma = require('./prismaClient')

async function seed() {
    console.log('Seeding database...')

    const projects = [
        {
            title: 'Job Portal Management System',
            description: 'Built using .NET Framework with CRUD operations and object-oriented programming concepts including abstraction.',
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
            github: 'https://github.com/rabin0811/job-portal/tree/main/JobPortal',
            liveDemo: '',
        },
        {
            title: 'Full Stack Portfolio Website',
            description: 'Developed a modern full stack portfolio website using React.js, Vite, Tailwind CSS, Node.js, Express.js, Prisma ORM, PostgreSQL, JWT authentication, and REST API integration. Implemented protected admin dashboard, CRUD operations, blog management, project management, image uploads, resume uploads, responsive mobile-first design, SEO optimization, and dark/light theme functionality.',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
            github: 'https://github.com/Rabin0811/rabin-portfolio',
            liveDemo: '',
        },
    ]

    const blogs = [
        {
            title: 'Linux Basics for Beginners',
            category: 'Linux',
            content: 'Linux is a powerful and open-source operating system used by developers worldwide. This guide covers the essential commands and concepts every beginner should know to get started with the Linux command line interface.',
            image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
        },
        {
            title: 'Understanding CRUD Operations',
            category: 'Backend',
            content: 'CRUD (Create, Read, Update, Delete) operations form the backbone of most web applications. Learn how to implement these fundamental database operations effectively using modern backend frameworks and best practices.',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
        },
        {
            title: 'GitHub Workflow Guide',
            category: 'GitHub',
            content: 'Master the essential GitHub workflows including branching strategies, pull requests, code reviews, and collaboration best practices. This guide helps teams work efficiently with version control.',
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
        },
    ]

    for (const project of projects) {
        await prisma.project.create({ data: project })
        console.log(`  Created project: ${project.title}`)
    }

    for (const blog of blogs) {
        await prisma.blog.create({ data: blog })
        console.log(`  Created blog: ${blog.title}`)
    }

    console.log('Seed complete!')
}

seed()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())
