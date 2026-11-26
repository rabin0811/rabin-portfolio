import { lazy, Suspense, useEffect, useRef } from 'react'
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom'

import Navbar from './components/layout/Navbar.jsx'

import Hero from './components/sections/Hero.jsx'
import About from './components/sections/About.jsx'
import Certifications from './components/sections/Certifications.jsx'
import Skills from './components/sections/Skills.jsx'
import BlogSection from './components/sections/Blog.jsx'
import ProjectsSection from './components/sections/Projects.jsx'
import Contact from './components/sections/Contact.jsx'
import Footer from './components/sections/Footer.jsx'

import ProtectedRoute from './admin/components/ProtectedRoute.jsx'
import { clearAuthToken } from './admin/authSession.js'

import { Helmet } from 'react-helmet-async'
import SEO from './components/SEO.jsx'

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://humagainrabin.com.np'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const VISITOR_SESSION_KEY = 'portfolio-visitor-counted'
let visitorTrackingStarted = false

const Dashboard = lazy(() => import('./admin/pages/Dashboard.jsx'))
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin.jsx'))
const Blogs = lazy(() => import('./admin/pages/Blogs.jsx'))
const Projects = lazy(() => import('./admin/pages/Projects.jsx'))
const Resumes = lazy(() => import('./admin/pages/Resumes.jsx'))
const Gallery = lazy(() => import('./admin/pages/Gallery.jsx'))
const Messages = lazy(() => import('./admin/pages/Messages.jsx'))
const Register = lazy(() => import('./admin/pages/Register.jsx'))

const AdminTitle = () => {
  const location = useLocation()
  const titles = {
    '/admin': 'Admin Login',
    '/admin/dashboard': 'Dashboard',
    '/admin/blogs': 'Manage Blogs',
    '/admin/projects': 'Manage Projects',
    '/admin/gallery': 'Manage Gallery',
    '/admin/resumes': 'Manage Resumes',
    '/admin/messages': 'Messages',
    '/admin/register': 'Register Admin',
  }
  const page = Object.keys(titles).find((p) => location.pathname === p) ? Object.keys(titles).find((p) => location.pathname === p) : '/admin'

  return (
    <Helmet>
      <title>{titles[page]} | Rabin Humagain Admin</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  )
}

const isAdminPath = (pathname) => pathname === '/admin' || pathname.startsWith('/admin/')

const AdminSessionBoundary = () => {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)

  useEffect(() => {
    if (isAdminPath(previousPath.current) && !isAdminPath(pathname)) {
      clearAuthToken()
    }
    previousPath.current = pathname
  }, [pathname])

  return null
}

function HomePage() {
  useEffect(() => {
    if (visitorTrackingStarted) return
    visitorTrackingStarted = true

    try {
      if (window.sessionStorage.getItem(VISITOR_SESSION_KEY)) return
    } catch (error) {
      console.warn('Unable to access session storage for visitor tracking', error)
    }

    fetch(`${API}/api/visitors`, { method: 'POST', keepalive: true })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Visitor tracking failed with status ${response.status}`)
        }
        try {
          window.sessionStorage.setItem(VISITOR_SESSION_KEY, 'true')
        } catch (error) {
          console.warn('Unable to save visitor tracking session', error)
        }
      })
      .catch((error) => console.error('Failed to record visitor count', error))
  }, [])

  return (

    <div className="bg-white dark:bg-black text-zinc-900 dark:text-white min-h-screen transition-colors duration-300">

      <SEO
        title="Rabin Humagain | Full Stack Developer"
        description="Modern portfolio website of Rabin Humagain. Full stack developer, backend enthusiast, React developer, Node.js developer, and computer engineering student from Nepal."
        keywords="Rabin Humagain, Full Stack Developer, React Developer, Node Developer, Portfolio Website, Backend Enthusiast, Nepal"
        image="/profile.jpeg"
        url={SITE_URL}
        schema={{
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Rabin Humagain',
            url: SITE_URL,
            image: new URL('/profile.jpeg', SITE_URL).toString(),
            jobTitle: 'Full Stack Developer',
            description: 'Computer Engineering Student and Full Stack Developer',
            sameAs: [
                'https://github.com/rabin0811',
                'https://www.linkedin.com/in/rabin-humagain-417a35410',
                'https://facebook.com/rabin.humagai',
                'https://instagram.com/__ra_bin__',
            ],
        }}
      />

      <Navbar />

      <Hero />

      <About />

      <Certifications />

      <Skills />

      <BlogSection />

      <ProjectsSection />

      <Contact />

      <Footer />

    </div>

  )
}

function App() {

  return (

    <>

      <AdminSessionBoundary />

      <AdminTitle />

      <Suspense fallback={<div className="p-6 text-center">Loading page...</div>}>
        <Routes>

          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/admin"
            element={<AdminLogin />}
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/blogs"
            element={
              <ProtectedRoute>
                <Blogs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/gallery"
            element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/resumes"
            element={
              <ProtectedRoute>
                <Resumes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/register"
            element={<Register />}
          />

        </Routes>
      </Suspense>

    </>

  )
}

export default App