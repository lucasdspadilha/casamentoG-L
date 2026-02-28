import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { OurStory } from './components/sections/OurStory'
import { Ceremony } from './components/sections/Ceremony'
import { Gallery } from './components/sections/Gallery'
import { WishList } from './components/sections/WishList'
import { Faq } from './components/sections/Faq'
import { Rsvp } from './components/sections/Rsvp'

function App() {
  return (
    <>
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
    </>
  )
}

export default App
