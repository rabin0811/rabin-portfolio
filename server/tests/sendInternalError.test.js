const assert = require('node:assert/strict')
const { test } = require('node:test')
const sendInternalError = require('../utils/sendInternalError')

test('logs server errors without returning exception details to clients', () => {
    const previousError = console.error
    let loggedContext
    let loggedError
    console.error = (context, error) => {
        loggedContext = context
        loggedError = error
    }

    const response = {
        statusCode: null,
        body: null,
        headersSent: false,
        status(code) {
            this.statusCode = code
            return this
        },
        json(body) {
            this.body = body
            return this
        },
    }
    const error = new Error('database connection details')

    try {
        sendInternalError(response, error, 'Request failed', 'Request could not be completed')
    } finally {
        console.error = previousError
    }

    assert.equal(response.statusCode, 500)
    assert.deepEqual(response.body, { message: 'Request could not be completed' })
    assert.equal(loggedContext, 'Request failed')
    assert.equal(loggedError, error)
})
