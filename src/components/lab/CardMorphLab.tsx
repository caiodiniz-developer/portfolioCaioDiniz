import { useState } from 'react'
import { flushSync } from 'react-dom'
import { ArrowLeft } from 'lucide-react'
import { projects } from '@/data/projects'
import { useLanguageStore } from '@/store/useLanguageStore'

/* The card → case study transition, with the routing taken out. A thumbnail
   and the big image in the detail view are two different elements; giving
   them the same view-transition-name tells the browser they are "the same
   thing", and it animates position, size and a crossfade between its
   before/after snapshots. The name is set on the clicked thumbnail only, just
   before the change — a name must be unique on the page at snapshot time. */

const NAME = 'lab-morph'
const ITEMS = projects.filter(p => p.featured).slice(0, 3)

type VTDocument = Document & { startViewTransition?: (cb: () => void) => unknown }

export default function CardMorphLab() {
  const en = useLanguageStore(s => s.lang) === 'en'
  const [open, setOpen] = useState<string | null>(null)
  // Which thumbnail carries the shared name right now (the one clicked, or
  // the one we are returning to).
  const [named, setNamed] = useState<string | null>(null)
  const current = ITEMS.find(p => p.slug === open)

  function go(next: string | null, carry: string) {
    const doc = document as VTDocument
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!doc.startViewTransition || reduced) { setOpen(next); return }
    flushSync(() => setNamed(carry))          // old state: this thumb is named
    doc.startViewTransition(() => flushSync(() => setOpen(next)))
  }

  return (
    <div className="cm-root">
      {current ? (
        <div className="cm-detail">
          <img src={current.image} alt={current.title} style={{ viewTransitionName: NAME }} className="cm-hero" />
          <div className="cm-bar">
            <button onClick={() => go(null, current.slug)} className="cm-back">
              <ArrowLeft size={13} /> {en ? 'Back' : 'Voltar'}
            </button>
            <span className="cm-name">{current.title}</span>
          </div>
        </div>
      ) : (
        <div className="cm-grid">
          {ITEMS.map(p => (
            <button key={p.slug} className="cm-card" onClick={() => go(p.slug, p.slug)} aria-label={`${en ? 'Open' : 'Abrir'} ${p.title}`}>
              <img
                src={p.image}
                alt=""
                style={{ viewTransitionName: named === p.slug ? NAME : undefined }}
              />
              <span>{p.title}</span>
            </button>
          ))}
        </div>
      )}

      <style>{`
        .cm-root { position: absolute; inset: 0; }
        .cm-grid {
          position: absolute; inset: 0;
          display: grid; grid-template-columns: repeat(3, minmax(0,1fr));
          gap: clamp(0.6rem, 2vw, 1.25rem); padding: clamp(1rem, 3vw, 2rem);
          align-items: center;
        }
        .cm-card {
          display: flex; flex-direction: column; gap: 0.6rem;
          padding: 0; border: none; background: none; cursor: pointer; text-align: left;
        }
        .cm-card img {
          width: 100%; aspect-ratio: 4/5; object-fit: cover; object-position: top;
          border-radius: 12px; display: block;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .cm-card:hover img { transform: scale(1.03); }
        .cm-card span {
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.8rem; letter-spacing: -0.02em;
          color: rgba(255,255,255,0.75);
        }
        .cm-detail { position: absolute; inset: 0; }
        .cm-hero { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
        .cm-bar {
          position: absolute; left: 0; right: 0; bottom: 0;
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding: 1rem 1.1rem;
          background: linear-gradient(180deg, transparent, rgba(0,0,0,0.85));
        }
        .cm-back {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.5rem 0.95rem; border-radius: 999px; border: none; cursor: pointer;
          background: #fff; color: #0d0d0d;
          font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
        }
        .cm-name { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.1rem; letter-spacing: -0.03em; color: #fff; }

        ::view-transition-group(${NAME}) {
          animation-duration: 0.6s;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 12px; overflow: hidden;
        }
        ::view-transition-old(${NAME}),
        ::view-transition-new(${NAME}) { width: 100%; height: 100%; object-fit: cover; object-position: top; animation-duration: 0.6s; }
      `}</style>
    </div>
  )
}
