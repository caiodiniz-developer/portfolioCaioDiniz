import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface StrokeDef { d: string; delay: number; dur: number }

const STROKES: StrokeDef[] = [
  { d: 'M 34,17 C 24,11 8,17 8,30 C 8,43 20,51 34,47',                                                                       delay: 0,    dur: 0.28 },
  { d: 'M 34,47 C 36,37 42,33 50,35 C 58,37 58,47 52,51 C 46,55 38,51 36,47 M 58,42 L 58,55',                                delay: 0.12, dur: 0.32 },
  { d: 'M 68,55 L 70,23',                                                                                                     delay: 0.28, dur: 0.12 },
  { d: 'M 77,35 C 70,31 66,40 68,47 C 70,54 76,57 83,55 C 90,53 94,46 92,39 C 90,32 83,29 77,31 C 73,33 75,37 77,35',      delay: 0.34, dur: 0.24 },
  { d: 'M 108,14 L 106,56',                                                                                                   delay: 0.46, dur: 0.18 },
  { d: 'M 106,14 C 124,14 136,22 136,34 C 136,46 124,56 106,56',                                                             delay: 0.52, dur: 0.24 },
  { d: 'M 144,55 L 146,23',                                                                                                   delay: 0.64, dur: 0.12 },
  { d: 'M 152,55 L 154,28 C 158,18 170,20 172,30 L 170,55',                                                                  delay: 0.70, dur: 0.24 },
  { d: 'M 178,55 L 180,23',                                                                                                   delay: 0.82, dur: 0.12 },
  { d: 'M 186,26 L 204,26 L 184,56 L 206,56',                                                                                delay: 0.88, dur: 0.20 },
  { d: 'M 4,63 C 40,72 100,74 175,68 C 190,66 202,62 210,59',                                                               delay: 1.14, dur: 0.38 },
]

const DOTS = [
  { cx: 69,  cy: 15, delay: 0.44 },
  { cx: 145, cy: 15, delay: 0.80 },
  { cx: 179, cy: 15, delay: 0.96 },
]

const TOTAL_DUR = 1.52

export default function SignatureTransition() {
  /* Show only once per browser session — on initial site entry */
  const [show, setShow] = useState(() => !sessionStorage.getItem('sig-entry-shown'))

  useEffect(() => {
    if (!show) return
    sessionStorage.setItem('sig-entry-shown', '1')
    const t = setTimeout(() => setShow(false), (TOTAL_DUR + 0.9) * 1000)
    return () => clearTimeout(t)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="sig-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.4, 0, 1, 1] } }}
          transition={{ duration: 0.12 }}
          style={{
            position:      'fixed', inset: 0, zIndex: 8000,
            display:       'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          {/* Atmospheric vignette */}
          <motion.div
            style={{
              position:   'absolute', inset: 0,
              background: 'radial-gradient(ellipse 110% 80% at 50% 50%, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.78) 100%)',
            }}
          />

          <svg
            viewBox="0 0 218 96"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: 'clamp(220px, 30vw, 400px)', position: 'relative', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="sigGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="rgba(200,210,230,0.75)" />
                <stop offset="45%"  stopColor="rgba(255,255,255,1)"    />
                <stop offset="100%" stopColor="rgba(190,205,225,0.8)"  />
              </linearGradient>
              <linearGradient id="flourishGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="rgba(255,255,255,0.6)" />
                <stop offset="60%"  stopColor="rgba(255,255,255,0.45)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)"    />
              </linearGradient>
              <filter id="sigGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="sigHalo" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur" />
                <feColorMatrix in="blur" type="matrix" values="1 1 1 0 0  1 1 1 0 0  1 1 1 0 0  0 0 0 0.18 0" result="halo" />
                <feMerge><feMergeNode in="halo" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Halo layer */}
            {STROKES.slice(0, -1).map((s, i) => (
              <motion.path key={`halo-${i}`} d={s.d} stroke="rgba(255,255,255,0.12)" strokeWidth={8} filter="url(#sigHalo)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: s.delay, duration: s.dur, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}

            {/* Main strokes */}
            {STROKES.slice(0, -1).map((s, i) => (
              <motion.path key={`stroke-${i}`} d={s.d} stroke="url(#sigGrad)" strokeWidth={1.8} filter="url(#sigGlow)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: s.delay, duration: s.dur, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}

            {/* i-dots */}
            {DOTS.map((dot, i) => (
              <motion.circle key={`dot-${i}`} cx={dot.cx} cy={dot.cy} r={2.4} fill="rgba(255,255,255,0.9)" filter="url(#sigGlow)"
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: dot.delay, duration: 0.15, ease: 'backOut' }}
              />
            ))}

            {/* Flourish */}
            {(() => {
              const f = STROKES[STROKES.length - 1]
              return (
                <motion.path d={f.d} stroke="url(#flourishGrad)" strokeWidth={1.2} filter="url(#sigGlow)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: f.delay, duration: f.dur, ease: [0.4, 0, 0.2, 1] }}
                />
              )
            })()}

            {/* Subtitle */}
            <motion.text x="109" y="88" textAnchor="middle" fontSize="6.5" fontFamily="Inter, sans-serif"
              fontWeight="600" letterSpacing="0.22em" style={{ textTransform: 'uppercase' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.42, duration: 0.45, ease: 'easeOut' }}>
              <tspan fill="rgba(255,255,255,0.3)">FULL STACK DEVELOPER</tspan>
            </motion.text>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
