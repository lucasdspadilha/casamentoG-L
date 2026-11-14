import { motion } from 'framer-motion'
import { stripPhotoIds, photoUrl } from '../../data/weddingPhotos'

/**
 * Faixa divisora com 4 fotos — usada como quebra visual entre seções.
 * Sem título, sem CTA. Só decoração.
 */
export function WeddingStrip() {
  return (
    <section className="relative overflow-hidden bg-charcoal">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5">
        {stripPhotoIds.map((id, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="relative overflow-hidden aspect-[4/5] md:aspect-square"
          >
            <img
              src={photoUrl(id, 'thumb')}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-charcoal/15" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
