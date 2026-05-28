const multer = require('multer')

const path = require('path')

/* RESUME STORAGE */

const resumeStorage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, 'uploads/resume')

    },

    filename: (req, file, cb) => {

        cb(null, 'resume.pdf')

    }

})

/* PROJECT IMAGE STORAGE */

const imageStorage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, 'uploads/projects')

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() + path.extname(file.originalname)

        cb(null, uniqueName)

    }

})

const uploadResume = multer({
    storage: resumeStorage
})

const uploadProjectImage = multer({
    storage: imageStorage
})

module.exports = {
    uploadResume,
    uploadProjectImage
}