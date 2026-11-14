import { useEffect, useState } from 'react'
import { X, ArrowRight } from 'lucide-react'

const DISMISS_KEY = 'geo-banner-dismissed-v1'
const BANNER_HEIGHT_PX = 40

interface GeoResponse {
  region: string | null
  country: string | null
  city: string | null
}

/**
 * Banner que só aparece quando o visitante parece estar em SP
 * mas caiu na landing do churrasco MT. Sugere /setembro.
 * Fora desse caso, não renderiza nada.
 */
export function GeoBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(DISMISS_KEY)) return

    // Debug override: /?debug-region=SP (pra testar local sem deploy)
    const params = new URLSearchParams(window.location.search)
    const debugRegion = params.get('debug-region')

    let cancelled = false
    const geoPromise: Promise<GeoResponse> = debugRegion
      ? Promise.resolve({ region: debugRegion, country: 'BR', city: null })
      : fetch('/api/geo').then((r) => r.json() as Promise<GeoResponse>)

    geoPromise
      .then((data) => {
        if (cancelled) return
        if (data.region === 'SP') setVisible(true)
      })
      .catch(() => {
        // Sem geo, sem banner.
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Expõe altura do banner via CSS var pro navbar se ajustar
  useEffect(() => {
    const root = document.documentElement
    if (visible) {
      root.style.setProperty('--geo-banner-h', `${BANNER_HEIGHT_PX}px`)
    } else {
      root.style.removeProperty('--geo-banner-h')
    }
    return () => {
      root.style.removeProperty('--geo-banner-h')
    }
  }, [visible])

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed left-0 right-0 z-[60] bg-sage text-cream px-4 flex items-center justify-center gap-3 shadow-sm"
      style={{ top: 0, height: `${BANNER_HEIGHT_PX}px` }}
    >
      <span className="font-sans text-xs tracking-wide">
        Procurando a cerimônia de setembro em SP?
      </span>
      <a
        href="/setembro"
        className="inline-flex items-center gap-1 font-sans text-[11px] uppercase tracking-[0.15em] bg-cream/15 hover:bg-cream/25 px-3 py-1 rounded-full transition-colors"
      >
        Ir pra lá
        <ArrowRight size={12} />
      </a>
      <button
        type="button"
        onClick={dismiss}
        className="ml-2 text-cream/70 hover:text-cream transition-colors cursor-pointer"
        aria-label="Fechar"
      >
        <X size={14} />
      </button>
    </div>
  )
}
