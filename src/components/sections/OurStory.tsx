import { motion } from 'framer-motion'
import { SectionTitle } from '../ui/SectionTitle'
import { storyEvents } from '../../data/story'

export function OurStory() {
  return (
    <section
      id="nossa-historia"
      className="py-24 md:py-32 px-6 bg-cream"
    >
      <div className="max-w-3xl mx-auto">
        <SectionTitle
          label="Uma história de amor"
          title="Nossa História"
          subtitle="Cada capítulo nos trouxe mais perto do nosso grande dia."
        />

        <div className="mt-16 relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-sage-light/30 -translate-x-px" />

          <div className="flex flex-col gap-12">
            {storyEvents.map((event, index) => {
              const isRight = index % 2 === 0

              return (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: isRight ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    isRight ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content side */}
                  <div
                    className={`flex-1 pl-12 md:pl-0 ${
                      isRight ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
                    }`}
                  >
                    <div
                      className={`bg-white border border-sage-light/20 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 ${
                        isRight ? '' : 'md:ml-0'
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

                  {/* Center dot */}
                  <div className="absolute left-6 md:left-1/2 top-6 -translate-x-1/2 w-3 h-3 rounded-full bg-sage border-2 border-cream shadow-sm" />

                  {/* Empty side for alternating layout */}
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
