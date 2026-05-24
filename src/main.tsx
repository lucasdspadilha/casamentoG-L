import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

// Limpa hash de navegação (ex: #rsvp) pra página sempre começar do topo.
// Mantém apenas a rota de admin.
const hash = window.location.hash
if (hash && hash !== '#/admin' && hash !== '#admin') {
  history.replaceState(
    null,
    '',
    window.location.pathname + window.location.search
  )
}

window.scrollTo(0, 0)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
