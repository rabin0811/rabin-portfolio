const assert = require('node:assert/strict')
const express = require('express')
const { test } = require('node:test')
const errorHandler = require('../middleware/errorHandler')

test('fallback error handler logs details but returns safe messages', async (context) => {
    const app = express()
    app.get('/client-error', (req, res, next) => {
        const error = new Error('private validation detail')
        error.status = 400
        next(error)
    })
    app.get('/server-error', (req, res, next) => {
        next(new Error('database connection secret'))
    })
    app.use(errorHandler)

    const loggedErrors = []
    const originalConsoleError = console.error
    console.error = (...args) => loggedErrors.push(args)

    const server = app.listen(0, '127.0.0.1')
    await new Promise((resolve) => server.once('listening', resolve))
    context.after(async () => {
        console.error = originalConsoleError
        await new Promise((resolve, reject) => {
            server.close((error) => error ? reject(error) : resolve())
        })
    })

    const baseUrl = `http://127.0.0.1:${server.address().port}`

    const clientError = await fetch(`${baseUrl}/client-error`)
    assert.equal(clientError.status, 400)
    assert.deepEqual(await clientError.json(), { message: 'Invalid request' })

    const serverError = await fetch(`${baseUrl}/server-error`)
    assert.equal(serverError.status, 500)
    assert.deepEqual(await serverError.json(), { message: 'Internal server error' })
    assert.equal(loggedErrors.length, 2)
})
