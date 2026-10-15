import { FinalCTA } from '../components/home/FinalCTA'
import { Hero } from '../components/home/Hero'
import { PackagesTeaser } from '../components/home/PackagesTeaser'
import { Partners } from '../components/home/Partners'
import { ProcessStrip } from '../components/home/ProcessStrip'
import { RoomJourney } from '../components/home/RoomJourney'
import { SignatureScroll } from '../components/home/SignatureScroll'
import { Spaces } from '../components/home/Spaces'
import { StatementBand } from '../components/home/StatementBand'
import { StoryIntro } from '../components/home/StoryIntro'
import { Testimonials } from '../components/home/Testimonials'
import { ToursTeaser } from '../components/home/ToursTeaser'
import { WhySiriz } from '../components/home/WhySiriz'

export function Home() {
  return (
    <>
      <Hero />
      <StoryIntro />
      <RoomJourney />
      <StatementBand />
      <Spaces />
      <SignatureScroll />
      <WhySiriz />
      <ProcessStrip />
      <PackagesTeaser />
      <ToursTeaser />
      <Testimonials />
      <Partners />
      <FinalCTA />
    </>
  )
}
