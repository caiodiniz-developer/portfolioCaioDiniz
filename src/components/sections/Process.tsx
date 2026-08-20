import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useLanguageStore } from '@/store/useLanguageStore'
import { processSteps } from '@/data/process'
import { useCursorStore } from '@/store/useCursorStore'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]
const STEP = 360 / processSteps.length     // degrees between cards on the ring

/* Line-art marks, one per stage. */
const STEP_ICONS = [
  <svg viewBox="0 0 28 28" fill="none" width="22" height="22" key="i0">
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
    <line x1="18" y1="18" x2="24" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  <svg viewBox="0 0 28 28" fill="none" width="22" height="22" key="i1">
    <rect x="3" y="3" width="22" height="22" rx="3" stroke="currentColor" strokeWidth="1.4" />
    <line x1="3" y1="11" x2="25" y2="11" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <line x1="11" y1="3" x2="11" y2="25" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.35" />
  </svg>,
  <svg viewBox="0 0 28 28" fill="none" width="22" height="22" key="i2">
    <path d="M5 23 L9 19 L19 9 L23 5 L19 9 L9 19 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M5 23 L3 25 L7 25 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <circle cx="20" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4" />
  </svg>,
  <svg viewBox="0 0 28 28" fill="none" width="22" height="22" key="i3">
    <path d="M9 8 L4 14 L9 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 8 L24 14 L19 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="16" y1="6" x2="12" y2="22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
  </svg>,
  <svg viewBox="0 0 28 28" fill="none" width="22" height="22" key="i4">
    <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.4" />
    <path d="M8 14 L12 18 L20 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg viewBox="0 0 28 28" fill="none" width="22" height="22" key="i5">
    <path d="M14 4 C14 4 20 8 20 16 L14 24 L8 16 C8 8 14 4 14 4Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <circle cx="14" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M9 19 L5 23" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M19 19 L23 23" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>,
]

export default function Process() {
  const lang      = useLanguageStore((s) => s.lang)
  const en        = lang === 'en'
  const setCursor = useCursorStore((s) => s.setState)
  const reduced   = usePrefersReducedMotion()

  const [active, setActive] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const ringRef    = useRef<HTMLDivElement>(null)
  /* Rotation lives in a ref, not state: it is written every scroll frame and
     re-rendering React at that rate would be the whole frame budget. */
  const rotRef     = useRef(0)
  /* Mirrors `active` for the scroll handler, which must read the current index
     without the effect depending on it (see the ScrollTrigger note below). */
  const activeRef  = useRef(0)

  const rotateTo = useCallback((index: number) => {
    setActive(index)
    activeRef.current = index
    rotRef.current = -index * STEP
    if (!ringRef.current) return
    gsap.to(ringRef.current, {
      rotateY: -index * STEP,
      duration: 0.9,
      ease: 'power3.out',
      overwrite: true,
    })
  }, [])

  /* Scroll drives the ring: as the section travels through the viewport the
     carousel advances one stage at a time. No pinning — pinning this section
     fought with Lenis and made the whole page feel sticky.

     The trigger is created ONCE. An earlier version listed `active` as a
     dependency, which tore down and rebuilt the trigger on every change —
     rebuilding fires onUpdate immediately, so a click was instantly overwritten
     by whatever the scroll position implied. The current index lives in a ref
     so the effect never needs to re-run. */
  useEffect(() => {
    if (!sectionRef.current || reduced) return

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 70%',
      end: 'bottom 60%',
      scrub: 1,
      onUpdate: (self) => {
        const idx = Math.min(
          processSteps.length - 1,
          Math.floor(self.progress * processSteps.length)
        )
        if (idx === activeRef.current) return
        activeRef.current = idx
        setActive(idx)
        rotRef.current = -idx * STEP
        if (ringRef.current) {
          gsap.to(ringRef.current, {
            rotateY: -idx * STEP,
            duration: 0.7,
            ease: 'power3.out',
            overwrite: true,
          })
        }
      },
    })

    return () => st.kill()
  }, [reduced])

  const step = processSteps[active]

  return (
    <section
      ref={sectionRef}
      className="section-padding"
      style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}
    >
      <div className="container-custom">

        {/* ── Header ── */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: E }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.22)' }}>04</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontFamily: 'monospace', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
              {en ? 'process' : 'processo'}
            </span>
          </div>

          <h2
            className="font-black text-white"
            style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.04em', lineHeight: 0.95 }}
          >
            {en ? 'From idea to product' : 'Da ideia ao produto'}
          </h2>
          <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.28)', maxWidth: '44ch', lineHeight: 1.7 }}>
            {en
              ? 'Six stages, in order. Scroll to move through them — or pick one.'
              : 'Seis etapas, em ordem. Role para avançar — ou escolha uma.'}
          </p>
        </motion.div>

        {/* ── Stage detail + 3D ring ── */}
        <div className="pr-layout">

          {/* LEFT — the active stage */}
          <div className="pr-detail">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: E }}
              >
                <span className="pr-index">
                  {String(active + 1).padStart(2, '0')}
                  <span className="pr-total">/{String(processSteps.length).padStart(2, '0')}</span>
                </span>

                <h3 className="pr-title">{en ? step.titleEn : step.titlePt}</h3>

                <p className="pr-desc">
                  {en ? step.descriptionEn : step.descriptionPt}
                </p>

                <span className="pr-duration">{step.duration}</span>
              </motion.div>
            </AnimatePresence>

            {/* Progress rail */}
            <div className="pr-rail">
              {processSteps.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => rotateTo(i)}
                  aria-label={en ? s.titleEn : s.titlePt}
                  className={`pr-tick ${i === active ? 'is-on' : ''}`}
                  onMouseEnter={() => setCursor('pointer')}
                  onMouseLeave={() => setCursor('default')}
                />
              ))}
            </div>
          </div>

          {/* RIGHT — the ring, in real 3D space */}
          <div className="pr-stage">
            <div className="pr-ring" ref={ringRef}>
              {processSteps.map((s, i) => {
                const isOn = i === active
                return (
                  <button
                    key={s.id}
                    className={`pr-card ${isOn ? 'is-on' : ''}`}
                    style={{ transform: `rotateY(${i * STEP}deg) translateZ(var(--pr-radius))` }}
                    onClick={() => rotateTo(i)}
                    onMouseEnter={() => setCursor('pointer')}
                    onMouseLeave={() => setCursor('default')}
                  >
                    <span className="pr-card-icon">{STEP_ICONS[i]}</span>
                    <span className="pr-card-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="pr-card-title">{en ? s.titleEn : s.titlePt}</span>
                  </button>
                )
              })}
            </div>

            {/* Floor reflection — sells the depth without another light source */}
            <div className="pr-floor" />
          </div>
        </div>
      </div>

      <style>{`
        .pr-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2.5rem, 6vw, 5rem);
          align-items: center;
        }
        @media (min-width: 940px) {
          .pr-layout { grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); }
        }

        /* ── Detail panel ── */
        .pr-detail { min-width: 0; }
        .pr-index {
          display: block;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2.6rem, 6vw, 4.5rem);
          letter-spacing: -0.05em;
          line-height: 1;
          color: #fff;
          font-variant-numeric: tabular-nums;
        }
        .pr-total {
          font-size: 0.28em;
          color: rgba(255,255,255,0.2);
          margin-left: 0.35em;
          letter-spacing: 0;
        }
        .pr-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(1.4rem, 3vw, 2.2rem);
          letter-spacing: -0.035em;
          color: #fff;
          margin: 0.9rem 0 0.75rem;
          line-height: 1.1;
        }
        .pr-desc {
          font-size: 0.88rem;
          line-height: 1.75;
          color: rgba(255,255,255,0.36);
          margin: 0;
          max-width: 42ch;
          min-height: 5.2em;   /* stops the rail jumping between stages */
        }
        .pr-duration {
          display: inline-block;
          margin-top: 1.1rem;
          padding: 0.35rem 0.85rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.09);
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }

        .pr-rail {
          display: flex;
          gap: 0.4rem;
          margin-top: clamp(1.75rem, 3vw, 2.5rem);
        }
        .pr-tick {
          flex: 1;
          height: 2px;
          border: 0;
          padding: 0;
          background: rgba(255,255,255,0.09);
          cursor: pointer;
          transition: background 0.35s ease, transform 0.35s ease;
          transform-origin: center;
        }
        .pr-tick:hover { background: rgba(255,255,255,0.3); }
        .pr-tick.is-on { background: #fff; transform: scaleY(2.5); }

        /* ── 3D stage ──
           perspective on the parent + preserve-3d on the ring is what makes the
           cards genuinely occupy depth rather than being a fake 2D fan. */
        .pr-stage {
          position: relative;
          height: clamp(300px, 42vw, 420px);
          perspective: 1100px;
          perspective-origin: 50% 45%;
        }
        .pr-ring {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          transform: rotateY(0deg);
          will-change: transform;
        }

        .pr-card {
          --pr-radius: 300px;
          position: absolute;
          top: 50%;
          left: 50%;
          width: 190px;
          height: 210px;
          margin: -105px 0 0 -95px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 1.25rem;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.16);
          background: linear-gradient(160deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03));
          color: rgba(255,255,255,0.62);
          font-family: inherit;
          cursor: pointer;
          transition: border-color 0.4s ease, background 0.4s ease, color 0.4s ease, box-shadow 0.4s ease;
          /* Cards on the far side of the ring stay visible but recede */
          backface-visibility: hidden;
        }
        .pr-card.is-on {
          border-color: rgba(255,255,255,0.6);
          background: linear-gradient(160deg, rgba(255,255,255,0.2), rgba(255,255,255,0.06));
          color: #fff;
          box-shadow: 0 30px 70px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06);
        }

        .pr-card-icon { color: inherit; opacity: 0.9; }
        .pr-card-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          opacity: 0.45;
        }
        .pr-card-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1rem;
          letter-spacing: -0.02em;
          line-height: 1.15;
          text-align: left;
        }

        .pr-floor {
          position: absolute;
          left: 50%;
          bottom: -6%;
          width: min(520px, 90%);
          height: 90px;
          transform: translateX(-50%);
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.07), transparent 68%);
          filter: blur(14px);
          pointer-events: none;
        }

        @media (max-width: 620px) {
          .pr-card { --pr-radius: 220px; width: 150px; height: 175px; margin: -87px 0 0 -75px; padding: 1rem; }
          .pr-card-title { font-size: 0.85rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pr-ring { transition: none; }
          .pr-card { transition: none; }
        }
      `}</style>
    </section>
  )
}
