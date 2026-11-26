const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const { getContentType, isR2Enabled, uploadObject } = require('../storage')

const uploadRoot = path.join(__dirname, '../uploads')
const categories = ['resume', 'projects', 'profile', 'blogs', 'gallery']

const migrateLocalUploads = async () => {
    if (!isR2Enabled) {
        throw new Error('Configure all Cloudflare R2 variables before migrating uploads')
    }

    let uploadedCount = 0

    for (const category of categories) {
        const directory = path.join(uploadRoot, category)
        let entries

        try {
            entries = await fs.promises.readdir(directory, { withFileTypes: true })
        } catch (error) {
            if (error.code === 'ENOENT') {
                continue
            }
            throw error
        }

        for (const entry of entries) {
            if (!entry.isFile()) {
                continue
            }

            const filePath = path.join(directory, entry.name)
            await uploadObject(
                category,
                entry.name,
                fs.createReadStream(filePath),
                getContentType(entry.name)
            )
            uploadedCount += 1
            console.log(`Uploaded ${category}/${entry.name}`)
        }
    }

    console.log(`Uploaded ${uploadedCount} local file(s) to Cloudflare R2`)
}

migrateLocalUploads().catch((error) => {
    console.error('Failed to migrate local uploads to Cloudflare R2', error)
    process.exitCode = 1
})
