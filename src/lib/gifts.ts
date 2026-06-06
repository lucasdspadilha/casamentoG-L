export interface GiftRecord {
  id: string
  giverName: string
  items: { wishId: number; title: string; amount: number }[]
  total: number
  submittedAt: string
}

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error ?? `Request failed (${res.status})`)
  }
  return res.json() as Promise<T>
}

export async function getAllGifts(): Promise<GiftRecord[]> {
  const res = await fetch('/api/gifts', { credentials: 'include' })
  return jsonOrThrow<GiftRecord[]>(res)
}

export async function saveGift(record: Omit<GiftRecord, 'id'>): Promise<GiftRecord> {
  const res = await fetch('/api/gifts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      giverName: record.giverName,
      items: record.items,
      total: record.total,
      submittedAt: record.submittedAt,
    }),
  })
  return jsonOrThrow<GiftRecord>(res)
}

export async function clearAllGifts(): Promise<void> {
  const res = await fetch('/api/gifts', {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error ?? `Request failed (${res.status})`)
  }
}
