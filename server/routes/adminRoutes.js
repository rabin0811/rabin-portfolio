const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const prisma = require('../db')
const sendInternalError = require('../utils/sendInternalError')

router.get('/profile', protect, async (req, res) => {
    try {
        const admin = await prisma.admin.findUnique({
            where: { id: req.admin.id },
            select: { name: true, email: true },
        })
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' })
        }
        res.status(200).json(admin)
    } catch (error) {
        sendInternalError(res, error, 'Failed to fetch administrator profile')
    }
})

module.exports = router
