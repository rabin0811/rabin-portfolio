const express = require('express')

const router = express.Router()

const protect = require('../middleware/authMiddleware')

const {
    addProject,
    fetchProjects,
    fetchPublicProjects,
    removeProject,
    toggleProjectVisibility,
} = require('../controllers/projectController')

router.get('/', fetchProjects)

router.get('/public', fetchPublicProjects)

router.post('/add', protect, addProject)

router.put('/:id/toggle', protect, toggleProjectVisibility)

router.delete('/:id', protect, removeProject)

module.exports = router