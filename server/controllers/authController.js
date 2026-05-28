const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {
    findAdminByEmail,
    createAdmin,
} = require('../models/adminModel')

const registerAdmin = async (req, res) => {

    try {

        const { email, password } = req.body

        const existingAdmin = await findAdminByEmail(email)

        if (existingAdmin) {
            return res.status(400).json({
                message: 'Admin already exists',
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const admin = await createAdmin({
            email,
            password: hashedPassword,
        })

        res.status(201).json({
            success: true,
            admin,
        })

    } catch (error) {

        res.status(500).json({
            message: error.message,
        })

    }
}

const loginAdmin = async (req, res) => {

    try {

        const { email, password } = req.body

        const admin = await findAdminByEmail(email)

        if (!admin) {
            return res.status(404).json({
                message: 'Admin not found',
            })
        }

        const isMatch = await bcrypt.compare(
            password,
            admin.password
        )

        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials',
            })
        }

        const token = jwt.sign(
            {
                id: admin.id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d',
            }
        )

        res.status(200).json({
            success: true,
            token,
            admin: {
                id: admin.id,
                email: admin.email,
            },
        })

    } catch (error) {

        res.status(500).json({
            message: error.message,
        })

    }
}

module.exports = {
    registerAdmin,
    loginAdmin,
}