const express = require('express')
const prisma = require('../db')
const protect = require('../middleware/authMiddleware')
const sendInternalError = require('../utils/sendInternalError')
const router = express.Router()

router.get('/', protect, async (req, res) => {
    try {
        const [
            totalBlogs,
            totalProjects,
            totalMessages,
            recentMessages,
            visitorCounter,
        ] =
            await Promise.all([
                prisma.blog.count(),
                prisma.project.count(),
                prisma.contact.count(),
                prisma.contact.findMany({
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    select: {
                        id: true,
                        name: true,
                        subject: true,
                        message: true,
                        createdAt: true,
                    },
                }),
                prisma.visitorCounter.findUnique({
                    where: { id: 1 },
                    select: { total: true },
                }),
            ])

        res.status(200).json({
            totalBlogs,
            totalProjects,
            totalMessages,
            recentMessages,
            visitors: visitorCounter?.total ?? 0,
        })
    } catch (error) {
        sendInternalError(res, error, 'Failed to fetch analytics')
    }
})

module.exports = router
