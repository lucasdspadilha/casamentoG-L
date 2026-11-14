import { motion } from 'framer-motion'
import { MapPin, Clock, CalendarDays, ExternalLink } from 'lucide-react'
import { SectionTitle } from '../ui/SectionTitle'
import { LeafDivider } from '../ui/LeafDivider'

interface InfoCardProps {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
}

function InfoCard({ icon, label, value, sub }: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center gap-3"
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(122,158,126,0.15)',
          color: 'var(--color-sage-light)',
        }}
      >
        {icon}
      </div>
      <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-cream/70">
        {label}
      </p>
      <p className="font-serif text-lg font-medium text-cream">{value}</p>
      {sub && <p className="font-sans text-xs text-cream/60">{sub}</p>}
    </motion.div>
  )
}

export function InfoMt() {
  const mapsUrl =
    'https://maps.google.com/?q=Recanto+das+Fam%C3%ADlias+Estrada+de+Monte+Carmelo+Col%C3%ADder+MT'

  return (
    <section
      id="info-mt"
      className="py-24 md:py-32 px-6 bg-charcoal text-cream relative overflow-hidden"
    >
      {/* Background decorativo — círculos sólidos sage, formato original */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <circle cx="100" cy="100" r="200" fill="var(--color-sage)" />
          <circle cx="700" cy="500" r="250" fill="var(--color-sage)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <SectionTitle
          label="Nos encontre em MT"
          title="O Churrasco"
          subtitle="Vai ser um dia pra matar a saudade e celebrar com quem a gente ama."
          light
        />

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
          <InfoCard
            icon={<CalendarDays size={20} />}
            label="Data"
            value="07 de Fevereiro"
            sub="Domingo"
          />
          <InfoCard
            icon={<Clock size={20} />}
            label="Horário"
            value="10h"
            sub="Almoço à vontade"
          />
          <InfoCard
            icon={<MapPin size={20} />}
            label="Local"
            value="Recanto das Famílias"
            sub="Colíder, MT"
          />
        </div>

        <LeafDivider className="mt-16 [&>div]:bg-sage-light/20 [&>svg]:text-sage-light" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 flex flex-col items-center text-center gap-6"
        >
          <div>
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-cream/40 mb-3">
              Endereço
            </p>
            <p className="font-serif text-2xl font-light text-cream">
              Recanto das Famílias
            </p>
            <p className="font-sans text-sm text-cream/60 mt-1">
              Estrada de Monte Carmelo, s/n
            </p>
            <p className="font-sans text-sm text-cream/60">
              Colíder — MT · CEP 78500-000
            </p>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.15em] uppercase px-6 py-3 rounded-full transition-colors duration-300"
            style={{
              border: '1px solid rgba(181,201,183,0.5)',
              color: 'rgba(247,243,236,0.8)',
            }}
          >
            <MapPin size={13} />
            Ver no mapa
            <ExternalLink size={11} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
