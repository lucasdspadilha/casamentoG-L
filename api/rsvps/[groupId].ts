import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../_lib/supabase.js'

// Endpoint público — retorna apenas o resumo necessário pro modal de overwrite.
// NÃO retorna phone, message, previousVersions (dados pessoais).
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { groupId } = req.query
  if (typeof groupId !== 'string') {
    return res.status(400).json({ error: 'Invalid groupId' })
  }

  const { data, error } = await supabase
    .from('rsvps')
    .select(
      'group_id, attending, attending_guest_ids, plus_one_name, edit_count, submitted_at, set_by_admin'
    )
    .eq('group_id', groupId)
    .maybeSingle()

  if (error) return res.status(500).json({ error: error.message })
  if (!data) return res.status(404).json({ error: 'Not found' })

  return res.status(200).json({
    groupId: data.group_id,
    attending: data.attending,
    attendingGuestIds: data.attending_guest_ids ?? [],
    plusOneName: data.plus_one_name ?? undefined,
    editCount: data.edit_count ?? 0,
    submittedAt: data.submitted_at,
    setByAdmin: data.set_by_admin ?? false,
  })
}
