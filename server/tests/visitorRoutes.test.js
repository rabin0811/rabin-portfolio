const assert = require('node:assert/strict')
const express = require('express')
const { test } = require('node:test')
const createVisitorRouter = require('../routes/visitorRoutes')

test('visitor count reads are non-mutating and POST increments the persistent total', async (context) => {
    let total = 0
    const prisma = {
        visitorCounter: {
            findUnique: async () => (total === 0 ? null : { total }),
            upsert: async ({ create, update }) => {
                total = total === 0 ? create.total : total + update.total.increment
                return { total }
            },
        },
    }

    const app = express()
    app.use('/api/visitors', createVisitorRouter(prisma))

    const server = app.listen(0, '127.0.0.1')
    await new Promise((resolve) => server.once('listening', resolve))
    context.after(() => new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve())
    }))

    const url = `http://127.0.0.1:${server.address().port}/api/visitors`

    const initialRead = await fetch(url)
    assert.deepEqual(await initialRead.json(), { visitors: 0 })
    assert.equal(total, 0)

    const firstVisit = await fetch(url, { method: 'POST' })
    assert.deepEqual(await firstVisit.json(), { visitors: 1 })

    const readAfterVisit = await fetch(url)
    assert.deepEqual(await readAfterVisit.json(), { visitors: 1 })

    const repeatedVisit = await fetch(url, { method: 'POST' })
    assert.equal(repeatedVisit.status, 429)
    assert.deepEqual(await repeatedVisit.json(), {
        message: 'Visitor count limit reached. Try again later.',
    })
    assert.equal(total, 1)
})
