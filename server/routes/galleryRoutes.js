const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const { uploadGalleryImage } = require('../middleware/uploadMiddleware')

const {
    addImage,
    fetchImages,
    removeImage,
    reorderImages,
} = require('../controllers/galleryController')

router.get('/', fetchImages)
router.post('/upload', protect, uploadGalleryImage.single('galleryImage'), addImage)
router.delete('/:id', protect, removeImage)
router.put('/reorder', protect, reorderImages)

module.exports = router
