const {
    createImage,
    getImages,
    deleteImage,
    updateOrder,
} = require('../models/galleryModel')

const fs = require('fs')
const path = require('path')

const addImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' })
        }

        const image = await createImage({
            filename: req.file.filename,
            filepath: `/uploads/gallery/${req.file.filename}`,
            mimetype: req.file.mimetype,
        })

        res.status(201).json({ success: true, image })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const fetchImages = async (req, res) => {
    try {
        const images = await getImages()
        res.status(200).json({ success: true, images })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const removeImage = async (req, res) => {
    try {
        const image = await deleteImage(req.params.id)

        const filePath = path.join(
            __dirname,
            '../uploads/gallery',
            image.filename
        )
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }

        res.status(200).json({ success: true, message: 'Image deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const reorderImages = async (req, res) => {
    try {
        const { orderedIds } = req.body
        if (!Array.isArray(orderedIds)) {
            return res.status(400).json({ message: 'orderedIds array required' })
        }
        await updateOrder(orderedIds)
        res.status(200).json({ success: true, message: 'Order updated' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    addImage,
    fetchImages,
    removeImage,
    reorderImages,
}
