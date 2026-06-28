import { useEffect } from 'react'
import { SITE } from '@/lib/constants'
import Hero             from '@/components/sections/Hero'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import Services         from '@/components/sections/Services'
import StackCarousel    from '@/components/sections/StackCarousel'
import Process          from '@/components/sections/Process'
import Testimonials          from '@/components/sections/Testimonials'
import CTASection            from '@/components/sections/CTASection'

export default function Home() {
  useEffect(() => {
    document.title = SITE.title
  }, [])

  return (
    <>
      <Hero />
      <FeaturedProjects />
      <Services />
      <StackCarousel />
      <Process />
      <Testimonials />
      <CTASection />
    </>
  )
}
