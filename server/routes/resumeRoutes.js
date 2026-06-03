const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const { uploadResume, getResumeInfo, downloadResume, deleteResume } = require('../controllers/resumeController')

router.get('/info', getResumeInfo)
router.get('/download', downloadResume)
router.post('/upload', protect, uploadResume)
router.delete('/', protect, deleteResume)

module.exports = router
