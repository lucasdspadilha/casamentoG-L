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

const STORAGE_KEY = 'rsvp-entries-v1'

export function getAllRsvps(): RsvpEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as RsvpEntry[]) : []
  } catch {
    return []
  }
}

export function getRsvpByGroup(groupId: string): RsvpEntry | undefined {
  return getAllRsvps().find((e) => e.groupId === groupId)
}

export function saveRsvp(entry: RsvpEntry) {
  const all = getAllRsvps().filter((e) => e.groupId !== entry.groupId)
  all.push(entry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function clearAllRsvps() {
  localStorage.removeItem(STORAGE_KEY)
}
