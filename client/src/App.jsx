import { useEffect } from 'react'

import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom'

import Navbar from './components/layout/Navbar.jsx'

import Hero from './components/sections/Hero.jsx'
import PortfolioSlideshow from './components/sections/PortfolioSlideshow.jsx'
import About from './components/sections/About.jsx'
import Certifications from './components/sections/Certifications.jsx'
import Skills from './components/sections/Skills.jsx'
import BlogSection from './components/sections/Blog.jsx'
import ProjectsSection from './components/sections/Projects.jsx'
import Contact from './components/sections/Contact.jsx'
import Footer from './components/sections/Footer.jsx'

import ProtectedRoute from './admin/components/ProtectedRoute.jsx'

import Dashboard from './admin/pages/Dashboard.jsx'
import AdminLogin from './admin/pages/AdminLogin.jsx'
import Blogs from './admin/pages/Blogs.jsx'
import Projects from './admin/pages/Projects.jsx'
import Uploads from './admin/pages/Uploads.jsx'
import Gallery from './admin/pages/Gallery.jsx'
import Messages from './admin/pages/Messages.jsx'
import Register from './admin/pages/Register.jsx'
import Profile from './admin/pages/Profile.jsx'

import SEO from './components/SEO.jsx'

const TitleManager = () => {

  const location = useLocation()

  useEffect(() => {

    if (location.pathname.startsWith('/admin')) {

      document.title = 'Rabin Humagain Admin'

    } else {

      document.title = 'Rabin Humagain'

    }

  }, [location])

  return null
}

function HomePage() {

  return (

    <div className="bg-white dark:bg-black text-zinc-900 dark:text-white min-h-screen transition-colors duration-300">

      <SEO
        title="Rabin Humagain | Full Stack Developer"
        description="Modern portfolio website of Rabin Humagain. Full stack developer, backend enthusiast, React developer, Node.js developer, and computer engineering student."
        keywords="Rabin Humagain, Full Stack Developer, React Developer, Node Developer, Portfolio Website"
        image="/profile.jpeg"
        url="https://rabin-portfolio.vercel.app"
      />

      <Navbar />

      <Hero />

      <PortfolioSlideshow />

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
          path="/admin/gallery"
          element={
            <ProtectedRoute>
              <Gallery />
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

        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>

    </>

  )
}

export default App