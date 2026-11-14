import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy, X, QrCode } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import { PIX_CONFIG, generatePixPayload } from '../../lib/pix'

export function PixSoft() {
  const [showQr, setShowQr] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)

  const payload = generatePixPayload()

  async function copyPixKey() {
    setCopyError(false)
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(PIX_CONFIG.key)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = PIX_CONFIG.key
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(textarea)
        if (!ok) throw new Error('execCommand falhou')
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopyError(true)
      setTimeout(() => setCopyError(false), 4000)
    }
  }

  return (
    <section id="presentes" className="pt-16 pb-8 px-6 bg-cream">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl p-7 flex flex-col items-center text-center gap-4"
          style={{
            backgroundColor: 'rgba(122,158,126,0.05)',
            border: '1px solid rgba(122,158,126,0.2)',
          }}
        >
          <p
            className="font-sans text-[10px] tracking-[0.25em] uppercase"
            style={{ color: 'var(--color-sage-dark)' }}
          >
            Opcional · Presente
          </p>

          <p className="font-serif italic text-lg text-charcoal-light leading-relaxed max-w-md">
            Sua presença já é o maior presente. Mas se quiserem nos dar uma alegria a mais, qualquer valor é super bem-vindo.
          </p>

          <div className="flex flex-col items-center gap-2 mt-2">
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light/60">
              Chave Pix
            </p>
            <p className="font-sans text-sm text-charcoal select-all break-all">
              {PIX_CONFIG.key}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap justify-center mt-1">
            <button
              type="button"
              onClick={copyPixKey}
              className="inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.15em] px-4 py-2 rounded-full border transition-colors cursor-pointer"
              style={{
                borderColor: copyError
                  ? 'rgb(248,113,113)'
                  : copied
                    ? 'var(--color-sage)'
                    : 'rgba(122,158,126,0.35)',
                color: copyError
                  ? 'rgb(239,68,68)'
                  : copied
                    ? 'var(--color-sage-dark)'
                    : 'var(--color-charcoal-light)',
              }}
            >
              {copyError ? (
                <>
                  <X size={11} /> Erro
                </>
              ) : copied ? (
                <>
                  <Check size={11} /> Copiado
                </>
              ) : (
                <>
                  <Copy size={11} /> Copiar chave
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowQr(!showQr)}
              className="inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.15em] px-4 py-2 rounded-full transition-colors cursor-pointer"
              style={{
                backgroundColor: showQr ? 'transparent' : 'var(--color-sage)',
                color: showQr ? 'var(--color-sage-dark)' : 'var(--color-cream)',
                border: showQr
                  ? '1px solid rgba(122,158,126,0.35)'
                  : '1px solid var(--color-sage)',
              }}
            >
              <QrCode size={11} />
              {showQr ? 'Ocultar QR' : 'Ver QR Code'}
            </button>
          </div>

          <AnimatePresence>
            {showQr && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-white p-3 rounded-lg border border-sage-light/20 inline-block mt-2">
                  <QRCodeCanvas value={payload} size={160} level="M" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
