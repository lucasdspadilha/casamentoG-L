import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Trash2, Plus } from 'lucide-react'
import { wishes } from '../../data/wishes'
import { parseAmount, formatBRL } from '../../lib/money'
import { saveGift, type GiftRecord } from '../../lib/gifts'
import { useBodyScrollLock } from '../../lib/useBodyScrollLock'
import { useEscapeKey } from '../../lib/useEscapeKey'

interface Line {
  id: string
  wishId?: number
  emoji?: string
  title: string
  amount: number
}

interface Props {
  onClose: () => void
  onSaved: (record: GiftRecord) => void
}

function todayLocal(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function ManualGiftDialog({ onClose, onSaved }: Props) {
  useBodyScrollLock()
  useEscapeKey(onClose)
  const [giverName, setGiverName] = useState('')
  const [receivedAt, setReceivedAt] = useState(todayLocal())
  const [lines, setLines] = useState<Line[]>([])
  const [selectedWishId, setSelectedWishId] = useState<string>('')
  const [error, setError] = useState('')

  const availableWishes = useMemo(
    () => wishes.filter((w) => !lines.some((l) => l.wishId === w.id)),
    [lines]
  )

  const total = useMemo(
    () => lines.reduce((s, l) => s + (Number(l.amount) || 0), 0),
    [lines]
  )

  function addFromWish() {
    const id = Number(selectedWishId)
    const w = wishes.find((x) => x.id === id)
    if (!w) return
    setLines([
      ...lines,
      {
        id: crypto.randomUUID(),
        wishId: w.id,
        emoji: w.emoji,
        title: w.title,
        amount: parseAmount(w.price) ?? 0,
      },
    ])
    setSelectedWishId('')
    setError('')
  }

  function addCustom() {
    setLines([
      ...lines,
      { id: crypto.randomUUID(), title: '', amount: 0 },
    ])
    setError('')
  }

  function updateLine(id: string, patch: Partial<Line>) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  }

  function removeLine(id: string) {
    setLines((prev) => prev.filter((l) => l.id !== id))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const valid = lines
      .filter((l) => l.title.trim() && Number(l.amount) > 0)
      .map((l) => ({
        wishId: l.wishId ?? -1,
        title: l.title.trim(),
        amount: Number(l.amount),
      }))

    if (valid.length === 0) {
      setError('Adicione ao menos um item com valor maior que zero.')
      return
    }

    try {
      const saved = await saveGift({
        giverName: giverName.trim() || 'Anônimo',
        items: valid,
        total: valid.reduce((s, i) => s + i.amount, 0),
        submittedAt: new Date(`${receivedAt}T12:00:00`).toISOString(),
      })
      onSaved(saved)
    } catch (err) {
      setError(
        'Erro ao salvar: ' + (err instanceof Error ? err.message : 'tente de novo')
      )
    }
  }

  return (
    <div
      className="fixed inset-0 bg-charcoal/40 z-50 flex items-end sm:items-center justify-center sm:px-6"
      onClick={onClose}
    >
      <motion.form
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="bg-cream rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <div className="sticky top-0 bg-cream border-b border-sage-light/20 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-serif text-2xl text-charcoal">Adicionar presente</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-charcoal-light hover:text-charcoal cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-5 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
                Nome do doador (opcional)
              </label>
              <input
                type="text"
                value={giverName}
                onChange={(e) => setGiverName(e.target.value)}
                placeholder="Anônimo"
                className="w-full bg-white border border-sage-light/30 rounded-xl px-4 py-3 font-sans text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-sage transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
                Data do Pix
              </label>
              <input
                type="date"
                value={receivedAt}
                onChange={(e) => setReceivedAt(e.target.value)}
                className="w-full bg-white border border-sage-light/30 rounded-xl px-4 py-3 font-sans text-sm text-charcoal focus:outline-none focus:border-sage transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
              Itens recebidos
            </label>

            {lines.length === 0 && (
              <p className="font-sans text-xs text-charcoal-light/70 bg-white border border-sage-light/20 border-dashed rounded-xl px-4 py-6 text-center">
                Nenhum item adicionado ainda. Use os botões abaixo.
              </p>
            )}

            {lines.map((line) => (
              <div
                key={line.id}
                className="flex items-center gap-2 bg-white border border-sage-light/30 rounded-xl p-3"
              >
                {line.emoji && (
                  <span className="text-xl shrink-0">{line.emoji}</span>
                )}
                {line.wishId ? (
                  <p className="flex-1 font-serif text-sm text-charcoal truncate">
                    {line.title}
                  </p>
                ) : (
                  <input
                    type="text"
                    value={line.title}
                    onChange={(e) =>
                      updateLine(line.id, { title: e.target.value })
                    }
                    placeholder="Descrição (ex.: Pix avulso)"
                    className="flex-1 bg-cream border border-sage-light/30 rounded-lg px-3 py-1.5 font-sans text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-sage transition-colors"
                  />
                )}
                <div className="relative w-28 shrink-0">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 font-sans text-xs text-charcoal-light">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={line.amount || ''}
                    onChange={(e) =>
                      updateLine(line.id, {
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    className="w-full bg-cream border border-sage-light/30 rounded-lg pl-8 pr-2 py-1.5 font-sans text-sm text-charcoal text-right focus:outline-none focus:border-sage transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  aria-label="Remover"
                  className="text-charcoal-light/60 hover:text-red-500 transition-colors p-1 cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex gap-2">
                <select
                  value={selectedWishId}
                  onChange={(e) => setSelectedWishId(e.target.value)}
                  className="flex-1 bg-white border border-sage-light/30 rounded-xl px-3 py-2.5 font-sans text-xs text-charcoal focus:outline-none focus:border-sage transition-colors"
                >
                  <option value="">Selecione um item da lista...</option>
                  {availableWishes.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.emoji} {w.title} — {w.price}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addFromWish}
                  disabled={!selectedWishId}
                  className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-[0.15em] text-sage border border-sage-light/40 px-3 py-2 rounded-full hover:bg-sage hover:text-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Plus size={12} /> Add
                </button>
              </div>
              <button
                type="button"
                onClick={addCustom}
                className="flex items-center justify-center gap-1.5 font-sans text-xs uppercase tracking-[0.15em] text-charcoal-light border border-sage-light/40 px-3 py-2 rounded-full hover:border-sage transition-colors cursor-pointer"
              >
                <Plus size={12} /> Personalizado
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-sage-light/30 pt-4">
            <span className="font-sans text-xs tracking-[0.2em] uppercase text-charcoal-light">
              Total
            </span>
            <span className="font-serif text-2xl text-charcoal">
              {formatBRL(total)}
            </span>
          </div>

          {error && (
            <p className="font-sans text-xs text-red-500">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-sage text-cream font-sans text-xs tracking-[0.2em] uppercase py-4 rounded-full hover:bg-sage-dark transition-colors cursor-pointer"
          >
            Salvar presente
          </button>
        </div>
      </motion.form>
    </div>
  )
}
