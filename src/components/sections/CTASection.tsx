import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'
import { SITE } from '@/lib/constants'
import Magnetic from '@/components/animations/Magnetic'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

const MARQUEE_ITEMS = [
  'DISPONÍVEL', 'FREELANCE', 'OPEN TO WORK', '2026',
  'BRASIL', 'FULL STACK', 'REACT', 'NODE.JS', 'UI/UX',
]

/* ── Rotating orbital badge ─────────────────────────────── */
function OrbitBadge({ lang }: { lang: string }) {
  const setCursor = useCursorStore((s) => s.setState)
  const orbitText = lang === 'en'
    ? 'CAIO DINIZ · AVAILABLE · FREELANCE · 2026 · '
    : 'CAIO DINIZ · DISPONÍVEL · FREELANCE · 2026 · '

  return (
    <Link
      to="/contact"
      aria-label={lang === 'en' ? 'Contact me' : 'Falar comigo'}
      style={{ display: 'block', position: 'relative', width: 260, height: 260, flexShrink: 0 }}
      onMouseEnter={() => setCursor('pointer')}
      onMouseLeave={() => setCursor('default')}
    >
      <svg
        viewBox="0 0 240 240"
        width="260"
        height="260"
        aria-hidden
        style={{ position: 'absolute', inset: 0, animation: 'orbit-spin 20s linear infinite' }}
      >
        <defs>
          <path id="orbitPath2" d="M 120,120 m -95,0 a 95,95 0 1,1 190,0 a 95,95 0 1,1 -190,0" />
        </defs>
        <text fill="rgba(255,255,255,0.28)" fontSize="8" fontFamily="monospace" fontWeight="700" letterSpacing="9">
          <textPath href="#orbitPath2">{orbitText}</textPath>
        </text>
      </svg>

      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.07)', pointerEvents: 'none' }} />

      <motion.div
        style={{
          position: 'absolute', inset: 28, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        }}
        whileHover={{ borderColor: 'rgba(255,255,255,0.32)', background: 'rgba(255,255,255,0.04)' }}
        transition={{ duration: 0.3 }}
      >
        <motion.span
          style={{ fontSize: '2.4rem', color: '#ffffff', lineHeight: 1, display: 'block' }}
          whileHover={{ scale: 1.12, rotate: -15 }}
          transition={{ duration: 0.35, ease: E }}
        >
          ↗
        </motion.span>
        <span style={{ fontSize: '0.46rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', textAlign: 'center', lineHeight: 1.4 }}>
          FALAR<br />COMIGO
        </span>
      </motion.div>

      <motion.div
        style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)', opacity: 0, pointerEvents: 'none' }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
    </Link>
  )
}

/* ── Main section ────────────────────────────────────────── */
export default function CTASection() {
  const lang      = useLanguageStore((s) => s.lang)
  const setCursor = useCursorStore((s) => s.setState)

  const waUrl = `https://wa.me/${SITE.whatsapp.replace(/\D/g, '')}`

  return (
    <section style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
      <style>{`
        @keyframes cta-ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes orbit-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes cta-pulse  { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div className="container-custom" style={{ paddingTop: 'clamp(3.5rem,7vw,6rem)', paddingBottom: 'clamp(3.5rem,7vw,6rem)' }}>

        {/* ── Status bar ── */}
        <motion.div
          className="flex items-center justify-between flex-wrap gap-3"
          style={{ marginBottom: 'clamp(3rem,6vw,5rem)' }}
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: E }}
        >
          <div className="flex items-center gap-2.5">
            <span style={{ display: 'block', width: 6, height: 6, borderRadius: '50%', background: '#4ade80', animation: 'cta-pulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
              {lang === 'en' ? 'Available for projects' : 'Disponível para projetos'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)' }}>05</span>
            <div style={{ width: 36, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontFamily: 'monospace', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.15)' }}>
              {lang === 'en' ? 'contact' : 'contato'}
            </span>
          </div>
        </motion.div>

        {/* ── Main grid ── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-center"
          style={{ gap: 'clamp(3rem,6vw,6rem)' }}
        >
          {/* LEFT ── headline + actions */}
          <div>
            {/* 2-line headline */}
            {(lang === 'en' ? ['HAVE A', 'PROJECT?'] : ['TEM UM', 'PROJETO?']).map((word, i) => (
              <div key={i} style={{ overflow: 'hidden' }}>
                <motion.h2
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: 'clamp(4rem,11vw,11rem)',
                    fontWeight: 900,
                    letterSpacing: '-0.055em',
                    lineHeight: 0.88,
                    margin: 0,
                    ...(i === 1
                      ? { color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.28)' }
                      : { color: '#ffffff' }),
                  }}
                  initial={{ y: '110%' }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.85, delay: i * 0.12, ease: E }}
                >
                  {word}
                </motion.h2>
              </div>
            ))}

            {/* Email + buttons */}
            <motion.div
              style={{ marginTop: 'clamp(2.5rem,5vw,4rem)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.38, ease: E }}
            >
              {/* Email address as prominent link */}
              <a
                href={`mailto:${SITE.email}`}
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content' }}
                onMouseEnter={() => setCursor('pointer')}
                onMouseLeave={() => setCursor('default')}
              >
                <span style={{ fontSize: 'clamp(0.85rem,1.5vw,1.1rem)', color: 'rgba(255,255,255,0.38)', letterSpacing: '-0.01em', transition: 'color 0.25s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.38)' }}>
                  {SITE.email}
                </span>
                <ArrowUpRight size={13} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
              </a>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Magnetic strength={0.3}>
                  <Link to="/contact">
                    <button
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        background: '#ffffff', color: '#0d0d0d', border: 'none',
                        borderRadius: '100px', padding: '0.9rem 1.8rem',
                        fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em',
                        textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.25s',
                      }}
                      onMouseEnter={e => { (e.currentTarget.style.background = '#e0e0e0'); setCursor('pointer') }}
                      onMouseLeave={e => { (e.currentTarget.style.background = '#ffffff'); setCursor('default') }}
                    >
                      {lang === 'en' ? 'Start Project' : 'Iniciar Projeto'} <ArrowUpRight size={12} />
                    </button>
                  </Link>
                </Magnetic>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: 'transparent', color: 'rgba(255,255,255,0.45)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '100px', padding: '0.9rem 1.8rem',
                    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em',
                    textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.25s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#fff'; el.style.borderColor = 'rgba(255,255,255,0.3)'; setCursor('pointer') }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'rgba(255,255,255,0.45)'; el.style.borderColor = 'rgba(255,255,255,0.12)'; setCursor('default') }}
                >
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </div>

          {/* RIGHT ── orbital badge (desktop) */}
          <motion.div
            className="hidden lg:flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: E }}
          >
            <OrbitBadge lang={lang} />
          </motion.div>
        </div>

        {/* Mobile: badge centered below */}
        <motion.div
          className="flex lg:hidden justify-center mt-12"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: E }}
        >
          <OrbitBadge lang={lang} />
        </motion.div>

      </div>

      {/* ── Marquee ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', padding: '1rem 0' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'cta-ticker 34s linear infinite' }}>
          {[0, 1].map((set) => (
            <div key={set} style={{ display: 'flex', alignItems: 'center' }}>
              {MARQUEE_ITEMS.map((item, i) => (
                <span key={`${set}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '2rem', paddingRight: '2rem', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.1)' }}>{item}</span>
                  <span style={{ color: 'rgba(255,255,255,0.06)', fontSize: '0.35rem' }}>◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
