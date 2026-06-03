const jwt = require('jsonwebtoken')
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

module.exports = {
    googleLogin,
    googleConfig,
    checkAdminExists,
    getPublicProfile,
}
