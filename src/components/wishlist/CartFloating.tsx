import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../../lib/useCart'
import { wishes } from '../../data/wishes'
import { parseAmount, formatBRL } from '../../lib/money'
import { CartModal } from './CartModal'

export function CartFloating() {
  const { items } = useCart()
  const [open, setOpen] = useState(false)

  const total = useMemo(() => {
    return items.reduce((sum, ci) => {
      const wish = wishes.find((w) => w.id === ci.wishId)
      if (!wish) return sum
      const amount = ci.customAmount ?? parseAmount(wish.price) ?? 0
      return sum + amount
    }, 0)
  }, [items])

  return (
    <>
      <AnimatePresence>
        {items.length > 0 && !open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-sage text-cream font-sans text-sm pl-4 pr-5 py-3 rounded-full shadow-lg hover:bg-sage-dark transition-colors cursor-pointer"
          >
            <span className="relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-2 -right-2 bg-gold text-charcoal text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {items.length}
              </span>
            </span>
            <span className="font-medium">{formatBRL(total)}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && <CartModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
