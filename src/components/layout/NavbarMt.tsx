import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { to: 'nossa-historia', label: 'Nossa História' },
  { to: 'info-mt', label: 'Local' },
  { to: 'galeria', label: 'Galeria' },
  { to: 'presentes', label: 'Presente' },
  { to: 'rsvp', label: 'Confirmar Presença' },
]

export function NavbarMt() {
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
        style={{ top: 'var(--geo-banner-h, 0px)' }}
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-sage-light/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between w-full">
          <Link
            to="hero"
            smooth
            duration={800}
            className="cursor-pointer"
            aria-label="Giulia & Lucas"
          >
            <img
              src="/logo3.png"
              alt="Giulia & Lucas"
              className="h-15 w-auto select-none"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                smooth
                duration={800}
                offset={-64}
                className="font-sans text-xs tracking-[0.15em] uppercase cursor-pointer transition-colors duration-200"
                style={
                  link.to === 'rsvp'
                    ? {
                        backgroundColor: 'var(--color-sage)',
                        color: 'var(--color-cream)',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '9999px',
                      }
                    : { color: 'var(--color-charcoal-light)' }
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-charcoal"
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-cream/98 backdrop-blur-sm flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <img
              src="/logo3.png"
              alt="Giulia & Lucas"
              className="h-20 w-auto mb-8 select-none"
            />
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                smooth
                duration={800}
                offset={-64}
                onClick={() => setMenuOpen(false)}
                className="font-sans text-sm tracking-[0.2em] uppercase text-charcoal-light cursor-pointer transition-colors"
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
