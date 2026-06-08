const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const {
    uploadProfileImage,
    getProfileImages,
    getPublicProfileImages,
    deleteProfileImage,
} = require('../controllers/profileImageController')

router.get('/public', getPublicProfileImages)
router.get('/', protect, getProfileImages)
router.post('/upload', protect, uploadProfileImage)
router.delete('/:id', protect, deleteProfileImage)

module.exports = router
