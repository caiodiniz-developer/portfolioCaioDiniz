import { useEffect, useRef } from 'react'
import { useLanguageStore } from '@/store/useLanguageStore'

/**
 * Makes the browser tab itself part of the site.
 *
 *  1. The favicon becomes a live scroll-progress ring, redrawn on a canvas and
 *     swapped in as a data URI.
 *  2. Leaving the tab swaps the title for a nudge; coming back restores it.
 *
 * Both are cheap, but the favicon is the one that needs care: replacing the
 * <link> element on every scroll event would thrash the DOM, so drawing is
 * throttled to whole-percent changes and runs off the scroll listener rather
 * than its own RAF loop.
 */

const SIZE = 64          // canvas is 2x the 32px favicon slot, for crisp edges
const RING = 6

export default function LiveTab() {
  const lang = useLanguageStore(s => s.lang)
  const originalTitle = useRef<string>('')
  const lastPct = useRef(-1)

  /* ── Title on blur ── */
  useEffect(() => {
    const away = lang === 'en' ? 'ei, volta aqui 👀' : 'ei, volta aqui 👀'

    function onVisibility() {
      if (document.hidden) {
        // Capture at the moment of leaving — the title changes per route, so a
        // value captured on mount would restore a stale one.
        originalTitle.current = document.title
        document.title = away
      } else if (originalTitle.current) {
        document.title = originalTitle.current
        originalTitle.current = ''
      }
    }

    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      if (originalTitle.current) document.title = originalTitle.current
    }
  }, [lang])

  /* ── Favicon progress ring ── */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = SIZE
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Own the favicon link so we never fight the one in index.html.
    let link = document.querySelector<HTMLLinkElement>('link[data-live-favicon]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      link.type = 'image/png'
      link.setAttribute('data-live-favicon', '')
      document.head.appendChild(link)
    }
    const linkEl = link

    function draw(pct: number) {
      const c = ctx!
      c.clearRect(0, 0, SIZE, SIZE)

      const cx = SIZE / 2
      const r  = cx - RING / 2 - 1

      // Track
      c.beginPath()
      c.arc(cx, cx, r, 0, Math.PI * 2)
      c.strokeStyle = 'rgba(255,255,255,0.18)'
      c.lineWidth = RING
      c.stroke()

      // Progress — starts at 12 o'clock
      if (pct > 0) {
        c.beginPath()
        c.arc(cx, cx, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct)
        c.strokeStyle = '#ffffff'
        c.lineWidth = RING
        c.lineCap = 'round'
        c.stroke()
      }

      // Centre mark — keeps the icon recognisable at 16px
      c.beginPath()
      c.arc(cx, cx, r * 0.34, 0, Math.PI * 2)
      c.fillStyle = '#ffffff'
      c.fill()

      linkEl.href = canvas.toDataURL('image/png')
    }

    function onScroll() {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      const whole = Math.round(pct * 100)
      // Redrawing + toDataURL is not free; only do it when the ring would
      // visibly change.
      if (whole === lastPct.current) return
      lastPct.current = whole
      draw(pct)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      linkEl.remove()
    }
  }, [])

  return null
}
