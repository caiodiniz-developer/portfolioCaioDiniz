import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguageStore } from '@/store/useLanguageStore'
import { processSteps } from '@/data/process'
import { useCursorStore } from '@/store/useCursorStore'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* Small SVG icons per step — drawn with stroke */
const STEP_ICONS = [
  /* 1 — Discovery: chat bubble */
  <svg viewBox="0 0 28 28" fill="none" width="20" height="20">
    <rect x="3" y="3" width="20" height="15" rx="4" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 22 L6 25 L14 22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="7" y1="9"  x2="19" y2="9"  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="7" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>,
  /* 2 — Planning: grid/blueprint */
  <svg viewBox="0 0 28 28" fill="none" width="20" height="20">
    <rect x="3" y="3" width="22" height="22" rx="3" stroke="currentColor" strokeWidth="1.4"/>
    <line x1="3" y1="11" x2="25" y2="11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    <line x1="3" y1="19" x2="25" y2="19" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    <line x1="11" y1="3" x2="11" y2="25" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    <line x1="19" y1="3" x2="19" y2="25" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    <rect x="6" y="6" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.4"/>
  </svg>,
  /* 3 — Design: pen tool */
  <svg viewBox="0 0 28 28" fill="none" width="20" height="20">
    <path d="M5 23 L9 19 L19 9 L23 5 L19 9 L9 19 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M5 23 L3 25 L7 25 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <circle cx="20" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
  </svg>,
  /* 4 — Development: code */
  <svg viewBox="0 0 28 28" fill="none" width="20" height="20">
    <path d="M9 8 L4 14 L9 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 8 L24 14 L19 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="6" x2="12" y2="22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
  </svg>,
  /* 5 — Testing: checkmark circle */
  <svg viewBox="0 0 28 28" fill="none" width="20" height="20">
    <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 14 L12 18 L20 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  /* 6 — Launch: rocket */
  <svg viewBox="0 0 28 28" fill="none" width="20" height="20">
    <path d="M14 4 C14 4 20 8 20 16 L14 24 L8 16 C8 8 14 4 14 4Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <circle cx="14" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M9 19 L5 23" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M19 19 L23 23" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>,
]

export default function Process() {
  const lang      = useLanguageStore((s) => s.lang)
  const setCursor = useCursorStore((s) => s.setState)
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      className="section-padding"
      style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="container-custom">

        {/* ── Header ── */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: E }}
        >
          {/* Section marker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.22)' }}>04</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontFamily: 'monospace', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
              {lang === 'en' ? 'process' : 'processo'}
            </span>
          </div>

          <div className="flex items-end justify-between gap-8">
            <h2
              className="font-black text-white"
              style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.04em', lineHeight: '0.95' }}
            >
              {lang === 'en' ? 'From idea to product' : 'Da ideia ao produto'}
            </h2>

            <p
              className="hidden lg:block text-right leading-relaxed"
              style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)', maxWidth: '32ch' }}
            >
              {lang === 'en'
                ? 'A clear process that keeps every project on track, on budget and on time.'
                : 'Um processo claro que mantém cada projeto no prazo e dentro do escopo.'}
            </p>
          </div>
        </motion.div>

        {/* ── Steps ── */}
        <div>
          {processSteps.map((step, i) => {
            const title  = lang === 'en' ? step.titleEn       : step.titlePt
            const desc   = lang === 'en' ? step.descriptionEn : step.descriptionPt
            const isOpen = open === step.id

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: E }}
              >
                {/* Divider line */}
                <motion.div
                  style={{ height: 1, background: 'rgba(255,255,255,0.07)', transformOrigin: 'left' }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.07, ease: E }}
                />

                <button
                  className="w-full text-left group"
                  style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                  onClick={() => setOpen(isOpen ? null : step.id)}
                  onMouseEnter={() => setCursor('pointer')}
                  onMouseLeave={() => setCursor('default')}
                >
                  <div className="grid items-start gap-4 py-5"
                    style={{ gridTemplateColumns: '2rem 1.5rem 1fr auto' }}>

                    {/* Number */}
                    <span
                      className="font-black tabular-nums mt-0.5"
                      style={{
                        fontSize: '0.62rem', letterSpacing: '0.1em',
                        color: isOpen ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)',
                        transition: 'color 0.3s',
                        fontFamily: 'monospace',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Icon */}
                    <span
                      style={{
                        color: isOpen ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)',
                        transition: 'color 0.3s',
                        marginTop: 1,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {STEP_ICONS[i] ?? STEP_ICONS[0]}
                    </span>

                    {/* Title + expandable description */}
                    <div className="flex flex-col">
                      <h3
                        className="font-black text-white transition-colors duration-300"
                        style={{
                          fontFamily: 'Syne, sans-serif',
                          fontSize: 'clamp(1.1rem, 2vw, 1.55rem)',
                          letterSpacing: '-0.025em',
                          lineHeight: '1.1',
                          color: isOpen ? '#ffffff' : 'rgba(255,255,255,0.75)',
                          transition: 'color 0.3s',
                        }}
                      >
                        {title}
                      </h3>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.38, ease: E }}
                            style={{ overflow: 'hidden' }}
                          >
                            <p className="text-sm leading-relaxed max-w-lg mt-4 pb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                              {desc}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Duration + toggle */}
                    <div className="flex items-center gap-4 mt-0.5 flex-shrink-0">
                      <span
                        className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] transition-colors duration-300"
                        style={{ color: isOpen ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.16)' }}
                      >
                        {step.duration}
                      </span>

                      {/* Animated plus/minus */}
                      <div
                        style={{
                          width: 20, height: 20,
                          borderRadius: '50%',
                          border: `1px solid ${isOpen ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'border-color 0.3s',
                        }}
                      >
                        <motion.div
                          style={{ position: 'relative', width: 8, height: 8 }}
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.3, ease: E }}
                        >
                          <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: isOpen ? '#ffffff' : 'rgba(255,255,255,0.4)', transform: 'translateY(-50%)' }} />
                          <span style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: isOpen ? '#ffffff' : 'rgba(255,255,255,0.4)', transform: 'translateX(-50%)' }} />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            )
          })}

          {/* Final divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </div>
      </div>
    </section>
  )
}
