import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionTitle } from '../ui/SectionTitle'

// Placeholder images using gradient backgrounds — replace with real photos
const photos = [
  {
    id: 1,
    src: '',
    alt: 'Giulia e Lucas',
    bg: 'from-sage-light/30 to-sage/20',
    label: 'Ensaio',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    id: 2,
    src: '',
    alt: 'Giulia e Lucas',
    bg: 'from-gold-light/30 to-gold/20',
    label: 'Primeira viagem',
    span: '',
  },
  {
    id: 3,
    src: '',
    alt: 'Giulia e Lucas',
    bg: 'from-cream-dark to-sage-light/20',
    label: 'Nossa casa',
    span: '',
  },
  {
    id: 4,
    src: '',
    alt: 'Giulia e Lucas',
    bg: 'from-sage/20 to-sage-dark/10',
    label: 'O pedido',
    span: 'md:col-span-2',
  },
  {
    id: 5,
    src: '',
    alt: 'Giulia e Lucas',
    bg: 'from-gold/20 to-cream-dark',
    label: 'Juntos',
    span: '',
  },
  {
    id: 6,
    src: '',
    alt: 'Giulia e Lucas',
    bg: 'from-sage-light/20 to-cream-dark',
    label: 'Momentos',
    span: '',
  },
]

function PlaceholderPhoto({ bg, label }: { bg: string; label: string }) {
  return (
    <div className={`w-full h-full min-h-48 bg-gradient-to-br ${bg} flex flex-col items-center justify-center gap-2`}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-sage/40">
        <rect x="2" y="6" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="15" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 6V4a2 2 0 012-2h12a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-sage/40">
        {label}
      </span>
    </div>
  )
}

export function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prev = () =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length))
  const next = () =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % photos.length))

  return (
    <section id="galeria" className="py-24 md:py-32 px-6 bg-cream-dark">
      <div className="max-w-5xl mx-auto">
        <SectionTitle
          label="Momentos"
          title="Nossa Galeria"
          subtitle="Alguns registros da nossa história juntos."
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-3 auto-rows-48 gap-3"
        >
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => openLightbox(index)}
              className={`relative overflow-hidden rounded-xl cursor-pointer group ${photo.span}`}
              style={{ minHeight: '180px' }}
            >
              {photo.src ? (
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <PlaceholderPhoto bg={photo.bg} label={photo.label} />
              )}
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-300 rounded-xl" />
              <span className="absolute bottom-3 left-3 font-sans text-[10px] tracking-[0.15em] uppercase text-white/0 group-hover:text-white/80 transition-colors duration-300">
                {photo.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center font-sans text-xs text-charcoal-light/40 tracking-wide"
        >
          As fotos do grande dia serão adicionadas em breve ✨
        </motion.p>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-cream/60 hover:text-cream transition-colors"
            >
              <X size={24} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 text-cream/60 hover:text-cream transition-colors"
            >
              <ChevronLeft size={32} />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl w-full aspect-[4/3] rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {photos[lightboxIndex].src ? (
                <img
                  src={photos[lightboxIndex].src}
                  alt={photos[lightboxIndex].alt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <PlaceholderPhoto
                  bg={photos[lightboxIndex].bg}
                  label={photos[lightboxIndex].label}
                />
              )}
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 text-cream/60 hover:text-cream transition-colors"
            >
              <ChevronRight size={32} />
            </button>

            <p className="absolute bottom-6 font-sans text-xs tracking-[0.15em] uppercase text-cream/40">
              {lightboxIndex + 1} / {photos.length} — {photos[lightboxIndex].label}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
