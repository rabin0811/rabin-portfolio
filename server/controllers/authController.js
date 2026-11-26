const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const { OAuth2Client } = require('google-auth-library')
const prisma = require('../db')
const sendInternalError = require('../utils/sendInternalError')

const {
    findAdminByEmail,
    createAdmin,
    countAdmins,
    updateAdmin,
} = require('../models/adminModel')

const googleLogin = async (req, res) => {

    try {

        const { credential } = req.body

        if (!credential) {
            return res.status(400).json({
                message: 'Google credential is required',
            })
        }

        const clientId = process.env.GOOGLE_CLIENT_ID

        if (!clientId) {
            return res.status(500).json({
                message: 'Google OAuth is not configured on the server. Please set GOOGLE_CLIENT_ID in .env',
            })
        }

        const client = new OAuth2Client(clientId)
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: clientId,
        })

        const payload = ticket.getPayload()
        const { sub: googleId, email } = payload

        if (!email) {
            return res.status(400).json({
                message: 'Google account has no email',
            })
        }

        const admin = await findAdminByEmail(email)

        /* Flow C: Auto-Link — email matches existing admin, link googleId */
        if (admin) {
            if (!admin.googleId) {
                await updateAdmin(admin.id, { googleId })
            }
            const token = jwt.sign(
                { id: admin.id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            )
            return res.status(200).json({
                success: true,
                token,
                admin: { id: admin.id, email: admin.email },
            })
        }

        return res.status(403).json({
            message: 'Google sign-in is available after initial administrator setup.',
        })

    } catch (error) {
        sendInternalError(res, error, 'Google authentication failed', 'Google authentication failed. Please try again.')
    }
}

const googleConfig = async (req, res) => {
    try {
        const clientId = process.env.GOOGLE_CLIENT_ID
        res.status(200).json({
            configured: !!clientId,
            clientId: clientId || null,
        })
    } catch (error) {
        sendInternalError(res, error, 'Failed to read Google login configuration')
    }
}

const checkAdminExists = async (req, res) => {
    try {
        const adminCount = await countAdmins()
        res.status(200).json({
            exists: adminCount > 0,
        })
    } catch (error) {
        sendInternalError(res, error, 'Failed to check administrator setup')
    }
}

const getPublicProfile = async (req, res) => {
    try {
        const admin = await prisma.admin.findFirst({
            select: { name: true, email: true, profileImage: true },
        })
        if (admin) {
            res.status(200).json(admin)
        } else {
            res.status(404).json({ message: 'No admin found' })
        }
    } catch (error) {
        sendInternalError(res, error, 'Failed to fetch public administrator profile')
    }
}

const localRegister = async (req, res) => {
    try {
        const { email, password, name, setupKey } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' })
        }

        const expectedSetupKey = process.env.ADMIN_SETUP_KEY
        if (!expectedSetupKey || Buffer.byteLength(expectedSetupKey) < 32) {
            return res.status(503).json({ message: 'Initial administrator setup is not configured' })
        }

        if (typeof setupKey !== 'string' || !setupKey) {
            return res.status(403).json({ message: 'Invalid administrator setup credentials' })
        }

        const suppliedKeyHash = crypto.createHash('sha256').update(setupKey).digest()
        const expectedKeyHash = crypto.createHash('sha256').update(expectedSetupKey).digest()
        if (!crypto.timingSafeEqual(suppliedKeyHash, expectedKeyHash)) {
            return res.status(403).json({ message: 'Invalid administrator setup credentials' })
        }

        const adminCount = await countAdmins()
        if (adminCount >= 1) {
            return res.status(403).json({
                message: 'An admin account is already registered.',
            })
        }

        const existing = await findAdminByEmail(email)
        if (existing) {
            return res.status(409).json({ message: 'An admin with this email already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const admin = await createAdmin({
            email,
            password: hashedPassword,
            name: name || null,
        })

        const token = jwt.sign(
            { id: admin.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(201).json({
            success: true,
            token,
            admin: { id: admin.id, email: admin.email },
        })
    } catch (error) {
        sendInternalError(res, error, 'Administrator registration failed', 'Registration failed')
    }
}

const localLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        const admin = await findAdminByEmail(email)
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        if (!admin.password) {
            return res.status(401).json({
                message: 'This account uses Google Sign-In. Please log in with Google.',
            })
        }

        const valid = await bcrypt.compare(password, admin.password)
        if (!valid) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const token = jwt.sign(
            { id: admin.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(200).json({
            success: true,
            token,
            admin: { id: admin.id, email: admin.email, name: admin.name },
        })
    } catch (error) {
        sendInternalError(res, error, 'Administrator login failed', 'Login failed')
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ message: 'Email is required' })
        }

        const smtpHost = process.env.SMTP_HOST
        const smtpUser = process.env.SMTP_USER
        const smtpPass = process.env.SMTP_PASS

        if (!smtpHost || !smtpUser || !smtpPass) {
            return res.status(503).json({ message: 'Password reset is temporarily unavailable' })
        }

        const admin = await findAdminByEmail(email)
        if (!admin || !admin.password) {
            return res.status(200).json({
                success: true,
                message: 'If an account exists for this email, reset instructions have been sent.',
            })
        }

        const code = crypto.randomBytes(32).toString('hex')
        const resetCodeHash = crypto.createHash('sha256').update(code).digest('hex')
        const expiry = new Date(Date.now() + 15 * 60 * 1000)

        await prisma.admin.update({
            where: { id: admin.id },
            data: { resetCode: resetCodeHash, resetCodeExpiry: expiry },
        })

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: { user: smtpUser, pass: smtpPass },
        })
        await transporter.sendMail({
            from: smtpUser,
            to: admin.email,
            subject: 'Password Reset Token - Portfolio Admin',
            text: `Your password reset token is: ${code}\n\nThis token expires in 15 minutes.\n\nIf you did not request this, please ignore this email.`,
        })

        res.status(200).json({
            success: true,
            message: 'If an account exists for this email, reset instructions have been sent.',
        })
    } catch (error) {
        sendInternalError(res, error, 'Failed to send password reset token', 'Failed to send reset instructions')
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body

        if (
            typeof email !== 'string'
            || typeof code !== 'string'
            || typeof newPassword !== 'string'
            || !email
            || !code
            || !newPassword
        ) {
            return res.status(400).json({ message: 'Email, code, and new password are required' })
        }

        const token = code.trim()
        if (!/^[a-f0-9]{64}$/i.test(token)) {
            return res.status(400).json({ message: 'Invalid or expired reset token' })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' })
        }

        const admin = await findAdminByEmail(email)
        if (!admin) {
            return res.status(400).json({ message: 'Invalid or expired reset token' })
        }

        if (!admin.resetCode || !admin.resetCodeExpiry) {
            return res.status(400).json({ message: 'Invalid or expired reset token' })
        }

        if (Date.now() >= new Date(admin.resetCodeExpiry).getTime()) {
            return res.status(400).json({ message: 'Invalid or expired reset token' })
        }

        const submittedHash = crypto.createHash('sha256').update(token).digest()
        const storedHash = Buffer.from(admin.resetCode, 'hex')
        if (
            storedHash.length !== submittedHash.length
            || !crypto.timingSafeEqual(storedHash, submittedHash)
        ) {
            return res.status(400).json({ message: 'Invalid or expired reset token' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12)

        const result = await prisma.admin.updateMany({
            where: {
                id: admin.id,
                resetCode: admin.resetCode,
                resetCodeExpiry: { gt: new Date() },
            },
            data: {
                password: hashedPassword,
                resetCode: null,
                resetCodeExpiry: null,
            },
        })

        if (result.count !== 1) {
            return res.status(400).json({ message: 'Invalid or expired reset token' })
        }

        res.status(200).json({ success: true, message: 'Password reset successfully. You can now login.' })
    } catch (error) {
        sendInternalError(res, error, 'Password reset failed', 'Failed to reset password')
    }
}

module.exports = {
    googleLogin,
    googleConfig,
    checkAdminExists,
    getPublicProfile,
    localRegister,
    localLogin,
    forgotPassword,
    resetPassword,
}
