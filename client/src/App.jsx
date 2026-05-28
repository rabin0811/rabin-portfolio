import { useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from 'react-router-dom'

import Navbar from './components/layout/Navbar.jsx'

import Hero from './components/sections/Hero.jsx'
import About from './components/sections/About.jsx'
import Skills from './components/sections/Skills.jsx'
import ProjectsSection from './components/sections/Projects.jsx'
import Contact from './components/sections/Contact.jsx'
import Footer from './components/sections/Footer.jsx'
import ProtectedRoute from './admin/components/ProtectedRoute.jsx'

import Dashboard from './admin/pages/Dashboard.jsx'
import AdminLogin from './admin/pages/AdminLogin.jsx'
import Blogs from './admin/pages/Blogs.jsx'
import Projects from './admin/pages/Projects.jsx'
import Uploads from './admin/pages/Uploads.jsx'
import Messages from './admin/pages/Messages.jsx'

// A small internal component to listen for URL path changes and adjust the document title dynamically
const TitleManager = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      document.title = 'Rabin Humagain_Admin'
    } else {
      document.title = 'Rabin Humagain'
    }
  }, [location])

  return null // This component doesn't render any visible UI
}

function HomePage() {
  return (
    /* Changed hardcoded bg-black to adapt gracefully if you use global light/dark background wrappers */
    <div className="bg-white dark:bg-black text-zinc-900 dark:text-white min-h-screen transition-colors duration-300">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <ProjectsSection />
      <Contact />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      {/* The TitleManager sits inside BrowserRouter to monitor routing states */}
      <TitleManager />

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
          path="/admin/uploads"
          element={
            <ProtectedRoute>
              <Uploads />
            </ProtectedRoute>
          }
        />

        <Route
          path='/admin/messages'
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
      </Routes>

    </BrowserRouter>
  )
}

export default App