import { useEffect, useState } from 'react'

type RouteState = {
  pathname: string
  hash: string
}

function readRoute(): RouteState {
  if (typeof window === 'undefined') return { pathname: '/', hash: '' }
  return {
    pathname: window.location.pathname,
    hash: window.location.hash,
  }
}

export function useHashRoute(): string {
  const [route, setRoute] = useState<RouteState>(readRoute)

  useEffect(() => {
    const handler = () => setRoute(readRoute())
    window.addEventListener('hashchange', handler)
    window.addEventListener('popstate', handler)
    return () => {
      window.removeEventListener('hashchange', handler)
      window.removeEventListener('popstate', handler)
    }
  }, [])

  return route.hash
}

export function useRoute(): RouteState {
  const [route, setRoute] = useState<RouteState>(readRoute)

  useEffect(() => {
    const handler = () => setRoute(readRoute())
    window.addEventListener('hashchange', handler)
    window.addEventListener('popstate', handler)
    return () => {
      window.removeEventListener('hashchange', handler)
      window.removeEventListener('popstate', handler)
    }
  }, [])

  return route
}
