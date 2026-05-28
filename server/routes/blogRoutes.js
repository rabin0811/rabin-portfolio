const express = require('express')

const router = express.Router()

const protect = require('../middleware/authMiddleware')

const {
    addBlog,
    fetchBlogs,
    removeBlog,
} = require('../controllers/blogController')

router.get('/', fetchBlogs)

router.post('/add', protect, addBlog)

router.delete('/:id', protect, removeBlog)

module.exports = router