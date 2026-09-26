import { useState } from 'react'
import { useLanguageStore } from '@/store/useLanguageStore'

/* Drag to compare the product before and after the rebuild.
 *
 * The control is a native range input stretched invisibly over the images,
 * so mouse, touch and keyboard (arrow keys) all work and screen readers
 * announce it as a slider — the handle is purely visual. */
export default function BeforeAfter({ before, after, title }: { before: string; after: string; title: string }) {
  const en = useLanguageStore(s => s.lang) === 'en'
  const [pos, setPos] = useState(50)

  return (
    <section className="ba-wrap">
      <h2 className="pd-label">{en ? 'Before → after' : 'Antes → depois'}</h2>

      <div className="ba-frame">
        <img src={after} alt={`${title} — ${en ? 'after' : 'depois'}`} className="ba-img" />
        <img
          src={before}
          alt={`${title} — ${en ? 'before' : 'antes'}`}
          className="ba-img"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />

        <span className="ba-tag" style={{ left: 12 }}>{en ? 'Before' : 'Antes'}</span>
        <span className="ba-tag" style={{ right: 12 }}>{en ? 'After' : 'Depois'}</span>

        <div className="ba-handle" style={{ left: `${pos}%` }} aria-hidden>
          <span className="ba-knob">‹ ›</span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={e => setPos(Number(e.target.value))}
          aria-label={en ? 'Compare before and after' : 'Comparar antes e depois'}
          className="ba-range"
        />
      </div>

      <style>{`
        .ba-wrap {
          padding-top: clamp(1.5rem,3vw,2.25rem);
          margin-bottom: clamp(2.5rem,5vw,4rem);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .ba-frame {
          position: relative; overflow: hidden;
          aspect-ratio: 16/9;
          border-radius: clamp(12px,2vw,16px);
          border: 1px solid rgba(255,255,255,0.08);
          background: #0b0b0b;
          user-select: none;
        }
        .ba-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; object-position: top; display: block;
          pointer-events: none;
        }
        .ba-tag {
          position: absolute; top: 12px; z-index: 2;
          padding: 0.3rem 0.65rem; border-radius: 999px;
          background: rgba(0,0,0,0.7); color: #fff;
          font-size: 0.58rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
          pointer-events: none;
        }
        .ba-handle {
          position: absolute; top: 0; bottom: 0; width: 2px; z-index: 2;
          background: #fff; transform: translateX(-1px);
          box-shadow: 0 0 12px rgba(0,0,0,0.6);
          pointer-events: none;
        }
        .ba-knob {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          width: 38px; height: 38px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: #fff; color: #0d0d0d;
          font-size: 0.8rem; font-weight: 800; letter-spacing: 0.1em;
          box-shadow: 0 6px 20px rgba(0,0,0,0.5);
        }
        .ba-range {
          position: absolute; inset: 0; z-index: 3;
          width: 100%; height: 100%; margin: 0;
          opacity: 0; cursor: ew-resize;
        }
        .ba-range:focus-visible + * , .ba-frame:focus-within .ba-knob {
          outline: 2px solid #4ade80; outline-offset: 3px;
        }
      `}</style>
    </section>
  )
}
