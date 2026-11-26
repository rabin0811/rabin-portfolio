const assert = require('node:assert/strict')
const { Readable } = require('node:stream')
const { test } = require('node:test')
const { createValidatedStorage } = require('../middleware/validatedUploadStorage')

const collectFile = (file) => new Promise((resolve, reject) => {
    const storage = createValidatedStorage({
        _handleFile(req, validatedFile, callback) {
            const chunks = []
            validatedFile.stream.on('data', (chunk) => chunks.push(chunk))
            validatedFile.stream.on('error', callback)
            validatedFile.stream.on('end', () => callback(null, { content: Buffer.concat(chunks) }))
        },
        _removeFile(req, validatedFile, callback) {
            callback(null)
        },
    })

    storage._handleFile({}, {
        ...file,
        stream: Readable.from(file.chunks),
    }, (error, info) => error ? reject(error) : resolve(info))
})

test('validates image and PDF signatures while replaying the complete stream', async () => {
    const fixtures = [
        {
            originalname: 'image.png',
            mimetype: 'image/png',
            chunks: [Buffer.from([0x89, 0x50, 0x4e, 0x47]), Buffer.from([0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0])],
        },
        {
            originalname: 'image.jpg',
            mimetype: 'image/jpeg',
            chunks: [Buffer.from([0xff, 0xd8]), Buffer.from([0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0])],
        },
        {
            originalname: 'image.gif',
            mimetype: 'image/gif',
            chunks: [Buffer.from('GIF89a'), Buffer.from([0, 0, 0, 0, 0, 0])],
        },
        {
            originalname: 'image.webp',
            mimetype: 'image/webp',
            chunks: [Buffer.from('RIFF0000WEBP'), Buffer.from('VP8 ')],
        },
        {
            originalname: 'resume.pdf',
            mimetype: 'application/pdf',
            chunks: [Buffer.from('%PDF-1.7\n')],
        },
    ]

    for (const fixture of fixtures) {
        const info = await collectFile(fixture)
        assert.deepEqual(info.content, Buffer.concat(fixture.chunks))
    }
})

test('rejects spoofed MIME types and mismatched filename extensions', async () => {
    await assert.rejects(collectFile({
        originalname: 'spoofed.png',
        mimetype: 'image/png',
        chunks: [Buffer.from('%PDF-1.7\n')],
    }), /content or extension/)

    await assert.rejects(collectFile({
        originalname: 'mismatched.webp',
        mimetype: 'image/png',
        chunks: [Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0])],
    }), /content or extension/)
})
