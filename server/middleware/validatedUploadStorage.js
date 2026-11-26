const path = require('node:path')
const { Readable } = require('node:stream')

const detectFileType = (header) => {
    if (header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
        return { mimetype: 'image/png', extensions: ['.png'] }
    }

    if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
        return { mimetype: 'image/jpeg', extensions: ['.jpg', '.jpeg'] }
    }

    const gifHeader = header.subarray(0, 6).toString('ascii')
    if (gifHeader === 'GIF87a' || gifHeader === 'GIF89a') {
        return { mimetype: 'image/gif', extensions: ['.gif'] }
    }

    if (
        header.subarray(0, 4).toString('ascii') === 'RIFF'
        && header.subarray(8, 12).toString('ascii') === 'WEBP'
    ) {
        return { mimetype: 'image/webp', extensions: ['.webp'] }
    }

    if (header.subarray(0, 5).toString('ascii') === '%PDF-') {
        return { mimetype: 'application/pdf', extensions: ['.pdf'] }
    }

    return null
}

const readHeaderAndRestoreStream = async (file) => {
    const iterator = file.stream[Symbol.asyncIterator]()
    const chunks = []
    let length = 0

    while (length < 12) {
        const { value, done } = await iterator.next()
        if (done) {
            break
        }
        chunks.push(value)
        length += value.length
    }

    const header = Buffer.concat(chunks).subarray(0, 12)
    const replayStream = Readable.from((async function* replay() {
        for (const chunk of chunks) {
            yield chunk
        }
        while (true) {
            const { value, done } = await iterator.next()
            if (done) {
                return
            }
            yield value
        }
    }()))

    Object.defineProperty(file, 'stream', {
        configurable: true,
        enumerable: false,
        writable: true,
        value: replayStream,
    })

    return header
}

const validateFileHeader = (file, header) => {
    const detectedType = detectFileType(header)
    const declaredMimeType = file.mimetype === 'image/jpg' ? 'image/jpeg' : file.mimetype
    const extension = path.extname(file.originalname).toLowerCase()

    if (
        !detectedType
        || detectedType.mimetype !== declaredMimeType
        || !detectedType.extensions.includes(extension)
    ) {
        const error = new Error('Uploaded file content or extension does not match its allowed type')
        error.code = 'INVALID_UPLOAD_CONTENT'
        throw error
    }
}

const createValidatedStorage = (storage) => ({
    _handleFile(req, file, callback) {
        readHeaderAndRestoreStream(file)
            .then((header) => {
                validateFileHeader(file, header)
                storage._handleFile(req, file, callback)
            })
            .catch(callback)
    },
    _removeFile(req, file, callback) {
        storage._removeFile(req, file, callback)
    },
})

module.exports = {
    createValidatedStorage,
}
