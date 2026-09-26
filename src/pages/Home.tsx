import { useEffect } from 'react'
import { SITE } from '@/lib/constants'
import Hero          from '@/components/sections/Hero'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import Services      from '@/components/sections/Services'
import StackCarousel from '@/components/sections/StackCarousel'
import Process       from '@/components/sections/Process'
import GitHubActivity from '@/components/sections/GitHubActivity'
import CTASection    from '@/components/sections/CTASection'
import Decompose     from '@/components/animations/Decompose'

export default function Home() {
  useEffect(() => {
    document.title = SITE.title
  }, [])

  return (
    <>
      <Hero />
      <FeaturedProjects />
      {/* Services decomposes back into wireframe as it leaves — the mirror of
          the hero assembling itself on arrival. Applied to one section on
          purpose: the effect reads as intentional once, and as a gimmick if
          every section did it. */}
      <Decompose>
        <Services />
      </Decompose>
      <StackCarousel />
      <Process />
      {/* Testimonials hidden until there are real, attributable quotes —
          src/data/testimonials.ts still holds placeholders. */}
      <GitHubActivity />
      <CTASection />
    </>
  )
}
