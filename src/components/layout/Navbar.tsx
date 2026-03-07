import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { to: 'nossa-historia', label: 'Nossa História' },
  { to: 'cerimonia', label: 'Cerimônia' },
  { to: 'galeria', label: 'Galeria' },
  { to: 'presentes', label: 'Presentes' },
  { to: 'rsvp', label: 'Confirmar Presença' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-sage-light/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between w-full">
          {/* Monogram */}
          <Link
            to="hero"
            smooth
            duration={800}
            className="cursor-pointer"
          >
            <span className="font-serif text-xl font-light tracking-widest text-charcoal select-none">
              G <span className="text-sage-light mx-1">&</span> L
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                smooth
                duration={800}
                offset={-64}
                className={`font-sans text-xs tracking-[0.15em] uppercase cursor-pointer transition-colors duration-200 ${
                  link.to === 'rsvp'
                    ? 'bg-sage text-cream px-5 py-2 rounded-full hover:bg-sage-dark'
                    : 'text-charcoal-light hover:text-sage'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-charcoal"
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-cream/98 backdrop-blur-sm flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <div className="font-serif text-3xl font-light tracking-widest text-charcoal mb-8">
              G <span className="text-sage-light mx-2">&</span> L
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                smooth
                duration={800}
                offset={-64}
                onClick={() => setMenuOpen(false)}
                className="font-sans text-sm tracking-[0.2em] uppercase text-charcoal-light hover:text-sage cursor-pointer transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
