const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:4173', 'https://rabin-portfolio-jade.vercel.app'],
    credentials: true,
}))
app.use(express.json())
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
app.use('/api/visitors', visitorRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/resume', resumeRoutes)

app.get('/', (req, res) => {
  res.send('Portfolio API Running')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})