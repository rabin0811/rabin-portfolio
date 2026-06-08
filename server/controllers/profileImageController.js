const prisma = require('../db')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads/profile')
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
        cb(null, uniqueName)
    },
})

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
        if (allowed.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed'), false)
        }
    },
}).single('profileImage')

const uploadProfileImage = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ message: err.message })
        if (!req.file) return res.status(400).json({ message: 'No image uploaded' })

        try {
            const filepath = '/uploads/profile/' + req.file.filename
            const image = await prisma.profileImage.create({
                data: {
                    filename: req.file.filename,
                    filepath,
                    mimetype: req.file.mimetype,
                    adminId: req.admin.id,
                },
            })

            res.status(200).json({ success: true, image: { id: image.id, filepath } })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message })
        }
    })
}

const getProfileImages = async (req, res) => {
    try {
        const images = await prisma.profileImage.findMany({
            where: { adminId: req.admin.id },
            orderBy: { createdAt: 'desc' },
        })
        res.status(200).json({ success: true, images })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getPublicProfileImages = async (req, res) => {
    try {
        const images = await prisma.profileImage.findMany({
            orderBy: { createdAt: 'desc' },
            select: { filepath: true },
        })

        const admin = await prisma.admin.findFirst({
            select: { profileImage: true, name: true },
        })

        res.status(200).json({
            success: true,
            images: images.map(i => i.filepath),
            fallbackImage: admin?.profileImage || null,
            name: admin?.name || 'Rabin Humagain',
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteProfileImage = async (req, res) => {
    try {
        const { id } = req.params
        const image = await prisma.profileImage.findFirst({
            where: { id: Number(id), adminId: req.admin.id },
        })
        if (!image) {
            return res.status(404).json({ message: 'Image not found' })
        }

        const filePath = path.join(__dirname, '../uploads/profile', image.filename)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

        await prisma.profileImage.delete({ where: { id: Number(id) } })
        res.status(200).json({ success: true, message: 'Image deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { uploadProfileImage, getProfileImages, getPublicProfileImages, deleteProfileImage }
