import { lazy, Suspense, useEffect, useState } from 'react'
import { SITE } from '@/lib/constants'
import { isAppReady, onAppReady } from '@/lib/appReady'
import Hero from '@/components/sections/Hero'

const HomeRest = lazy(() => import('./HomeRest'))

/* The hero is all that's on screen at first, so it renders alone. Mounting
   the other six sections at the same time (with their ScrollTriggers, split
   text and carousels) kept a slow phone's main thread busy for seconds and
   held back the hero's own entrance.

   When the rest mounts:
   - intro still playing → right away, on idle: the preloader covers the
     screen, so that time is free;
   - no intro → after the hero's entrance has played, or on the first sign
     of the visitor heading down the page, whichever comes first. */
function useMountRest() {
  const [mount, setMount] = useState(false)

  useEffect(() => {
    if (mount) return
    const go = () => setMount(true)
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
    const idle = (cb: () => void) => w.requestIdleCallback ? w.requestIdleCallback(cb, { timeout: 1500 }) : setTimeout(cb, 200)

    if (!isAppReady()) { idle(go); return }

    const events = ['wheel', 'touchstart', 'keydown', 'scroll'] as const
    events.forEach(e => window.addEventListener(e, go, { once: true, passive: true }))
    let t: ReturnType<typeof setTimeout> | undefined
    const unsub = onAppReady(() => { t = setTimeout(() => idle(go), 1600) })
    return () => {
      events.forEach(e => window.removeEventListener(e, go))
      unsub()
      if (t) clearTimeout(t)
    }
  }, [mount])

  return mount
}

export default function Home() {
  useEffect(() => {
    document.title = SITE.title
  }, [])

  const mountRest = useMountRest()

  return (
    <>
      <Hero />
      {mountRest && (
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <HomeRest />
        </Suspense>
      )}
    </>
  )
}
