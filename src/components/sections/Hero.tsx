import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-scroll'
import { ChevronDown } from 'lucide-react'

const WEDDING_DATE = new Date('2026-09-07T10:30:00')

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(): TimeLeft {
  const now = new Date()
  const diff = WEDDING_DATE.getTime() - now.getTime()
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

// Botanical SVG decorations
function BotanicalLeft() {
  return (
    <svg
      viewBox="0 0 200 400"
      className="absolute left-0 bottom-0 h-[60%] md:h-[80%] opacity-20 text-sage"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20 380 Q60 300 40 220 Q20 140 70 80 Q50 160 80 230 Q100 300 60 380Z" />
      <path d="M50 360 Q120 310 100 240 Q80 180 130 130 Q100 200 120 260 Q140 320 80 370Z" opacity="0.6" />
      <path d="M10 320 Q80 290 70 230 Q60 180 100 150 Q75 210 85 260 Q95 310 30 330Z" opacity="0.4" />
      <path d="M60 400 L55 280 M55 280 Q30 260 10 230 M55 280 Q80 255 90 220" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function BotanicalRight() {
  return (
    <svg
      viewBox="0 0 200 400"
      className="absolute right-0 top-0 h-[55%] md:h-[70%] opacity-20 text-sage"
      fill="currentColor"
      aria-hidden
    >
      <path d="M180 20 Q140 100 160 180 Q180 260 130 320 Q150 240 120 170 Q100 100 140 20Z" />
      <path d="M150 40 Q80 90 100 160 Q120 220 70 270 Q100 200 80 140 Q60 80 120 30Z" opacity="0.6" />
      <path d="M190 80 Q120 110 130 170 Q140 220 100 250 Q125 190 115 140 Q105 90 170 70Z" opacity="0.4" />
      <path d="M140 0 L145 120 M145 120 Q170 140 190 170 M145 120 Q120 145 110 180" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Hero() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft())

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const passed = WEDDING_DATE <= new Date()

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-cream px-6 pt-24 pb-16"
    >
      <BotanicalLeft />
      <BotanicalRight />

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(122,158,126,0.06)_0%,_transparent_60%)]" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        {/* Tag */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-xs tracking-[0.3em] uppercase text-sage mb-8"
        >
          Você está convidado para celebrar
        </motion.p>

        {/* Names */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          className="font-serif text-6xl sm:text-7xl md:text-8xl font-light text-charcoal leading-none tracking-wide"
        >
          Giulia
          <span className="block text-sage-light font-light text-5xl sm:text-6xl md:text-7xl py-3">
            &amp;
          </span>
          Lucas
        </motion.h1>

        {/* Date & location */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-8 flex flex-col items-center gap-2"
        >
          <div className="h-px w-20 bg-sage-light/60" />
          <p className="font-sans text-sm tracking-[0.2em] uppercase text-charcoal-light mt-3">
            07 de Setembro · 10h30
          </p>
          <p className="font-sans text-xs tracking-[0.15em] uppercase text-charcoal-light/60">
            Bar Botânico · Pinheiros, São Paulo
          </p>
          <div className="h-px w-20 bg-sage-light/60 mt-3" />
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-12"
        >
          {passed ? (
            <p className="font-serif italic text-2xl text-sage">
              Que dia inesquecível! 🌿
            </p>
          ) : (
            <>
              <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal-light/50 mb-5">
                Faltam
              </p>
              <div className="flex items-start gap-6 md:gap-10">
                <CountdownUnit value={timeLeft.days} label="dias" />
                <span className="font-serif text-3xl text-sage-light mt-1">·</span>
                <CountdownUnit value={timeLeft.hours} label="horas" />
                <span className="font-serif text-3xl text-sage-light mt-1">·</span>
                <CountdownUnit value={timeLeft.minutes} label="minutos" />
                <span className="font-serif text-3xl text-sage-light mt-1">·</span>
                <CountdownUnit value={timeLeft.seconds} label="segundos" />
              </div>
            </>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-12"
        >
          <Link
            to="rsvp"
            smooth
            duration={800}
            offset={-64}
            className="inline-block cursor-pointer bg-sage text-cream font-sans text-xs tracking-[0.2em] uppercase px-8 py-3.5 rounded-full hover:bg-sage-dark transition-colors duration-300"
          >
            Confirmar Presença
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <Link to="nossa-historia" smooth duration={800} offset={-64} className="cursor-pointer">
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
