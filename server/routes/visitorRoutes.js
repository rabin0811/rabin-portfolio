const express = require('express')
const { visitorLimiter } = require('../middleware/rateLimiters')
const sendInternalError = require('../utils/sendInternalError')

function createVisitorRouter(prisma = require('../db')) {
    const router = express.Router()

    router.get('/', async (req, res) => {
        try {
            const counter = await prisma.visitorCounter.findUnique({
                where: { id: 1 },
                select: { total: true },
            })

            res.status(200).json({ visitors: counter?.total ?? 0 })
        } catch (error) {
            sendInternalError(res, error, 'Failed to fetch visitor count')
        }
    })

    router.post('/', visitorLimiter, async (req, res) => {
        try {
            const counter = await prisma.visitorCounter.upsert({
                where: { id: 1 },
                create: { id: 1, total: 1 },
                update: { total: { increment: 1 } },
                select: { total: true },
            })

            res.status(200).json({ visitors: counter.total })
        } catch (error) {
            sendInternalError(res, error, 'Failed to record visitor')
        }
    })

    return router
}

module.exports = createVisitorRouter