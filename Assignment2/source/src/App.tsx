import { useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Background from './components/Background'
import CursorGlow from './components/CursorGlow'
import ScrollProgress from './components/ScrollProgress'
import Extras from './components/Extras'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'
import About from './pages/About'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }) }, [pathname])
  return null
}

function Routed() {
  const location = useLocation()
  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/post/:slug" element={<PostDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Background />
      <CursorGlow />
      <ScrollProgress />
      <Extras />
      <Header />
      <main className="relative min-h-screen">
        <Routed />
      </main>
      <Footer />
    </HashRouter>
  )
}
