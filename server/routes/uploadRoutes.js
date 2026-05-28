const express = require('express')

const router = express.Router()

const protect = require('../middleware/authMiddleware')

const {
    uploadResume,
    uploadProjectImage
} = require('../middleware/uploadMiddleware')

/* RESUME UPLOAD */

router.post(
    '/resume',
    protect,
    uploadResume.single('resume'),

    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({
                    message: 'No file uploaded',
                })

            }

            res.status(200).json({

                success: true,

                file: req.file.filename,

                path: `/uploads/resume/${req.file.filename}`

            })

        } catch (error) {

            console.log(error)

            res.status(500).json({
                message: error.message,
            })

        }

    }
)

/* PROJECT IMAGE UPLOAD */

router.post(
    '/project-image',
    protect,
    uploadProjectImage.single('projectImage'),

    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({
                    message: 'No image uploaded',
                })

            }

            res.status(200).json({

                success: true,

                file: req.file.filename,

                path: `/uploads/projects/${req.file.filename}`

            })

        } catch (error) {

            console.log(error)

            res.status(500).json({
                message: error.message,
            })

        }

    }
)

module.exports = router