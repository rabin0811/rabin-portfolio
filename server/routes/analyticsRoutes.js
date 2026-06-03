const express = require('express')
const prisma = require('../db')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const [totalBlogs, totalProjects, totalMessages, recentMessages] =
            await Promise.all([
                prisma.blog.count(),
                prisma.project.count(),
                prisma.contact.count(),
                prisma.contact.findMany({
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                }),
            ])

        res.status(200).json({
            totalBlogs,
            totalProjects,
            totalMessages,
            recentMessages,
            visitors: 1250,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
