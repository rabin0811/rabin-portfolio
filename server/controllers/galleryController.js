const {
    createImage,
    getImages,
    deleteImage,
    updateOrder,
} = require('../models/galleryModel')

const { deleteStoredFile } = require('../storage')
const sendInternalError = require('../utils/sendInternalError')

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
        sendInternalError(res, error, 'Failed to add gallery image')
    }
}

const fetchImages = async (req, res) => {
    try {
        const images = await getImages()
        res.status(200).json({ success: true, images })
    } catch (error) {
        sendInternalError(res, error, 'Failed to fetch gallery images')
    }
}

const removeImage = async (req, res) => {
    try {
        const image = await deleteImage(req.params.id)
        await deleteStoredFile('gallery', image.filename)

        res.status(200).json({ success: true, message: 'Image deleted' })
    } catch (error) {
        sendInternalError(res, error, 'Failed to remove gallery image')
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
        sendInternalError(res, error, 'Failed to reorder gallery images')
    }
}

module.exports = {
    addImage,
    fetchImages,
    removeImage,
    reorderImages,
}
