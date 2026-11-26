const fs = require('fs')
const multer = require('multer')
const path = require('path')
const { createR2Storage, isR2Enabled } = require('../storage')
const { createValidatedStorage } = require('./validatedUploadStorage')

const uploadRoot = path.join(__dirname, '../uploads')
const maxFileSize = 10 * 1024 * 1024

const createStorage = (category, getFilename) => {
    if (isR2Enabled) {
        return createValidatedStorage(createR2Storage(category, getFilename))
    }

    return createValidatedStorage(multer.diskStorage({
        destination: (req, file, cb) => {
            const directory = path.join(uploadRoot, category)
            fs.mkdir(directory, { recursive: true }, (error) => cb(error, directory))
        },
        filename: (req, file, cb) => cb(null, getFilename(file)),
    }))
}

const uniqueFilename = (file, separator = '-') => (
    `${Date.now()}${separator}${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
)

const createUploadError = (message) => {
    const error = new Error(message)
    error.code = 'INVALID_UPLOAD_CONTENT'
    return error
}

const withSafeUploadErrors = (uploader) => ({
    single(fieldName) {
        const middleware = uploader.single(fieldName)
        return (req, res, next) => {
            middleware(req, res, (error) => {
                if (!error) {
                    return next()
                }

                if (error.name === 'MulterError') {
                    const isTooLarge = error.code === 'LIMIT_FILE_SIZE'
                    return res.status(isTooLarge ? 413 : 400).json({
                        message: isTooLarge
                            ? 'Uploaded file exceeds the 10 MiB size limit'
                            : 'Invalid upload request',
                    })
                }

                if (error.code === 'INVALID_UPLOAD_CONTENT') {
                    return res.status(400).json({ message: 'File type, content, or extension is not allowed' })
                }

                next(error)
            })
        }
    },
})

const imageFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/gif',
    ]

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(createUploadError('Only PNG, JPEG, WebP, or GIF images are allowed'), false)
    }
}

const pdfFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true)
    } else {
        cb(createUploadError('Only PDF files are allowed'), false)
    }
}

const uploadResume = withSafeUploadErrors(multer({
    storage: createStorage('resume', () => 'resume.pdf'),
    limits: { fileSize: maxFileSize },
    fileFilter: pdfFilter,
}))

const uploadProjectImage = withSafeUploadErrors(multer({
    storage: createStorage('projects', (file) => uniqueFilename(file, '')),
    limits: { fileSize: maxFileSize },
    fileFilter: imageFilter,
}))

const uploadProfileImage = withSafeUploadErrors(multer({
    storage: createStorage('profile', (file) => `profile${path.extname(file.originalname)}`),
    limits: { fileSize: maxFileSize },
    fileFilter: imageFilter,
}))

const uploadBlogImage = withSafeUploadErrors(multer({
    storage: createStorage('blogs', uniqueFilename),
    limits: { fileSize: maxFileSize },
    fileFilter: imageFilter,
}))

const uploadGalleryImage = withSafeUploadErrors(multer({
    storage: createStorage('gallery', uniqueFilename),
    limits: { fileSize: maxFileSize },
    fileFilter: imageFilter,
}))

module.exports = {
    uploadResume,
    uploadProjectImage,
    uploadProfileImage,
    uploadBlogImage,
    uploadGalleryImage,
}
