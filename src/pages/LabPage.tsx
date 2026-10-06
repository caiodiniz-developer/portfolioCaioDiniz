import { useEffect } from 'react'
import type { ComponentType } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { experiments } from '@/data/lab'
import ExperimentFrame from '@/components/lab/ExperimentFrame'
import LiquidMetalLab from '@/components/lab/LiquidMetalLab'
import MagneticFieldLab from '@/components/lab/MagneticFieldLab'
import CircleRevealLab from '@/components/lab/CircleRevealLab'
import CubeLab from '@/components/lab/CubeLab'
import CardMorphLab from '@/components/lab/CardMorphLab'
import ScrollScrubLab from '@/components/lab/ScrollScrubLab'
import { SITE } from '@/lib/constants'
import { useLanguageStore } from '@/store/useLanguageStore'
import { getLenis } from '@/hooks/useLenis'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* id (from src/data/lab.ts) → the component that goes on that experiment's
   stage. An id with no entry here simply isn't rendered. */
const STAGES: Record<string, ComponentType> = {
  'liquid-metal': LiquidMetalLab,
  'magnetic-field': MagneticFieldLab,
  'circle-reveal': CircleRevealLab,
  'css-cube': CubeLab,
  'card-morph': CardMorphLab,
  'scroll-scrub': ScrollScrubLab,
}

export default function LabPage() {
  const en = useLanguageStore(s => s.lang) === 'en'

  useEffect(() => {
    document.title = `${en ? 'Lab' : 'Laboratório'} — ${SITE.name}`
  }, [en])

  const shown = experiments.filter(e => STAGES[e.id])

  /* /lab#css-cube lands on that experiment. The router resets scroll to the
     top on every navigation, so this runs a beat later, once the page
     transition has settled and the layout is final. */
  const { hash } = useLocation()
  function scrollToExperiment(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(el, { offset: -96, duration: 1 })
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  useEffect(() => {
    if (!hash) return
    const t = setTimeout(() => scrollToExperiment(decodeURIComponent(hash.slice(1))), 450)
    return () => clearTimeout(t)
  }, [hash])

  return (
    <main style={{ background: '#0d0d0d', minHeight: '100vh' }}>
      <div
        className="container-custom"
        style={{ paddingTop: 'clamp(7rem,12vw,10rem)', paddingBottom: 'clamp(4rem,8vw,7rem)' }}
      >
        <motion.header
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: E }}
          className="lab-head"
        >
          <span className="lab-eyebrow">
            <span className="lab-eyebrow-line" />
            {en ? 'Lab' : 'Laboratório'}
          </span>
          <h1 className="lab-h1">
            {en ? <>Small things,<br /><span>taken apart.</span></> : <>Coisas pequenas,<br /><span>desmontadas.</span></>}
          </h1>
          <p className="lab-lead">
            {en
              ? 'Each piece below isolates one technique used somewhere on this site. Play with it, read how it works, open the code.'
              : 'Cada peça abaixo isola uma técnica usada em algum lugar deste site. Brinque, leia como funciona, abra o código.'}
          </p>
        </motion.header>

        {/* Index — the page is long; this is the way to one piece. */}
        <nav className="lab-index" aria-label={en ? 'Experiments' : 'Experimentos'}>
          {shown.map((x, i) => (
            <a
              key={x.id}
              href={`#${x.id}`}
              onClick={e => { e.preventDefault(); history.replaceState(null, '', `#${x.id}`); scrollToExperiment(x.id) }}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              {en ? x.titleEn : x.titlePt}
            </a>
          ))}
        </nav>

        <div className="lab-list">
          {shown.map((experiment, i) => {
            const Stage = STAGES[experiment.id]
            return (
              <ExperimentFrame key={experiment.id} experiment={experiment} index={i} en={en}>
                <Stage />
              </ExperimentFrame>
            )
          })}
        </div>
      </div>

      <style>{`
        .lab-head { display: flex; flex-direction: column; gap: 1.5rem; max-width: 46rem; }
        .lab-eyebrow {
          display: inline-flex; align-items: center; gap: 0.75rem;
          font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .lab-eyebrow-line { width: 1.25rem; height: 1px; background: rgba(255,255,255,0.2); }
        .lab-h1 {
          margin: 0; color: #fff;
          font-family: 'Syne', sans-serif; font-weight: 900;
          /* Syne Black is very wide: 'desmontadas.' needs ~8.4vw per em to
             fit a phone, so the floor is lower than the other page titles. */
          font-size: clamp(1.7rem, 8.4vw, 6rem); letter-spacing: -0.055em; line-height: 0.9;
        }
        /* The dimmed second line: 0.4 is the faintest that still clears the
           3:1 contrast floor for large text on this background. */
        .lab-h1 span { color: rgba(255,255,255,0.4); }
        .lab-lead { margin: 0; max-width: 38rem; font-size: 0.95rem; line-height: 1.75; color: rgba(255,255,255,0.55); }

        .lab-index { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: clamp(2rem,4vw,3rem); }
        .lab-index a {
          display: inline-flex; align-items: center; gap: 0.55rem;
          padding: 0.55rem 0.95rem; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 0.74rem; font-weight: 600; color: rgba(255,255,255,0.7);
          text-decoration: none; transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .lab-index a:hover { color: #fff; border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.04); }
        .lab-index span {
          font-family: "JetBrains Mono","Fira Code",ui-monospace,monospace;
          font-size: 0.62rem; color: rgba(255,255,255,0.45);
        }

        .lab-list { margin-top: clamp(2.5rem,5vw,4rem); }
        .lab-item {
          display: grid; gap: 1.75rem;
          padding: clamp(2.5rem,5vw,4rem) 0;
          border-top: 1px solid rgba(255,255,255,0.07);
          scroll-margin-top: 6rem;
        }
        @media (min-width: 960px) {
          .lab-item { grid-template-columns: minmax(0,1fr) minmax(0,1.7fr); gap: clamp(2rem,5vw,4.5rem); align-items: start; }
          .lab-copy { position: sticky; top: 7rem; }
        }

        .lab-num {
          display: block; margin-bottom: 0.9rem;
          font-family: "JetBrains Mono","Fira Code",ui-monospace,monospace;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em;
          color: rgba(255,255,255,0.5);
        }
        .lab-title {
          margin: 0 0 1rem; color: #fff;
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(1.6rem,3vw,2.4rem); letter-spacing: -0.04em; line-height: 1.05;
        }
        .lab-note { margin: 0 0 1.25rem; font-size: 0.92rem; line-height: 1.8; color: rgba(255,255,255,0.58); max-width: 42ch; }
        .lab-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; list-style: none; margin: 0 0 1.5rem; padding: 0; }
        .lab-tags li {
          padding: 0.3rem 0.7rem; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 0.58rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }
        .lab-source {
          display: inline-flex; align-items: center; gap: 0.35rem;
          font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.6); text-decoration: none; transition: color 0.2s;
        }
        .lab-source:hover { color: #fff; }
        .lab-copy-link { margin-left: 1.25rem; padding: 0; border: none; background: none; cursor: pointer; font-family: inherit; }

        .lab-stage-wrap { min-width: 0; }
        .lab-stage {
          position: relative; overflow: hidden;
          /* Tall enough on phones that an experiment with a control panel
             (liquid metal) still has room for the thing being controlled. */
          min-height: clamp(380px, 42vw, 440px);
          border-radius: clamp(14px,2vw,20px);
          border: 1px solid rgba(255,255,255,0.08);
          background: #0a0a0a;
          display: flex; align-items: center; justify-content: center;
        }
        .lab-hint {
          margin: 0.8rem 0 0;
          font-size: 0.62rem; letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }
      `}</style>
    </main>
  )
}
