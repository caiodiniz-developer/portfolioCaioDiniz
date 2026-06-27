import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import CarCanvas from './CarCanvas'
import Magnetic from '@/components/animations/Magnetic'
import Button from '@/components/ui/Button'
import { CHAPTERS } from './carKeyframes'
import { useCursorStore } from '@/store/useCursorStore'

gsap.registerPlugin(ScrollTrigger)

const DISPLAY: React.CSSProperties = {
  fontFamily: 'Syne, sans-serif',
  fontSize: 'clamp(3.6rem, 11.5vw, 9.8rem)',
  letterSpacing: '-0.055em',
  lineHeight: '0.875',
  fontWeight: 800,
}

/* split one line into word spans */
function HeadlineLine({ text, color }: { text: string; color: string }) {
  return (
    <div style={{ ...DISPLAY, color, display: 'block', overflow: 'hidden' }}>
      <motion.span
        style={{ display: 'block' }}
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        exit={{ y: '-110%' }}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
      >
        {text}
      </motion.span>
    </div>
  )
}

export default function CarExperience() {
  const setCursor = useCursorStore((s) => s.setState)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const scrollProgress  = useRef(0)
  const mousePos        = useRef({ x: 0, y: 0 })
  const lastScrollTime  = useRef(Date.now())
  const chapterIdxRef   = useRef(0)

  const [chapterIdx, setChapterIdx] = useState(0)
  const chapter = CHAPTERS[chapterIdx]

  /* ── track mouse ── */
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      mousePos.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  /* ── GSAP pin + scroll progress ── */
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: wrapRef.current!,
      start:   'top top',
      end:     '+=420%',
      pin:     true,
      pinSpacing: true,
      onUpdate(self) {
        scrollProgress.current = self.progress
        lastScrollTime.current = Date.now()

        /* chapter detection */
        let newIdx = CHAPTERS.length - 1
        for (let i = 0; i < CHAPTERS.length - 1; i++) {
          if (self.progress < CHAPTERS[i + 1].range[0]) { newIdx = i; break }
        }
        if (newIdx !== chapterIdxRef.current) {
          chapterIdxRef.current = newIdx
          setChapterIdx(newIdx)
        }
      },
    })

    /* header entrance */
    const ctx = gsap.context(() => {
      gsap.set('.ce-meta',    { y: 20, opacity: 0 })
      gsap.set('.ce-bottom',  { y: 22, opacity: 0 })
      gsap.set('.ce-scroll-line', { scaleY: 0, transformOrigin: 'top' })
      gsap.set('.ce-scroll-txt',  { opacity: 0 })

      const tl = gsap.timeline({ delay: 0.1, defaults: { ease: 'power3.out' } })
      tl.to('.ce-meta',   { y: 0, opacity: 1, duration: 0.7 }, 0)
      tl.to('.ce-bottom', { y: 0, opacity: 1, duration: 0.7 }, 0.55)
      tl.to('.ce-scroll-line', { scaleY: 1, duration: 1.1, ease: 'power2.inOut' }, 1.0)
      tl.to('.ce-scroll-txt',  { opacity: 1, duration: 0.5 }, 1.2)
    }, wrapRef)

    return () => { trigger.kill(); ctx.revert() }
  }, [])

  /* ── progress bar width via direct DOM ── */
  const barRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let rafId: number
    function tick() {
      if (barRef.current) {
        barRef.current.style.width = `${scrollProgress.current * 100}%`
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100vh', background: '#0d0d0d' }}
    >
      {/* ── 3D Canvas (full bleed, behind text) ── */}
      <div className="absolute inset-0 z-0">
        <CarCanvas
          scrollProgress={scrollProgress}
          mousePos={mousePos}
          lastScrollTime={lastScrollTime}
        />
      </div>

      {/* ── Bottom gradient fade into next section ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: '160px',
          background: 'linear-gradient(to bottom, transparent, #0d0d0d)',
        }}
      />

      {/* ── Top left: meta ── */}
      <div
        className="ce-meta absolute top-0 left-0 right-0 z-20"
        style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 5vw, 4.5rem)' }}
      >
        <div className="flex items-center justify-between">
          <span className="font-black text-white text-sm tracking-[-0.03em] select-none">
            Caio Diniz
          </span>
          <span
            className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white/20"
          >
            {chapter.label}
          </span>
        </div>
      </div>

      {/* ── Center left: headline ── */}
      <div
        className="absolute z-20 flex flex-col justify-center"
        style={{
          top: 0,
          bottom: 0,
          left: 'clamp(1.5rem, 5vw, 4.5rem)',
          right: 'auto',
          maxWidth: 'min(55vw, 780px)',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div key={chapterIdx} className="flex flex-col">
            {chapter.lines.map((line, i) => (
              <HeadlineLine key={`${chapterIdx}-${i}`} text={line} color={chapter.colors[i]} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="ce-bottom absolute bottom-0 left-0 right-0 z-20"
        style={{
          padding: '0 clamp(1.5rem, 5vw, 4.5rem) clamp(1.5rem, 3vw, 2.5rem)',
        }}
      >
        {/* Progress bar */}
        <div className="mb-6" style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }}>
          <div
            ref={barRef}
            style={{ height: '1px', background: '#ffffff', width: '0%', transition: 'width 0.1s linear' }}
          />
        </div>

        <div className="grid sm:grid-cols-[1fr_auto] gap-6 items-end">
          <AnimatePresence mode="wait">
            <motion.div key={`sub-${chapterIdx}`}>
              {chapter.cta ? (
                /* CTA chapter */
                <div className="flex items-center gap-3 flex-wrap">
                  <Magnetic strength={0.3}>
                    <Link to="/projects">
                      <Button
                        variant="primary"
                        size="md"
                        onMouseEnter={() => setCursor('pointer')}
                        onMouseLeave={() => setCursor('default')}
                      >
                        Ver Projetos
                        <ArrowUpRight size={14} />
                      </Button>
                    </Link>
                  </Magnetic>
                  <Magnetic strength={0.3}>
                    <Link to="/contact">
                      <Button
                        variant="secondary"
                        size="md"
                        onMouseEnter={() => setCursor('pointer')}
                        onMouseLeave={() => setCursor('default')}
                      >
                        Entrar em Contato
                      </Button>
                    </Link>
                  </Magnetic>
                </div>
              ) : (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-sm text-white/30 leading-relaxed max-w-sm"
                >
                  {chapter.sub}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Scroll indicator */}
          <div className="hidden sm:flex flex-col items-end gap-2">
            <span
              className="ce-scroll-txt text-[0.5rem] font-semibold uppercase tracking-[0.22em] text-white/20"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Scroll
            </span>
            <div
              className="ce-scroll-line w-px"
              style={{
                height: '64px',
                background: 'linear-gradient(to top, rgba(255,255,255,0.2), rgba(255,255,255,0.03))',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
