import { randomBytes } from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from './supabase.js'

const COOKIE_NAME = 'admin_session'
const SESSION_DURATION_DAYS = 30
const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000

export interface SessionUser {
  id: string
  email: string
}

export function generateToken(): string {
  return randomBytes(32).toString('hex')
}

function buildCookie(token: string, expiresAt: Date): string {
  const parts = [
    `${COOKIE_NAME}=${token}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Expires=${expiresAt.toUTCString()}`,
  ]
  if (process.env.NODE_ENV === 'production') parts.push('Secure')
  return parts.join('; ')
}

function buildClearCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}

export async function createSession(
  res: VercelResponse,
  userId: string
): Promise<string> {
  const token = generateToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

  const { error } = await supabase
    .from('admin_sessions')
    .insert({ user_id: userId, token, expires_at: expiresAt.toISOString() })

  if (error) throw new Error(`Failed to create session: ${error.message}`)

  res.setHeader('Set-Cookie', buildCookie(token, expiresAt))
  return token
}

export async function destroySession(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  const token = readToken(req)
  if (token) {
    await supabase.from('admin_sessions').delete().eq('token', token)
  }
  res.setHeader('Set-Cookie', buildClearCookie())
}

function readToken(req: VercelRequest): string | null {
  const cookieHeader = req.headers.cookie
  if (!cookieHeader) return null
  const match = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`))
  return match ? match.slice(COOKIE_NAME.length + 1) : null
}

export async function getSessionUser(
  req: VercelRequest
): Promise<SessionUser | null> {
  const token = readToken(req)
  if (!token) return null

  const { data: session, error } = await supabase
    .from('admin_sessions')
    .select('user_id, expires_at')
    .eq('token', token)
    .maybeSingle()

  if (error || !session) return null

  if (new Date(session.expires_at) < new Date()) {
    // Expirada — limpa do banco
    await supabase.from('admin_sessions').delete().eq('token', token)
    return null
  }

  const { data: user, error: userError } = await supabase
    .from('admin_users')
    .select('id, email')
    .eq('id', session.user_id)
    .maybeSingle()

  if (userError || !user) return null
  return { id: user.id, email: user.email }
}

export async function requireSessionUser(
  req: VercelRequest,
  res: VercelResponse
): Promise<SessionUser | null> {
  const user = await getSessionUser(req)
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' })
    return null
  }
  return user
}
