const prisma = require('../db')
const multer = require('multer')

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]
        if (allowed.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Only PDF, DOC, DOCX files are allowed'), false)
        }
    },
}).single('resume')

const uploadResume = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ message: err.message })
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

        try {
            const base64 = req.file.buffer.toString('base64')
            await prisma.admin.update({
                where: { id: req.admin.id },
                data: {
                    resumeData: base64,
                    resumeName: req.file.originalname,
                    resumeMimeType: req.file.mimetype,
                },
            })

            res.status(200).json({
                success: true,
                message: 'Resume uploaded successfully',
                name: req.file.originalname,
                size: req.file.size,
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message })
        }
    })
}

const getResumeInfo = async (req, res) => {
    try {
        const admin = await prisma.admin.findFirst({
            where: { resumeData: { not: null } },
            select: { resumeName: true, resumeMimeType: true },
        })
        if (!admin || !admin.resumeName) {
            return res.status(404).json({ exists: false })
        }
        res.status(200).json({ exists: true, name: admin.resumeName, mimeType: admin.resumeMimeType })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const downloadResume = async (req, res) => {
    try {
        const admin = await prisma.admin.findFirst({
            where: { resumeData: { not: null } },
            select: { resumeData: true, resumeName: true, resumeMimeType: true },
        })
        if (!admin || !admin.resumeData) {
            return res.status(404).json({ message: 'No resume uploaded' })
        }

        const buffer = Buffer.from(admin.resumeData, 'base64')
        res.setHeader('Content-Type', admin.resumeMimeType || 'application/pdf')
        res.setHeader('Content-Disposition', `inline; filename="${admin.resumeName || 'resume.pdf'}"`)
        res.send(buffer)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteResume = async (req, res) => {
    try {
        await prisma.admin.update({
            where: { id: req.admin.id },
            data: { resumeData: null, resumeName: null, resumeMimeType: null },
        })

        res.status(200).json({ success: true, message: 'Resume deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { uploadResume, getResumeInfo, downloadResume, deleteResume }
