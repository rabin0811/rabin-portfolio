const prisma = require('../db')

const createBlog = async (data) => {
    return prisma.blog.create({
        data: {
            title: data.title,
            content: data.content,
            image: data.image,
            category: data.category,
        },
    })
}

const getBlogs = async () => {
    return prisma.blog.findMany({ orderBy: { createdAt: 'desc' } })
}

const deleteBlog = async (id) => {
    await prisma.blog.delete({ where: { id: Number(id) } })
}

module.exports = {
    createBlog,
    getBlogs,
    deleteBlog,
}
