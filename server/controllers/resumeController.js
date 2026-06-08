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
            const resume = await prisma.resume.create({
                data: {
                    name: req.file.originalname,
                    data: base64,
                    mimeType: req.file.mimetype,
                    adminId: req.admin.id,
                },
            })

            res.status(200).json({
                success: true,
                message: 'Resume uploaded successfully',
                resume: {
                    id: resume.id,
                    name: resume.name,
                    mimeType: resume.mimeType,
                    isActive: resume.isActive,
                    createdAt: resume.createdAt,
                },
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message })
        }
    })
}

const getResumes = async (req, res) => {
    try {
        const resumes = await prisma.resume.findMany({
            where: { adminId: req.admin.id },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                mimeType: true,
                isActive: true,
                createdAt: true,
            },
        })
        res.status(200).json({ success: true, resumes })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const setActiveResume = async (req, res) => {
    try {
        const { id } = req.params
        const resume = await prisma.resume.findFirst({
            where: { id: Number(id), adminId: req.admin.id },
        })
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' })
        }

        await prisma.resume.updateMany({
            where: { adminId: req.admin.id },
            data: { isActive: false },
        })

        await prisma.resume.update({
            where: { id: Number(id) },
            data: { isActive: true },
        })

        res.status(200).json({ success: true, message: 'Active resume updated' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getResumeInfo = async (req, res) => {
    try {
        const admin = await prisma.admin.findFirst()
        if (!admin) {
            return res.status(404).json({ exists: false })
        }

        const active = await prisma.resume.findFirst({
            where: { adminId: admin.id, isActive: true },
            select: { name: true, mimeType: true, createdAt: true },
        })

        if (active) {
            return res.status(200).json({ exists: true, name: active.name, mimeType: active.mimeType })
        }

        const latest = await prisma.resume.findFirst({
            where: { adminId: admin.id },
            orderBy: { createdAt: 'desc' },
            select: { name: true, mimeType: true },
        })

        if (latest) {
            return res.status(200).json({ exists: true, name: latest.name, mimeType: latest.mimeType })
        }

        if (admin.resumeData) {
            return res.status(200).json({ exists: true, name: admin.resumeName, mimeType: admin.resumeMimeType })
        }

        res.status(404).json({ exists: false })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const downloadResume = async (req, res) => {
    try {
        const admin = await prisma.admin.findFirst()
        if (!admin) {
            return res.status(404).json({ message: 'No resume uploaded' })
        }

        const active = await prisma.resume.findFirst({
            where: { adminId: admin.id, isActive: true },
        })

        if (active) {
            const buffer = Buffer.from(active.data, 'base64')
            res.set('Content-Type', active.mimeType || 'application/pdf')
            res.set('Content-Disposition', 'inline; filename="' + encodeURIComponent(active.name || 'resume.pdf') + '"')
            res.set('Content-Length', buffer.length)
            res.set('X-Content-Type-Options', 'nosniff')
            return res.send(buffer)
        }

        const latest = await prisma.resume.findFirst({
            where: { adminId: admin.id },
            orderBy: { createdAt: 'desc' },
        })

        if (latest) {
            const buffer = Buffer.from(latest.data, 'base64')
            res.set('Content-Type', latest.mimeType || 'application/pdf')
            res.set('Content-Disposition', 'inline; filename="' + encodeURIComponent(latest.name || 'resume.pdf') + '"')
            res.set('Content-Length', buffer.length)
            res.set('X-Content-Type-Options', 'nosniff')
            return res.send(buffer)
        }

        if (admin.resumeData) {
            const buffer = Buffer.from(admin.resumeData, 'base64')
            res.set('Content-Type', admin.resumeMimeType || 'application/pdf')
            res.set('Content-Disposition', 'inline; filename="' + encodeURIComponent(admin.resumeName || 'resume.pdf') + '"')
            res.set('Content-Length', buffer.length)
            res.set('X-Content-Type-Options', 'nosniff')
            return res.send(buffer)
        }

        res.status(404).json({ message: 'No resume uploaded' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteResume = async (req, res) => {
    try {
        const { id } = req.params
        const resume = await prisma.resume.findFirst({
            where: { id: Number(id), adminId: req.admin.id },
        })
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' })
        }
        await prisma.resume.delete({ where: { id: Number(id) } })
        res.status(200).json({ success: true, message: 'Resume deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { uploadResume, getResumes, setActiveResume, getResumeInfo, downloadResume, deleteResume }
