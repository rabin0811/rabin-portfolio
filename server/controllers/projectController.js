const prisma = require('../db')
const sendInternalError = require('../utils/sendInternalError')

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
        sendInternalError(res, error, 'Failed to create project')
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
        sendInternalError(res, error, 'Failed to fetch projects')
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
        sendInternalError(res, error, 'Failed to fetch public projects')
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
        sendInternalError(res, error, 'Failed to delete project')
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
        sendInternalError(res, error, 'Failed to update project visibility')
    }
}

module.exports = {
    addProject,
    fetchProjects,
    fetchPublicProjects,
    removeProject,
    toggleProjectVisibility,
}