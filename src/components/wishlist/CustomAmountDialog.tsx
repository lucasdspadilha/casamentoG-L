import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useBodyScrollLock } from '../../lib/useBodyScrollLock'
import { useEscapeKey } from '../../lib/useEscapeKey'

interface Props {
  title: string
  suggestion?: number
  minimum?: number
  maximum?: number
  onClose: () => void
  onConfirm: (amount: number) => void
}

export function CustomAmountDialog({
  title,
  suggestion = 100,
  minimum = 0,
  maximum = 50000,
  onClose,
  onConfirm,
}: Props) {
  useBodyScrollLock()
  useEscapeKey(onClose)
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const num = parseFloat(value.replace(',', '.'))
    if (!Number.isFinite(num) || num <= 0) {
      setError('Digite um valor válido.')
      return
    }
    if (minimum > 0 && num < minimum) {
      setError(`Valor mínimo R$ ${minimum}.`)
      return
    }
    if (num > maximum) {
      setError(
        `Valor máximo R$ ${maximum.toLocaleString('pt-BR')}. Se quiser dar mais, fale com a gente.`
      )
      return
    }
    onConfirm(num)
  }

  return (
    <div
      className="fixed inset-0 bg-charcoal/40 z-[60] flex items-center justify-center px-6"
      onClick={onClose}
    >
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="bg-cream rounded-2xl p-6 w-full max-w-sm flex flex-col gap-5 relative"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 text-charcoal-light hover:text-charcoal cursor-pointer"
        >
          <X size={18} />
        </button>

        <div>
          <h3 className="font-serif text-2xl text-charcoal">{title}</h3>
          <p className="font-sans text-xs text-charcoal-light mt-1">
            Quanto você gostaria de presentear?
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
            Valor (R$)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-sans text-sm text-charcoal-light">
              R$
            </span>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min={minimum}
              max={maximum}
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                setError('')
              }}
              placeholder={String(suggestion)}
              autoFocus
              className="w-full bg-white border border-sage-light/30 rounded-xl pl-11 pr-4 py-3 font-sans text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-sage transition-colors"
            />
          </div>
          {error && (
            <p className="font-sans text-xs text-red-500">{error}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-sage text-cream font-sans text-xs tracking-[0.2em] uppercase py-3 rounded-full hover:bg-sage-dark transition-colors cursor-pointer"
        >
          Adicionar ao carrinho
        </button>
      </motion.form>
    </div>
  )
}
