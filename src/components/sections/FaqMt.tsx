import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { SectionTitle } from '../ui/SectionTitle'
import { faqsMt } from '../../data/faqMt'

function FaqMtItem({
  question,
  answer,
  index,
}: {
  question: string
  answer: string
  index: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="border-b border-sage-light/20 last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer group"
      >
        <span className="font-sans text-sm font-medium text-charcoal transition-colors group-hover:text-[color:var(--color-sage-dark)]">
          {question}
        </span>
        <span
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            border: '1px solid rgba(122,158,126,0.4)',
            color: 'var(--color-sage-dark)',
          }}
        >
          {open ? <Minus size={12} /> : <Plus size={12} />}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="font-sans text-sm leading-relaxed text-charcoal-light pb-5">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FaqMt() {
  return (
    <section className="pt-10 pb-24 md:pb-32 px-6 bg-cream">
      <div className="max-w-2xl mx-auto">
        <SectionTitle
          label="Dúvidas frequentes"
          title="FAQ"
          subtitle="Alguma pergunta? Olha aqui antes."
        />

        <div className="mt-12">
          {faqsMt.map((faq, index) => (
            <FaqMtItem key={index} {...faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
