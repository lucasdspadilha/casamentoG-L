import { NavbarMt } from '../components/layout/NavbarMt'
import { FooterMt } from '../components/layout/FooterMt'
import { GeoBanner } from '../components/layout/GeoBanner'
import { HeroMt } from '../components/sections/HeroMt'
import { InfoMt } from '../components/sections/InfoMt'
import { FaqMt } from '../components/sections/FaqMt'
import { OurStory } from '../components/sections/OurStory'
import { Gallery } from '../components/sections/Gallery'
import { WeddingStrip } from '../components/sections/WeddingStrip'
import { PixSoft } from '../components/sections/PixSoft'
import { Rsvp } from '../components/sections/Rsvp'

export function ChurrascoMtLanding() {
  return (
    <>
      <GeoBanner />
      <NavbarMt />
      <main>
        <HeroMt />
        <OurStory eventId="churrasco-mt" />
        <InfoMt />
        <Gallery />
        <WeddingStrip />
        <Rsvp
          eventId="churrasco-mt"
          label="Até 25 de janeiro de 2027"
          title="Confirmar Presença"
          subtitle="Digite seu nome pra gente te encontrar na lista."
        />
        <PixSoft />
        <FaqMt />
      </main>
      <FooterMt />
    </>
  )
}
