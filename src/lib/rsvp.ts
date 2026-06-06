export interface PreviousVersion {
  attending: 'yes' | 'no'
  attendingGuestIds: string[]
  plusOneName?: string
  phone?: string
  message?: string
  submittedAt: string
}

export interface RsvpEntry {
  groupId: string
  attending: 'yes' | 'no'
  attendingGuestIds: string[]
  plusOneName?: string
  phone?: string
  message?: string
  submittedAt: string
  editCount?: number
  previousVersions?: PreviousVersion[]
}

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error ?? `Request failed (${res.status})`)
  }
  return res.json() as Promise<T>
}

export async function getAllRsvps(): Promise<RsvpEntry[]> {
  const res = await fetch('/api/rsvps', { credentials: 'include' })
  return jsonOrThrow<RsvpEntry[]>(res)
}

export async function getRsvpByGroup(
  groupId: string
): Promise<RsvpEntry | undefined> {
  const res = await fetch(`/api/rsvps/${encodeURIComponent(groupId)}`, {
    credentials: 'include',
  })
  if (res.status === 404) return undefined
  return jsonOrThrow<RsvpEntry>(res)
}

export async function saveRsvp(entry: RsvpEntry): Promise<RsvpEntry> {
  const res = await fetch('/api/rsvps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      groupId: entry.groupId,
      attending: entry.attending,
      attendingGuestIds: entry.attendingGuestIds,
      plusOneName: entry.plusOneName,
      phone: entry.phone,
      message: entry.message,
    }),
  })
  return jsonOrThrow<RsvpEntry>(res)
}

export async function clearAllRsvps(): Promise<void> {
  const res = await fetch('/api/rsvps', {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error ?? `Request failed (${res.status})`)
  }
}
