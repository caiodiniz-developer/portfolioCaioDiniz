import { useEffect, useRef } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { useLanguageStore } from '@/store/useLanguageStore'

/* A cube with no WebGL: six absolutely-positioned faces, each rotated onto
   its side and pushed out by half the edge with translateZ, inside a parent
   with transform-style: preserve-3d. Dragging only changes two numbers (the
   X and Y angles); on release the last drag velocity keeps turning it and
   decays every frame, which is the inertia. */

const FACES = [
  { label: 'React',      t: 'rotateY(0deg)' },
  { label: 'TypeScript', t: 'rotateY(90deg)' },
  { label: 'Node.js',    t: 'rotateY(180deg)' },
  { label: 'GSAP',       t: 'rotateY(-90deg)' },
  { label: 'Three.js',   t: 'rotateX(90deg)' },
  { label: 'Postgres',   t: 'rotateX(-90deg)' },
]

const FRICTION = 0.95
const IDLE_SPIN = 0.12 // deg per frame when nobody is touching it

export default function CubeLab() {
  const en = useLanguageStore(s => s.lang) === 'en'
  const cubeRef = useRef<HTMLDivElement>(null)
  const state = useRef({ rx: -22, ry: 32, vx: 0, vy: IDLE_SPIN, dragging: false, lastX: 0, lastY: 0 })

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const tick = () => {
      const s = state.current
      if (!s.dragging) {
        s.rx += s.vx; s.ry += s.vy
        s.vx *= FRICTION
        // Decay toward the idle spin rather than to a dead stop.
        s.vy = reduced ? s.vy * FRICTION : IDLE_SPIN + (s.vy - IDLE_SPIN) * FRICTION
      }
      s.rx = Math.max(-80, Math.min(80, s.rx))
      if (cubeRef.current) cubeRef.current.style.transform = `rotateX(${s.rx}deg) rotateY(${s.ry}deg)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  function onKeyDown(e: ReactKeyboardEvent) {
    const s = state.current
    const step = 4
    if (e.key === 'ArrowLeft') s.vy = -step
    else if (e.key === 'ArrowRight') s.vy = step
    else if (e.key === 'ArrowUp') s.vx = step
    else if (e.key === 'ArrowDown') s.vx = -step
    else return
    e.preventDefault()
  }

  return (
    <div
      className="cube-scene"
      tabIndex={0}
      role="application"
      aria-label={en ? 'Rotatable cube. Use the arrow keys to turn it.' : 'Cubo giratório. Use as setas para girar.'}
      onKeyDown={onKeyDown}
      onPointerDown={e => {
        const s = state.current
        s.dragging = true; s.lastX = e.clientX; s.lastY = e.clientY; s.vx = s.vy = 0
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerMove={e => {
        const s = state.current
        if (!s.dragging) return
        const dx = e.clientX - s.lastX, dy = e.clientY - s.lastY
        s.lastX = e.clientX; s.lastY = e.clientY
        s.vy = dx * 0.45; s.vx = -dy * 0.45
        s.ry += s.vy; s.rx += s.vx
      }}
      onPointerUp={() => { state.current.dragging = false }}
      onPointerCancel={() => { state.current.dragging = false }}
    >
      <div ref={cubeRef} className="cube">
        {FACES.map(f => (
          <div key={f.label} className="cube-face" style={{ transform: `${f.t} translateZ(var(--half))` }}>
            {f.label}
          </div>
        ))}
      </div>

      <style>{`
        .cube-scene {
          --edge: clamp(130px, 22vw, 190px);
          --half: calc(var(--edge) / 2);
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          perspective: 900px;
          cursor: grab; touch-action: none; outline-offset: -4px;
        }
        .cube-scene:active { cursor: grabbing; }
        .cube { position: relative; width: var(--edge); height: var(--edge); transform-style: preserve-3d; will-change: transform; }
        .cube-face {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.28);
          background: #151515;
          color: #fff; font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(0.85rem, 2vw, 1.15rem); letter-spacing: -0.02em;
          /* Solid faces, backs culled: only the three facing you are drawn,
             so no mirrored labels show through. */
          user-select: none; backface-visibility: hidden;
        }
      `}</style>
    </div>
  )
}
