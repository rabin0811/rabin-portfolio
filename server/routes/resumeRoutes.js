const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const {
    uploadResume,
    getResumes,
    setActiveResume,
    getResumeInfo,
    downloadResume,
    deleteResume,
} = require('../controllers/resumeController')

router.get('/info', getResumeInfo)
router.get('/download', downloadResume)
router.get('/list', protect, getResumes)
router.post('/upload', protect, uploadResume)
router.put('/:id/active', protect, setActiveResume)
router.delete('/:id', protect, deleteResume)

module.exports = router
