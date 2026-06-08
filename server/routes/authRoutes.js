const express = require('express')
const protect = require('../middleware/authMiddleware')

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

router.get('/verify', protect, (req, res) => {
    res.json({ valid: true })
})

router.get('/google-config', googleConfig)
router.get('/check-admin', checkAdminExists)
router.get('/public-profile', getPublicProfile)

module.exports = router
