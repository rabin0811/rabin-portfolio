const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const { OAuth2Client } = require('google-auth-library')
const prisma = require('../db')

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
        const adminCount = await countAdmins()

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

        /* Flow B: Admin exists, email doesn't match — block */
        if (adminCount >= 1) {
            return res.status(403).json({
                message: 'An admin account is already registered. Please log in with your admin credentials.',
            })
        }

        /* Flow A: No admin exists — create as system admin */
        const newAdmin = await createAdmin({
            email,
            googleId,
        })

        const token = jwt.sign(
            { id: newAdmin.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        return res.status(201).json({
            success: true,
            token,
            admin: { id: newAdmin.id, email: newAdmin.email },
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Google authentication failed. Please try again.',
        })
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
        res.status(500).json({ message: error.message })
    }
}

const checkAdminExists = async (req, res) => {
    try {
        const adminCount = await countAdmins()
        res.status(200).json({
            exists: adminCount > 0,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
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
        res.status(500).json({ message: error.message })
    }
}

const localRegister = async (req, res) => {
    try {
        const { email, password, name } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' })
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
        console.log(error)
        res.status(500).json({ message: 'Registration failed' })
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
        console.log(error)
        res.status(500).json({ message: 'Login failed' })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ message: 'Email is required' })
        }

        const admin = await findAdminByEmail(email)
        if (!admin) {
            return res.status(404).json({ message: 'No account found with this email' })
        }

        if (!admin.password) {
            return res.status(400).json({ message: 'This account uses Google login. Password reset not available.' })
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const expiry = new Date(Date.now() + 15 * 60 * 1000)

        await prisma.admin.update({
            where: { id: admin.id },
            data: { resetCode: code, resetCodeExpiry: expiry },
        })

        const smtpHost = process.env.SMTP_HOST
        const smtpUser = process.env.SMTP_USER
        const smtpPass = process.env.SMTP_PASS

        if (smtpHost && smtpUser && smtpPass) {
            const transporter = nodemailer.createTransport({
                host: smtpHost,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: false,
                auth: { user: smtpUser, pass: smtpPass },
            })
            await transporter.sendMail({
                from: smtpUser,
                to: admin.email,
                subject: 'Password Reset Code - Portfolio Admin',
                text: `Your password reset code is: ${code}\n\nThis code expires in 15 minutes.\n\nIf you did not request this, please ignore this email.`,
            })
        } else {
            console.log('--- PASSWORD RESET CODE ---')
            console.log(`Email: ${admin.email}`)
            console.log(`Code: ${code}`)
            console.log('Expires: 15 minutes')
            console.log('--- SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env for email delivery ---')
        }

        res.status(200).json({ success: true, message: 'Reset code sent to your email' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to send reset code' })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body

        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: 'Email, code, and new password are required' })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' })
        }

        const admin = await findAdminByEmail(email)
        if (!admin) {
            return res.status(404).json({ message: 'No account found with this email' })
        }

        if (!admin.resetCode || !admin.resetCodeExpiry) {
            return res.status(400).json({ message: 'No reset code requested. Please request a new code.' })
        }

        if (admin.resetCode !== code) {
            return res.status(400).json({ message: 'Invalid reset code' })
        }

        if (new Date() > new Date(admin.resetCodeExpiry)) {
            return res.status(400).json({ message: 'Reset code has expired. Please request a new code.' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12)

        await prisma.admin.update({
            where: { id: admin.id },
            data: {
                password: hashedPassword,
                resetCode: null,
                resetCodeExpiry: null,
            },
        })

        res.status(200).json({ success: true, message: 'Password reset successfully. You can now login.' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to reset password' })
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
