export interface AuthUser {
  id: string
  email: string
}

async function jsonOrNull<T>(res: Response): Promise<T | null> {
  if (!res.ok) return null
  return res.json() as Promise<T>
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error ?? 'Falha no login.')
  }
  return res.json() as Promise<AuthUser>
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const res = await fetch('/api/auth/me', { credentials: 'include' })
  return jsonOrNull<AuthUser>(res)
}
