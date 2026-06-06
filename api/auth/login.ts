import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import { supabase } from '../_lib/supabase.js'
import { createSession } from '../_lib/session.js'

// Hash dummy pra equalizar timing quando email não existe (anti enumeração).
const DUMMY_HASH =
  '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV.ABCDEF'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, password } = req.body ?? {}
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' })
  }

  const { data: user } = await supabase
    .from('admin_users')
    .select('id, email, password_hash')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle()

  // Sempre roda bcrypt.compare, com hash dummy se user não existe —
  // garante latência constante (anti timing attack).
  const hashToCompare = user?.password_hash ?? DUMMY_HASH
  const ok = await bcrypt.compare(password, hashToCompare)

  if (!user || !ok) {
    return res.status(401).json({ error: 'Credenciais inválidas.' })
  }

  await createSession(res, user.id)

  return res.status(200).json({ id: user.id, email: user.email })
}
