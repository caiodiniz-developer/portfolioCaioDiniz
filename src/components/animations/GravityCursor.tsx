import { useEffect } from 'react'
import gsap from 'gsap'

/**
 * Pulls any `[data-gravity]` element toward the cursor when it comes close.
 *
 * PERF CONTRACT — mousemove fires up to 120Hz and, crucially, trackpad
 * scrolling generates it too, so anything expensive here lands squarely on the
 * scroll pipeline:
 *  1. Geometry is measured into a cache in DOCUMENT space, never inside the
 *     move handler. Reading getBoundingClientRect() per element per event was
 *     forcing a synchronous layout flush dozens of times a second.
 *  2. The cache is refreshed on resize and on DOM changes, debounced into a
 *     single frame — the MutationObserver used to rebuild every quickTo on
 *     every mutation, which also leaked tweens.
 *  3. Scroll does not invalidate the cache: viewport position is derived by
 *     subtracting the current scroll offset at read time.
 */

const THRESHOLD = 130   // px radius of influence
const STRENGTH  = 0.28  // 0–1, how far it travels

interface Target {
  el: HTMLElement
  qx: gsap.QuickToFunc
  qy: gsap.QuickToFunc
  /** Centre and size, in document space. */
  cx: number
  cy: number
  w: number
  h: number
}

export default function GravityCursor() {
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let targets: Target[] = []

    function measure() {
      const sx = window.scrollX
      const sy = window.scrollY
      const next: Target[] = []

      document.querySelectorAll<HTMLElement>('[data-gravity]').forEach(el => {
        const r = el.getBoundingClientRect()
        if (r.width === 0 && r.height === 0) return
        next.push({
          el,
          // quickTo is created once per element per measure, not per event.
          qx: gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' }),
          qy: gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' }),
          cx: r.left + r.width / 2 + sx,
          cy: r.top + r.height / 2 + sy,
          w: r.width,
          h: r.height,
        })
      })

      targets = next
    }

    /* Collapse a burst of DOM changes (a route transition) into one measure. */
    let scheduled = false
    function scheduleMeasure() {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(() => {
        scheduled = false
        measure()
      })
    }

    function onMove(e: MouseEvent) {
      const mx = e.clientX
      const my = e.clientY
      const sx = window.scrollX
      const sy = window.scrollY

      for (let i = 0; i < targets.length; i++) {
        const t = targets[i]
        // Cached document-space centre → current viewport position.
        const dx = mx - (t.cx - sx)
        const dy = my - (t.cy - sy)
        const dist = Math.hypot(dx, dy)

        if (dist < THRESHOLD) {
          const factor = (1 - dist / THRESHOLD) * STRENGTH
          t.qx(dx * factor * (t.w / 2))
          t.qy(dy * factor * (t.h / 2))
        } else {
          t.qx(0)
          t.qy(0)
        }
      }
    }

    measure()

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('resize', scheduleMeasure, { passive: true })

    const mo = new MutationObserver(scheduleMeasure)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', scheduleMeasure)
      mo.disconnect()
      targets.forEach(t => gsap.set(t.el, { x: 0, y: 0 }))
    }
  }, [])

  return null
}
