import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { SectionTitle } from '../ui/SectionTitle'
import { useBodyScrollLock } from '../../lib/useBodyScrollLock'
import { galleryPhotoIds, photoUrl } from '../../data/weddingPhotos'

const INITIAL_VISIBLE = 8

export function WeddingGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(false)
  useBodyScrollLock(lightboxIndex !== null)

  const visibleIds = expanded
    ? galleryPhotoIds
    : galleryPhotoIds.slice(0, INITIAL_VISIBLE)
  const hiddenCount = galleryPhotoIds.length - INITIAL_VISIBLE

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prev = () =>
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + visibleIds.length) % visibleIds.length
    )
  const next = () =>
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % visibleIds.length
    )

  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, visibleIds.length])

  return (
    <section id="o-dia" className="py-24 md:py-32 px-6 bg-cream scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          label="07 de Setembro de 2026"
          title="O Grande Dia"
          subtitle="Os registros do nosso casamento no Bar Botânico."
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          id="o-dia-grid"
          className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-[200px] gap-2 md:gap-3"
        >
          {visibleIds.map((id, index) => {
            // Padrão de destaque: fotos 0, 6, 12 ocupam 2x2 (varia a textura do grid)
            const featured = index % 7 === 0
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.4) }}
                whileHover={{ scale: 1.01 }}
                onClick={() => openLightbox(index)}
                className={`relative overflow-hidden rounded-xl cursor-pointer group ${
                  featured ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <img
                  src={photoUrl(id, 'thumb')}
                  alt={`Momento do casamento ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-300 rounded-xl" />
              </motion.div>
            )
          })}
        </motion.div>

        {!expanded && hiddenCount > 0 && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase bg-sage text-cream hover:bg-sage-dark px-6 py-3 rounded-full transition-colors cursor-pointer"
            >
              Ver mais {hiddenCount} fotos
              <ChevronDown size={14} />
            </button>
          </div>
        )}
      </div>

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
              aria-label="Fechar"
            >
              <X size={24} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              className="absolute left-4 text-cream/60 hover:text-cream transition-colors"
              aria-label="Anterior"
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
              <img
                src={photoUrl(visibleIds[lightboxIndex], 'full')}
                alt={`Momento ${lightboxIndex + 1}`}
                decoding="async"
                className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain rounded-xl"
              />
            </motion.div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              className="absolute right-4 text-cream/60 hover:text-cream transition-colors"
              aria-label="Próxima"
            >
              <ChevronRight size={32} />
            </button>

            <div className="absolute bottom-6 left-0 right-0 text-center px-6 pointer-events-none">
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-cream/40">
                {lightboxIndex + 1} / {visibleIds.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
