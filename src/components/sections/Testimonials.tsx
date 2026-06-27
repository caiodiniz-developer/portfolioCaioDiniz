import { useRef, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguageStore } from '@/store/useLanguageStore'
import { testimonials } from '@/data/testimonials'
import { useCursorStore } from '@/store/useCursorStore'

gsap.registerPlugin(ScrollTrigger)

const AUTO_DELAY = 5500

export default function Testimonials() {
  const lang      = useLanguageStore((s) => s.lang)
  const setCursor = useCursorStore((s) => s.setState)
  const ref       = useRef<HTMLElement>(null)
  const [current, setCurrent] = useState(0)
  const [dir, setDir]         = useState<1 | -1>(1)
  const [paused, setPaused]   = useState(false)
  const [autoKey, setAutoKey] = useState(0)

  function go(next: number) {
    setDir(next > current ? 1 : -1)
    setCurrent(next)
    setAutoKey((k) => k + 1)
  }
  const prev = () => go((current - 1 + testimonials.length) % testimonials.length)
  const next = () => go((current + 1) % testimonials.length)

  /* Auto-advance; resets timer on manual nav or unpause */
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setDir(1)
      setCurrent((c) => (c + 1) % testimonials.length)
    }, AUTO_DELAY)
    return () => clearInterval(id)
  }, [paused, autoKey])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.tsm-header', { y: 28, opacity: 0 })
      gsap.to('.tsm-header', {
        y: 0, opacity: 1, duration: 0.75, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current!, start: 'top 78%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  const active = testimonials[current]
  const quote  = lang === 'en' ? active.quote : active.quotePt

  /* Quote slide variants */
  const quoteVariants = {
    enter: (d: number) => ({ opacity: 0, x: d * 50 }),
    center:              ({ opacity: 1, x: 0 }),
    exit:  (d: number) => ({ opacity: 0, x: d * -50 }),
  }

  return (
    <section
      ref={ref}
      className="section-padding overflow-hidden"
      style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-custom">
        {/* ── Header ── */}
        <div className="tsm-header flex items-end justify-between mb-20 gap-6">
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/30">
              <span className="w-5 h-px bg-white/15" />
              {lang === 'en' ? 'Testimonials' : 'Depoimentos'}
            </span>
            <h2
              className="font-black text-white"
              style={{
                fontFamily:    'Syne, sans-serif',
                fontSize:      'clamp(2rem, 4vw, 3.5rem)',
                letterSpacing: '-0.04em',
                lineHeight:    '0.95',
              }}
            >
              {lang === 'en' ? 'What clients say' : 'O que dizem sobre mim'}
            </h2>
          </div>

          {/* Counter */}
          <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
            <AnimatePresence mode="wait">
              <motion.span
                key={current}
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0,   opacity: 1 }}
                exit={{    y:  12, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-black text-white tabular-nums"
                style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.04em', lineHeight: 1, display: 'block' }}
              >
                {String(current + 1).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-white/20">
              / {String(testimonials.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* ── Quote area ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 'clamp(2.5rem, 5vw, 4.5rem)' }}>

          {/* Decorative " */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`mark-${current}`}
              initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
              animate={{ opacity: 0.07, scale: 1, rotate: 0 }}
              exit={{    opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="select-none pointer-events-none"
              style={{
                fontFamily:   'Syne, sans-serif',
                fontSize:     'clamp(6rem, 14vw, 13rem)',
                fontWeight:   900,
                color:        '#ffffff',
                lineHeight:   1,
                marginBottom: '-2rem',
                display:      'block',
              }}
            >
              "
            </motion.div>
          </AnimatePresence>

          {/* Quote text — whole-block slide (no inline-block word wrapping) */}
          <div
            style={{
              position:      'relative',
              maxWidth:      '800px',
              marginBottom:  'clamp(2rem, 4vw, 3.5rem)',
              minHeight:     'clamp(6rem, 12vw, 10rem)',
            }}
          >
            <AnimatePresence mode="wait" custom={dir}>
              <motion.blockquote
                key={`quote-${current}`}
                custom={dir}
                variants={quoteVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily:    'Syne, sans-serif',
                  fontSize:      'clamp(1.2rem, 2.8vw, 2.2rem)',
                  letterSpacing: '-0.025em',
                  lineHeight:    '1.28',
                  fontWeight:    700,
                  color:         '#ffffff',
                  margin:        0,
                }}
              >
                {quote}
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Author */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`author-${current}`}
              initial={{ opacity: 0, x: dir * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{    opacity: 0, x: dir * -30 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4"
            >
              {active.avatar && (
                <img
                  src={active.avatar}
                  alt={active.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  style={{ filter: 'grayscale(20%)', border: '1px solid rgba(255,255,255,0.12)' }}
                  loading="lazy"
                />
              )}
              <div>
                <p className="font-semibold text-white text-sm" style={{ letterSpacing: '-0.01em' }}>
                  {active.name}
                </p>
                <p className="mt-0.5" style={{ fontSize: '0.6875rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.30)' }}>
                  {active.role}, {active.company}
                </p>
              </div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{    scaleX: 0 }}
                transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: '1px', background: 'rgba(255,255,255,0.12)', flex: 1, transformOrigin: 'left', marginLeft: '1rem' }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Navigation ── */}
        <div
          className="flex items-center justify-between mt-14 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Progress pills */}
          <div className="flex gap-2 items-center">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Depoimento ${i + 1}`}
                className="relative overflow-hidden transition-all duration-500"
                style={{
                  height:       '2px',
                  width:        i === current ? '36px' : '10px',
                  background:   'rgba(255,255,255,0.12)',
                  borderRadius: '1px',
                }}
              >
                {i === current && (
                  <motion.span
                    key={`${i}-${autoKey}`}
                    className="absolute inset-y-0 left-0 bg-white"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: AUTO_DELAY / 1000, ease: 'linear' }}
                    style={{ borderRadius: '1px' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Arrow buttons — large + prominent */}
          <div className="flex gap-3">
            <button
              onClick={prev}
              aria-label="Anterior"
              className="group flex items-center justify-center transition-all duration-300"
              style={{
                width:        '52px',
                height:       '52px',
                borderRadius: '50%',
                border:       '1px solid rgba(255,255,255,0.15)',
                background:   'rgba(255,255,255,0.03)',
              }}
              onMouseEnter={(e) => {
                setCursor('pointer')
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)'
              }}
              onMouseLeave={(e) => {
                setCursor('default')
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'
              }}
            >
              <ArrowLeft size={18} strokeWidth={1.5} className="text-white/50 group-hover:text-white transition-colors" />
            </button>
            <button
              onClick={next}
              aria-label="Próximo"
              className="group flex items-center justify-center transition-all duration-300"
              style={{
                width:        '52px',
                height:       '52px',
                borderRadius: '50%',
                border:       '1px solid rgba(255,255,255,0.15)',
                background:   'rgba(255,255,255,0.03)',
              }}
              onMouseEnter={(e) => {
                setCursor('pointer')
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)'
              }}
              onMouseLeave={(e) => {
                setCursor('default')
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'
              }}
            >
              <ArrowRight size={18} strokeWidth={1.5} className="text-white/50 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
