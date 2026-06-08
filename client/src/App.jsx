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

import Dashboard from './admin/pages/Dashboard.jsx'
import AdminLogin from './admin/pages/AdminLogin.jsx'
import Blogs from './admin/pages/Blogs.jsx'
import Projects from './admin/pages/Projects.jsx'
import Resumes from './admin/pages/Resumes.jsx'
import Gallery from './admin/pages/Gallery.jsx'
import Messages from './admin/pages/Messages.jsx'
import Register from './admin/pages/Register.jsx'

import { Helmet } from 'react-helmet-async'
import SEO from './components/SEO.jsx'

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

function HomePage() {

  return (

    <div className="bg-white dark:bg-black text-zinc-900 dark:text-white min-h-screen transition-colors duration-300">

      <SEO
        title="Rabin Humagain | Full Stack Developer"
        description="Modern portfolio website of Rabin Humagain. Full stack developer, backend enthusiast, React developer, Node.js developer, and computer engineering student from Nepal."
        keywords="Rabin Humagain, Full Stack Developer, React Developer, Node Developer, Portfolio Website, Backend Enthusiast, Nepal"
        image="/profile.jpeg"
        url="https://rabin-portfolio.vercel.app"
        schema={{
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Rabin Humagain',
            url: 'https://rabin-portfolio.vercel.app',
            image: 'https://rabin-portfolio.vercel.app/profile.jpeg',
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

      <AdminTitle />

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

    </>

  )
}

export default App