import { useEffect } from 'react'
import { SITE } from '@/lib/constants'
import Hero                     from '@/components/sections/Hero'
import FeaturedProjects         from '@/components/sections/FeaturedProjects'
import HorizontalScrollProjects from '@/components/sections/HorizontalScrollProjects'
import Services                 from '@/components/sections/Services'
import StackCarousel            from '@/components/sections/StackCarousel'
import Process                  from '@/components/sections/Process'
import Testimonials             from '@/components/sections/Testimonials'
import CTASection               from '@/components/sections/CTASection'

export default function Home() {
  useEffect(() => {
    document.title = SITE.title
  }, [])

  return (
    <>
      <Hero />
      {/*
        FeaturedProjects = masonry grid, shown on all breakpoints.
        HorizontalScrollProjects = pinned horizontal scroll, desktop only (lg+).
        They complement each other: mobile users get the masonry, desktop users
        get the immersive horizontal track as an additional showcase.
      */}
      <FeaturedProjects />
      <HorizontalScrollProjects />
      <Services />
      <StackCarousel />
      <Process />
      <Testimonials />
      <CTASection />
    </>
  )
}
