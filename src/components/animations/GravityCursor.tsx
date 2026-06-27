import { useEffect } from 'react'
import gsap from 'gsap'

/* Add data-gravity to any element you want attracted to the cursor */
export default function GravityCursor() {
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    const THRESHOLD = 130  // px radius of influence
    const STRENGTH  = 0.28 // 0–1 how much it moves

    const els: { el: HTMLElement; qx: gsap.QuickToFunc; qy: gsap.QuickToFunc }[] = []

    function refresh() {
      els.length = 0
      document.querySelectorAll<HTMLElement>('[data-gravity]').forEach(el => {
        els.push({
          el,
          qx: gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' }),
          qy: gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' }),
        })
      })
    }
    refresh()

    /* Re-scan on route changes */
    const observer = new MutationObserver(refresh)
    observer.observe(document.body, { childList: true, subtree: true })

    function onMove(e: MouseEvent) {
      const mx = e.clientX, my = e.clientY
      els.forEach(({ el, qx, qy }) => {
        const r   = el.getBoundingClientRect()
        const cx  = r.left + r.width  / 2
        const cy  = r.top  + r.height / 2
        const dx  = mx - cx
        const dy  = my - cy
        const dist= Math.sqrt(dx * dx + dy * dy)

        if (dist < THRESHOLD) {
          const factor = (1 - dist / THRESHOLD) * STRENGTH
          qx(dx * factor * (r.width  / 2))
          qy(dy * factor * (r.height / 2))
        } else {
          qx(0); qy(0)
        }
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      observer.disconnect()
      els.forEach(({ el }) => gsap.set(el, { x: 0, y: 0 }))
    }
  }, [])

  return null
}
