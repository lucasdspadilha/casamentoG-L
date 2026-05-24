import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionTitle } from '../ui/SectionTitle'
import { useBodyScrollLock } from '../../lib/useBodyScrollLock'

const photos = [
  {
    id: 1,
    src: `${import.meta.env.BASE_URL}images/moments/1.jpeg`,
    alt: 'Giulia e Lucas',
    bg: 'from-sage-light/30 to-sage/20',
    label: 'Tarde de domingo',
    description: 'Almoço em família. Vibe.',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    id: 2,
    src: `${import.meta.env.BASE_URL}images/moments/2.jpeg`,
    alt: 'Giulia e Lucas',
    bg: 'from-gold-light/30 to-gold/20',
    label: 'Festa fantasia',
    description: 'A princesa e Luffy no mesmo elevador. Combinamos sem combinar.',
    span: '',
    position: 'object-[center_25%]',
  },
  {
    id: 3,
    src: `${import.meta.env.BASE_URL}images/moments/3.jpeg`,
    alt: 'Giulia e Lucas',
    bg: 'from-cream-dark to-sage-light/20',
    label: 'Lollapalooza',
    description: 'Mural colorido, música alta e a gente entre os palcos.',
    span: '',
  },
  {
    id: 4,
    src: `${import.meta.env.BASE_URL}images/moments/4.jpeg`,
    alt: 'Giulia e Lucas',
    bg: 'from-sage/20 to-sage-dark/10',
    label: 'Miami à deriva',
    description: 'Retrovisor, calor de Miami. Nossa Roadtrip.',
    span: 'md:col-span-2',
    zoomClass: 'scale-150 group-hover:scale-[1.56]',
    position: 'object-[center_55%]',
  },
  {
    id: 5,
    src: `${import.meta.env.BASE_URL}images/moments/5.jpeg`,
    alt: 'Giulia e Lucas',
    bg: 'from-gold/20 to-cream-dark',
    label: 'Comemorando',
    description: 'Nós.',
    span: '',
    position: 'object-[center_25%]',
  },
  // {
  //   id: 6,
  //   src: '',
  //   alt: 'Giulia e Lucas',
  //   bg: 'from-sage-light/20 to-cream-dark',
  //   label: 'Momentos',
  //   span: '',
  // },
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
  useBodyScrollLock(lightboxIndex !== null)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prev = () =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length))
  const next = () =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % photos.length))

  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex])

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
          className="mt-12 grid grid-cols-2 md:grid-cols-3 auto-rows-[250px] gap-3"
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
              style={{ minHeight: '140px' }}
            >
              {photo.src ? (
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    photo.position ?? ''
                  } ${photo.zoomClass ?? 'group-hover:scale-105'}`}
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
              className="flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {photos[lightboxIndex].src ? (
                <img
                  src={photos[lightboxIndex].src}
                  alt={photos[lightboxIndex].alt}
                  decoding="async"
                  className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain rounded-xl"
                />
              ) : (
                <div className="max-w-2xl w-full aspect-[4/3] rounded-xl overflow-hidden">
                  <PlaceholderPhoto
                    bg={photos[lightboxIndex].bg}
                    label={photos[lightboxIndex].label}
                  />
                </div>
              )}
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 text-cream/60 hover:text-cream transition-colors"
            >
              <ChevronRight size={32} />
            </button>

            <div className="absolute bottom-6 left-0 right-0 text-center px-6 pointer-events-none">
              <p className="font-serif text-lg text-cream/90">
                {photos[lightboxIndex].label}
              </p>
              {photos[lightboxIndex].description && (
                <p className="font-sans text-xs text-cream/60 mt-1 max-w-md mx-auto">
                  {photos[lightboxIndex].description}
                </p>
              )}
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-cream/30 mt-2">
                {lightboxIndex + 1} / {photos.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
