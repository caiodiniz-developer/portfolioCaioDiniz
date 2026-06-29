import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useT } from '@/hooks/useTranslation'
import { useLanguageStore } from '@/store/useLanguageStore'
import About from '@/components/sections/About'
import DevAnatomy from '@/components/sections/DevAnatomy'
import Experience from '@/components/sections/Experience'
import CTASection from '@/components/sections/CTASection'
import { SITE } from '@/lib/constants'

/* ─── Tech stack data ─── */
const STACK = [
  {
    id: 'frontend',
    labelEn: 'Front-end',
    labelPt: 'Front-end',
    color: 'rgba(130,200,130,0.85)',
    items: ['React 19', 'TypeScript', 'JavaScript', 'HTML & CSS', 'Tailwind CSS', 'Framer Motion', 'GSAP'],
  },
  {
    id: 'backend',
    labelEn: 'Back-end',
    labelPt: 'Back-end',
    color: 'rgba(100,160,255,0.85)',
    items: ['Node.js', 'PostgreSQL', 'MySQL', 'SQL', 'REST APIs'],
  },
  {
    id: 'tools',
    labelEn: 'Tools & Design',
    labelPt: 'Ferramentas',
    color: 'rgba(200,140,255,0.85)',
    items: ['Git', 'GitHub', 'Vite', 'Figma'],
  },
]



export default function AboutPage() {
  const t    = useT()
  const lang = useLanguageStore((s) => s.lang)

  useEffect(() => {
    document.title = `${lang === 'en' ? 'About' : 'Sobre'} — ${SITE.name}`
  }, [lang])

  return (
    <main style={{ paddingTop: '5rem' }}>
      {/* Hero */}
      <section
        className="section-padding relative overflow-hidden"
        style={{ background: '#0d0d0d', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: 0.07, filter: 'blur(2px)', transform: 'scale(1.04)' }}
        >
          <source src="/assets/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6 max-w-3xl"
          >
            <span className="inline-flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/30">
              <span className="w-5 h-px bg-white/15" />
              {t.about.badge}
            </span>
            <h1
              className="font-black text-white"
              style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2.5rem, 7vw, 6rem)', letterSpacing: '-0.055em', lineHeight: '0.88' }}
            >
              {lang === 'en' ? (
                <>Developer,<br /><span style={{ color: 'rgba(255,255,255,0.22)' }}>creator &amp; builder.</span></>
              ) : (
                <>Desenvolvedor,<br /><span style={{ color: 'rgba(255,255,255,0.22)' }}>criador &amp; construtor.</span></>
              )}
            </h1>
            <p className="text-sm text-white/35 leading-relaxed max-w-xl">
              {t.about.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* About split section — foto-1 only, no hover */}
      <About />

      {/* ─── Dev Anatomy ─── */}
      <DevAnatomy />

      {/* ─── Creative Tech Stack ─── */}
      <section style={{ background: '#111111', borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4.5rem)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', marginBottom: 'clamp(2.5rem,5vw,4rem)', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ display: 'inline-block', width: 18, height: 1, background: 'rgba(255,255,255,0.15)' }} />
                {lang === 'en' ? 'Tech Stack' : 'Stack Técnica'}
              </span>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3.5rem)', letterSpacing: '-0.04em', lineHeight: '0.95', color: '#ffffff', margin: 0 }}>
                {lang === 'en' ? 'Tools I master.' : 'Ferramentas que domino.'}
              </h2>
            </div>
            {/* Live terminal cursor accent */}
            <span style={{ fontFamily: '"JetBrains Mono","Fira Code",monospace', fontSize: '0.7rem', color: 'rgba(130,200,130,0.5)', paddingBottom: '0.35rem' }}>
              <span style={{ animation: 'stackBlink 1.1s step-end infinite' }}>▋</span>
            </span>
          </div>

          {/* Code-editor card */}
          <div style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', background: '#0d0d0d' }}>

            {/* Editor chrome / tab bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'rgba(255,95,87,0.55)', display: 'inline-block' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'rgba(255,188,46,0.55)', display: 'inline-block' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'rgba(40,200,64,0.55)', display: 'inline-block' }} />
              <span style={{ marginLeft: '0.75rem', fontFamily: '"JetBrains Mono","Fira Code",monospace', fontSize: '0.625rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.04em' }}>
                stack.ts
              </span>
            </div>

            {/* Code body */}
            <div style={{ padding: 'clamp(1.5rem,3vw,2.5rem)', fontFamily: '"JetBrains Mono","Fira Code",monospace', fontSize: 'clamp(0.7rem,1.2vw,0.825rem)', lineHeight: '2', overflowX: 'auto' }}>

              <div style={{ color: 'rgba(255,255,255,0.18)', marginBottom: '0.25em' }}>
                {'// '}{lang === 'en' ? 'technologies I use daily' : 'tecnologias que uso no dia a dia'}
              </div>

              <div style={{ marginBottom: '0.5em' }}>
                <span style={{ color: 'rgba(130,200,130,0.8)' }}>export const </span>
                <span style={{ color: 'rgba(150,185,255,0.9)' }}>stack</span>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}> = {'{'}</span>
              </div>

              {STACK.map((cat, ci) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: ci * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  style={{ paddingLeft: '1.8em', marginBottom: ci < STACK.length - 1 ? '0.25em' : '0.5em' }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.35)' }}>{lang === 'en' ? cat.labelEn : cat.labelPt}</span>
                  <span style={{ color: 'rgba(255,255,255,0.25)' }}>: [</span>
                  {cat.items.map((item, ii) => (
                    <span key={item}>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: ci * 0.12 + ii * 0.06 + 0.15 }}
                        style={{ color: cat.color, cursor: 'default' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.textShadow = `0 0 12px ${cat.color}` }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.textShadow = 'none' }}
                      >
                        "{item}"
                      </motion.span>
                      {ii < cat.items.length - 1 && (
                        <span style={{ color: 'rgba(255,255,255,0.25)' }}>, </span>
                      )}
                    </span>
                  ))}
                  <span style={{ color: 'rgba(255,255,255,0.25)' }}>{'],'}  </span>
                </motion.div>
              ))}

              <div>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>{'}'}</span>
                <span style={{ color: 'rgba(130,200,130,0.6)' }}> satisfies </span>
                <span style={{ color: 'rgba(150,185,255,0.7)' }}>Stack</span>
              </div>
            </div>
          </div>

          {/* Tag cloud below — quick scan of all skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginTop: 'clamp(2rem,4vw,3rem)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
          >
            {STACK.flatMap((cat) =>
              cat.items.map((item) => (
                <span
                  key={item}
                  style={{
                    padding:       '0.375rem 0.875rem',
                    borderRadius:  '999px',
                    border:        '1px solid rgba(255,255,255,0.08)',
                    background:    'rgba(255,255,255,0.03)',
                    fontSize:      '0.7rem',
                    fontWeight:    600,
                    color:         'rgba(255,255,255,0.35)',
                    letterSpacing: '0.04em',
                    transition:    'color 0.25s, border-color 0.25s, background 0.25s',
                    cursor:        'default',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = '#fff'
                    el.style.borderColor = 'rgba(255,255,255,0.25)'
                    el.style.background = 'rgba(255,255,255,0.07)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = 'rgba(255,255,255,0.35)'
                    el.style.borderColor = 'rgba(255,255,255,0.08)'
                    el.style.background = 'rgba(255,255,255,0.03)'
                  }}
                >
                  {item}
                </span>
              ))
            )}
          </motion.div>
        </div>

        <style>{`@keyframes stackBlink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
      </section>

      <Experience />
      <CTASection />
    </main>
  )
}
