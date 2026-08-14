import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ArrowDown } from 'lucide-react'
import { getLenis } from '@/hooks/useLenis'
import { useLanguageStore } from '@/store/useLanguageStore'

/**
 * Notices when someone is blasting through the page and offers them the map.
 *
 * Three rapid bursts of scrolling — each above a velocity threshold, all within
 * a short window — is a fairly reliable "I'm skimming, where is the thing I
 * want" signal. Rather than fight it, the site hands over an outline of the
 * page and lets them jump.
 *
 * Fires at most once per session: an easter egg that repeats stops being one
 * and starts being an interruption.
 */

const BURST_VELOCITY = 2200   // px/s — a deliberate flick, not normal reading
const BURST_WINDOW   = 2600   // ms in which the three bursts must happen
const BURSTS_NEEDED  = 3
const BURST_COOLDOWN = 260    // ms — one flick shouldn't register as several

interface Item { id: string; label: string; top: number }

export default function SpeedReader() {
  const lang = useLanguageStore(s => s.lang)
  const en = lang === 'en'
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const firedRef = useRef(false)
  const burstsRef = useRef<number[]>([])
  const lastBurstRef = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (sessionStorage.getItem('speed-reader-seen')) return

    let lastY = window.scrollY
    let lastT = performance.now()

    function onScroll() {
      const now = performance.now()
      const y = window.scrollY
      const dt = now - lastT
      if (dt < 16) return                       // ignore sub-frame noise

      const velocity = Math.abs(y - lastY) / (dt / 1000)
      lastY = y
      lastT = now

      if (velocity < BURST_VELOCITY) return
      if (now - lastBurstRef.current < BURST_COOLDOWN) return
      lastBurstRef.current = now

      // Keep only bursts inside the rolling window.
      burstsRef.current = [...burstsRef.current, now].filter(t => now - t <= BURST_WINDOW)

      if (burstsRef.current.length >= BURSTS_NEEDED && !firedRef.current) {
        firedRef.current = true
        sessionStorage.setItem('speed-reader-seen', '1')
        setItems(collectSections())
        setOpen(true)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /** Build the outline from the headings actually on the page. */
  function collectSections(): Item[] {
    const out: Item[] = []
    const seen = new Set<string>()

    document.querySelectorAll<HTMLElement>('h1, h2').forEach((h, i) => {
      const text = h.innerText.trim().replace(/\s+/g, ' ')
      if (!text || text.length > 60) return
      const key = text.toLowerCase()
      if (seen.has(key)) return
      seen.add(key)

      // Give it an anchor if it lacks one, so we can scroll back to it.
      if (!h.id) h.id = `sr-sec-${i}`
      out.push({
        id: h.id,
        label: text,
        top: h.getBoundingClientRect().top + window.scrollY,
      })
    })

    return out.slice(0, 8)
  }

  function jumpTo(item: Item) {
    setOpen(false)
    const el = document.getElementById(item.id)
    const lenis = getLenis()
    if (el && lenis) lenis.scrollTo(el, { offset: -100, duration: 1.1 })
    else if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="sr-card"
          role="dialog"
          aria-label={en ? 'Page outline' : 'Resumo da página'}
        >
          <header className="sr-head">
            <div>
              <span className="sr-eyebrow">
                <ArrowDown size={10} />
                {en ? 'in a hurry?' : 'com pressa?'}
              </span>
              <h2 className="sr-title">
                {en ? 'Calm down — there’s a lot here.' : 'Calma, tem bastante coisa aqui.'}
              </h2>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={en ? 'Close' : 'Fechar'}
              className="sr-close"
            >
              <X size={13} />
            </button>
          </header>

          <p className="sr-lede">
            {en
              ? 'Jump straight to whatever you were looking for:'
              : 'Pule direto para o que você estava procurando:'}
          </p>

          <nav className="sr-list">
            {items.map((item, i) => (
              <button key={item.id} onClick={() => jumpTo(item)} className="sr-item">
                <span className="sr-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="sr-label">{item.label}</span>
              </button>
            ))}
          </nav>

          <style>{`
            .sr-card {
              position: fixed;
              right: clamp(1rem, 3vw, 2rem);
              bottom: clamp(1rem, 3vw, 2rem);
              z-index: 450;
              width: min(340px, calc(100vw - 2rem));
              max-height: min(70vh, 560px);
              overflow-y: auto;
              padding: 1.25rem;
              border-radius: 18px;
              border: 1px solid rgba(255,255,255,0.12);
              background: rgba(13,13,13,0.94);
              backdrop-filter: blur(20px);
              box-shadow: 0 24px 70px rgba(0,0,0,0.65);
              scrollbar-width: none;
            }
            .sr-card::-webkit-scrollbar { display: none; }

            .sr-head {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 0.75rem;
            }
            .sr-eyebrow {
              display: inline-flex; align-items: center; gap: 0.35rem;
              font-size: 0.52rem; font-weight: 700;
              letter-spacing: 0.16em; text-transform: uppercase;
              color: rgba(255,255,255,0.28);
            }
            .sr-title {
              margin: 0.5rem 0 0;
              font-family: 'Syne', sans-serif;
              font-weight: 800;
              font-size: 1.02rem;
              letter-spacing: -0.03em;
              line-height: 1.2;
              color: #fff;
            }
            .sr-close {
              width: 24px; height: 24px; flex-shrink: 0;
              display: flex; align-items: center; justify-content: center;
              border-radius: 50%;
              border: 1px solid rgba(255,255,255,0.1);
              background: transparent;
              color: rgba(255,255,255,0.35);
              cursor: pointer; padding: 0;
              transition: color 0.2s, border-color 0.2s;
            }
            .sr-close:hover { color: #fff; border-color: rgba(255,255,255,0.3); }

            .sr-lede {
              margin: 0.75rem 0 0.9rem;
              font-size: 0.72rem;
              line-height: 1.6;
              color: rgba(255,255,255,0.34);
            }

            .sr-list { display: flex; flex-direction: column; gap: 0.15rem; }
            .sr-item {
              display: flex;
              align-items: baseline;
              gap: 0.65rem;
              width: 100%;
              padding: 0.5rem 0.6rem;
              border: 0;
              border-radius: 9px;
              background: transparent;
              text-align: left;
              cursor: pointer;
              font-family: inherit;
              transition: background 0.18s;
            }
            .sr-item:hover { background: rgba(255,255,255,0.05); }
            .sr-num {
              font-family: 'JetBrains Mono', monospace;
              font-size: 0.55rem;
              font-weight: 700;
              color: rgba(255,255,255,0.2);
              flex-shrink: 0;
            }
            .sr-label {
              font-size: 0.78rem;
              color: rgba(255,255,255,0.62);
              line-height: 1.35;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .sr-item:hover .sr-label { color: #fff; }
          `}</style>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
