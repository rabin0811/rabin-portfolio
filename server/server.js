const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const securityHeaders = require('./middleware/securityHeaders')
const errorHandler = require('./middleware/errorHandler')

dotenv.config({ path: path.join(__dirname, '.env') })

const { getR2Object, isR2Enabled } = require('./storage')

const app = express()

app.use(securityHeaders)

if (process.env.TRUST_PROXY_HOPS) {
    const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS)
    if (!Number.isInteger(trustProxyHops) || trustProxyHops < 1) {
        throw new Error('TRUST_PROXY_HOPS must be a positive integer')
    }
    app.set('trust proxy', trustProxyHops)
}

const configuredOrigins = (process.env.CORS_ORIGINS || 'https://humagainrabin.com.np')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
const isLocalDevelopmentOrigin = (origin) => {
    if (process.env.NODE_ENV === 'production' || !origin) {
        return false
    }

    try {
        const url = new URL(origin)
        return url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname)
    } catch {
        return false
    }
}

app.use(cors({
    origin: (origin, callback) => {
        callback(null, Boolean(
            origin && (configuredOrigins.includes(origin) || isLocalDevelopmentOrigin(origin))
        ))
    },
    credentials: true,
}))
app.use(express.json())
app.get('/uploads/:category/:filename', async (req, res, next) => {
    if (!isR2Enabled) {
        return next()
    }

    try {
        const object = await getR2Object(req.params.category, req.params.filename)
        if (!object || !object.Body) {
            return next()
        }

        if (object.ContentType) {
            res.type(object.ContentType)
        }
        if (object.ContentLength) {
            res.set('Content-Length', object.ContentLength)
        }
        res.set('X-Content-Type-Options', 'nosniff')
        object.Body.on('error', (error) => {
            console.error('Failed to stream uploaded object', error)
            if (res.headersSent) {
                res.destroy(error)
            } else {
                res.status(502).end()
            }
        })
        object.Body.pipe(res)
    } catch (error) {
        if (
            error.code === 'INVALID_UPLOAD_PATH'
            || error.name === 'NoSuchKey'
            || error.name === 'NotFound'
            || error.$metadata?.httpStatusCode === 404
        ) {
            return next()
        }

        console.error('Failed to retrieve uploaded object', error)
        res.status(502).json({ message: 'Unable to retrieve uploaded file' })
    }
})
app.use('/uploads', express.static(
  path.join(__dirname, 'uploads')
))

const contactRoutes = require('./routes/contactRoutes')
const authRoutes = require('./routes/authRoutes')
const blogRoutes = require('./routes/blogRoutes')
const projectRoutes = require('./routes/projectRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const visitorRoutes = require('./routes/visitorRoutes')
const adminRoutes = require('./routes/adminRoutes')
const galleryRoutes = require('./routes/galleryRoutes')
const resumeRoutes = require('./routes/resumeRoutes')

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/contact', contactRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/visitors', visitorRoutes())
app.use('/api/admin', adminRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/resume', resumeRoutes)

app.get('/', (req, res) => {
  res.send('Portfolio API Running')
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})