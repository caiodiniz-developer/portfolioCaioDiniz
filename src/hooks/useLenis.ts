import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

let lenisInstance: Lenis | null = null

export function getLenis(): Lenis | null {
  return lenisInstance
}

export function useLenis() {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    // Respect reduced-motion preference — skip Lenis entirely
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration:       1.8,
      easing:         (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel:    true,
      syncTouch:      false,
      wheelMultiplier: 0.7,
      touchMultiplier: 1.8,
    })

    lenisInstance = lenis

    // Keep ScrollTrigger in sync with Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis from GSAP's ticker — single unified RAF loop
    const tickerFn = (time: number) => {
      lenis.raf(time * 1000) // GSAP passes seconds; Lenis expects ms
    }
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0) // prevent large jumps after tab switches

    // ── Global scroll reveals ──────────────────────────────
    // Inject CSS once
    const styleId = 'lenis-sr'
    if (!document.getElementById(styleId)) {
      const s = document.createElement('style')
      s.id = styleId
      s.textContent = `
        @media (prefers-reduced-motion: no-preference) {
          [data-sr] {
            opacity: 0;
            transform: translateY(44px);
            transition:
              opacity  0.85s cubic-bezier(0.16,1,0.3,1),
              transform 0.95s cubic-bezier(0.16,1,0.3,1);
          }
          [data-sr].sr-on { opacity: 1; transform: none; }
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

    // Observe elements marked with data-sr
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('sr-on')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
    )

    // Scan runs once DOM has settled after route mount
    const scanHandle = setTimeout(() => {
      document.querySelectorAll('[data-sr]').forEach(el => io.observe(el))
      ScrollTrigger.refresh()
    }, 120)

    return () => {
      clearTimeout(scanHandle)
      io.disconnect()
      gsap.ticker.remove(tickerFn)
      lenis.destroy()
      lenisInstance = null
    }
  }, [prefersReducedMotion])
}
