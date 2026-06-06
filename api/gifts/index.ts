import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../_lib/supabase'
import { requireSessionUser } from '../_lib/session'

interface GiftItem {
  wishId: number
  title: string
  amount: number
}

interface IncomingGift {
  giverName?: string
  items: GiftItem[]
  total: number
  submittedAt?: string
}

interface DbGift {
  id: string
  giver_name: string
  items: GiftItem[]
  total: number
  submitted_at: string
}

function toApi(row: DbGift) {
  return {
    id: row.id,
    giverName: row.giver_name,
    items: row.items ?? [],
    total: Number(row.total),
    submittedAt: row.submitted_at,
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const user = await requireSessionUser(req, res)
    if (!user) return

    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json((data as DbGift[]).map(toApi))
  }

  if (req.method === 'POST') {
    const body = req.body as IncomingGift
    if (!Array.isArray(body?.items) || typeof body.total !== 'number') {
      return res.status(400).json({ error: 'Invalid gift payload' })
    }
    if (body.total <= 0 || body.total > 1000000) {
      return res.status(400).json({ error: 'Invalid total amount' })
    }
    if (body.items.length === 0) {
      return res.status(400).json({ error: 'At least one item required' })
    }

    const { data, error } = await supabase
      .from('gifts')
      .insert({
        giver_name: body.giverName?.trim() || 'Anônimo',
        items: body.items,
        total: body.total,
        submitted_at: body.submittedAt ?? new Date().toISOString(),
      })
      .select('*')
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(toApi(data as DbGift))
  }

  // DELETE endpoint for admin to clear all gifts (raro mas útil)
  if (req.method === 'DELETE') {
    const user = await requireSessionUser(req, res)
    if (!user) return

    const { error } = await supabase.from('gifts').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
