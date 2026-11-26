const assert = require('node:assert/strict')
const express = require('express')
const { test } = require('node:test')
const {
    forgotPasswordLimiter,
    loginLimiter,
    registrationLimiter,
    resetPasswordLimiter,
} = require('../middleware/rateLimiters')

test('authentication endpoints enforce the configured per-IP request limits', async (context) => {
    const app = express()
    app.post('/login', loginLimiter, (req, res) => res.sendStatus(req.query.ok === '1' ? 200 : 401))
    app.post('/register', registrationLimiter, (req, res) => res.sendStatus(201))
    app.post('/forgot', forgotPasswordLimiter, (req, res) => res.sendStatus(200))
    app.post('/reset', resetPasswordLimiter, (req, res) => res.sendStatus(400))

    const server = app.listen(0, '127.0.0.1')
    await new Promise((resolve) => server.once('listening', resolve))
    context.after(() => new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve())
    }))

    const baseUrl = `http://127.0.0.1:${server.address().port}`
    const post = (route) => fetch(`${baseUrl}${route}`, { method: 'POST' })

    for (let attempt = 0; attempt < 12; attempt += 1) {
        assert.equal((await post('/login?ok=1')).status, 200)
    }
    for (let attempt = 0; attempt < 10; attempt += 1) {
        assert.equal((await post('/login')).status, 401)
    }
    assert.equal((await post('/login')).status, 429)

    for (let attempt = 0; attempt < 5; attempt += 1) {
        assert.equal((await post('/register')).status, 201)
    }
    assert.equal((await post('/register')).status, 429)

    for (let attempt = 0; attempt < 3; attempt += 1) {
        assert.equal((await post('/forgot')).status, 200)
    }
    assert.equal((await post('/forgot')).status, 429)

    for (let attempt = 0; attempt < 10; attempt += 1) {
        assert.equal((await post('/reset')).status, 400)
    }
    assert.equal((await post('/reset')).status, 429)
})
