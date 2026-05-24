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
import { useHashRoute } from './lib/useHashRoute'

function App() {
  const hash = useHashRoute()

  if (hash === '#/admin' || hash === '#admin') {
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
        <Faq />
        <Rsvp />
      </main>
      <Footer />
      <CartFloating />
    </CartProvider>
  )
}

export default App
