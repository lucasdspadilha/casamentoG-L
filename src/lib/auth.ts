const ADMIN_PASSWORD = 'setembro2026'
const SESSION_KEY = 'admin-session-v1'

export function login(pwd: string): boolean {
  if (pwd === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, '1')
    return true
  }
  return false
}

export function isLoggedIn(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === '1'
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
}
