import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Gift } from 'lucide-react'
import { SectionTitle } from '../ui/SectionTitle'
import { wishes, wishCategories } from '../../data/wishes'

export function WishList() {
  const [activeCategory, setActiveCategory] = useState('Todos')

  const filtered =
    activeCategory === 'Todos'
      ? wishes
      : wishes.filter((w) => w.category === activeCategory)

  return (
    <section id="presentes" className="py-24 md:py-32 px-6 bg-cream">
      <div className="max-w-5xl mx-auto">
        <SectionTitle
          label="Lista de desejos"
          title="Presentes"
          subtitle="Sua presença já é o maior presente. Mas se quiser nos dar uma alegria a mais, aqui estão algumas ideias."
        />

        {/* Pix note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 bg-sage/8 border border-sage-light/30 rounded-2xl p-6 max-w-xl mx-auto"
        >
          <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center text-sage shrink-0">
            <Gift size={18} />
          </div>
          <div className="text-center sm:text-left">
            <p className="font-sans text-sm font-medium text-charcoal">Prefere contribuir via Pix?</p>
            <p className="font-sans text-xs text-charcoal-light/70 mt-0.5">
              Chave Pix: <span className="font-medium text-sage">giulia.lucas@casamento.com</span>
            </p>
          </div>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {wishCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-sans text-xs tracking-[0.12em] uppercase px-5 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-sage text-cream border-sage'
                  : 'bg-transparent text-charcoal-light border-sage-light/40 hover:border-sage hover:text-sage'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div
          layout
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="bg-white border border-sage-light/20 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-cream-dark flex items-center justify-center text-2xl">
                    {item.emoji}
                  </div>
                  <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-sage bg-sage/8 px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 flex-1">
                  <h3 className="font-serif text-lg font-medium text-charcoal leading-tight">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs leading-relaxed text-charcoal-light">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-sage-light/15">
                  {item.price && (
                    <span className="font-sans text-xs text-charcoal-light/60">
                      {item.price}
                    </span>
                  )}
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-sans text-xs text-sage hover:text-sage-dark transition-colors ml-auto"
                    >
                      Ver produto <ExternalLink size={11} />
                    </a>
                  ) : (
                    <button className="ml-auto font-sans text-xs text-sage hover:text-sage-dark transition-colors cursor-pointer">
                      Tenho interesse
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
