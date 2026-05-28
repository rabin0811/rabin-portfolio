const {
    createBlog,
    getBlogs,
    deleteBlog,
} = require('../models/blogModel')

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

        res.status(500).json({
            message: error.message,
        })

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

        res.status(500).json({
            message: error.message,
        })

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

        res.status(500).json({
            message: error.message,
        })

    }
}

module.exports = {
    addBlog,
    fetchBlogs,
    removeBlog,
}