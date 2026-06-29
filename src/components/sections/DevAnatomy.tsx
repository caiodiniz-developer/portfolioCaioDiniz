import { useState, useRef } from 'react'
import { motion, AnimatePresence, useSpring } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useLanguageStore } from '@/store/useLanguageStore'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface Zone {
  id: string
  labelPt: string; labelEn: string
  subtitlePt: string; subtitleEn: string
  descPt: string; descEn: string
  skills: string[]
  color: string
  // Position on photo (% of container)
  top: string
  left: string
}

const ZONES: Zone[] = [
  {
    id: 'head',
    labelPt: 'Mente', labelEn: 'Mind',
    subtitlePt: 'Onde tudo começa', subtitleEn: 'Where everything starts',
    descPt: 'Arquitetura limpa, raciocínio lógico e decisões técnicas que escalam sem quebrar.',
    descEn: 'Clean architecture, logical thinking and technical decisions that scale without breaking.',
    skills: ['Algoritmos', 'System Design', 'Problem Solving', 'Code Review', 'UI/UX'],
    color: '#a78bfa',
    top: '9%', left: '50%',
  },
  {
    id: 'heart',
    labelPt: 'Coração', labelEn: 'Heart',
    subtitlePt: 'O que me move', subtitleEn: 'What drives me',
    descPt: 'Paixão real por código que funciona, performa e que o próximo dev vai adorar manter.',
    descEn: 'Real passion for code that works, performs and that the next dev will love maintaining.',
    skills: ['Clean Code', 'SOLID', 'Performance', 'DX', 'Open Source'],
    color: '#f472b6',
    top: '38%', left: '50%',
  },
  {
    id: 'hands',
    labelPt: 'Mãos', labelEn: 'Hands',
    subtitlePt: 'O que construo todo dia', subtitleEn: 'What I build every day',
    descPt: 'As ferramentas que domino para transformar ideias em produto funcional de verdade.',
    descEn: 'The tools I master to turn ideas into actual working products.',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Git'],
    color: '#4ade80',
    top: '57%', left: '50%',
  },
  {
    id: 'base',
    labelPt: 'Base', labelEn: 'Foundation',
    subtitlePt: 'O que sustenta tudo', subtitleEn: 'What holds it all up',
    descPt: 'Infraestrutura robusta, CI/CD e deploys que não te acordam de madrugada.',
    descEn: "Robust infrastructure, CI/CD and deploys that won't wake you up at 3am.",
    skills: ['CI/CD', 'Linux', 'Vercel', 'Railway', 'Segurança', 'Monitoramento'],
    color: '#fb923c',
    top: '84%', left: '50%',
  },
]

/* ── Zone dot overlay on photo ── */
function ZoneDot({ zone, active, onEnter, onLeave }: {
  zone: Zone
  active: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: zone.top,
        left: zone.left,
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        cursor: 'crosshair',
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Hit area (larger invisible circle) */}
      <div style={{ position: 'absolute', width: 72, height: 72, borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 11 }} />

      {/* Outer ring — visible on hover */}
      <motion.div
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.5 }}
        transition={{ duration: 0.3, ease: E }}
        style={{
          position: 'absolute',
          width: 64, height: 64,
          borderRadius: '50%',
          border: `1.5px solid ${zone.color}`,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          boxShadow: `0 0 22px ${zone.color}55`,
        }}
      />

      {/* Pulsing dot */}
      <motion.div
        animate={active
          ? { scale: 1.3, boxShadow: `0 0 18px 4px ${zone.color}99` }
          : { scale: [1, 1.35, 1], boxShadow: [`0 0 8px ${zone.color}66`, `0 0 14px ${zone.color}aa`, `0 0 8px ${zone.color}66`] }
        }
        transition={active
          ? { duration: 0.25, ease: E }
          : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{
          width: 14, height: 14,
          borderRadius: '50%',
          background: zone.color,
          position: 'relative', zIndex: 12,
        }}
      />

      {/* Label pill */}
      <motion.div
        animate={{ opacity: active ? 1 : 0, y: active ? -2 : 4 }}
        transition={{ duration: 0.22, ease: E }}
        style={{
          position: 'absolute',
          top: '100%', left: '50%',
          transform: 'translateX(-50%)',
          marginTop: 8,
          background: zone.color,
          color: '#000',
          fontSize: '0.55rem',
          fontWeight: 800,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '3px 9px',
          borderRadius: 99,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        {zone.labelPt}
      </motion.div>
    </div>
  )
}

/* ── Skill card ── */
function SkillCard({ zone, pt }: { zone: Zone; pt: boolean }) {
  return (
    <motion.div
      key={zone.id}
      initial={{ opacity: 0, x: 20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: -12, filter: 'blur(8px)' }}
      transition={{ duration: 0.32, ease: E }}
      style={{
        padding: 'clamp(1.5rem,3vw,2rem)',
        borderRadius: 18,
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${zone.color}25`,
        boxShadow: `0 0 50px ${zone.color}0d`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gradient accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${zone.color}, transparent)` }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '1.25rem' }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: `${zone.color}16`, border: `1px solid ${zone.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: zone.color, boxShadow: `0 0 12px ${zone.color}` }} />
        </div>
        <div>
          <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.2rem)', letterSpacing: '-0.045em', color: '#fff', margin: 0, lineHeight: 1 }}>
            {pt ? zone.labelPt : zone.labelEn}
          </h3>
          <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: zone.color, margin: '4px 0 0', opacity: 0.85 }}>
            {pt ? zone.subtitlePt : zone.subtitleEn}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: '1.25rem' }} />

      {/* Description */}
      <p style={{ fontSize: 'clamp(0.85rem,1.4vw,0.98rem)', color: 'rgba(255,255,255,0.42)', lineHeight: 1.78, margin: '0 0 1.5rem' }}>
        {pt ? zone.descPt : zone.descEn}
      </p>

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.38rem' }}>
        {zone.skills.map((s, i) => (
          <motion.span
            key={s}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: E, delay: 0.08 + i * 0.05 }}
            style={{ padding: '0.35rem 0.85rem', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em', background: `${zone.color}14`, border: `1px solid ${zone.color}30`, color: zone.color }}
          >
            {s}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

/* ── Idle placeholder ── */
function IdlePlaceholder({ pt }: { pt: boolean }) {
  return (
    <motion.div
      key="idle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
    >
      <p style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(1.3rem,2.5vw,1.9rem)', letterSpacing: '-0.04em', color: 'rgba(255,255,255,0.13)', lineHeight: 1.2, margin: 0 }}>
        {pt ? 'Passe o cursor\npelos pontos.' : 'Hover over\nthe dots.'}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {ZONES.map((z, i) => (
          <motion.span
            key={z.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.07, duration: 0.3, ease: E }}
            style={{ padding: '0.32rem 0.8rem', borderRadius: 999, fontSize: '0.66rem', fontWeight: 700, color: z.color, border: `1px solid ${z.color}25`, background: `${z.color}0a`, opacity: 0.55 }}
          >
            {pt ? z.labelPt : z.labelEn}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════ MAIN ═══════════════════════════ */
export default function DevAnatomy() {
  const lang = useLanguageStore(s => s.lang)
  const pt   = lang === 'pt'
  const [activeId, setActiveId] = useState<string | null>(null)
  const secRef = useRef<HTMLElement>(null)
  const figRef = useRef<HTMLDivElement>(null)
  const inView = useInView(secRef, { once: true, margin: '-80px' })

  const rX = useSpring(0, { stiffness: 45, damping: 13 })
  const rY = useSpring(0, { stiffness: 45, damping: 13 })

  function onMove(e: React.MouseEvent) {
    const el = figRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    rY.set(((e.clientX - r.left) / r.width - 0.5) * 18)
    rX.set(-((e.clientY - r.top) / r.height - 0.5) * 12)
  }
  function onLeave() { rX.set(0); rY.set(0); setActiveId(null) }

  const zone = ZONES.find(z => z.id === activeId) ?? null

  return (
    <section
      ref={secRef}
      style={{ padding: 'clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem)', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Ambient background glow */}
      <AnimatePresence>
        {zone && (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: zone.color, filter: 'blur(140px)', opacity: 0.055, pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto' }}>

        {/* ── Header (centrado) ── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: E }}
          style={{ textAlign: 'center', marginBottom: 'clamp(3rem,6vw,5rem)' }}
        >
          <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', margin: '0 0 0.9rem', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-block', width: 20, height: 1, background: 'rgba(255,255,255,0.15)' }} />
            {pt ? 'Anatomia de um Dev' : 'Anatomy of a Dev'}
            <span style={{ display: 'inline-block', width: 20, height: 1, background: 'rgba(255,255,255,0.15)' }} />
          </p>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(2.2rem,5.5vw,4.5rem)', letterSpacing: '-0.055em', lineHeight: 0.9, color: '#fff', margin: '0 0 1rem' }}>
            {pt ? 'Um dev, por dentro.' : 'A dev, from the inside.'}
          </h2>
          <p style={{ fontSize: 'clamp(0.82rem,1.4vw,0.96rem)', color: 'rgba(255,255,255,0.28)', margin: 0 }}>
            {pt ? 'Passe o cursor pelos pontos para explorar cada camada.' : 'Hover over the dots to explore each layer.'}
          </p>
        </motion.div>

        {/* ── Content grid ── */}
        <div
          className="anatomy-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 'clamp(2rem,5vw,5rem)', alignItems: 'center', justifyItems: 'center' }}
        >
          {/* LEFT — photo with zone dots */}
          <motion.div
            ref={figRef}
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, ease: E, delay: 0.1 }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{
              rotateX: rX, rotateY: rY,
              transformStyle: 'preserve-3d',
              perspective: 700,
              position: 'relative',
              display: 'inline-block',
              animation: 'figfloat 5.5s ease-in-out infinite',
            }}
          >
            {/* Photo */}
            <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <img
                src="/caiocorpointeiro.png"
                alt="Caio Diniz"
                style={{ display: 'block', width: '100%', maxWidth: 300, height: 'auto', maxHeight: 520, objectFit: 'contain', objectPosition: 'top' }}
                draggable={false}
              />
              {/* Bottom vignette */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '25%', background: 'linear-gradient(to top, #0d0d0d, transparent)', pointerEvents: 'none' }} />
            </div>

            {/* Zone dots overlay */}
            {ZONES.map(z => (
              <ZoneDot
                key={z.id}
                zone={z}
                active={activeId === z.id}
                onEnter={() => setActiveId(z.id)}
                onLeave={() => setActiveId(null)}
              />
            ))}
          </motion.div>

          {/* RIGHT — skill card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, ease: E, delay: 0.18 }}
            style={{ width: '100%', minHeight: 240 }}
          >
            <AnimatePresence mode="wait">
              {zone
                ? <SkillCard key={zone.id} zone={zone} pt={pt} />
                : <IdlePlaceholder key="idle" pt={pt} />
              }
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes figfloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-12px); }
        }
        @media (max-width: 700px) {
          .anatomy-grid { grid-template-columns: 1fr !important; }
          .anatomy-grid > div:first-child { justify-self: center; }
        }
      `}</style>
    </section>
  )
}
