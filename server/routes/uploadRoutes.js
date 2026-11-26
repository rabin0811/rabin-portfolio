const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const prisma = require('../db')
const { deleteStoredFile } = require('../storage')
const sendInternalError = require('../utils/sendInternalError')

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
            sendInternalError(res, error, 'Failed to process resume upload')
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
            sendInternalError(res, error, 'Failed to process project image upload')
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
            sendInternalError(res, error, 'Failed to process blog image upload')
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
            sendInternalError(res, error, 'Failed to update administrator profile image')
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
            await deleteStoredFile('profile', req.params.filename)
            await prisma.admin.update({
                where: { id: req.admin.id },
                data: { profileImage: null },
            })
            res.status(200).json({ success: true, message: 'Profile image removed' })
        } catch (error) {
            sendInternalError(res, error, 'Failed to remove administrator profile image')
        }
    }
)

module.exports = router
