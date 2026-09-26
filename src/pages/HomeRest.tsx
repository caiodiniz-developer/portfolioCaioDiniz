import { useEffect, useState } from 'react'
import ScrollTrigger from 'gsap/ScrollTrigger'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import Services      from '@/components/sections/Services'
import StackCarousel from '@/components/sections/StackCarousel'
import Process       from '@/components/sections/Process'
import GitHubActivity from '@/components/sections/GitHubActivity'
import CTASection    from '@/components/sections/CTASection'
import Decompose     from '@/components/animations/Decompose'

/* Everything on the home page below the hero, mounted one section per idle
   slot. Rendering all six in one go was a single multi-second task on a slow
   phone — nothing could respond until it finished. Top-down order means the
   section just under the hero is always the first to exist. */
const SECTIONS = [
  () => <FeaturedProjects />,
  // Services decomposes back into wireframe as it leaves — the mirror of the
  // hero assembling itself on arrival. Once on purpose: it reads as
  // intentional once, and as a gimmick if every section did it.
  () => <Decompose><Services /></Decompose>,
  () => <StackCarousel />,
  () => <Process />,
  // Testimonials hidden until there are real, attributable quotes —
  // src/data/testimonials.ts still holds placeholders.
  () => <GitHubActivity />,
  () => <CTASection />,
]

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number
  cancelIdleCallback?: (id: number) => void
}

export default function HomeRest() {
  const [count, setCount] = useState(1)

  useEffect(() => {
    const w = window as IdleWindow
    if (count >= SECTIONS.length) {
      // The page just grew by several screens: remeasure every trigger.
      const id = requestAnimationFrame(() => ScrollTrigger.refresh())
      return () => cancelAnimationFrame(id)
    }
    const next = () => setCount(c => c + 1)
    if (w.requestIdleCallback && w.cancelIdleCallback) {
      const id = w.requestIdleCallback(next, { timeout: 600 })
      return () => w.cancelIdleCallback!(id)
    }
    const t = setTimeout(next, 50)
    return () => clearTimeout(t)
  }, [count])

  return <>{SECTIONS.slice(0, count).map((render, i) => <div key={i} style={{ display: 'contents' }}>{render()}</div>)}</>
}
