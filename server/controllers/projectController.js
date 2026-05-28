const {
    createProject,
    getProjects,
    deleteProject,
} = require('../models/projectModel')

const addProject = async (req, res) => {

    try {

        const {
            title,
            description,
            image,
            github,
            liveDemo,
        } = req.body

        const project = await createProject({
            title,
            description,
            image,
            github,
            liveDemo,
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

        const projects = await getProjects()

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

        await deleteProject(req.params.id)

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

module.exports = {
    addProject,
    fetchProjects,
    removeProject,
}