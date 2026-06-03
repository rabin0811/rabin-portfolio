const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const prisma = require('../db')

router.get('/profile', protect, async (req, res) => {
    try {
        const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } })
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' })
        }
        res.status(200).json(admin)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
