const {
    createBlog,
    getBlogs,
    deleteBlog,
} = require('../models/blogModel')
const sendInternalError = require('../utils/sendInternalError')

const addBlog = async (req, res) => {

    try {

        const {
            title,
            content,
            category,
            image,
        } = req.body

        const blog = await createBlog({
            title,
            content,
            category,
            image,
        })

        res.status(201).json({
            success: true,
            blog,
        })

    } catch (error) {
        sendInternalError(res, error, 'Failed to create blog')
    }
}

const fetchBlogs = async (req, res) => {

    try {

        const blogs = await getBlogs()

        res.status(200).json({
            success: true,
            blogs,
        })

    } catch (error) {
        sendInternalError(res, error, 'Failed to fetch blogs')
    }
}

const removeBlog = async (req, res) => {

    try {

        await deleteBlog(req.params.id)

        res.status(200).json({
            success: true,
            message: 'Blog deleted',
        })

    } catch (error) {
        sendInternalError(res, error, 'Failed to delete blog')
    }
}

module.exports = {
    addBlog,
    fetchBlogs,
    removeBlog,
}