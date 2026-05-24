export interface GiftRecord {
  id: string
  giverName: string
  items: { wishId: number; title: string; amount: number }[]
  total: number
  submittedAt: string
}

const STORAGE_KEY = 'gifts-v1'

export function getAllGifts(): GiftRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as GiftRecord[]) : []
  } catch {
    return []
  }
}

export function saveGift(record: GiftRecord) {
  const all = getAllGifts()
  all.push(record)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function clearAllGifts() {
  localStorage.removeItem(STORAGE_KEY)
}
