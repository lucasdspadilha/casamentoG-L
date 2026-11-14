import { useEffect } from 'react'
import { Admin } from './components/admin/Admin'
import { CasamentoLanding } from './pages/CasamentoLanding'
import { ChurrascoMtLanding } from './pages/ChurrascoMtLanding'
import { useRoute } from './lib/useHashRoute'

function App() {
  const { pathname, hash } = useRoute()

  const isAdmin =
    pathname === '/admin' ||
    pathname === '/admin/' ||
    hash === '#/admin' ||
    hash === '#admin'

  // /setembro é a URL canônica do casamento. /casamento e #/casamento
  // continuam aceitos pra não quebrar links antigos — redirecionam na barra.
  const isLegacyCasamento =
    pathname === '/casamento' ||
    pathname === '/casamento/' ||
    hash === '#/casamento'

  const isSetembro =
    pathname === '/setembro' ||
    pathname === '/setembro/' ||
    hash === '#/setembro'

  useEffect(() => {
    if (isLegacyCasamento && typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/setembro')
    }
  }, [isLegacyCasamento])

  if (isAdmin) return <Admin />
  if (isSetembro || isLegacyCasamento) return <CasamentoLanding />
  return <ChurrascoMtLanding />
}

export default App
