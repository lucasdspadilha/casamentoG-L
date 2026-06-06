import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../_lib/supabase.js'
import { requireSessionUser } from '../_lib/session.js'

interface IncomingRsvp {
  groupId: string
  attending: 'yes' | 'no'
  attendingGuestIds?: string[]
  plusOneName?: string
  phone?: string
  message?: string
}

interface DbRsvp {
  id: string
  group_id: string
  attending: 'yes' | 'no'
  attending_guest_ids: string[]
  plus_one_name: string | null
  phone: string | null
  message: string | null
  edit_count: number
  previous_versions: unknown[]
  submitted_at: string
  updated_at: string
}

function toApi(row: DbRsvp) {
  return {
    groupId: row.group_id,
    attending: row.attending,
    attendingGuestIds: row.attending_guest_ids ?? [],
    plusOneName: row.plus_one_name ?? undefined,
    phone: row.phone ?? undefined,
    message: row.message ?? undefined,
    editCount: row.edit_count ?? 0,
    previousVersions: row.previous_versions ?? [],
    submittedAt: row.submitted_at,
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const user = await requireSessionUser(req, res)
    if (!user) return

    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json((data as DbRsvp[]).map(toApi))
  }

  if (req.method === 'POST') {
    const body = req.body as IncomingRsvp
    if (
      !body?.groupId ||
      typeof body.groupId !== 'string' ||
      (body.attending !== 'yes' && body.attending !== 'no')
    ) {
      return res.status(400).json({ error: 'Invalid RSVP payload' })
    }
    if (
      body.attendingGuestIds !== undefined &&
      (!Array.isArray(body.attendingGuestIds) ||
        !body.attendingGuestIds.every((x) => typeof x === 'string'))
    ) {
      return res.status(400).json({ error: 'Invalid attendingGuestIds' })
    }

    // Verifica existência atual pra mesclar histórico de edições
    const { data: existing } = await supabase
      .from('rsvps')
      .select('*')
      .eq('group_id', body.groupId)
      .maybeSingle()

    const newRow = {
      group_id: body.groupId,
      attending: body.attending,
      attending_guest_ids: body.attendingGuestIds ?? [],
      plus_one_name: body.plusOneName?.trim() || null,
      phone: body.phone?.trim() || null,
      message: body.message?.trim() || null,
      edit_count: existing ? (existing.edit_count ?? 0) + 1 : 0,
      previous_versions: existing
        ? [
            ...(existing.previous_versions ?? []),
            {
              attending: existing.attending,
              attendingGuestIds: existing.attending_guest_ids,
              plusOneName: existing.plus_one_name,
              phone: existing.phone,
              message: existing.message,
              submittedAt: existing.submitted_at,
            },
          ]
        : [],
      submitted_at: existing ? existing.submitted_at : new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('rsvps')
      .upsert(newRow, { onConflict: 'group_id' })
      .select('*')
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(toApi(data as DbRsvp))
  }

  if (req.method === 'DELETE') {
    const user = await requireSessionUser(req, res)
    if (!user) return

    const { error } = await supabase
      .from('rsvps')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
