import { useRef, useEffect, type ReactNode } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * The mirror of the hero's assembly: as this section leaves the viewport it
 * decomposes back into the wireframe it was built from — content dissolves,
 * outlines appear, saturation drains. Scrolling back up reassembles it.
 *
 * Implementation notes:
 *  - Driven by `scrub`, so it is tied to scroll position rather than time and
 *    reverses naturally when the visitor scrolls back.
 *  - The outline is a `box-shadow: inset`, not a border, so nothing reflows —
 *    a border would change every child's box at 60fps.
 *  - Wrapped children are never unmounted or hidden outright; worst case the
 *    timeline never runs and the section simply looks normal.
 */
export default function Decompose({
  children,
  /** How far into the wireframe state it goes. 0–1. */
  intensity = 1,
}: {
  children: ReactNode
  intensity?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      /* Direct children are the "boxes" that survive as outlines. */
      const blocks = Array.from(el.children) as HTMLElement[]
      if (!blocks.length) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          // Begins once the section is mostly past, so reading is never
          // disturbed — only leaving triggers the teardown.
          start: 'bottom 65%',
          end: 'bottom 5%',
          scrub: 0.8,
        },
      })

      tl.to(blocks, {
        opacity: 1 - 0.82 * intensity,
        filter: `grayscale(${intensity}) blur(${1.2 * intensity}px)`,
        boxShadow: `inset 0 0 0 1px rgba(255,255,255,${0.16 * intensity})`,
        borderRadius: 6,
        ease: 'none',
        stagger: { each: 0.06, from: 'end' },
      }, 0)

      tl.to(el, {
        scale: 1 - 0.02 * intensity,
        ease: 'none',
      }, 0)
    }, ref)

    return () => ctx.revert()
  }, [intensity])

  return (
    <div ref={ref} style={{ willChange: 'transform' }}>
      {children}
    </div>
  )
}
