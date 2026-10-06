import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useLanguageStore } from '@/store/useLanguageStore'

/* The light/dark switch of this site, in a box. Two copies of the same
   content are stacked, one per theme. A click puts the other theme on top,
   clipped to a zero-radius circle at the click point, and grows that circle
   until it covers the farthest corner — then the layers swap roles. The real
   switch does the same thing with the View Transitions API, where the two
   "copies" are the browser's before/after snapshots of the whole page. */

type Theme = 'dark' | 'light'

function Mock({ theme, en }: { theme: Theme; en: boolean }) {
  const dark = theme === 'dark'
  const fg = dark ? '#fff' : '#0d0d0d'
  const sub = dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.6)'
  const line = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'
  return (
    <div style={{ position: 'absolute', inset: 0, background: dark ? '#0d0d0d' : '#f2f2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: 'min(100%, 340px)', padding: '1.6rem', borderRadius: 18, border: `1px solid ${line}`, background: dark ? 'rgba(255,255,255,0.03)' : '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.1rem' }}>
          <span style={{ width: 34, height: 34, borderRadius: '50%', background: fg }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 8, width: '55%', borderRadius: 4, background: fg, opacity: 0.85 }} />
            <div style={{ height: 6, width: '35%', borderRadius: 4, background: fg, opacity: 0.3, marginTop: 7 }} />
          </div>
        </div>
        <p style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.04em', color: fg }}>
          {dark ? (en ? 'Dark.' : 'Escuro.') : (en ? 'Light.' : 'Claro.')}
        </p>
        <p style={{ margin: '0.5rem 0 1.2rem', fontSize: '0.8rem', lineHeight: 1.6, color: sub }}>
          {en ? 'Click anywhere. The other theme starts where you clicked.' : 'Clique em qualquer lugar. O outro tema nasce onde você clicou.'}
        </p>
        <span style={{ display: 'inline-block', padding: '0.55rem 1.1rem', borderRadius: 999, background: fg, color: dark ? '#0d0d0d' : '#fff', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {en ? 'Button' : 'Botão'}
        </span>
      </div>
    </div>
  )
}

export default function CircleRevealLab() {
  const en = useLanguageStore(s => s.lang) === 'en'
  const [base, setBase] = useState<Theme>('dark')
  const [next, setNext] = useState<Theme | null>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const busy = useRef(false)

  function reveal(x: number, y: number, w: number, h: number) {
    if (busy.current) return
    busy.current = true
    const target: Theme = base === 'dark' ? 'light' : 'dark'
    setNext(target)

    // Wait a frame for the top layer to mount, then grow the circle.
    requestAnimationFrame(() => {
      const el = topRef.current
      const r = Math.hypot(Math.max(x, w - x), Math.max(y, h - y))
      const done = () => { setBase(target); setNext(null); busy.current = false }
      if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { done(); return }
      el.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        // fill: forwards — otherwise the layer snaps back to radius 0 for the
        // frame between the animation ending and React swapping the layers.
        { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' },
      ).finished.then(done, done)
    })
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    reveal(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={en ? 'Switch theme with a circular reveal' : 'Trocar o tema com revelação circular'}
      onPointerDown={onPointerDown}
      onKeyDown={e => {
        if (e.key !== 'Enter' && e.key !== ' ') return
        e.preventDefault()
        const rect = e.currentTarget.getBoundingClientRect()
        reveal(rect.width / 2, rect.height / 2, rect.width, rect.height)
      }}
      data-no-invert
      style={{ position: 'absolute', inset: 0, cursor: 'pointer', outlineOffset: -4 }}
    >
      <Mock theme={base} en={en} />
      {next && (
        <div ref={topRef} style={{ position: 'absolute', inset: 0, clipPath: 'circle(0px at 50% 50%)' }}>
          <Mock theme={next} en={en} />
        </div>
      )}
    </div>
  )
}
