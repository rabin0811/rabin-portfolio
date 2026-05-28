const express = require('express')

const router = express.Router()

const protect = require('../middleware/authMiddleware')

const {
    addProject,
    fetchProjects,
    removeProject,
} = require('../controllers/projectController')

router.get('/', fetchProjects)

router.post('/add', protect, addProject)

router.delete('/:id', protect, removeProject)

module.exports = router