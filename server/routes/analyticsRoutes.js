const express = require('express')

const prisma = require('../prismaClient')

const router = express.Router()

router.get('/', async (req, res) => {

    try {

        const totalBlogs =
            await prisma.blog.count()

        const totalProjects =
            await prisma.project.count()

        res.status(200).json({
            totalBlogs,
            totalProjects,
            visitors: 1250,
        })

    } catch (error) {

        res.status(500).json({
            message: error.message,
        })

    }

})

module.exports = router