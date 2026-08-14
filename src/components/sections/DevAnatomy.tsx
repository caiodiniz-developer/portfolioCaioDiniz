import { Suspense, useState, useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { Brain, Heart, Code2, Layers } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { getLenis } from '@/hooks/useLenis'

const E: [number, number, number, number] = [0.22, 1, 0.36, 1]
const TARGET_H = 2.0

/* ── Types ── */
interface Zone {
  id: string
  labelPt: string; labelEn: string
  subtitlePt: string; subtitleEn: string
  descPt: string; descEn: string
  skills: string[]
  color: string
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>
  yFrac: number
}

const ZONES: Zone[] = [
  {
    id: 'head',
    labelPt: 'Mente', labelEn: 'Mind',
    subtitlePt: 'Onde tudo começa', subtitleEn: 'Where everything starts',
    descPt: 'Arquitetura limpa, raciocínio lógico e decisões técnicas que escalam sem quebrar.',
    descEn: 'Clean architecture, logical thinking and technical decisions that scale without breaking.',
    skills: ['Algoritmos', 'System Design', 'Problem Solving', 'Code Review', 'UI/UX'],
    color: '#b8b3ff', icon: Brain, yFrac: 0.91,
  },
  {
    id: 'heart',
    labelPt: 'Coração', labelEn: 'Heart',
    subtitlePt: 'O que me move', subtitleEn: 'What drives me',
    descPt: 'Paixão real por código que funciona, performa e que o próximo dev vai adorar manter.',
    descEn: 'Real passion for code that works, performs and that the next dev will love maintaining.',
    skills: ['Clean Code', 'SOLID', 'Performance', 'DX', 'Open Source'],
    color: '#f0a6b4', icon: Heart, yFrac: 0.62,
  },
  {
    id: 'hands',
    labelPt: 'Mãos', labelEn: 'Hands',
    subtitlePt: 'O que construo todo dia', subtitleEn: 'What I build every day',
    descPt: 'As ferramentas que domino para transformar ideias em produto funcional de verdade.',
    descEn: 'The tools I master to turn ideas into actual working products.',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Git'],
    color: '#a0d4b8', icon: Code2, yFrac: 0.46,
  },
  {
    id: 'base',
    labelPt: 'Base', labelEn: 'Foundation',
    subtitlePt: 'O que sustenta tudo', subtitleEn: 'What holds it all up',
    descPt: 'Infraestrutura robusta, CI/CD e deploys que não te acordam de madrugada.',
    descEn: "Robust infrastructure, CI/CD and deploys that won't wake you up at 3am.",
    skills: ['CI/CD', 'Linux', 'Vercel', 'Railway', 'Segurança', 'Monitoramento'],
    color: '#d4b896', icon: Layers, yFrac: 0.05,
  },
]

/* ────────────────────────────────────────────
   Dot world positions — supports multiple dots per zone
   (hands split into left + right)
──────────────────────────────────────────── */
interface ZoneDot { dotId: string; zoneId: string; pos: THREE.Vector3 }

const ZONE_DOTS: ZoneDot[] = [
  { dotId: 'head',        zoneId: 'head',  pos: new THREE.Vector3(0,     0.91 * TARGET_H, 0.12) },
  { dotId: 'heart',       zoneId: 'heart', pos: new THREE.Vector3(0,     0.62 * TARGET_H, 0.12) },
  { dotId: 'hands-left',  zoneId: 'hands', pos: new THREE.Vector3(-0.30, 0.39 * TARGET_H, 0.10) },
  { dotId: 'hands-right', zoneId: 'hands', pos: new THREE.Vector3( 0.30, 0.39 * TARGET_H, 0.10) },
  { dotId: 'base',        zoneId: 'base',  pos: new THREE.Vector3(0,     0.05 * TARGET_H, 0.12) },
]

/* ────────────────────────────────────────────
   DOT PROJECTOR — runs inside Canvas
   projects world positions → canvas px → updates DOM refs directly
──────────────────────────────────────────── */
function DotProjector({ dotRefs, modelOffset }: {
  dotRefs: React.RefObject<Map<string, HTMLDivElement | null>>
  modelOffset: React.RefObject<[number, number, number]>
}) {
  const { camera, size } = useThree()
  const vec = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    ZONE_DOTS.forEach(dot => {
      const el = dotRefs.current?.get(dot.dotId)
      if (!el) return

      const off = modelOffset.current ?? [0, 0, 0]
      vec.set(dot.pos.x + off[0], dot.pos.y, dot.pos.z + off[2])
      vec.project(camera)

      const x = ((vec.x + 1) / 2) * size.width
      const y = ((-vec.y + 1) / 2) * size.height

      // Use transform instead of left/top — compositor-only, no layout reflow per frame
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`

      const behind = vec.z > 1
      el.style.opacity       = behind ? '0' : '1'
      el.style.pointerEvents = behind ? 'none' : 'auto'
    })
  })

  return null
}

/* ────────────────────────────────────────────
   3-D MODEL
──────────────────────────────────────────── */
function HumanModel({ onOffset }: { onOffset: (off: [number, number, number]) => void }) {
  const { scene } = useGLTF('/caiocorpointeiro.glb')

  const { s, groupPos } = useMemo(() => {
    const bbox = new THREE.Box3().setFromObject(scene)
    const size = bbox.getSize(new THREE.Vector3())
    const center = bbox.getCenter(new THREE.Vector3())
    const s = TARGET_H / size.y
    const groupPos: [number, number, number] = [-center.x * s, -bbox.min.y * s, -center.z * s]
    return { s, groupPos }
  }, [scene])

  useEffect(() => {
    // Tell projector about X/Z offset so dots centre on the model
    onOffset([groupPos[0], 0, groupPos[2]])
  }, [groupPos, onOffset])

  return (
    <group position={groupPos} scale={s}>
      <primitive object={scene} />
    </group>
  )
}

/* ────────────────────────────────────────────
   SKILL CARD
──────────────────────────────────────────── */
function SkillCard({ zone, pt }: { zone: Zone; pt: boolean }) {
  const Icon = zone.icon
  return (
    <motion.div
      key={zone.id}
      initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
      transition={{ duration: 0.48, ease: [0.25, 1, 0.4, 1] }}
      style={{ padding: 'clamp(2rem,4vw,2.8rem)', borderRadius: 18, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: `linear-gradient(90deg,transparent,${zone.color}40,transparent)` }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: '1.3rem' }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={17} color={zone.color} strokeWidth={1.6} />
        </div>
        <div>
          <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(1.7rem,3.2vw,2.8rem)', letterSpacing: '-0.045em', color: '#fff', margin: 0, lineHeight: 1 }}>
            {pt ? zone.labelPt : zone.labelEn}
          </h3>
          <p style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: zone.color, margin: '5px 0 0', opacity: 0.7 }}>
            {pt ? zone.subtitlePt : zone.subtitleEn}
          </p>
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: '1.3rem' }} />
      <p style={{ fontSize: 'clamp(0.88rem,1.4vw,1.02rem)', color: 'rgba(255,255,255,0.38)', lineHeight: 1.82, margin: '0 0 1.8rem' }}>
        {pt ? zone.descPt : zone.descEn}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
        {zone.skills.map((s, i) => (
          <motion.span key={s} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: E, delay: 0.1 + i * 0.065 }}
            style={{ padding: '0.3rem 0.78rem', borderRadius: 999, fontSize: '0.67rem', fontWeight: 600, letterSpacing: '0.03em', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.45)' }}>
            {s}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

function IdlePlaceholder({ pt }: { pt: boolean }) {
  return (
    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <p style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(1.1rem,2vw,1.6rem)', letterSpacing: '-0.04em', color: 'rgba(255,255,255,0.09)', lineHeight: 1.3, margin: 0, whiteSpace: 'pre-line' }}>
        {pt ? 'Passe o cursor\npelos pontos.' : 'Hover the dots\nto explore.'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {ZONES.map((z, i) => {
          const Icon = z.icon
          return (
            <motion.div key={z.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.1, duration: 0.35, ease: E }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.28 }}>
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

/* ════════════════════════════════════════════
   ZONE DOT HTML ELEMENT
════════════════════════════════════════════ */
function ZoneDotEl({ zone, active }: { zone: Zone; active: boolean }) {
  const Icon = zone.icon
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, cursor: 'crosshair' }}>
      {/* Pulse ring (idle) */}
      {!active && (
        <div style={{
          position: 'absolute', width: 26, height: 26, borderRadius: '50%',
          border: `1.5px solid ${zone.color}`, opacity: 0.45,
          animation: 'zdpulse 2.2s ease-in-out infinite',
        }} />
      )}
      {/* Dot / icon */}
      <div style={{
        width: active ? 32 : 12, height: active ? 32 : 12, borderRadius: '50%',
        background: active ? 'rgba(8,8,8,0.9)' : zone.color,
        border: active ? `1px solid ${zone.color}55` : 'none',
        backdropFilter: active ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: active ? 'blur(12px)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.26s cubic-bezier(0.22,1,0.36,1)',
      }}>
        {active && <Icon size={13} color={zone.color} strokeWidth={1.7} />}
      </div>
      {/* Label pill */}
      <div style={{
        position: 'absolute', top: 'calc(100% + 6px)', left: '50%',
        transform: 'translateX(-50%)',
        padding: '2px 8px', borderRadius: 99,
        background: 'rgba(10,10,10,0.85)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.55)',
        fontSize: '0.44rem', fontWeight: 700,
        letterSpacing: '0.13em', textTransform: 'uppercase' as const,
        whiteSpace: 'nowrap' as const, fontFamily: 'Inter, sans-serif',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        opacity: active ? 1 : 0, transition: 'opacity 0.18s',
        pointerEvents: 'none' as const,
      }}>
        {zone.labelPt}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   MAIN EXPORT
════════════════════════════════════════════ */
export default function DevAnatomy() {
  const lang   = useLanguageStore(s => s.lang)
  const pt     = lang === 'pt'
  const [activeId, setActiveId] = useState<string | null>(null)
  const secRef  = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const inView  = useInView(secRef, { once: true, margin: '-80px' })
  const zone    = ZONES.find(z => z.id === activeId) ?? null

  // Refs for dot DOM elements — updated by DotProjector every frame
  const dotRefs     = useRef<Map<string, HTMLDivElement | null>>(new Map())
  // X/Z offset from the model's center (communicated by HumanModel after load)
  const modelOffset = useRef<[number, number, number]>([0, 0, 0])

  const handleOffset = useRef(([x, _y, z]: [number, number, number]) => {
    modelOffset.current = [x, 0, z]
  })

  // On mobile: scroll card into view when a zone is activated.
  // Use Lenis.scrollTo so it doesn't conflict with the smooth scroll engine.
  useEffect(() => {
    if (!activeId) return
    if (!window.matchMedia('(hover: none)').matches) return
    const id = setTimeout(() => {
      const el = cardRef.current
      if (!el) return
      const lenis = getLenis()
      if (lenis) {
        lenis.scrollTo(el, { offset: -40, duration: 0.9 })
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }, 120)
    return () => clearTimeout(id)
  }, [activeId])

  return (
    <section
      ref={secRef}
      className="anatomy-section"
      style={{ padding: 'clamp(4rem,10vw,10rem) clamp(1.25rem,5vw,6rem)', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Ambient glow */}
      <AnimatePresence>
        {zone && (
          <motion.div key={zone.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
            style={{ position: 'absolute', top: '15%', left: '20%', width: 600, height: 600, borderRadius: '50%', background: zone.color, filter: 'blur(200px)', opacity: 0.03, pointerEvents: 'none' }} />
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, ease: E }}
          style={{ textAlign: 'center', marginBottom: 'clamp(4rem,7vw,6rem)' }}>
          <p style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', margin: '0 0 0.9rem', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-block', width: 16, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            {pt ? 'Anatomia de um Dev' : 'Anatomy of a Dev'}
            <span style={{ display: 'inline-block', width: 16, height: 1, background: 'rgba(255,255,255,0.1)' }} />
          </p>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(2.5rem,6vw,5.5rem)', letterSpacing: '-0.055em', lineHeight: 0.9, color: '#fff', margin: '0 0 1rem' }}>
            {pt ? 'Um dev, por dentro.' : 'A dev, from the inside.'}
          </h2>
          <p className="anatomy-hint" style={{ fontSize: 'clamp(0.78rem,1.2vw,0.88rem)', color: 'rgba(255,255,255,0.2)', margin: 0 }}>
            <span className="anatomy-hint-desktop">{pt ? 'Arraste para girar · passe nos pontos para explorar' : 'Drag to rotate · hover dots to explore'}</span>
            <span className="anatomy-hint-mobile">{pt ? 'Toque para girar · toque nos pontos para explorar' : 'Touch to rotate · tap dots to explore'}</span>
          </p>
        </motion.div>

        {/* Grid */}
        <div className="anatomy-grid"
          style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 'clamp(2rem,5vw,5rem)', alignItems: 'center', justifyItems: 'center' }}>

          {/* LEFT — 3D canvas + dot overlays */}
          <motion.div
            initial={{ opacity: 0, x: -18 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.95, ease: E, delay: 0.08 }}
            className="anatomy-canvas-wrap"
          style={{ width: '100%', maxWidth: 560, position: 'relative', aspectRatio: '3/4' }}
          >
            {/* Canvas */}
            <Canvas
              gl={{ alpha: true, antialias: true }}
              camera={{ position: [0, TARGET_H * 0.5, 3.8], fov: 36, near: 0.05, far: 50 }}
              style={{ width: '100%', height: '100%', background: 'transparent' }}
            >
              <ambientLight intensity={0.6} />
              <directionalLight position={[3, 5, 3]} intensity={1.1} />
              <directionalLight position={[-2, 2, -3]} intensity={0.35} color="#d0c8ff" />
              <Environment preset="studio" />
              <OrbitControls
                target={[0, TARGET_H * 0.50, 0]}
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.7}
                enableDamping
                dampingFactor={0.07}
                minPolarAngle={Math.PI * 0.1}
                maxPolarAngle={Math.PI * 0.9}
              />
              <Suspense fallback={null}>
                <HumanModel onOffset={handleOffset.current} />
              </Suspense>
              <DotProjector dotRefs={dotRefs} modelOffset={modelOffset} />
            </Canvas>

            {/* Dot overlays — positioned by DotProjector each frame */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
              {ZONE_DOTS.map(dot => {
                const zoneData = ZONES.find(z => z.id === dot.zoneId)!
                return (
                  <div
                    key={dot.dotId}
                    ref={el => { dotRefs.current.set(dot.dotId, el) }}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      opacity: 0,
                      pointerEvents: 'none',
                      transition: 'opacity 0.2s',
                      zIndex: 10,
                    }}
                    onMouseEnter={() => setActiveId(dot.zoneId)}
                    onMouseLeave={() => { if (!window.matchMedia('(hover: none)').matches) setActiveId(null) }}
                    onClick={() => { if (window.matchMedia('(hover: none)').matches) setActiveId(p => p === dot.zoneId ? null : dot.zoneId) }}
                  >
                    <ZoneDotEl zone={zoneData} active={activeId === dot.zoneId} />
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* RIGHT — skill card */}
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, x: 18 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.95, ease: E, delay: 0.16 }}
            style={{ width: '100%', minHeight: 280 }}
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
        @keyframes zdpulse {
          0%,100% { opacity: 0.35; transform: scale(1); }
          50%      { opacity: 0.7;  transform: scale(1.3); }
        }
        .anatomy-hint-mobile { display: none; }
        @media (hover: none) {
          .anatomy-hint-desktop { display: none; }
          .anatomy-hint-mobile  { display: inline; }
        }
        @media (max-width: 720px) {
          .anatomy-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .anatomy-canvas-wrap {
            max-width: 320px !important;
            aspect-ratio: 2/3 !important;
            margin: 0 auto;
          }
        }
        @media (max-width: 420px) {
          .anatomy-canvas-wrap {
            max-width: 260px !important;
          }
        }
      `}</style>
    </section>
  )
}

useGLTF.preload('/caiocorpointeiro.glb')
