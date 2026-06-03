const prisma = require('../db')

const createProject = async (data) => {
    return prisma.project.create({
        data: {
            title: data.title,
            description: data.description,
            image: data.image,
            github: data.github,
            liveDemo: data.liveDemo,
        },
    })
}

const getProjects = async () => {
    return prisma.project.findMany({ orderBy: { createdAt: 'desc' } })
}

const deleteProject = async (id) => {
    await prisma.project.delete({ where: { id: Number(id) } })
}

module.exports = {
    createProject,
    getProjects,
    deleteProject,
}
