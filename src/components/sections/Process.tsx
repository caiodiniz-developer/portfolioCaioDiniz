import { useRef, useEffect, useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useLanguageStore } from '@/store/useLanguageStore'
import { processSteps } from '@/data/process'
import { useCursorStore } from '@/store/useCursorStore'

gsap.registerPlugin(ScrollTrigger)

export default function Process() {
  const lang      = useLanguageStore((s) => s.lang)
  const setCursor = useCursorStore((s) => s.setState)
  const ref       = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.prc-header', { y: 28, opacity: 0 })
      gsap.set('.prc-row',    { y: 22, opacity: 0 })

      gsap.to('.prc-header', {
        y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.prc-header', start: 'top 78%', once: true },
      })
      gsap.to('.prc-row', {
        y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.08,
        scrollTrigger: { trigger: ref.current!, start: 'top 70%', once: true },
      })

      const lines = ref.current!.querySelectorAll<HTMLElement>('.prc-line')
      lines.forEach((line) => {
        gsap.set(line, { scaleX: 0, transformOrigin: 'left' })
        gsap.to(line, {
          scaleX: 1,
          duration: 0.7,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: line, start: 'top 85%', once: true },
        })
      })

      const numEls = ref.current!.querySelectorAll<HTMLElement>('.prc-num')
      numEls.forEach((el, i) => {
        const target = i + 1
        const obj = { val: 0 }
        gsap.to(obj, {
          val: target,
          duration: 0.8,
          ease: 'power2.out',
          onUpdate() {
            el.textContent = String(Math.round(obj.val)).padStart(2, '0')
          },
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
      })
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={ref}
      className="section-padding"
      style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="container-custom">
        {/* Header */}
        <div className="prc-header flex items-end justify-between mb-16 gap-6">
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/30">
              <span className="w-5 h-px bg-white/15" />
              {lang === 'en' ? 'How I work' : 'Como trabalho'}
            </span>
            <h2
              className="font-black text-white"
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                letterSpacing: '-0.04em',
                lineHeight: '0.95',
              }}
            >
              {lang === 'en' ? 'From idea to product' : 'Da ideia ao produto'}
            </h2>
          </div>
        </div>

        {/* Steps — click to expand */}
        <div>
          {processSteps.map((step, i) => {
            const title   = lang === 'en' ? step.titleEn       : step.titlePt
            const desc    = lang === 'en' ? step.descriptionEn : step.descriptionPt
            const isOpen  = open === step.id

            return (
              <div key={step.id} className="prc-row">
                <div
                  className="prc-line w-full"
                  style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }}
                />
                <button
                  className="w-full text-left group cursor-pointer"
                  onClick={() => setOpen(isOpen ? null : step.id)}
                  onMouseEnter={() => setCursor('pointer')}
                  onMouseLeave={() => setCursor('default')}
                >
                  <div className="py-5 grid grid-cols-[2rem_1fr_auto] md:grid-cols-[3rem_1fr_auto] gap-3 md:gap-10 items-start">
                    {/* Number */}
                    <span
                      className="prc-num font-black tabular-nums text-white/18 mt-1"
                      style={{ fontSize: '0.625rem', letterSpacing: '0.1em' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Content */}
                    <div className="flex flex-col">
                      <h3
                        className="font-black text-white group-hover:text-white/75 transition-colors duration-300"
                        style={{
                          fontFamily: 'Syne, sans-serif',
                          fontSize: 'clamp(1.1rem, 2vw, 1.55rem)',
                          letterSpacing: '-0.02em',
                          lineHeight: '1.1',
                        }}
                      >
                        {title}
                      </h3>

                      {/* Expandable description */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            <p className="text-sm text-white/38 leading-relaxed max-w-lg mt-4 pb-1">
                              {desc}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Duration + toggle icon */}
                    <div className="flex items-center gap-4 mt-1 flex-shrink-0">
                      <span
                        className="text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-white/18 group-hover:text-white/40 transition-colors duration-300"
                      >
                        {step.duration}
                      </span>
                      <span
                        className="text-white/25 group-hover:text-white/60 transition-colors duration-300"
                        style={{ flexShrink: 0 }}
                      >
                        {isOpen
                          ? <Minus size={14} strokeWidth={1.5} />
                          : <Plus  size={14} strokeWidth={1.5} />
                        }
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            )
          })}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />
        </div>
      </div>
    </section>
  )
}
