const assert = require('node:assert/strict')
const express = require('express')
const { test } = require('node:test')
const securityHeaders = require('../middleware/securityHeaders')

test('security headers are set while allowing cross-origin public assets', async (context) => {
    const app = express()
    app.use(securityHeaders)
    app.get('/uploads/sample.png', (req, res) => res.type('image/png').send('image'))

    const server = app.listen(0, '127.0.0.1')
    await new Promise((resolve) => server.once('listening', resolve))
    context.after(() => new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve())
    }))

    const response = await fetch(`http://127.0.0.1:${server.address().port}/uploads/sample.png`)
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
    assert.equal(response.headers.get('cross-origin-resource-policy'), 'cross-origin')
    assert.ok(response.headers.get('content-security-policy'))
})
