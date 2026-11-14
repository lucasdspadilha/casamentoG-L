import { guestGroups, type EventId, type GuestGroup } from '../data/guestGroups'
import { guestGroupsMT } from '../data/guestGroupsMT'
import { normalize } from './normalize'

const allGroups: GuestGroup[] = [...guestGroups, ...guestGroupsMT]

export function searchGroups(
  query: string,
  eventId?: EventId
): GuestGroup[] {
  const q = normalize(query)
  if (q.length < 2) return []

  const scope = eventId ? allGroups.filter((g) => g.eventId === eventId) : allGroups
  const tokens = q.split(/\s+/).filter(Boolean)
  return scope.filter((group) => {
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
  return allGroups.find((g) => g.id === id)
}

export function groupsByEvent(eventId: EventId): GuestGroup[] {
  return allGroups.filter((g) => g.eventId === eventId)
}

export { guestGroups, guestGroupsMT }
