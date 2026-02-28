import { motion } from 'framer-motion'

interface SectionTitleProps {
  label?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  light?: boolean
}

export function SectionTitle({
  label,
  title,
  subtitle,
  align = 'center',
  light = false,
}: SectionTitleProps) {
  const alignClass = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }[align]

  return (
    <motion.div
      className={`flex flex-col gap-3 ${alignClass}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {label && (
        <span
          className={`font-sans text-xs tracking-[0.25em] uppercase ${light ? 'text-sage-light' : 'text-sage'}`}
        >
          {label}
        </span>
      )}
      <h2
        className={`font-serif text-4xl md:text-5xl font-light leading-tight ${light ? 'text-cream' : 'text-charcoal'}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`font-sans text-sm md:text-base font-light max-w-md leading-relaxed ${light ? 'text-cream/70' : 'text-charcoal-light'}`}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`mt-2 h-px w-16 ${light ? 'bg-sage-light/50' : 'bg-sage-light'}`}
      />
    </motion.div>
  )
}
