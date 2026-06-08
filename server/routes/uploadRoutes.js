const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const prisma = require('../db')

const {
    uploadResume,
    uploadProjectImage,
    uploadProfileImage,
    uploadBlogImage
} = require('../middleware/uploadMiddleware')

/* =========================================
RESUME UPLOAD
========================================= */

router.post(
    '/resume',
    protect,
    uploadResume.single('resume'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' })
            }
            res.status(200).json({
                success: true,
                file: req.file.filename,
                path: `/uploads/resume/${req.file.filename}`,
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message })
        }
    }
)

/* =========================================
PROJECT IMAGE UPLOAD
========================================= */

router.post(
    '/project-image',
    protect,
    uploadProjectImage.single('projectImage'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No image uploaded' })
            }
            res.status(200).json({
                success: true,
                file: req.file.filename,
                path: `/uploads/projects/${req.file.filename}`,
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message })
        }
    }
)

/* =========================================
BLOG IMAGE UPLOAD
========================================= */

router.post(
    '/blog-image',
    protect,
    uploadBlogImage.single('blogImage'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No image uploaded' })
            }
            res.status(200).json({
                success: true,
                file: req.file.filename,
                path: `/uploads/blogs/${req.file.filename}`,
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message })
        }
    }
)

/* =========================================
PROFILE IMAGE UPLOAD
========================================= */

router.post(
    '/profile',
    protect,
    uploadProfileImage.single('profile'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No image uploaded' })
            }
            const imagePath = `/uploads/profile/${req.file.filename}`
            await prisma.admin.update({
                where: { id: req.admin.id },
                data: { profileImage: imagePath },
            })
            res.status(200).json({ success: true, path: imagePath })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message })
        }
    }
)

/* =========================================
REMOVE PROFILE IMAGE
========================================= */

router.delete(
    '/profile/:filename',
    protect,
    async (req, res) => {
        try {
            const filePath = path.join(
                __dirname,
                '../uploads/profile',
                req.params.filename
            )
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }
            await prisma.admin.update({
                where: { id: req.admin.id },
                data: { profileImage: null },
            })
            res.status(200).json({ success: true, message: 'Profile image removed' })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message })
        }
    }
)

module.exports = router
