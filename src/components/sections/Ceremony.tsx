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
      <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center text-sage">
        {icon}
      </div>
      <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal-light/90">
        {label}
      </p>
      <p className="font-serif text-lg font-medium text-cream/60">{value}</p>
      {sub && (
        <p className="font-sans text-xs text-charcoal-light/90">{sub}</p>
      )}
    </motion.div>
  )
}

export function Ceremony() {
  const mapsUrl =
    'https://maps.google.com/?q=Bar+Bot%C3%A2nico+Rua+Deputado+Lacerda+Franco+344+Pinheiros+S%C3%A3o+Paulo'

  return (
    <section
      id="cerimonia"
      className="py-24 md:py-32 px-6 bg-charcoal text-cream relative overflow-hidden"
    >
      {/* Background botanical */}
      <div className="absolute inset-0 opacity-5">
        <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <circle cx="100" cy="100" r="200" fill="currentColor" className="text-sage" />
          <circle cx="700" cy="500" r="250" fill="currentColor" className="text-sage" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <SectionTitle
          label="O grande dia"
          title="Cerimônia & Recepção"
          subtitle="Será uma alegria enorme ter vocês presentes nesse momento."
          light
        />

        {/* Info cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
          <InfoCard
            icon={<CalendarDays size={20} />}
            label="Data"
            value="07 de Setembro"
            sub="Segunda"
          />
          <InfoCard
            icon={<Clock size={20} />}
            label="Horário"
            value="10h30"
            sub="Cerimônia"
          />
          <InfoCard
            icon={<MapPin size={20} />}
            label="Local"
            value="Bar Botânico"
            sub="Pinheiros, São Paulo"
          />
        </div>

        <LeafDivider className="mt-16 [&>div]:bg-sage-light/20 [&>svg]:text-sage-light" />

        {/* Address block */}
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
            <p className="font-serif text-2xl font-light text-cream">Bar Botânico</p>
            <p className="font-sans text-sm text-cream/60 mt-1">
              Rua Deputado Lacerda Franco, 344 — Pinheiros
            </p>
            <p className="font-sans text-sm text-cream/60">São Paulo — SP</p>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-sage-light/40 text-cream/70 hover:text-cream hover:border-sage-light font-sans text-xs tracking-[0.15em] uppercase px-6 py-3 rounded-full transition-colors duration-300"
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
