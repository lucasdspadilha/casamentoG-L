import { guestGroups, type GuestGroup } from '../data/guestGroups'
import { normalize } from './normalize'

export function searchGroups(query: string): GuestGroup[] {
  const q = normalize(query)
  if (q.length < 2) return []

  const tokens = q.split(/\s+/).filter(Boolean)
  return guestGroups.filter((group) => {
    const haystack = [
      group.label,
      ...group.guests.flatMap((g) => [g.name, ...(g.nicknames || [])]),
    ]
      .map(normalize)
      .join(' ')
    return tokens.every((tok) => haystack.includes(tok))
  })
}

export function findGroupById(id: string): GuestGroup | undefined {
  return guestGroups.find((g) => g.id === id)
}

export { guestGroups }
