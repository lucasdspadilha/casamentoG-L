import { createContext } from 'react'

export interface CartItem {
  wishId: number
  customAmount?: number
}

export interface CartContextValue {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (wishId: number) => void
  clear: () => void
  isInCart: (wishId: number) => boolean
}

export const CartContext = createContext<CartContextValue | null>(null)
