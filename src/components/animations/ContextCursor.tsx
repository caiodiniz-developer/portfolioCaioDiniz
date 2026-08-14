import { useEffect, useRef, useState } from 'react'

/**
 * A cursor that tells you where you are.
 *
 * Deliberately NOT the old full-time follower blob:
 *  - it only appears over elements that declare `data-cursor`, so most of the
 *    site keeps the plain system cursor;
 *  - the native pointer is hidden only inside those zones, never globally, so
 *    the page never feels broken if this component fails;
 *  - position is written as CSS custom properties consumed by a `transform`,
 *    which stays on the compositor — `left`/`top` would force layout on every
 *    mouse move, which is the exact mistake that made the previous cursor
 *    stall the whole scroll pipeline.
 *
 * Usage: add `data-cursor="view" | "code" | "write" | "drag" | "open"` to any
 * element. Nested declarations resolve to the nearest one via `closest()`,
 * which is O(depth) — no DOM scanning per event.
 */

type CursorKind = 'view' | 'code' | 'write' | 'drag' | 'open'

const LABELS: Record<CursorKind, { pt: string; en: string } | null> = {
  view:  { pt: 'ver',    en: 'view' },
  open:  { pt: 'abrir',  en: 'open' },
  drag:  { pt: 'arraste', en: 'drag' },
  code:  null,
  write: null,
}

function Icon({ kind }: { kind: CursorKind }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (kind) {
    case 'view':
      return (
        <svg viewBox="0 0 24 24" width="17" height="17" {...common}>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <line x1="15.5" y1="15.5" x2="21" y2="21" />
          <line x1="7.6" y1="10.5" x2="13.4" y2="10.5" />
          <line x1="10.5" y1="7.6" x2="10.5" y2="13.4" />
        </svg>
      )
    case 'open':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" {...common}>
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="8 7 17 7 17 16" />
        </svg>
      )
    case 'write':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" {...common}>
          <path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 013 3L8 19l-4 1z" />
          <line x1="14.5" y1="6.5" x2="17.5" y2="9.5" />
        </svg>
      )
    case 'drag':
      return (
        <svg viewBox="0 0 24 24" width="17" height="17" {...common}>
          <polyline points="7 9 4 12 7 15" />
          <polyline points="17 9 20 12 17 15" />
          <line x1="4.5" y1="12" x2="19.5" y2="12" />
        </svg>
      )
    case 'code':
      // Text caret — the only one that animates, via CSS.
      return <span className="cc-caret" />
  }
}

export default function ContextCursor() {
  const [kind, setKind] = useState<CursorKind | null>(null)
  const [lang, setLang] = useState<'pt' | 'en'>('pt')
  const elRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Touch devices have no hover; a follower there is meaningless.
    if (window.matchMedia('(hover: none)').matches) return

    // Read the language off the store's persisted value without subscribing —
    // this component must not re-render on unrelated state changes.
    try {
      const raw = localStorage.getItem('language-storage')
      if (raw && /"lang":"en"/.test(raw)) setLang('en')
    } catch { /* storage unavailable — default stays */ }

    function onMove(e: MouseEvent) {
      const el = elRef.current
      if (el) {
        el.style.setProperty('--cx', `${e.clientX}px`)
        el.style.setProperty('--cy', `${e.clientY}px`)
      }

      const target = e.target as Element | null

      /* Inside a real text field the browser's I-beam is the right cursor and
         carries meaning (selection, position). Stand down there. */
      if (target?.closest?.('input, textarea, select, [contenteditable="true"]')) {
        setKind(prev => (prev === null ? prev : null))
        return
      }

      const zone = target?.closest?.('[data-cursor]')
      const next = (zone?.getAttribute('data-cursor') as CursorKind | undefined) ?? null
      setKind(prev => (prev === next ? prev : next))
    }

    function onLeave() { setKind(null) }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  const label = kind ? LABELS[kind] : null

  return (
    <div ref={elRef} className={`cc-root ${kind ? 'is-on' : ''}`} aria-hidden>
      {kind && (
        <div className={`cc-pill cc-${kind}`}>
          <Icon kind={kind} />
          {label && <span className="cc-label">{lang === 'en' ? label.en : label.pt}</span>}
        </div>
      )}

      <style>{`
        /* Hide the system pointer ONLY inside declared zones — and never over a
           form control, where the native I-beam still does a job. */
        [data-cursor],
        [data-cursor] * { cursor: none; }
        [data-cursor] input,
        [data-cursor] textarea,
        [data-cursor] select,
        [data-cursor] [contenteditable="true"] { cursor: text; }

        .cc-root {
          position: fixed;
          top: 0; left: 0;
          --cx: 50vw;
          --cy: 50vh;
          transform: translate3d(var(--cx), var(--cy), 0);
          pointer-events: none;
          z-index: 100000;
          will-change: transform;
        }

        .cc-pill {
          position: absolute;
          top: 0; left: 0;
          transform: translate(-50%, -50%) scale(0.7);
          opacity: 0;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.42rem 0.55rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(12,12,12,0.82);
          backdrop-filter: blur(10px);
          color: #fff;
          white-space: nowrap;
          box-shadow: 0 6px 24px rgba(0,0,0,0.45);
          animation: cc-in 0.24s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .cc-pill:has(.cc-label) { padding-right: 0.8rem; }

        @keyframes cc-in {
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }

        .cc-label {
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
        }

        /* The caret is its own shape — no pill chrome around it. */
        .cc-code {
          padding: 0;
          border: 0;
          background: transparent;
          backdrop-filter: none;
          box-shadow: none;
        }
        .cc-caret {
          display: block;
          width: 2px;
          height: 22px;
          background: #fff;
          border-radius: 1px;
          animation: cc-blink 1.05s step-end infinite;
        }
        @keyframes cc-blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }

        @media (prefers-reduced-motion: reduce) {
          .cc-pill  { animation: none; opacity: 1; transform: translate(-50%,-50%); }
          .cc-caret { animation: none; }
        }
      `}</style>
    </div>
  )
}
