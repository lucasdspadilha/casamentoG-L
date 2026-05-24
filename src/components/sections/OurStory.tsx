import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionTitle } from '../ui/SectionTitle'
import { storyEvents } from '../../data/story'

function CardImage({ src, emoji }: { src: string; emoji: string }) {
  const [error, setError] = useState(false)

  if (error || !src) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-sage-light/20 to-cream-dark flex flex-col items-center justify-center gap-2">
        <span className="text-3xl">{emoji}</span>
        <span className="font-sans text-[9px] tracking-[0.15em] uppercase text-sage/40">
          foto em breve
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setError(true)}
      className="w-full h-full object-cover"
    />
  )
}

export function OurStory() {
  return (
    <section id="nossa-historia" className="py-24 md:py-32 px-6 bg-cream">
      <div className="max-w-5xl mx-auto">
        <SectionTitle
          label="Uma história de amor"
          title="Nossa História"
          subtitle="Cada capítulo nos trouxe mais perto do nosso grande dia."
        />

        <div className="mt-16 relative">
          {/* Vertical center line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-sage-light/30 -translate-x-px" />

          <div className="flex flex-col gap-12">
            {storyEvents.map((event, index) => {
              // isRight=true  → card on LEFT side of timeline  → image on outer-left edge of card
              // isRight=false → card on RIGHT side of timeline → image on outer-right edge of card
              const isRight = index % 2 === 0

              return (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: isRight ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  className={`relative flex items-start md:gap-0 gap-6 ${
                    isRight ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content side */}
                  <div
                    className={`flex-1 md:pl-0 ${
                      isRight ? 'md:pr-12' : 'md:pl-12'
                    }`}
                  >
                    {/*
                      Card is a flex row. Image sits on the outer edge (away from center line):
                        isRight=true  (card on LEFT):  flex-row         → [image][text] → image on outer-left  ✓
                        isRight=false (card on RIGHT): flex-row-reverse → [text][image] → image on outer-right ✓
                    */}
                    <div
                      className={`bg-white border border-sage-light/20 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex ${
                        isRight ? 'md:flex-row' : 'md:flex-row-reverse'
                      } flex-col`}
                    >
                      {/* Image — full width on mobile (top), outer edge on desktop */}
                      {event.img !== undefined && (
                        <div className="w-full h-40 md:w-36 md:h-auto shrink-0">
                          <CardImage src={event.img} emoji={event.emoji} />
                        </div>
                      )}

                      {/* Text content */}
                      <div
                        className={`flex-1 p-6 ${
                          isRight ? 'md:text-right' : 'md:text-left'
                        }`}
                      >
                        <div
                          className={`flex items-center gap-3 mb-3 ${
                            isRight ? 'md:justify-end' : ''
                          }`}
                        >
                          <span className="text-xl">{event.emoji}</span>
                          <span className="font-sans text-xs tracking-[0.2em] uppercase text-sage font-medium">
                            {event.year}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl font-medium text-charcoal mb-2">
                          {event.title}
                        </h3>
                        <p className="font-sans text-sm leading-relaxed text-charcoal-light">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-6 md:left-1/2 top-6 -translate-x-1/2 w-3 h-3 rounded-full bg-sage border-2 border-cream shadow-sm" />

                  {/* Empty opposite side */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
