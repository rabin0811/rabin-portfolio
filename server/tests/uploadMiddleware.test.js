const assert = require('node:assert/strict')
const express = require('express')
const fs = require('node:fs/promises')
const path = require('node:path')
const { test } = require('node:test')

process.env.NODE_ENV = 'test'
delete process.env.R2_ACCOUNT_ID
delete process.env.R2_BUCKET_NAME
delete process.env.R2_ACCESS_KEY_ID
delete process.env.R2_SECRET_ACCESS_KEY

const { uploadProjectImage } = require('../middleware/uploadMiddleware')

test('invalid upload types return safe client errors', async (context) => {
    const app = express()
    app.post('/upload', uploadProjectImage.single('projectImage'), (req, res) => {
        res.status(201).json({ filename: req.file.filename })
    })
    const server = app.listen(0, '127.0.0.1')
    await new Promise((resolve) => server.once('listening', resolve))
    const savedFiles = []
    context.after(async () => {
        await new Promise((resolve, reject) => {
            server.close((error) => error ? reject(error) : resolve())
        })
        await Promise.all(savedFiles.map((filename) => fs.unlink(
            path.join(__dirname, '../uploads/projects', filename)
        )))
    })

    const url = `http://127.0.0.1:${server.address().port}/upload`
    const limit = 10 * 1024 * 1024
    const validPng = Buffer.alloc(limit)
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(validPng)
    const maximumSizeForm = new FormData()
    maximumSizeForm.append(
        'projectImage',
        new Blob([validPng], { type: 'image/png' }),
        'maximum.png'
    )
    const maximumSizeResponse = await fetch(url, { method: 'POST', body: maximumSizeForm })
    assert.equal(maximumSizeResponse.status, 201)
    const maximumSizeBody = await maximumSizeResponse.json()
    savedFiles.push(maximumSizeBody.filename)

    const oversizedForm = new FormData()
    oversizedForm.append(
        'projectImage',
        new Blob([Buffer.concat([validPng, Buffer.from([0])])], { type: 'image/png' }),
        'oversized.png'
    )
    const oversizedResponse = await fetch(url, { method: 'POST', body: oversizedForm })
    assert.equal(oversizedResponse.status, 413)

    const spoofedImage = new FormData()
    spoofedImage.append(
        'projectImage',
        new Blob([Buffer.from('%PDF-1.7\n')], { type: 'image/png' }),
        'spoofed.png'
    )
    const spoofedResponse = await fetch(url, { method: 'POST', body: spoofedImage })
    assert.equal(spoofedResponse.status, 400)
    assert.deepEqual(await spoofedResponse.json(), {
        message: 'File type, content, or extension is not allowed',
    })

    const svgImage = new FormData()
    svgImage.append(
        'projectImage',
        new Blob([Buffer.from('<svg></svg>')], { type: 'image/svg+xml' }),
        'image.svg'
    )
    const svgResponse = await fetch(url, { method: 'POST', body: svgImage })
    assert.equal(svgResponse.status, 400)
    assert.deepEqual(await svgResponse.json(), {
        message: 'File type, content, or extension is not allowed',
    })
})
