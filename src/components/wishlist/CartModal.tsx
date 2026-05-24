import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import {
  X,
  Trash2,
  Copy,
  Check,
  Heart,
  ArrowLeft,
} from 'lucide-react'
import { useCart } from '../../lib/useCart'
import { useBodyScrollLock } from '../../lib/useBodyScrollLock'
import { useEscapeKey } from '../../lib/useEscapeKey'
import { wishes } from '../../data/wishes'
import { parseAmount, formatBRL } from '../../lib/money'
import { generatePixPayload, PIX_CONFIG } from '../../lib/pix'
import { saveGift, type GiftRecord } from '../../lib/gifts'
import { celebrate } from '../../lib/confetti'

type Step = 'cart' | 'name' | 'success'

interface Props {
  onClose: () => void
}

export function CartModal({ onClose }: Props) {
  useBodyScrollLock()
  useEscapeKey(onClose)
  const { items, remove, clear } = useCart()
  const [step, setStep] = useState<Step>('cart')

  useEffect(() => {
    if (step === 'success') celebrate()
  }, [step])
  const [giverName, setGiverName] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)

  const enriched = useMemo(() => {
    return items
      .map((cartItem) => {
        const wish = wishes.find((w) => w.id === cartItem.wishId)
        if (!wish) return null
        const amount =
          cartItem.customAmount ?? parseAmount(wish.price) ?? 0
        return { cartItem, wish, amount }
      })
      .filter(Boolean) as {
      cartItem: { wishId: number; customAmount?: number }
      wish: (typeof wishes)[number]
      amount: number
    }[]
  }, [items])

  const total = enriched.reduce((sum, e) => sum + e.amount, 0)

  const pixPayload = useMemo(
    () => (total > 0 ? generatePixPayload({ amount: total }) : ''),
    [total]
  )

  async function copyPix() {
    setCopyError(false)
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(pixPayload)
      } else {
        // Fallback pra browsers/contextos sem Clipboard API (Safari iOS antigo, http)
        const textarea = document.createElement('textarea')
        textarea.value = pixPayload
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

  function confirmGift() {
    const record: GiftRecord = {
      id: crypto.randomUUID(),
      giverName: giverName.trim() || 'Anônimo',
      items: enriched.map((e) => ({
        wishId: e.wish.id,
        title: e.wish.title,
        amount: e.amount,
      })),
      total,
      submittedAt: new Date().toISOString(),
    }
    saveGift(record)
    clear()
    setStep('success')
  }

  return (
    <div
      className="fixed inset-0 bg-charcoal/40 z-50 flex items-end sm:items-center justify-center sm:px-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-cream rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <div className="sticky top-0 bg-cream border-b border-sage-light/20 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            {step !== 'cart' && step !== 'success' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="text-charcoal-light hover:text-charcoal cursor-pointer"
                aria-label="Voltar"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="font-serif text-2xl text-charcoal">
              {step === 'success' ? 'Obrigado!' : 'Seu presente'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-charcoal-light hover:text-charcoal cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5 p-6"
            >
              {enriched.length === 0 ? (
                <p className="text-center font-sans text-sm text-charcoal-light py-8">
                  Seu carrinho está vazio.
                </p>
              ) : (
                <>
                  <ul className="flex flex-col gap-3">
                    {enriched.map(({ wish, amount }) => (
                      <li
                        key={wish.id}
                        className="flex items-start gap-3 bg-white border border-sage-light/20 rounded-xl p-3"
                      >
                        <div className="w-10 h-10 rounded-lg bg-cream-dark flex items-center justify-center text-xl shrink-0">
                          {wish.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-base text-charcoal leading-tight">
                            {wish.title}
                          </p>
                          <p className="font-sans text-xs text-charcoal-light mt-0.5">
                            {formatBRL(amount)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(wish.id)}
                          aria-label="Remover"
                          className="text-charcoal-light/60 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between border-t border-sage-light/30 pt-4">
                    <span className="font-sans text-xs tracking-[0.2em] uppercase text-charcoal-light">
                      Total
                    </span>
                    <span className="font-serif text-2xl text-charcoal">
                      {formatBRL(total)}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-4 bg-white border border-sage-light/20 rounded-2xl p-5">
                    <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-sage">
                      Pagamento via Pix
                    </p>
                    <div className="bg-white p-2 rounded-lg">
                      <QRCodeSVG
                        value={pixPayload}
                        size={200}
                        level="M"
                        bgColor="#ffffff"
                        fgColor="#2C2C2C"
                      />
                    </div>
                    <div className="w-full text-center">
                      <p className="font-sans text-xs text-charcoal-light">
                        {PIX_CONFIG.name} · {PIX_CONFIG.key}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={copyPix}
                      className={`w-full flex items-center justify-center gap-2 font-sans text-xs tracking-[0.15em] uppercase py-3 rounded-full transition-colors cursor-pointer ${
                        copyError
                          ? 'bg-red-50 text-red-600'
                          : 'bg-cream-dark hover:bg-sage hover:text-cream'
                      }`}
                    >
                      {copied && (
                        <>
                          <Check size={14} /> Copiado!
                        </>
                      )}
                      {copyError && (
                        <>
                          <X size={14} /> Não foi possível copiar — selecione manualmente
                        </>
                      )}
                      {!copied && !copyError && (
                        <>
                          <Copy size={14} /> Copiar Pix copia-e-cola
                        </>
                      )}
                    </button>
                    {copyError && (
                      <p className="font-sans text-xs text-charcoal-light/70 text-center select-all break-all px-2">
                        {pixPayload}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep('name')}
                    className="w-full flex items-center justify-center gap-2 bg-sage text-cream font-sans text-xs tracking-[0.2em] uppercase py-4 rounded-full hover:bg-sage-dark transition-colors cursor-pointer"
                  >
                    <Heart size={14} /> Já fiz o Pix
                  </button>
                </>
              )}
            </motion.div>
          )}

          {step === 'name' && (
            <motion.form
              key="name"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={(e) => {
                e.preventDefault()
                confirmGift()
              }}
              className="flex flex-col gap-5 p-6"
            >
              <p className="font-sans text-sm text-charcoal-light leading-relaxed">
                Quer que a gente saiba quem mandou esse carinho? Deixa seu
                nome aqui — ou pula direto, fica do seu jeito.
              </p>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
                  Seu nome (opcional)
                </label>
                <input
                  type="text"
                  value={giverName}
                  onChange={(e) => setGiverName(e.target.value)}
                  autoFocus
                  placeholder="Nome completo"
                  className="w-full bg-white border border-sage-light/30 rounded-xl px-4 py-3 font-sans text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-sage transition-colors"
                />
              </div>

              <div className="bg-white border border-sage-light/20 rounded-xl p-4">
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light mb-2">
                  Resumo
                </p>
                <ul className="flex flex-col gap-1 mb-3">
                  {enriched.map(({ wish, amount }) => (
                    <li
                      key={wish.id}
                      className="flex justify-between font-sans text-xs text-charcoal"
                    >
                      <span>{wish.title}</span>
                      <span className="text-charcoal-light">
                        {formatBRL(amount)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between font-serif text-base text-charcoal border-t border-sage-light/20 pt-2">
                  <span>Total</span>
                  <span>{formatBRL(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-sage text-cream font-sans text-xs tracking-[0.2em] uppercase py-4 rounded-full hover:bg-sage-dark transition-colors cursor-pointer"
              >
                {giverName.trim() ? 'Confirmar presente' : 'Confirmar anonimamente'}
              </button>
            </motion.form>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center gap-5 p-8"
            >
              <div className="w-16 h-16 rounded-full bg-sage/15 flex items-center justify-center text-sage">
                <Heart size={28} />
              </div>
              <h3 className="font-serif text-3xl text-charcoal">
                Obrigado de coração!
              </h3>
              <p className="font-sans text-sm text-charcoal-light leading-relaxed">
                Esse mimo vai virar lembrança que a gente leva pra sempre.
                Mal podemos esperar pra te abraçar no dia.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="font-sans text-xs tracking-[0.15em] uppercase text-sage border border-sage-light/40 px-6 py-3 rounded-full hover:bg-sage hover:text-cream transition-all duration-300 cursor-pointer"
              >
                Fechar
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
