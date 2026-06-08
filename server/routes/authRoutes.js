const express = require('express')

const router = express.Router()

const {
    googleLogin,
    googleConfig,
    checkAdminExists,
    getPublicProfile,
    localRegister,
    localLogin,
} = require('../controllers/authController')

router.post('/google-login', googleLogin)
router.post('/register', localRegister)
router.post('/login', localLogin)

router.get('/google-config', googleConfig)
router.get('/check-admin', checkAdminExists)
router.get('/public-profile', getPublicProfile)

module.exports = router
