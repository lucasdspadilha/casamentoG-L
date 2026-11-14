import { useEffect } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../components/sections/Hero'
import { OurStory } from '../components/sections/OurStory'
import { Ceremony } from '../components/sections/Ceremony'
import { Gallery } from '../components/sections/Gallery'
import { WeddingGallery } from '../components/sections/WeddingGallery'
import { WeddingStrip } from '../components/sections/WeddingStrip'
import { WishList } from '../components/sections/WishList'
import { Faq } from '../components/sections/Faq'
import { Rsvp } from '../components/sections/Rsvp'
import { CartFloating } from '../components/wishlist/CartFloating'
import { CartProvider } from '../lib/cart'

export function CasamentoLanding() {
  // Scroll pra seção pedida — aceita sessionStorage (vindo de outra landing)
  // OU hash da URL (bookmark/share). Repete pra lidar com imagens acima que
  // carregam depois e mudam a posição do alvo.
  useEffect(() => {
    if (typeof window === 'undefined') return

    const fromSession = sessionStorage.getItem('scrollTo')
    if (fromSession) sessionStorage.removeItem('scrollTo')
    const target = fromSession || window.location.hash.slice(1)
    if (!target) return

    const scrollToTarget = () => {
      const el = document.getElementById(target)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80
        window.scrollTo({ top, behavior: 'auto' })
      }
    }

    const timeouts = [100, 300, 600, 1200, 2000].map((ms) =>
      setTimeout(scrollToTarget, ms)
    )

    const onLoad = () => scrollToTarget()
    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad)

    return () => {
      timeouts.forEach(clearTimeout)
      window.removeEventListener('load', onLoad)
    }
  }, [])

  return (
    <CartProvider>
      <Navbar />
      <main>
        <Hero />
        <OurStory eventId="casamento" />
        <Ceremony />
        <Gallery />
        <WeddingGallery />
        <WeddingStrip />
        <WishList />
        <Rsvp eventId="casamento" />
        <Faq />
      </main>
      <Footer />
      <CartFloating />
    </CartProvider>
  )
}
