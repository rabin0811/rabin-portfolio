const prisma = require('../prismaClient')

const createBlog = async (data) => {
    return await prisma.blog.create({
        data,
    })
}

const getBlogs = async () => {
    return await prisma.blog.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    })
}

const deleteBlog = async (id) => {
    return await prisma.blog.delete({
        where: {
            id: Number(id),
        },
    })
}

module.exports = {
    createBlog,
    getBlogs,
    deleteBlog,
}