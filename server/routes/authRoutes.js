const express = require('express')
const protect = require('../middleware/authMiddleware')
const {
    forgotPasswordLimiter,
    loginLimiter,
    registrationLimiter,
    resetPasswordLimiter,
} = require('../middleware/rateLimiters')

const router = express.Router()

const {
    googleLogin,
    googleConfig,
    checkAdminExists,
    getPublicProfile,
    localRegister,
    localLogin,
    forgotPassword,
    resetPassword,
} = require('../controllers/authController')

router.post('/google-login', loginLimiter, googleLogin)
router.post('/register', registrationLimiter, localRegister)
router.post('/login', loginLimiter, localLogin)
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword)
router.post('/reset-password', resetPasswordLimiter, resetPassword)

router.get('/verify', protect, (req, res) => {
    res.json({ valid: true })
})

router.get('/google-config', googleConfig)
router.get('/check-admin', checkAdminExists)
router.get('/public-profile', getPublicProfile)

module.exports = router
