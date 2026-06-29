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
  // spotlight ellipse (SVG coords, viewBox 0 0 200 500)
  cx: number; cy: number; rx: number; ry: number
}

const ZONES: Zone[] = [
  {
    id: 'head',
    labelPt: 'Mente', labelEn: 'Mind',
    subtitlePt: 'Onde tudo começa', subtitleEn: 'Where it all starts',
    descPt: 'Arquitetura limpa, raciocínio lógico e decisões técnicas que escalam sem quebrar o sistema.',
    descEn: 'Clean architecture, logical thinking and technical decisions that scale without breaking.',
    skills: ['Algoritmos', 'System Design', 'Problem Solving', 'Code Review', 'UI/UX'],
    color: '#a78bfa',
    cx: 100, cy: 66, rx: 52, ry: 58,
  },
  {
    id: 'heart',
    labelPt: 'Coração', labelEn: 'Heart',
    subtitlePt: 'Por que faço isso', subtitleEn: 'Why I do this',
    descPt: 'Paixão por código limpo, performance e software que deixa o próximo dev feliz de manter.',
    descEn: 'Passion for clean code, performance and software the next dev will be happy to maintain.',
    skills: ['Clean Code', 'SOLID', 'Performance', 'DX', 'Open Source'],
    color: '#f472b6',
    cx: 100, cy: 198, rx: 55, ry: 52,
  },
  {
    id: 'hands',
    labelPt: 'Mãos', labelEn: 'Hands',
    subtitlePt: 'O que construo todo dia', subtitleEn: 'What I build every day',
    descPt: 'As ferramentas que domino para transformar wireframes em produto funcional de verdade.',
    descEn: 'The tools I master to turn wireframes into actual working products.',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Git'],
    color: '#4ade80',
    cx: 100, cy: 273, rx: 110, ry: 23,
  },
  {
    id: 'base',
    labelPt: 'Base', labelEn: 'Foundation',
    subtitlePt: 'O que sustenta tudo', subtitleEn: 'What holds everything up',
    descPt: 'Infraestrutura robusta, CI/CD e deploys que não te acordam de madrugada.',
    descEn: "Robust infrastructure, CI/CD and deploys that won't wake you up at 3am.",
    skills: ['CI/CD', 'Linux', 'Vercel', 'Railway', 'Segurança', 'Monitoramento'],
    color: '#fb923c',
    cx: 100, cy: 447, rx: 64, ry: 40,
  },
]

/* ═══════════════════════════════════════════════════════
   SVG FIGURE — wireframe human body
═══════════════════════════════════════════════════════ */
function Figure({ activeId, onEnter, onLeave }: {
  activeId: string | null
  onEnter: (id: string) => void
  onLeave: () => void
}) {
  const dim = activeId ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.16)'

  return (
    <svg viewBox="0 0 200 500" width="100%" style={{ display: 'block', maxWidth: 260, margin: '0 auto' }}>
      <defs>
        {ZONES.map(z => (
          <filter key={z.id} id={`gf-${z.id}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        ))}
      </defs>

      {/* ── Base wireframe ── */}
      <g stroke={dim} strokeWidth="1.1" fill="none" style={{ transition: 'stroke 0.4s' }}>
        {/* HEAD */}
        <circle cx="100" cy="62" r="44" />
        {/* EYES */}
        <ellipse cx="84" cy="57" rx="9" ry="7" />
        <ellipse cx="116" cy="57" rx="9" ry="7" />
        {/* EYEBROWS */}
        <path d="M 76,48 Q 84,45 92,47" />
        <path d="M 108,47 Q 116,45 124,48" />
        {/* NECK */}
        <line x1="100" y1="106" x2="100" y2="130" />
        {/* COLLAR BONE */}
        <line x1="37" y1="140" x2="163" y2="140" />
        {/* TORSO */}
        <line x1="37" y1="140" x2="46" y2="310" />
        <line x1="163" y1="140" x2="154" y2="310" />
        <line x1="46" y1="310" x2="154" y2="310" />
        {/* SPINE */}
        <line x1="100" y1="130" x2="100" y2="310" />
        {/* RIBS */}
        <path d="M 48,172 Q 100,182 152,172" />
        <path d="M 48,198 Q 100,208 152,198" />
        <path d="M 48,224 Q 100,234 152,224" />
        {/* HEART CROSS */}
        <line x1="92" y1="248" x2="108" y2="248" />
        <line x1="100" y1="240" x2="100" y2="256" />
        {/* PELVIS */}
        <path d="M 46,310 Q 100,325 154,310" />
        {/* LEFT ARM */}
        <line x1="37" y1="140" x2="8" y2="268" />
        <circle cx="6" cy="276" r="9" />
        {/* RIGHT ARM */}
        <line x1="163" y1="140" x2="192" y2="268" />
        <circle cx="194" cy="276" r="9" />
        {/* LEFT LEG */}
        <line x1="73" y1="310" x2="58" y2="448" />
        <line x1="58" y1="448" x2="54" y2="476" />
        <line x1="38" y1="480" x2="68" y2="480" />
        {/* RIGHT LEG */}
        <line x1="127" y1="310" x2="142" y2="448" />
        <line x1="142" y1="448" x2="146" y2="476" />
        <line x1="132" y1="480" x2="162" y2="480" />
        {/* KNEE JOINTS */}
        <circle cx="60" cy="390" r="5" />
        <circle cx="140" cy="390" r="5" />
      </g>

      {/* ── Active zone highlight (colored body parts) ── */}
      {activeId === 'head' && (
        <g stroke="#a78bfa" strokeWidth="1.5" fill="none" opacity={0.9} filter="url(#gf-head)">
          <circle cx="100" cy="62" r="44" />
          <ellipse cx="84" cy="57" rx="9" ry="7" />
          <ellipse cx="116" cy="57" rx="9" ry="7" />
          <path d="M 76,48 Q 84,45 92,47" />
          <path d="M 108,47 Q 116,45 124,48" />
          <line x1="100" y1="106" x2="100" y2="130" />
        </g>
      )}
      {activeId === 'heart' && (
        <g stroke="#f472b6" strokeWidth="1.5" fill="none" opacity={0.9} filter="url(#gf-heart)">
          <line x1="37" y1="140" x2="46" y2="310" />
          <line x1="163" y1="140" x2="154" y2="310" />
          <line x1="100" y1="130" x2="100" y2="310" />
          <path d="M 48,172 Q 100,182 152,172" />
          <path d="M 48,198 Q 100,208 152,198" />
          <path d="M 48,224 Q 100,234 152,224" />
          <line x1="92" y1="248" x2="108" y2="248" />
          <line x1="100" y1="240" x2="100" y2="256" />
          <circle cx="100" cy="248" r="2" fill="#f472b6" stroke="none" />
        </g>
      )}
      {activeId === 'hands' && (
        <g stroke="#4ade80" strokeWidth="1.5" fill="none" opacity={0.9} filter="url(#gf-hands)">
          <line x1="37" y1="140" x2="8" y2="268" />
          <circle cx="6" cy="276" r="9" />
          <line x1="163" y1="140" x2="192" y2="268" />
          <circle cx="194" cy="276" r="9" />
        </g>
      )}
      {activeId === 'base' && (
        <g stroke="#fb923c" strokeWidth="1.5" fill="none" opacity={0.9} filter="url(#gf-base)">
          <line x1="73" y1="310" x2="58" y2="448" />
          <line x1="58" y1="448" x2="54" y2="476" />
          <line x1="38" y1="480" x2="68" y2="480" />
          <line x1="127" y1="310" x2="142" y2="448" />
          <line x1="142" y1="448" x2="146" y2="476" />
          <line x1="132" y1="480" x2="162" y2="480" />
          <circle cx="60" cy="390" r="5" />
          <circle cx="140" cy="390" r="5" />
        </g>
      )}

      {/* ── Zone spotlight glow ── */}
      {ZONES.map(z => (
        <motion.ellipse
          key={`spot-${z.id}`}
          cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry}
          fill={z.color}
          filter={`url(#gf-${z.id})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: activeId === z.id ? 0.22 : 0 }}
          transition={{ duration: 0.3 }}
        />
      ))}

      {/* ── Idle pulse dots ── */}
      {!activeId && ZONES.map((z, i) => (
        <motion.circle
          key={`idle-${z.id}`}
          cx={z.cx} cy={z.cy} r={3.5}
          fill={z.color}
          animate={{ opacity: [0.25, 0.65, 0.25], scale: [1, 1.4, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
          style={{ transformOrigin: `${z.cx}px ${z.cy}px` }}
        />
      ))}

      {/* ── Active zone dashed outline ── */}
      {ZONES.map(z => (
        <motion.ellipse
          key={`outline-${z.id}`}
          cx={z.cx} cy={z.cy} rx={z.rx + 4} ry={z.ry + 4}
          fill="none"
          stroke={z.color}
          strokeWidth="0.8"
          strokeDasharray="5 5"
          initial={{ opacity: 0 }}
          animate={{ opacity: activeId === z.id ? 0.75 : 0 }}
          transition={{ duration: 0.25 }}
        />
      ))}

      {/* ── Invisible hitboxes (order: largest last = on top for event priority) ── */}
      {/* base first (rendered below), head last (on top but smaller so won't eat other events) */}
      {[...ZONES].reverse().map(z => (
        <ellipse
          key={`hit-${z.id}`}
          cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry}
          fill="transparent" stroke="none"
          style={{ cursor: 'crosshair' }}
          onMouseEnter={() => onEnter(z.id)}
          onMouseLeave={onLeave}
        />
      ))}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════
   SKILL CARD
═══════════════════════════════════════════════════════ */
function ZoneCard({ zone, pt }: { zone: Zone; pt: boolean }) {
  return (
    <motion.div
      key={zone.id}
      initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
      transition={{ duration: 0.32, ease: E }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '1.5rem' }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: `${zone.color}14`, border: `1px solid ${zone.color}38`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: zone.color, boxShadow: `0 0 14px ${zone.color}cc` }} />
        </div>
        <div>
          <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', letterSpacing: '-0.045em', color: '#fff', margin: 0, lineHeight: 1 }}>
            {pt ? zone.labelPt : zone.labelEn}
          </h3>
          <p style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: zone.color, margin: '4px 0 0', opacity: 0.9 }}>
            {pt ? zone.subtitlePt : zone.subtitleEn}
          </p>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 'clamp(0.88rem,1.5vw,1.02rem)', color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, margin: '0 0 1.75rem', maxWidth: 420 }}>
        {pt ? zone.descPt : zone.descEn}
      </p>

      {/* Skill tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {zone.skills.map((s, i) => (
          <motion.span
            key={s}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: E, delay: 0.06 + i * 0.055 }}
            style={{ padding: '0.38rem 0.9rem', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em', background: `${zone.color}12`, border: `1px solid ${zone.color}2e`, color: zone.color }}
          >
            {s}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

function IdleCard({ pt }: { pt: boolean }) {
  return (
    <motion.div
      key="idle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
    >
      <p style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(1.4rem,2.8vw,2.2rem)', letterSpacing: '-0.04em', color: 'rgba(255,255,255,0.15)', lineHeight: 1.2, margin: 0, whiteSpace: 'pre-line' }}>
        {pt ? 'Passe o cursor\npela figura.' : 'Hover over\nthe figure.'}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
        {ZONES.map((z, i) => (
          <motion.span
            key={z.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.35, ease: E }}
            style={{ padding: '0.35rem 0.85rem', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {pt ? z.labelPt : z.labelEn}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════ */
export default function DevAnatomy() {
  const lang = useLanguageStore(s => s.lang)
  const pt = lang === 'pt'
  const [activeId, setActiveId] = useState<string | null>(null)
  const secRef  = useRef<HTMLElement>(null)
  const figRef  = useRef<HTMLDivElement>(null)
  const inView  = useInView(secRef, { once: true, margin: '-80px' })

  // 3D mouse tilt
  const rX = useSpring(0, { stiffness: 50, damping: 14 })
  const rY = useSpring(0, { stiffness: 50, damping: 14 })

  function onMouseMove(e: React.MouseEvent) {
    const el = figRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    rY.set(((e.clientX - r.left) / r.width - 0.5) * 22)
    rX.set(-((e.clientY - r.top) / r.height - 0.5) * 14)
  }
  function onMouseLeave() { rX.set(0); rY.set(0); setActiveId(null) }

  const zone = ZONES.find(z => z.id === activeId) ?? null

  return (
    <section
      ref={secRef}
      style={{ padding: 'clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem)', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Ambient background glow matching active zone */}
      <AnimatePresence>
        {zone && (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ position: 'absolute', top: '30%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: zone.color, filter: 'blur(120px)', opacity: 0.04, pointerEvents: 'none', zIndex: 0 }}
          />
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: E }}
          style={{ marginBottom: 'clamp(3rem,6vw,5rem)' }}
        >
          <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', margin: '0 0 0.65rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-block', width: 20, height: 1, background: 'rgba(255,255,255,0.15)' }} />
            {pt ? 'Anatomia de um Dev' : 'Anatomy of a Dev'}
          </p>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,5vw,4rem)', letterSpacing: '-0.05em', lineHeight: 0.92, color: '#fff', margin: 0, whiteSpace: 'pre-line' }}>
            {pt ? 'Um dev,\npor dentro.' : 'A dev,\nfrom the inside.'}
          </h2>
        </motion.div>

        {/* Grid */}
        <div
          className="anatomy-grid"
          style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'clamp(3rem,7vw,7rem)', alignItems: 'center' }}
        >
          {/* LEFT — figure */}
          <motion.div
            ref={figRef}
            initial={{ opacity: 0, x: -28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: E, delay: 0.1 }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d', perspective: 700, animation: 'figfloat 5s ease-in-out infinite' }}
          >
            <Figure activeId={activeId} onEnter={setActiveId} onLeave={() => setActiveId(null)} />
          </motion.div>

          {/* RIGHT — skill card */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: E, delay: 0.2 }}
            style={{ minHeight: 260 }}
          >
            <AnimatePresence mode="wait">
              {zone
                ? <ZoneCard key={zone.id} zone={zone} pt={pt} />
                : <IdleCard key="idle" pt={pt} />
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
        @media (max-width: 720px) {
          .anatomy-grid { grid-template-columns: 1fr !important; }
          .anatomy-grid > *:first-child { max-width: 220px; margin: 0 auto; }
        }
      `}</style>
    </section>
  )
}
