import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

// Register once at module level so ScrollTrigger exists before any component uses it.
gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null

export function getLenis(): Lenis | null {
  return lenisInstance
}

/** Pause the scroll engine (used by the preloader / modals).
 *  Lenis manages the `lenis-stopped` class on <html> itself. */
export function stopLenis() {
  lenisInstance?.stop()
}

/** Resume the scroll engine and re-measure everything. */
export function startLenis() {
  lenisInstance?.start()
  // Dimensions measured while the page was locked are stale — recompute both
  // Lenis' own scroll limit and every ScrollTrigger start/end.
  lenisInstance?.resize()
  ScrollTrigger.refresh()
}

export function useLenis() {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      // lerp is frame-rate adaptive: every frame we move `lerp` of the remaining
      // distance toward the target. 0.1 is the sweet spot used by most
      // award-winning sites — 0.08 felt sluggish, 0.15 feels twitchy.
      lerp:            0.1,
      smoothWheel:     true,
      // Native momentum on touch devices feels correct and stays responsive;
      // Lenis-driven touch adds input latency on mobile.
      syncTouch:       false,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.6,
      // Stop interpolating below a 0.05px delta so we don't burn frames
      // asymptotically approaching the target forever.
      // (Lenis default, stated explicitly for clarity.)
      overscroll:      true,
      autoResize:      true,
    })

    lenisInstance = lenis

    // Keep ScrollTrigger's cached scroll position in sync with Lenis' virtual one.
    lenis.on('scroll', ScrollTrigger.update)

    // ONE raf loop for the whole app: GSAP's ticker drives Lenis.
    // Never call requestAnimationFrame(lenis.raf) separately — two loops
    // double-advance the interpolation and produce stutter.
    const tickerFn = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerFn)
    // Without this, GSAP throttles after a slow frame and Lenis jumps.
    gsap.ticker.lagSmoothing(0)

    // ── Global scroll reveals ──────────────────────────────────────────
    const styleId = 'lenis-sr'
    if (!document.getElementById(styleId)) {
      const s = document.createElement('style')
      s.id = styleId
      s.textContent = `
        @media (prefers-reduced-motion: no-preference) {
          [data-sr] {
            opacity: 0;
            transform: translate3d(0, 44px, 0);
            transition:
              opacity   0.85s cubic-bezier(0.16,1,0.3,1),
              transform 0.95s cubic-bezier(0.16,1,0.3,1);
            will-change: opacity, transform;
          }
          [data-sr].sr-on {
            opacity: 1;
            transform: translate3d(0, 0, 0);
            will-change: auto;
          }
          [data-sr][data-sr-d="1"] { transition-delay: 0.08s; }
          [data-sr][data-sr-d="2"] { transition-delay: 0.18s; }
          [data-sr][data-sr-d="3"] { transition-delay: 0.28s; }
          [data-sr][data-sr-d="4"] { transition-delay: 0.38s; }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-sr] { opacity: 1; transform: none; }
        }
      `
      document.head.appendChild(s)
    }

    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('sr-on')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
    )

    function observeNewSR(node: Element) {
      if (node.hasAttribute('data-sr') && !node.classList.contains('sr-on')) {
        io.observe(node)
      }
      node.querySelectorAll<Element>('[data-sr]:not(.sr-on)').forEach(el => io.observe(el))
    }

    // Initial scan once the first page's DOM has settled.
    const scanHandle = setTimeout(() => {
      document.querySelectorAll('[data-sr]').forEach(el => io.observe(el))
      ScrollTrigger.refresh()
    }, 120)

    // Re-scan when the router swaps in new page content. We deliberately do NOT
    // call ScrollTrigger.refresh() here — it forces layout on every React DOM
    // mutation, which janks mid-scroll. Route changes refresh via startLenis().
    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof Element) observeNewSR(node)
        }
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })

    // Fonts change text metrics after first paint, which invalidates every
    // ScrollTrigger start/end that was measured before they loaded.
    let fontsDone = false
    document.fonts?.ready.then(() => {
      fontsDone = true
      ScrollTrigger.refresh()
    })

    // Images without explicit dimensions shift layout as they decode.
    function onLoad() { if (fontsDone) ScrollTrigger.refresh() }
    window.addEventListener('load', onLoad)

    // Debounced resize — ScrollTrigger.refresh() is expensive, don't run it
    // on every resize event during a window drag.
    let resizeTimer: ReturnType<typeof setTimeout>
    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 180)
    }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      clearTimeout(scanHandle)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', onLoad)
      io.disconnect()
      mo.disconnect()
      gsap.ticker.remove(tickerFn)
      lenis.destroy()
      lenisInstance = null
    }
  }, [prefersReducedMotion])
}
