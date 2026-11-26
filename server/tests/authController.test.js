const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const Module = require('node:module')
const { test } = require('node:test')
const bcrypt = require('bcryptjs')

const admin = {
    id: 'admin-1',
    email: 'admin@example.test',
    password: 'old-password-hash',
    resetCode: null,
    resetCodeExpiry: null,
}
const googleAdmin = {
    id: 'google-admin',
    email: 'google@example.test',
    password: null,
}
let sentMessage
let adminCount = 0
let createdAdminCount = 0

const prisma = {
    admin: {
        update: async ({ data }) => Object.assign(admin, data),
        updateMany: async ({ where, data }) => {
            if (
                admin.id !== where.id
                || admin.resetCode !== where.resetCode
                || new Date(admin.resetCodeExpiry) <= where.resetCodeExpiry.gt
            ) {
                return { count: 0 }
            }

            Object.assign(admin, data)
            return { count: 1 }
        },
    },
}

const adminModel = {
    findAdminByEmail: async (email) => {
        if (email === admin.email) {
            return admin
        }
        return email === googleAdmin.email ? googleAdmin : null
    },
    createAdmin: async (data) => {
        adminCount += 1
        createdAdminCount += 1
        return { id: 'created-admin', ...data }
    },
    countAdmins: async () => adminCount,
    updateAdmin: async () => {},
}

const controllerPath = require.resolve('../controllers/authController')
const originalLoad = Module._load
Module._load = function (request, parent, isMain) {
    if (parent && parent.filename === controllerPath) {
        if (request === '../db') {
            return prisma
        }
        if (request === '../models/adminModel') {
            return adminModel
        }
        if (request === 'nodemailer') {
            return {
                createTransport: () => ({
                    sendMail: async (message) => { sentMessage = message },
                }),
            }
        }
        if (request === 'google-auth-library') {
            return {
                OAuth2Client: class {
                    async verifyIdToken() {
                        return {
                            getPayload: () => ({
                                sub: 'google-id',
                                email: 'google-bootstrap@example.test',
                            }),
                        }
                    }
                },
            }
        }
    }

    return originalLoad.call(this, request, parent, isMain)
}

const { forgotPassword, googleLogin, localRegister, resetPassword } = require(controllerPath)
Module._load = originalLoad

const makeResponse = () => ({
    statusCode: 200,
    body: null,
    status(code) {
        this.statusCode = code
        return this
    },
    json(body) {
        this.body = body
        return this
    },
})

test('password reset tokens are hashed, expire, and can only be used once', async () => {
    const previousSmtp = {
        host: process.env.SMTP_HOST,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
    process.env.SMTP_HOST = 'smtp.example.test'
    process.env.SMTP_USER = 'sender@example.test'
    process.env.SMTP_PASS = 'test-password'

    try {
        const forgotResponse = makeResponse()
        await forgotPassword({ body: { email: admin.email } }, forgotResponse)
        assert.equal(forgotResponse.statusCode, 200)

        const token = sentMessage.text.match(/token is: ([a-f0-9]{64})/)[1]
        assert.equal(admin.resetCode, crypto.createHash('sha256').update(token).digest('hex'))
        assert(!JSON.stringify(forgotResponse.body).includes(token))

        const unknownResponse = makeResponse()
        const googleResponse = makeResponse()
        await forgotPassword({ body: { email: 'unknown@example.test' } }, unknownResponse)
        await forgotPassword({ body: { email: googleAdmin.email } }, googleResponse)
        assert.equal(unknownResponse.statusCode, googleResponse.statusCode)
        assert.deepEqual(unknownResponse.body, googleResponse.body)

        const invalidResponse = makeResponse()
        await resetPassword({
            body: { email: admin.email, code: '0'.repeat(64), newPassword: 'new-password' },
        }, invalidResponse)
        assert.equal(invalidResponse.statusCode, 400)

        const resetResponse = makeResponse()
        await resetPassword({
            body: { email: admin.email, code: token, newPassword: 'new-password' },
        }, resetResponse)
        assert.equal(resetResponse.statusCode, 200)
        assert.equal(admin.resetCode, null)
        assert(await bcrypt.compare('new-password', admin.password))

        const replayResponse = makeResponse()
        await resetPassword({
            body: { email: admin.email, code: token, newPassword: 'another-password' },
        }, replayResponse)
        assert.equal(replayResponse.statusCode, 400)

        admin.resetCode = crypto.createHash('sha256').update(token).digest('hex')
        admin.resetCodeExpiry = new Date(Date.now() - 1)
        const expiredResponse = makeResponse()
        await resetPassword({
            body: { email: admin.email, code: token, newPassword: 'new-password' },
        }, expiredResponse)
        assert.equal(expiredResponse.statusCode, 400)

        process.env.SMTP_HOST = ''
        const unavailableResponse = makeResponse()
        await forgotPassword({ body: { email: admin.email } }, unavailableResponse)
        assert.equal(unavailableResponse.statusCode, 503)
    } finally {
        if (previousSmtp.host === undefined) delete process.env.SMTP_HOST
        else process.env.SMTP_HOST = previousSmtp.host
        if (previousSmtp.user === undefined) delete process.env.SMTP_USER
        else process.env.SMTP_USER = previousSmtp.user
        if (previousSmtp.pass === undefined) delete process.env.SMTP_PASS
        else process.env.SMTP_PASS = previousSmtp.pass
    }
})

test('initial admin registration requires the setup key and Google login cannot bootstrap', async () => {
    const previousEnv = {
        setupKey: process.env.ADMIN_SETUP_KEY,
        jwtSecret: process.env.JWT_SECRET,
        googleClientId: process.env.GOOGLE_CLIENT_ID,
    }
    const setupKey = 'a'.repeat(64)
    process.env.ADMIN_SETUP_KEY = setupKey
    process.env.JWT_SECRET = 'test-jwt-secret'
    process.env.GOOGLE_CLIENT_ID = 'test-google-client'
    adminCount = 0
    createdAdminCount = 0

    try {
        const invalidKeyResponse = makeResponse()
        await localRegister({
            body: { email: 'first-admin@example.test', password: 'strong-password', setupKey: 'wrong' },
        }, invalidKeyResponse)
        assert.equal(invalidKeyResponse.statusCode, 403)
        assert.equal(adminCount, 0)

        const validKeyResponse = makeResponse()
        await localRegister({
            body: { email: 'first-admin@example.test', password: 'strong-password', setupKey },
        }, validKeyResponse)
        assert.equal(validKeyResponse.statusCode, 201)
        assert.equal(adminCount, 1)

        const repeatedRegistrationResponse = makeResponse()
        await localRegister({
            body: { email: 'second@example.test', password: 'strong-password', setupKey },
        }, repeatedRegistrationResponse)
        assert.equal(repeatedRegistrationResponse.statusCode, 403)
        assert.equal(createdAdminCount, 1)

        const googleResponse = makeResponse()
        await googleLogin({ body: { credential: 'test-google-credential' } }, googleResponse)
        assert.equal(googleResponse.statusCode, 403)
        assert.equal(createdAdminCount, 1)

        process.env.ADMIN_SETUP_KEY = ''
        const unavailableResponse = makeResponse()
        await localRegister({
            body: { email: 'another@example.test', password: 'strong-password', setupKey },
        }, unavailableResponse)
        assert.equal(unavailableResponse.statusCode, 503)
    } finally {
        if (previousEnv.setupKey === undefined) delete process.env.ADMIN_SETUP_KEY
        else process.env.ADMIN_SETUP_KEY = previousEnv.setupKey
        if (previousEnv.jwtSecret === undefined) delete process.env.JWT_SECRET
        else process.env.JWT_SECRET = previousEnv.jwtSecret
        if (previousEnv.googleClientId === undefined) delete process.env.GOOGLE_CLIENT_ID
        else process.env.GOOGLE_CLIENT_ID = previousEnv.googleClientId
    }
})
