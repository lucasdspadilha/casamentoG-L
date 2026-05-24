import { useEffect, useState } from 'react'
import { CartContext, type CartItem } from './cartContext'

const STORAGE_KEY = 'cart-v1'
const TTL_MS = 30 * 24 * 60 * 60 * 1000

interface StoredCart {
  items: CartItem[]
  savedAt: string
}

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredCart | CartItem[]

    // Compatibilidade com formato antigo (array sem savedAt)
    if (Array.isArray(parsed)) return parsed

    if (!parsed.savedAt) return parsed.items ?? []
    const age = Date.now() - new Date(parsed.savedAt).getTime()
    if (age > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY)
      return []
    }
    return parsed.items
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadFromStorage)

  useEffect(() => {
    if (items.length === 0) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }
    const stored: StoredCart = { items, savedAt: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  }, [items])

  function add(item: CartItem) {
    setItems((prev) => {
      if (prev.find((p) => p.wishId === item.wishId)) return prev
      return [...prev, item]
    })
  }

  function remove(wishId: number) {
    setItems((prev) => prev.filter((p) => p.wishId !== wishId))
  }

  function clear() {
    setItems([])
  }

  function isInCart(wishId: number) {
    return items.some((p) => p.wishId === wishId)
  }

  return (
    <CartContext.Provider value={{ items, add, remove, clear, isInCart }}>
      {children}
    </CartContext.Provider>
  )
}
