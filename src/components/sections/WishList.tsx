import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Plus, QrCode, Copy, X } from 'lucide-react'
import { SectionTitle } from '../ui/SectionTitle'
import { wishes, wishCategories, type WishItem } from '../../data/wishes'
import { useCart } from '../../lib/useCart'
import { parseAmount } from '../../lib/money'
import { PIX_CONFIG } from '../../lib/pix'
import { CustomAmountDialog } from '../wishlist/CustomAmountDialog'

export function WishList() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [customDialogFor, setCustomDialogFor] = useState<WishItem | null>(null)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const { add, remove, isInCart } = useCart()

  const filtered =
    activeCategory === 'Todos'
      ? wishes
      : wishes.filter((w) => w.category === activeCategory)

  function handleClick(item: WishItem) {
    if (isInCart(item.id)) {
      remove(item.id)
      return
    }
    if (parseAmount(item.price) === null) {
      setCustomDialogFor(item)
      return
    }
    add({ wishId: item.id })
  }

  function handleCustomConfirm(amount: number) {
    if (!customDialogFor) return
    add({ wishId: customDialogFor.id, customAmount: amount })
    setCustomDialogFor(null)
  }

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
    <section id="presentes" className="py-24 md:py-32 px-6 bg-cream">
      <div className="max-w-5xl mx-auto">
        <SectionTitle
          label="Lista de desejos"
          title="Presentes"
          subtitle="Sua presença já é o maior presente. Mas se quiser nos dar uma alegria a mais, monte seu carrinho e pague tudo com um Pix único."
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 bg-sage/8 border border-sage-light/30 rounded-2xl p-5 max-w-xl mx-auto"
        >
          <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center text-sage shrink-0">
            <QrCode size={18} />
          </div>
          <p className="font-sans text-xs text-charcoal-light/80 leading-relaxed text-center sm:text-left">
            Adicione os itens ao carrinho, e gerara automaticamente um QR Code Pix com o valor total — em um só pagamento.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 max-w-xl mx-auto text-center"
        >
          <span className="font-sans text-xs text-charcoal-light/60">
            ou Pix direto:
          </span>
          <span className="font-sans text-xs text-charcoal-light select-all">
            {PIX_CONFIG.key}
          </span>
          <button
            type="button"
            onClick={copyPixKey}
            aria-label="Copiar chave Pix"
            className={`inline-flex items-center gap-1 font-sans text-[10px] uppercase tracking-[0.1em] transition-colors cursor-pointer ${
              copyError
                ? 'text-red-500'
                : copied
                  ? 'text-sage'
                  : 'text-charcoal-light/60 hover:text-sage'
            }`}
          >
            {copyError ? (
              <>
                <X size={10} /> erro
              </>
            ) : copied ? (
              <>
                <Check size={10} /> copiado
              </>
            ) : (
              <>
                <Copy size={10} /> copiar
              </>
            )}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {wishCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-sans text-xs tracking-[0.12em] uppercase px-5 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-sage text-cream border-sage'
                  : 'bg-transparent text-charcoal-light border-sage-light/40 hover:border-sage hover:text-sage'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <motion.div
          layout
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => {
              const inCart = isInCart(item.id)
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className={`bg-white border rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group ${
                    inCart ? 'border-sage' : 'border-sage-light/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-xl bg-cream-dark flex items-center justify-center text-2xl">
                      {item.emoji}
                    </div>
                    <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-sage bg-sage/8 px-2.5 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1">
                    <h3 className="font-serif text-lg font-medium text-charcoal leading-tight">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs leading-relaxed text-charcoal-light">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-sage-light/15">
                    {item.price && (
                      <span className="font-sans text-xs text-charcoal-light/60">
                        {item.price}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleClick(item)}
                      className={`inline-flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                        inCart
                          ? 'bg-sage text-cream hover:bg-sage-dark'
                          : 'text-sage hover:bg-sage hover:text-cream border border-sage-light/40'
                      }`}
                    >
                      {inCart ? (
                        <>
                          <Check size={12} /> No carrinho
                        </>
                      ) : (
                        <>
                          <Plus size={12} /> Presentear
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {customDialogFor && (
          <CustomAmountDialog
            title={customDialogFor.title}
            suggestion={100}
            onClose={() => setCustomDialogFor(null)}
            onConfirm={handleCustomConfirm}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
