import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-scroll'
import { ChevronDown } from 'lucide-react'
import { heroPhotoId, photoUrl } from '../../data/weddingPhotos'

const EVENT_DATE = new Date('2027-02-07T10:00:00')

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(): TimeLeft {
  const now = new Date()
  const diff = EVENT_DATE.getTime() - now.getTime()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-4xl md:text-5xl font-light text-charcoal tabular-nums"
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
        {label}
      </span>
    </div>
  )
}

export function HeroMt() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft())

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const passed = EVENT_DATE <= new Date()

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-cream px-6 pt-24 pb-16"
    >
      {/* Background: foto do casamento com overlay cream suave */}
      <img
        src={photoUrl(heroPhotoId, 'full')}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none select-none"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(247,243,236,0.7) 0%, rgba(247,243,236,0.55) 50%, rgba(247,243,236,0.85) 100%)',
        }}
      />

      {/* Overlay quente — accent regional MT */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(122,158,126,0.10) 0%, transparent 60%)',
        }}
      />

      {/* Folhas decorativas por cima — mesmo DNA do casamento */}
      <img
        src="/folha.png"
        aria-hidden
        className="absolute left-0 bottom-0 h-[60%] md:h-[80%] w-auto opacity-20 -translate-x-1/4 rotate-180 pointer-events-none select-none z-[1]"
      />
      <img
        src="/folha.png"
        aria-hidden
        className="absolute right-0 top-0 h-[55%] md:h-[70%] w-auto opacity-20 translate-x-1/4 pointer-events-none select-none z-[1]"
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-[11px] tracking-[0.3em] uppercase mb-4"
          style={{ color: 'var(--color-sage-dark)' }}
        >
          Churrasco de comemoração
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          className="font-serif text-6xl sm:text-7xl md:text-8xl font-light text-charcoal leading-none tracking-wide"
        >
          Giulia
          <span
            className="block font-light text-5xl sm:text-6xl md:text-7xl py-3"
            style={{ color: 'var(--color-sage-light)' }}
          >
            &amp;
          </span>
          Lucas
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-8 flex flex-col items-center gap-2"
        >
          <div
            className="h-px w-20"
            style={{ backgroundColor: 'var(--color-sage-light)', opacity: 0.6 }}
          />
          <p className="font-sans text-sm tracking-[0.2em] uppercase text-charcoal-light mt-3">
            07 de Fevereiro · 10h
          </p>
          <p className="font-sans text-xs tracking-[0.15em] uppercase text-charcoal-light/60">
            Recanto das Famílias · Colíder, MT
          </p>
          <div
            className="h-px w-20 mt-3"
            style={{ backgroundColor: 'var(--color-sage-light)', opacity: 0.6 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-12"
        >
          {passed ? (
            <p
              className="font-serif italic text-2xl"
              style={{ color: 'var(--color-sage-dark)' }}
            >
              Que celebração! 🔥
            </p>
          ) : (
            <>
              <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal-light/50 mb-5">
                Faltam
              </p>
              <div className="flex items-start gap-6 md:gap-10">
                <CountdownUnit value={timeLeft.days} label="dias" />
                <span
                  className="font-serif text-3xl mt-1"
                  style={{ color: 'var(--color-sage-light)' }}
                >
                  ·
                </span>
                <CountdownUnit value={timeLeft.hours} label="horas" />
                <span
                  className="font-serif text-3xl mt-1"
                  style={{ color: 'var(--color-sage-light)' }}
                >
                  ·
                </span>
                <CountdownUnit value={timeLeft.minutes} label="minutos" />
                <span
                  className="font-serif text-3xl mt-1"
                  style={{ color: 'var(--color-sage-light)' }}
                >
                  ·
                </span>
                <CountdownUnit value={timeLeft.seconds} label="segundos" />
              </div>
            </>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <Link to="info-mt" smooth duration={800} offset={-64} className="cursor-pointer">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-charcoal-light/40"
          >
            <ChevronDown size={24} />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  )
}
