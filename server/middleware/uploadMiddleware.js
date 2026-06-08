const multer = require('multer')

const path = require('path')

/* =========================================
   RESUME STORAGE
========================================= */

const resumeStorage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, 'uploads/resume')

    },

    filename: (req, file, cb) => {

        cb(null, 'resume.pdf')

    }

})

/* =========================================
   PROJECT IMAGE STORAGE
========================================= */

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

/* =========================================
   PROFILE IMAGE STORAGE
========================================= */

const profileStorage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, 'uploads/profile')

    },

    filename: (req, file, cb) => {

        cb(
            null,
            'profile' + path.extname(file.originalname)
        )

    }

})

/* =========================================
   BLOG IMAGE STORAGE
========================================= */

const blogStorage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, 'uploads/blogs')

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname)

        cb(null, uniqueName)

    }

})

/* =========================================
   GALLERY IMAGE STORAGE
========================================= */

const galleryStorage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, 'uploads/gallery')

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname)

        cb(null, uniqueName)

    }

})

/* =========================================
   FILE FILTERS
========================================= */

const imageFilter = (req, file, cb) => {

    const allowedTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/gif',
        'image/svg+xml'
    ]

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true)

    } else {

        cb(
            new Error('Only image files are allowed'),
            false
        )

    }

}

const pdfFilter = (req, file, cb) => {

    if (file.mimetype === 'application/pdf') {

        cb(null, true)

    } else {

        cb(
            new Error('Only PDF files are allowed'),
            false
        )

    }

}

/* =========================================
   MULTER EXPORTS
========================================= */

const uploadResume = multer({

    storage: resumeStorage,

    fileFilter: pdfFilter

})

const uploadProjectImage = multer({

    storage: imageStorage,

    fileFilter: imageFilter

})

const uploadProfileImage = multer({

    storage: profileStorage,

    fileFilter: imageFilter

})

const uploadBlogImage = multer({

    storage: blogStorage,

    fileFilter: imageFilter

})

const uploadGalleryImage = multer({

    storage: galleryStorage,

    fileFilter: imageFilter

})

module.exports = {

    uploadResume,

    uploadProjectImage,

    uploadProfileImage,

    uploadBlogImage,

    uploadGalleryImage

}