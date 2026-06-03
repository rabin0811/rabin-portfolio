const express = require('express')

const router = express.Router()

const {
    googleLogin,
    googleConfig,
    checkAdminExists,
    getPublicProfile,
} = require('../controllers/authController')

router.post('/google-login', googleLogin)

router.get('/google-config', googleConfig)

router.get('/check-admin', checkAdminExists)

router.get('/public-profile', getPublicProfile)

module.exports = router
