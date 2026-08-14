import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguageStore } from '@/store/useLanguageStore'
import { testimonials } from '@/data/testimonials'

gsap.registerPlugin(ScrollTrigger)

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]
const ADVANCE_MS = 7000

function TypingDots() {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '10px 16px',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '20px 20px 20px 5px',
    }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: 'rgba(255,255,255,0.3)',
          display: 'inline-block',
          animation: `waDot 1.4s ${i * 0.22}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const lang   = useLanguageStore(s => s.lang)
  const ref    = useRef<HTMLElement>(null)
  const [current, setCurrent] = useState(0)
  const [typing,  setTyping]  = useState(false)
  const [shown,   setShown]   = useState(true)
  const [key,     setKey]     = useState(0)

  const active = testimonials[current]
  const quote  = lang === 'en' ? active.quote : active.quotePt

  function goTo(idx: number) {
    if (idx === current) return
    setShown(false)
    setTyping(true)
    setTimeout(() => {
      setCurrent(idx)
      setTyping(false)
      setTimeout(() => setShown(true), 60)
      setKey(k => k + 1)
    }, 1500)
  }

  useEffect(() => {
    const id = setInterval(() => {
      goTo((current + 1) % testimonials.length)
    }, ADVANCE_MS)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, key])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // set + to, never from(): a from() tween is reverted by every
      // ScrollTrigger.refresh() and stays reverted once `once: true` kills the trigger.
      const title = gsap.utils.toArray<HTMLElement>('.tsm-title')
      gsap.set(title, { y: 32, opacity: 0 })
      gsap.to(title, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current!, start: 'top 78%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  const now  = new Date()
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  return (
    <section
      ref={ref}
      style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,5rem)' }}
    >
      {/* Section label + title */}
      <div className="tsm-title" style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem,5vw,4rem)' }}>
        <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '0.9rem' }}>
          <span style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.15)', display: 'inline-block' }} />
          {lang === 'en' ? 'Testimonials' : 'Depoimentos'}
          <span style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.15)', display: 'inline-block' }} />
        </span>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3.5rem)', letterSpacing: '-0.04em', lineHeight: 0.95, color: '#fff', margin: 0, paddingBottom: '0.08em' }}>
          {lang === 'en' ? 'What clients say' : 'O que dizem sobre mim'}
        </h2>
      </div>

      {/* Chat window — centered */}
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={{
          borderRadius: 20, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.55)',
        }}>

          {/* Header bar */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`hdr-${current}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: E }}
              style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0.8rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {active.avatar
                  ? <img src={active.avatar} alt={active.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', display: 'block', border: '2px solid rgba(255,255,255,0.1)' }} />
                  : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>{active.name[0]}</div>
                }
                <span style={{ position: 'absolute', bottom: 1, right: 1, width: 8, height: 8, borderRadius: '50%', background: '#22c55e', border: '2px solid #0a0a0a' }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{active.name}</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.57rem', color: 'rgba(255,255,255,0.35)' }}>
                  {active.role} · {active.company} · <span style={{ color: '#4ade80' }}>online</span>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Chat body */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem 1.1rem', minHeight: 180 }}>
            {/* Date stamp */}
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.2)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: 99 }}>
                {lang === 'en' ? 'Today' : 'Hoje'}
              </span>
            </div>

            {/* Bubble */}
            <AnimatePresence mode="wait">
              {typing && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.28, ease: E }}
                >
                  <TypingDots />
                </motion.div>
              )}

              {!typing && shown && (
                <motion.div
                  key={`msg-${current}`}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.45, ease: E }}
                  style={{ maxWidth: '88%' }}
                >
                  <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '18px 18px 18px 5px', padding: '0.9rem 1rem' }}>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.68, fontStyle: 'italic' }}>
                      "{quote}"
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.2)' }}>{time}</span>
                      <span style={{ fontSize: '0.65rem', color: '#4fc3f7', lineHeight: 1 }}>✓✓</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contact chips + progress */}
          <div style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '0.7rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {testimonials.map((t, i) => (
                <button key={i} onClick={() => goTo(i)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0.28rem 0.65rem', borderRadius: 99, border: `1px solid ${i === current ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.07)'}`, background: i === current ? 'rgba(255,255,255,0.07)' : 'transparent', cursor: 'pointer', transition: 'all 0.25s ease' }}>
                  {t.avatar
                    ? <img src={t.avatar} alt={t.name} style={{ width: 16, height: 16, borderRadius: '50%', objectFit: 'cover' }} />
                    : <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: '#fff' }}>{t.name[0]}</span>
                  }
                  <span style={{ fontSize: '0.56rem', fontWeight: 600, color: i === current ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.22)', whiteSpace: 'nowrap', transition: 'color 0.25s' }}>
                    {t.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Linear progress */}
            <div style={{ height: 2, width: 48, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden', flexShrink: 0 }}>
              <motion.div
                key={`prog-${current}-${key}`}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: ADVANCE_MS / 1000, ease: 'linear' }}
                style={{ height: '100%', background: '#22c55e', borderRadius: 99 }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes waDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </section>
  )
}
