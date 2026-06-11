import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { OurStory } from './components/sections/OurStory'
import { Ceremony } from './components/sections/Ceremony'
import { Gallery } from './components/sections/Gallery'
import { WishList } from './components/sections/WishList'
import { Faq } from './components/sections/Faq'
import { Rsvp } from './components/sections/Rsvp'
import { Admin } from './components/admin/Admin'
import { CartFloating } from './components/wishlist/CartFloating'
import { CartProvider } from './lib/cart'
import { useRoute } from './lib/useHashRoute'

function App() {
  const { pathname, hash } = useRoute()

  const isAdmin =
    pathname === '/admin' ||
    pathname === '/admin/' ||
    hash === '#/admin' ||
    hash === '#admin'

  if (isAdmin) {
    return <Admin />
  }

  return (
    <CartProvider>
      <Navbar />
      <main>
        <Hero />
        <OurStory />
        <Ceremony />
        <Gallery />
        <WishList />
        <Rsvp />
        <Faq />
      </main>
      <Footer />
      <CartFloating />
    </CartProvider>
  )
}

export default App
