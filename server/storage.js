const fs = require('fs')
const path = require('path')
const { DeleteObjectCommand, GetObjectCommand, S3Client } = require('@aws-sdk/client-s3')
const { Upload } = require('@aws-sdk/lib-storage')

const uploadRoot = path.join(__dirname, 'uploads')
const uploadCategories = new Set(['resume', 'projects', 'profile', 'blogs', 'gallery'])
const r2Config = {
    accountId: process.env.R2_ACCOUNT_ID?.trim(),
    bucketName: process.env.R2_BUCKET_NAME?.trim(),
    accessKeyId: process.env.R2_ACCESS_KEY_ID?.trim(),
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY?.trim(),
}
const configuredValues = Object.values(r2Config).filter(Boolean).length

if (configuredValues > 0 && configuredValues < Object.keys(r2Config).length) {
    throw new Error('Cloudflare R2 configuration is incomplete')
}

const isR2Enabled = configuredValues === Object.keys(r2Config).length

if (process.env.NODE_ENV === 'production' && !isR2Enabled) {
    throw new Error('Cloudflare R2 configuration is required in production')
}

const r2Client = isR2Enabled
    ? new S3Client({
        region: 'auto',
        endpoint: `https://${r2Config.accountId}.r2.cloudflarestorage.com`,
        forcePathStyle: true,
        credentials: {
            accessKeyId: r2Config.accessKeyId,
            secretAccessKey: r2Config.secretAccessKey,
        },
    })
    : null

const getObjectKey = (category, filename) => {
    if (
        !uploadCategories.has(category)
        || typeof filename !== 'string'
        || !filename
        || filename === '.'
        || filename === '..'
        || filename.includes('/')
        || filename.includes('\\')
    ) {
        const error = new Error('Invalid upload path')
        error.code = 'INVALID_UPLOAD_PATH'
        throw error
    }

    return `${category}/${filename}`
}

const uploadObject = async (category, filename, body, contentType) => {
    if (!r2Client) {
        throw new Error('Cloudflare R2 is not configured')
    }

    const key = getObjectKey(category, filename)
    const upload = new Upload({
        client: r2Client,
        params: {
            Bucket: r2Config.bucketName,
            Key: key,
            Body: body,
            ContentType: contentType,
        },
    })

    await upload.done()
    return key
}

const createR2Storage = (category, getFilename) => ({
    _handleFile(req, file, callback) {
        const filename = getFilename(file)
        uploadObject(category, filename, file.stream, file.mimetype)
            .then((key) => callback(null, {
                filename,
                key,
                path: `/uploads/${key}`,
            }))
            .catch(callback)
    },
    _removeFile(req, file, callback) {
        deleteStoredFile(category, file.filename)
            .then(() => callback(null))
            .catch(callback)
    },
})

const getR2Object = async (category, filename) => {
    if (!r2Client) {
        return null
    }

    const key = getObjectKey(category, filename)
    return r2Client.send(new GetObjectCommand({
        Bucket: r2Config.bucketName,
        Key: key,
    }))
}

const deleteStoredFile = async (category, filename) => {
    const key = getObjectKey(category, filename)

    if (r2Client) {
        await r2Client.send(new DeleteObjectCommand({
            Bucket: r2Config.bucketName,
            Key: key,
        }))
    }

    const localPath = path.join(uploadRoot, category, filename)
    try {
        await fs.promises.unlink(localPath)
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error
        }
    }
}

const getContentType = (filename) => {
    const contentTypes = {
        '.gif': 'image/gif',
        '.jpeg': 'image/jpeg',
        '.jpg': 'image/jpeg',
        '.pdf': 'application/pdf',
        '.png': 'image/png',
        '.webp': 'image/webp',
    }

    return contentTypes[path.extname(filename).toLowerCase()] || 'application/octet-stream'
}

module.exports = {
    createR2Storage,
    deleteStoredFile,
    getContentType,
    getR2Object,
    isR2Enabled,
    uploadObject,
}
