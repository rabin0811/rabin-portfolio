const prisma = require('../prismaClient')

const createProject = async (data) => {
    return await prisma.project.create({
        data,
    })
}

const getProjects = async () => {
    return await prisma.project.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    })
}

const deleteProject = async (id) => {
    return await prisma.project.delete({
        where: {
            id: Number(id),
        },
    })
}

module.exports = {
    createProject,
    getProjects,
    deleteProject,
}