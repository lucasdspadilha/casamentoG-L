import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle } from 'lucide-react'
import { SectionTitle } from '../ui/SectionTitle'

interface FormData {
  name: string
  email: string
  phone: string
  guests: string
  attending: 'yes' | 'no' | ''
  dietary: string
  message: string
}

const initialForm: FormData = {
  name: '',
  email: '',
  phone: '',
  guests: '1',
  attending: '',
  dietary: '',
  message: '',
}

export function Rsvp() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: integrate with backend / email service
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section id="rsvp" className="py-24 md:py-32 px-6 bg-cream">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto flex flex-col items-center text-center gap-6"
        >
          <CheckCircle size={48} className="text-sage" />
          <h2 className="font-serif text-4xl font-light text-charcoal">
            {form.attending === 'yes' ? 'Até lá! 🌿' : 'Sentiremos sua falta!'}
          </h2>
          <p className="font-sans text-sm text-charcoal-light leading-relaxed">
            {form.attending === 'yes'
              ? `Obrigado, ${form.name}! Sua confirmação foi recebida. Mal podemos esperar para celebrar com você!`
              : `Obrigado por nos avisar, ${form.name}. Estaremos pensando em você nesse dia especial.`}
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm(initialForm) }}
            className="font-sans text-xs tracking-[0.15em] uppercase text-sage border border-sage-light/40 px-6 py-3 rounded-full hover:bg-sage hover:text-cream transition-all duration-300 cursor-pointer"
          >
            Enviar nova resposta
          </button>
        </motion.div>
      </section>
    )
  }

  return (
    <section id="rsvp" className="py-24 md:py-32 px-6 bg-cream">
      <div className="max-w-xl mx-auto">
        <SectionTitle
          label="Até 10 de Agosto de 2025"
          title="Confirmar Presença"
          subtitle="Por favor confirme sua presença para que possamos planejar tudo com carinho."
        />

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="mt-12 flex flex-col gap-5"
        >
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
              Nome completo *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Seu nome"
              className="w-full bg-white border border-sage-light/30 rounded-xl px-4 py-3 font-sans text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-sage transition-colors"
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
                E-mail *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="seu@email.com"
                className="w-full bg-white border border-sage-light/30 rounded-xl px-4 py-3 font-sans text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-sage transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
                WhatsApp
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="(11) 9 0000-0000"
                className="w-full bg-white border border-sage-light/30 rounded-xl px-4 py-3 font-sans text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-sage transition-colors"
              />
            </div>
          </div>

          {/* Attending */}
          <div className="flex flex-col gap-2">
            <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
              Você vai comparecer? *
            </label>
            <div className="flex gap-3">
              {[
                { value: 'yes', label: 'Sim, com certeza! 🥂' },
                { value: 'no', label: 'Não poderei ir' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, attending: opt.value as 'yes' | 'no' }))}
                  className={`flex-1 font-sans text-xs py-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                    form.attending === opt.value
                      ? 'bg-sage text-cream border-sage'
                      : 'bg-white text-charcoal-light border-sage-light/30 hover:border-sage'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Guests — only if attending */}
          {form.attending === 'yes' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex flex-col gap-1.5"
            >
              <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
                Número de acompanhantes (incluindo você)
              </label>
              <select
                name="guests"
                value={form.guests}
                onChange={handleChange}
                className="w-full bg-white border border-sage-light/30 rounded-xl px-4 py-3 font-sans text-sm text-charcoal focus:outline-none focus:border-sage transition-colors appearance-none"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'pessoa' : 'pessoas'}
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          {/* Dietary */}
          {form.attending === 'yes' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex flex-col gap-1.5"
            >
              <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
                Restrições alimentares
              </label>
              <input
                type="text"
                name="dietary"
                value={form.dietary}
                onChange={handleChange}
                placeholder="Ex.: vegetariano, sem glúten, alergia a frutos do mar..."
                className="w-full bg-white border border-sage-light/30 rounded-xl px-4 py-3 font-sans text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-sage transition-colors"
              />
            </motion.div>
          )}

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
              Mensagem para os noivos (opcional)
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={3}
              placeholder="Deixe um recado especial..."
              className="w-full bg-white border border-sage-light/30 rounded-xl px-4 py-3 font-sans text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-sage transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!form.attending || !form.name || !form.email}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-sage text-cream font-sans text-xs tracking-[0.2em] uppercase py-4 rounded-full hover:bg-sage-dark transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send size={14} />
            Confirmar
          </button>
        </motion.form>
      </div>
    </section>
  )
}
