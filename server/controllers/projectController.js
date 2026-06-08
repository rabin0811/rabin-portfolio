const prisma = require('../db')

const addProject = async (req, res) => {

    try {

        const {
            title,
            description,
            image,
            github,
            liveDemo,
        } = req.body

        const project = await prisma.project.create({
            data: { title, description, image, github, liveDemo },
        })

        res.status(201).json({
            success: true,
            project,
        })

    } catch (error) {

        res.status(500).json({
            message: error.message,
        })

    }
}

const fetchProjects = async (req, res) => {

    try {

        const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } })

        res.status(200).json({
            success: true,
            projects,
        })

    } catch (error) {

        res.status(500).json({
            message: error.message,
        })

    }
}

const fetchPublicProjects = async (req, res) => {

    try {

        const projects = await prisma.project.findMany({
            where: { visible: true },
            orderBy: { createdAt: 'desc' },
        })

        res.status(200).json({
            success: true,
            projects,
        })

    } catch (error) {

        res.status(500).json({
            message: error.message,
        })

    }
}

const removeProject = async (req, res) => {

    try {

        await prisma.project.delete({ where: { id: Number(req.params.id) } })

        res.status(200).json({
            success: true,
            message: 'Project deleted',
        })

    } catch (error) {

        res.status(500).json({
            message: error.message,
        })

    }
}

const toggleProjectVisibility = async (req, res) => {

    try {

        const project = await prisma.project.findUnique({
            where: { id: Number(req.params.id) },
        })

        if (!project) {
            return res.status(404).json({ message: 'Project not found' })
        }

        const updated = await prisma.project.update({
            where: { id: Number(req.params.id) },
            data: { visible: !project.visible },
        })

        res.status(200).json({
            success: true,
            visible: updated.visible,
        })

    } catch (error) {

        res.status(500).json({
            message: error.message,
        })

    }
}

module.exports = {
    addProject,
    fetchProjects,
    fetchPublicProjects,
    removeProject,
    toggleProjectVisibility,
}