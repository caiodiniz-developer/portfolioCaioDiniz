import { useState, useRef } from 'react'
import { motion, AnimatePresence, useSpring } from 'framer-motion'
import { useInView } from 'framer-motion'
import { Brain, Heart, Code2, Layers } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'

const E: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface Zone {
  id: string
  labelPt: string; labelEn: string
  subtitlePt: string; subtitleEn: string
  descPt: string; descEn: string
  skills: string[]
  color: string
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>
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
    color: '#b8b3ff',
    icon: Brain,
    top: '9%', left: '50%',
  },
  {
    id: 'heart',
    labelPt: 'Coração', labelEn: 'Heart',
    subtitlePt: 'O que me move', subtitleEn: 'What drives me',
    descPt: 'Paixão real por código que funciona, performa e que o próximo dev vai adorar manter.',
    descEn: 'Real passion for code that works, performs and that the next dev will love maintaining.',
    skills: ['Clean Code', 'SOLID', 'Performance', 'DX', 'Open Source'],
    color: '#f0a6b4',
    icon: Heart,
    top: '38%', left: '50%',
  },
  {
    id: 'hands',
    labelPt: 'Mãos', labelEn: 'Hands',
    subtitlePt: 'O que construo todo dia', subtitleEn: 'What I build every day',
    descPt: 'As ferramentas que domino para transformar ideias em produto funcional de verdade.',
    descEn: 'The tools I master to turn ideas into actual working products.',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Git'],
    color: '#a0d4b8',
    icon: Code2,
    top: '57%', left: '50%',
  },
  {
    id: 'base',
    labelPt: 'Base', labelEn: 'Foundation',
    subtitlePt: 'O que sustenta tudo', subtitleEn: 'What holds it all up',
    descPt: 'Infraestrutura robusta, CI/CD e deploys que não te acordam de madrugada.',
    descEn: "Robust infrastructure, CI/CD and deploys that won't wake you up at 3am.",
    skills: ['CI/CD', 'Linux', 'Vercel', 'Railway', 'Segurança', 'Monitoramento'],
    color: '#d4b896',
    icon: Layers,
    top: '84%', left: '50%',
  },
]

/* ── Zone dot ── */
function ZoneDot({ zone, active, onEnter, onLeave }: {
  zone: Zone
  active: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  const Icon = zone.icon
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
      {/* Invisible hit area */}
      <div style={{ position: 'absolute', width: 72, height: 72, borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 11 }} />

      {/* Dot */}
      <motion.div
        animate={active
          ? { scale: 1.1 }
          : { scale: [1, 1.22, 1] }
        }
        transition={active
          ? { duration: 0.22, ease: E }
          : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{
          width: 16, height: 16,
          borderRadius: '50%',
          background: `${zone.color}cc`,
          position: 'relative', zIndex: 12,
        }}
      />

      {/* Icon ring — appears on hover */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.22, ease: E }}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 36, height: 36,
              borderRadius: '50%',
              background: 'rgba(10,10,10,0.85)',
              border: `1px solid ${zone.color}35`,
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 13,
            }}
          >
            <Icon size={14} color={zone.color} strokeWidth={1.7} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Label pill */}
      <motion.div
        animate={{ opacity: active ? 1 : 0, y: active ? 0 : 5 }}
        transition={{ duration: 0.22, ease: E }}
        style={{
          position: 'absolute',
          top: '100%', left: '50%',
          transform: 'translateX(-50%)',
          marginTop: 14,
          background: 'rgba(20,20,20,0.85)',
          border: `1px solid rgba(255,255,255,0.09)`,
          color: 'rgba(255,255,255,0.55)',
          fontSize: '0.5rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          padding: '3px 9px',
          borderRadius: 99,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          backdropFilter: 'blur(8px)',
        }}
      >
        {zone.labelPt}
      </motion.div>
    </div>
  )
}

/* ── Skill card ── */
function SkillCard({ zone, pt }: { zone: Zone; pt: boolean }) {
  const Icon = zone.icon
  return (
    <motion.div
      key={zone.id}
      initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.4, 1] }}
      style={{
        padding: 'clamp(1.5rem,3vw,2rem)',
        borderRadius: 16,
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Thin top accent line */}
      <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: `linear-gradient(90deg, transparent, ${zone.color}45, transparent)` }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: '1.25rem' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={16} color={zone.color} strokeWidth={1.6} />
        </div>
        <div>
          <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(1.4rem,2.8vw,2rem)', letterSpacing: '-0.045em', color: '#fff', margin: 0, lineHeight: 1 }}>
            {pt ? zone.labelPt : zone.labelEn}
          </h3>
          <p style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: zone.color, margin: '5px 0 0', opacity: 0.7 }}>
            {pt ? zone.subtitlePt : zone.subtitleEn}
          </p>
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: '1.25rem' }} />

      <p style={{ fontSize: 'clamp(0.8rem,1.2vw,0.91rem)', color: 'rgba(255,255,255,0.36)', lineHeight: 1.82, margin: '0 0 1.5rem' }}>
        {pt ? zone.descPt : zone.descEn}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.32rem' }}>
        {zone.skills.map((s, i) => (
          <motion.span
            key={s}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: E, delay: 0.12 + i * 0.065 }}
            style={{
              padding: '0.3rem 0.78rem',
              borderRadius: 999,
              fontSize: '0.66rem',
              fontWeight: 600,
              letterSpacing: '0.03em',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              color: 'rgba(255,255,255,0.42)',
            }}
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
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
    >
      <p style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(1.1rem,2vw,1.6rem)', letterSpacing: '-0.04em', color: 'rgba(255,255,255,0.09)', lineHeight: 1.3, margin: 0, whiteSpace: 'pre-line' }}>
        {pt ? 'Passe o cursor\npelos pontos.' : 'Hover the dots\nto explore.'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {ZONES.map((z, i) => {
          const Icon = z.icon
          return (
            <motion.div
              key={z.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + i * 0.1, duration: 0.35, ease: E }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.3 }}
            >
              <Icon size={13} color={z.color} strokeWidth={1.6} />
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.04em' }}>
                {pt ? z.labelPt : z.labelEn}
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════ MAIN ═══════════════════════════ */
export default function DevAnatomy() {
  const lang  = useLanguageStore(s => s.lang)
  const pt    = lang === 'pt'
  const [activeId, setActiveId] = useState<string | null>(null)
  const secRef  = useRef<HTMLElement>(null)
  const figRef  = useRef<HTMLDivElement>(null)
  const inView  = useInView(secRef, { once: true, margin: '-80px' })

  const rX = useSpring(0, { stiffness: 50, damping: 16 })
  const rY = useSpring(0, { stiffness: 50, damping: 16 })

  function onMove(e: React.MouseEvent) {
    const el = figRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    rY.set(((e.clientX - r.left) / r.width - 0.5) * 12)
    rX.set(-((e.clientY - r.top) / r.height - 0.5) * 8)
  }
  function onLeave() { rX.set(0); rY.set(0); setActiveId(null) }

  const zone = ZONES.find(z => z.id === activeId) ?? null

  return (
    <section
      ref={secRef}
      style={{ padding: 'clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem)', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Very subtle ambient — barely visible */}
      <AnimatePresence>
        {zone && (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{ position: 'absolute', top: '10%', left: '25%', width: 480, height: 480, borderRadius: '50%', background: zone.color, filter: 'blur(180px)', opacity: 0.035, pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 960, margin: '0 auto' }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: E }}
          style={{ textAlign: 'center', marginBottom: 'clamp(3rem,6vw,5rem)' }}
        >
          <p style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', margin: '0 0 0.9rem', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-block', width: 16, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            {pt ? 'Anatomia de um Dev' : 'Anatomy of a Dev'}
            <span style={{ display: 'inline-block', width: 16, height: 1, background: 'rgba(255,255,255,0.1)' }} />
          </p>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,5vw,4rem)', letterSpacing: '-0.055em', lineHeight: 0.9, color: '#fff', margin: '0 0 1rem' }}>
            {pt ? 'Um dev, por dentro.' : 'A dev, from the inside.'}
          </h2>
          <p style={{ fontSize: 'clamp(0.78rem,1.2vw,0.88rem)', color: 'rgba(255,255,255,0.2)', margin: 0 }}>
            {pt ? 'Explore cada camada.' : 'Explore each layer.'}
          </p>
        </motion.div>

        {/* ── Content grid ── */}
        <div
          className="anatomy-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 'clamp(2rem,5vw,4.5rem)', alignItems: 'center', justifyItems: 'center' }}
        >
          {/* LEFT — photo, no box */}
          <motion.div
            ref={figRef}
            initial={{ opacity: 0, x: -18 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.95, ease: E, delay: 0.08 }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{
              rotateX: rX, rotateY: rY,
              transformStyle: 'preserve-3d',
              perspective: 900,
              position: 'relative',
              display: 'inline-block',
              animation: 'figfloat 6.5s ease-in-out infinite',
            }}
          >
            {/* Bare image — no box, no border, transparent PNG */}
            <img
              src="/caiocorpointeiro.png"
              alt="Caio Diniz"
              style={{ display: 'block', width: '100%', maxWidth: 380, height: 'auto', maxHeight: 570, objectFit: 'contain', objectPosition: 'top', userSelect: 'none', pointerEvents: 'none' }}
              draggable={false}
            />

            {/* Zone dots */}
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

          {/* RIGHT — card */}
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.95, ease: E, delay: 0.16 }}
            style={{ width: '100%', minHeight: 220 }}
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
          50%      { transform: translateY(-10px); }
        }
        @media (max-width: 680px) {
          .anatomy-grid { grid-template-columns: 1fr !important; }
          .anatomy-grid > div:first-child { justify-self: center; }
        }
      `}</style>
    </section>
  )
}
