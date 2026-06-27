import { useEffect } from 'react'
import { useLenis } from '@/hooks/useLenis'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export default function SmoothScroll() {
  const prefersReducedMotion = usePrefersReducedMotion()

  // Only init lenis when not in reduced motion mode
  const shouldInit = !prefersReducedMotion
  useLenisConditional(shouldInit)

  return null
}

function useLenisConditional(enabled: boolean) {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!enabled || prefersReducedMotion) return

    let Lenis: typeof import('lenis').default
    let lenisInstance: import('lenis').default
    let rafId: number

    import('lenis').then((mod) => {
      Lenis = mod.default
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
      })

      import('gsap').then(({ default: gsap }) => {
        import('gsap/ScrollTrigger').then(({ default: ScrollTrigger }) => {
          gsap.registerPlugin(ScrollTrigger)

          lenisInstance.on('scroll', ScrollTrigger.update)
          gsap.ticker.add((time) => {
            lenisInstance.raf(time * 1000)
          })
          gsap.ticker.lagSmoothing(0)

          function raf(time: number) {
            lenisInstance.raf(time)
            rafId = requestAnimationFrame(raf)
          }
          rafId = requestAnimationFrame(raf)
        })
      })
    })

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      if (lenisInstance) lenisInstance.destroy()
    }
  }, [enabled, prefersReducedMotion])
}
