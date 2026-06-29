import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, List, LayoutGrid, ShoppingBag, Monitor, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { projects } from '@/data/projects'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'
import { SITE } from '@/lib/constants'

type Filter   = 'All' | 'Full Stack' | 'Front-end' | 'Back-end' | 'Websites' | 'Creative'
type ViewMode = 'list' | 'deck' | 'store' | 'os'

const FILTERS: Filter[] = ['All', 'Full Stack', 'Front-end', 'Back-end', 'Websites', 'Creative']
const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

const CAT_COLOR: Record<string, string> = {
  'Full Stack': 'rgba(100,180,255,0.7)',
  'Front-end':  'rgba(200,150,255,0.7)',
  'Back-end':   'rgba(255,160,100,0.7)',
  'Websites':   'rgba(100,220,150,0.7)',
  'Creative':   'rgba(255,210,80,0.7)',
}

function complexity(stack: string[]) {
  const n = stack.length
  if (n <= 2) return 'R$ 2k'
  if (n <= 4) return 'R$ 5k'
  if (n <= 6) return 'R$ 12k'
  return 'R$ 25k+'
}

interface WinState { x: number; y: number; z: number }

export default function ProjectsPage() {
  const lang      = useLanguageStore(s => s.lang)
  const setCursor = useCursorStore(s => s.setState)
  const setLabel  = useCursorStore(s => s.setLabel)

  const [active,    setActive]    = useState<Filter>('All')
  const [viewMode,  setViewMode]  = useState<ViewMode>('list')
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [mouse,     setMouse]     = useState({ x: 0, y: 0 })
  const [isWide,    setIsWide]    = useState(false)

  // Deck
  const [deckIdx,    setDeckIdx]    = useState(0)
  const [deckDir,    setDeckDir]    = useState(1)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  // OS
  const [openWindows, setOpenWindows] = useState<Record<number, WinState>>({})
  const [maxZ,        setMaxZ]        = useState(10)
  const [dragging,    setDragging]    = useState<{ id: number; ox: number; oy: number; mx: number; my: number } | null>(null)

  const filtered       = active === 'All' ? projects : projects.filter(p => p.category === active)
  const hoveredProject = hoveredId != null ? projects.find(p => p.id === hoveredId) ?? null : null
  const imgTop         = Math.max(80, Math.min(mouse.y - 100, (typeof window !== 'undefined' ? window.innerHeight : 700) - 240))

  useEffect(() => {
    document.title = `Projects — ${SITE.name}`
    const check = () => setIsWide(window.innerWidth >= 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => { setDeckIdx(0) }, [active, viewMode])

  // Release drag when mouse lifted anywhere
  useEffect(() => {
    const up = () => setDragging(null)
    window.addEventListener('mouseup', up)
    return () => window.removeEventListener('mouseup', up)
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setMouse({ x: e.clientX, y: e.clientY })
    if (!dragging) return
    const dx = e.clientX - dragging.mx
    const dy = e.clientY - dragging.my
    setOpenWindows(prev => ({
      ...prev,
      [dragging.id]: { ...prev[dragging.id], x: dragging.ox + dx, y: dragging.oy + dy },
    }))
  }, [dragging])

  // ── OS helpers ─────────────────────────────────────────────────────────────
  function bringToFront(id: number) {
    const z = maxZ + 1
    setMaxZ(z)
    setOpenWindows(prev => ({ ...prev, [id]: { ...prev[id], z } }))
    return z
  }

  function openWindow(id: number) {
    if (openWindows[id]) { bringToFront(id); return }
    const z   = maxZ + 1
    const cnt = Object.keys(openWindows).length
    setMaxZ(z)
    setOpenWindows(prev => ({ ...prev, [id]: { x: 80 + cnt * 32, y: 100 + cnt * 28, z } }))
  }

  function closeWindow(id: number) {
    setOpenWindows(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  function startDrag(id: number, mx: number, my: number) {
    const win = openWindows[id]
    if (!win) return
    const z = maxZ + 1
    setMaxZ(z)
    setOpenWindows(prev => ({ ...prev, [id]: { ...prev[id], z } }))
    setDragging({ id, ox: win.x, oy: win.y, mx, my })
  }

  // ── Deck helpers ──────────────────────────────────────────────────────────
  function deckNext() { setDeckDir(1);  setDeckIdx(i => (i + 1) % filtered.length) }
  function deckPrev() { setDeckDir(-1); setDeckIdx(i => (i - 1 + filtered.length) % filtered.length) }

  const filterLabel: Record<Filter, string> = {
    All: lang === 'en' ? 'All' : 'Todos',
    'Full Stack': 'Full Stack', 'Front-end': 'Front-end', 'Back-end': 'Back-end',
    Websites: lang === 'en' ? 'Websites' : 'Sites',
    Creative: lang === 'en' ? 'Creative' : 'Criativo',
  }

  const currentCard = filtered[deckIdx % Math.max(filtered.length, 1)]

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main onMouseMove={onMouseMove} style={{ paddingTop: '7rem', background: '#0d0d0d', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,5vw,5rem) 0' }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: E }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 18, height: 1, background: 'rgba(255,255,255,0.15)' }} />
              {lang === 'en' ? 'Selected work' : 'Trabalhos selecionados'}
            </span>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(3.5rem, 9vw, 8rem)', letterSpacing: '-0.055em', lineHeight: 0.88, color: '#fff', margin: 0, paddingBottom: '0.1em' }}>
              {lang === 'en' ? 'Projects.' : 'Projetos.'}
            </h1>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={filtered.length} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: E }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, paddingBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'Syne', fontWeight: 900, fontSize: 'clamp(2.5rem,6vw,5.5rem)', letterSpacing: '-0.05em', color: 'rgba(255,255,255,0.06)', lineHeight: 1 }}>
                {String(filtered.length).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.16)' }}>
                {lang === 'en' ? 'projects' : 'projetos'}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── Filters + View Switcher ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.18 }}
        style={{ padding: '1.75rem clamp(1.5rem,5vw,5rem)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActive(f)}
              onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}
              style={{ padding: '0.4rem 1.05rem', borderRadius: 999, border: `1px solid ${active === f ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.08)'}`, background: active === f ? 'rgba(255,255,255,0.07)' : 'transparent', color: active === f ? '#fff' : 'rgba(255,255,255,0.32)', fontSize: '0.67rem', fontWeight: 600, letterSpacing: '0.04em', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
              {filterLabel[f]}
            </button>
          ))}
        </div>

        {/* View mode switcher */}
        <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: 3 }}>
          {([
            { id: 'list',  icon: <List size={13} />,        label: 'Lista'   },
            { id: 'deck',  icon: <LayoutGrid size={13} />,  label: 'Cards'   },
            { id: 'store', icon: <ShoppingBag size={13} />, label: 'Loja'    },
            { id: 'os',    icon: <Monitor size={13} />,     label: 'Desktop' },
          ] as const).map(vm => (
            <button key={vm.id} onClick={() => setViewMode(vm.id)} title={vm.label}
              onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 28, borderRadius: 6, border: 'none', background: viewMode === vm.id ? 'rgba(255,255,255,0.1)' : 'transparent', color: viewMode === vm.id ? '#fff' : 'rgba(255,255,255,0.28)', cursor: 'pointer', transition: 'all 0.15s' }}>
              {vm.icon}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ══════════ View Modes ══════════ */}
      <AnimatePresence mode="wait">

        {/* ── LIST ── */}
        {viewMode === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <AnimatePresence mode="popLayout">
                {filtered.map((project, i) => (
                  <motion.div key={project.id} layout
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.32, delay: i * 0.05, ease: E }}>
                    <Link to={`/projects/${project.slug}`} style={{ textDecoration: 'none', display: 'block' }}
                      onMouseEnter={() => { setHoveredId(project.id); setCursor('view'); setLabel('Ver') }}
                      onMouseLeave={() => { setHoveredId(null); setCursor('default'); setLabel('') }}>
                      <motion.div whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }} transition={{ duration: 0.15 }}
                        style={{ padding: 'clamp(0.9rem,2.2vw,1.6rem) clamp(1rem,5vw,5rem)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: 'minmax(2ch,3ch) 1fr auto', gap: 'clamp(0.5rem,2vw,2.5rem)', alignItems: 'center', cursor: 'none', position: 'relative', overflow: 'hidden' }}>
                        <motion.div animate={{ scaleX: hoveredId === project.id ? 1 : 0 }} transition={{ duration: 0.35, ease: E }}
                          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.12)', transformOrigin: 'left' }} />
                        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', color: hoveredId === project.id ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.18)', fontWeight: 500, transition: 'color 0.25s' }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.28rem', minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(0.9rem, 2.6vw, 2rem)', letterSpacing: '-0.03em', color: hoveredId === project.id ? '#fff' : 'rgba(255,255,255,0.82)', transition: 'color 0.2s', lineHeight: 1.1 }}>
                              {project.title}
                            </span>
                            <span className="proj-cat" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.09)', padding: '0.18rem 0.55rem', borderRadius: 999, whiteSpace: 'nowrap' }}>
                              <span style={{ width: 5, height: 5, borderRadius: '50%', background: CAT_COLOR[project.category] ?? 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                              {project.category}
                            </span>
                          </div>
                          <div className="proj-stack" style={{ display: 'flex', gap: '0.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            {project.stack.slice(0, 4).map((tech, ti, arr) => (
                              <span key={tech} style={{ fontSize: '0.63rem', color: 'rgba(255,255,255,0.2)', fontWeight: 500 }}>
                                {tech}{ti < arr.length - 1 ? <span style={{ marginLeft: '0.2rem', opacity: 0.4 }}>·</span> : null}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem,1.5vw,1.25rem)', flexShrink: 0 }}>
                          <AnimatePresence>
                            {hoveredId === project.id && isWide && project.results[0] && (
                              <motion.span initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.22, ease: E }}
                                style={{ fontSize: '0.6rem', fontWeight: 700, color: '#4ade80', border: '1px solid rgba(74,222,128,0.22)', background: 'rgba(74,222,128,0.07)', padding: '0.22rem 0.75rem', borderRadius: 999, whiteSpace: 'nowrap' }}>
                                {project.results[0]}
                              </motion.span>
                            )}
                          </AnimatePresence>
                          <span className="proj-year" style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.18)', fontWeight: 600, letterSpacing: '0.08em', fontFamily: '"JetBrains Mono", monospace' }}>
                            {project.year}
                          </span>
                          <motion.div animate={{ x: hoveredId === project.id ? 3 : 0 }} transition={{ duration: 0.18 }}>
                            <ArrowUpRight size={15} style={{ color: hoveredId === project.id ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.12)', transition: 'color 0.2s' }} />
                          </motion.div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <p style={{ textAlign: 'center', padding: '5rem', color: 'rgba(255,255,255,0.18)', fontSize: '0.875rem' }}>
                  {lang === 'en' ? 'No projects in this category.' : 'Nenhum projeto nessa categoria.'}
                </p>
              )}
            </div>

            {/* Floating image preview */}
            <AnimatePresence>
              {hoveredProject && isWide && (
                <motion.div key={hoveredProject.id}
                  initial={{ opacity: 0, scale: 0.88, rotate: -1 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.88, rotate: 1 }}
                  transition={{ duration: 0.2, ease: E }}
                  style={{ position: 'fixed', right: 'clamp(2rem,4vw,4.5rem)', top: imgTop, width: 'clamp(180px, 20vw, 320px)', aspectRatio: '16/10', borderRadius: 12, overflow: 'hidden', pointerEvents: 'none', zIndex: 300, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 100px rgba(0,0,0,0.75)' }}>
                  <img src={hoveredProject.image} alt={hoveredProject.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(13,13,13,0.72) 100%)' }} />
                  <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fff' }}>{hoveredProject.title}</span>
                    <span style={{ fontSize: '0.56rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{hoveredProject.year}</span>
                  </div>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: CAT_COLOR[hoveredProject.category] ?? '#fff', opacity: 0.7 }} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── DECK ── */}
        {viewMode === 'deck' && currentCard && (
          <motion.div key="deck" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div style={{ padding: '1.5rem clamp(1rem,5vw,5rem) 5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
              onTouchStart={e => setTouchStart(e.touches[0].clientX)}
              onTouchEnd={e => {
                if (touchStart === null) return
                const dx = e.changedTouches[0].clientX - touchStart
                if (Math.abs(dx) > 60) { dx < 0 ? deckNext() : deckPrev() }
                setTouchStart(null)
              }}>

              {/* Stack of cards */}
              <div style={{ position: 'relative', width: '100%', maxWidth: 520, height: 490 }}>
                {/* Ghost cards behind */}
                {[2, 1].map(off => {
                  const p = filtered[(deckIdx + off) % filtered.length]
                  return p ? (
                    <div key={`g${off}`} style={{
                      position: 'absolute', inset: 0, borderRadius: 22,
                      background: `rgba(255,255,255,${off === 2 ? 0.025 : 0.04})`,
                      border: '1px solid rgba(255,255,255,0.06)',
                      transform: `translateY(${off * 13}px) scale(${1 - off * 0.04}) rotate(${off % 2 === 0 ? off * 1.8 : -off * 1.2}deg)`,
                      transformOrigin: 'bottom center', pointerEvents: 'none',
                    }} />
                  ) : null
                })}

                {/* Main card */}
                <AnimatePresence mode="wait" custom={deckDir}>
                  <motion.div key={currentCard.id} custom={deckDir}
                    variants={{
                      enter: (d: number) => ({ x: d * 360, opacity: 0, rotate: d * 8, scale: 0.95 }),
                      center: { x: 0, opacity: 1, rotate: 0, scale: 1 },
                      exit:  (d: number) => ({ x: -d * 360, opacity: 0, rotate: -d * 8, scale: 0.95 }),
                    }}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.38, ease: E }}
                    style={{ position: 'absolute', inset: 0, background: '#141414', borderRadius: 22, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.55)' }}>

                    {/* Image area */}
                    <div style={{ height: '52%', overflow: 'hidden', position: 'relative' }}>
                      <img src={currentCard.image} alt={currentCard.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, #141414 100%)' }} />
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: CAT_COLOR[currentCard.category] ?? '#fff', opacity: 0.65 }} />
                      {currentCard.featured && (
                        <span style={{ position: 'absolute', top: 14, right: 14, fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', padding: '0.28rem 0.65rem', borderRadius: 999 }}>
                          Destaque
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.1rem 1.4rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                        <h2 style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.15rem,3vw,1.65rem)', letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.1 }}>
                          {currentCard.title}
                        </h2>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', border: '1px solid rgba(255,255,255,0.09)', padding: '0.18rem 0.55rem', borderRadius: 999, flexShrink: 0, marginTop: 4 }}>
                          <span style={{ width: 4, height: 4, borderRadius: '50%', background: CAT_COLOR[currentCard.category] ?? '#fff' }} />
                          {currentCard.category}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.42)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {currentCard.description}
                      </p>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {currentCard.stack.slice(0, 5).map(t => (
                          <span key={t} style={{ fontSize: '0.58rem', fontWeight: 600, padding: '0.18rem 0.52rem', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.38)' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                      <Link to={`/projects/${currentCard.slug}`} style={{ marginTop: 2, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#fff', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1.1rem', borderRadius: 999, width: 'fit-content', transition: 'all 0.2s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; setCursor('pointer') }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; setCursor('default') }}>
                        Ver projeto <ArrowUpRight size={11} />
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button onClick={deckPrev} onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}
                  style={{ width: 42, height: 42, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)' }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                  <ChevronLeft size={17} />
                </button>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.68rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em' }}>
                  {String(deckIdx + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}
                </span>
                <button onClick={deckNext} onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}
                  style={{ width: 42, height: 42, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)' }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STORE ── */}
        {viewMode === 'store' && (
          <motion.div key="store" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div style={{ padding: '0.5rem clamp(1rem,4vw,5rem) 5rem' }}>
              <p style={{ margin: '0 0 1.75rem', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
                {filtered.length} {lang === 'en' ? 'products available' : 'produtos disponíveis'} · {lang === 'en' ? 'estimated values' : 'valores estimados'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.1rem' }}>
                {filtered.map((project, i) => (
                  <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04, ease: E }}>
                    <Link to={`/projects/${project.slug}`} style={{ textDecoration: 'none', display: 'block' }}
                      onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}>
                      <div className="store-card"
                        style={{ background: '#111', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', transition: 'border-color 0.25s, transform 0.3s', cursor: 'pointer' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.16)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
                        {/* Product image */}
                        <div style={{ height: 175, overflow: 'hidden', position: 'relative' }}>
                          <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.07)' }}
                            onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }} />
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: CAT_COLOR[project.category] ?? '#fff', opacity: 0.5 }} />
                          {project.featured && (
                            <span style={{ position: 'absolute', top: 10, left: 10, fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(74,222,128,0.14)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', padding: '0.22rem 0.58rem', borderRadius: 999 }}>
                              Destaque
                            </span>
                          )}
                          <span style={{ position: 'absolute', top: 10, right: 10, fontSize: '0.56rem', fontWeight: 700, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.55)', padding: '0.2rem 0.6rem', borderRadius: 999 }}>
                            {project.year}
                          </span>
                        </div>

                        <div style={{ padding: '0.9rem 1.05rem 1.1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: '0.35rem' }}>
                            <span style={{ width: 4, height: 4, borderRadius: '50%', background: CAT_COLOR[project.category] ?? '#fff', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>
                              {project.category} · {project.type}
                            </span>
                          </div>
                          <h3 style={{ margin: '0 0 0.35rem', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.025em', color: '#fff', lineHeight: 1.1 }}>
                            {project.title}
                          </h3>
                          <p style={{ margin: '0 0 0.75rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {project.description}
                          </p>

                          <div style={{ display: 'flex', gap: '0.28rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                            {project.stack.slice(0, 4).map(t => (
                              <span key={t} style={{ fontSize: '0.54rem', fontWeight: 600, padding: '0.15rem 0.48rem', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.32)' }}>
                                {t}
                              </span>
                            ))}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <div>
                              <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em', marginBottom: 2 }}>VALOR ESTIMADO</div>
                              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.02em' }}>
                                {complexity(project.stack)}
                              </div>
                            </div>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#fff', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', padding: '0.42rem 0.85rem', borderRadius: 999 }}>
                              Ver <ArrowUpRight size={10} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── OS DESKTOP ── */}
        {viewMode === 'os' && (
          <motion.div key="os" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            style={{ position: 'relative', minHeight: 'calc(100svh - 220px)', padding: '1.5rem clamp(1rem,4vw,5rem) 4rem' }}>
            {/* Desktop texture */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 30%, rgba(40,40,90,0.35) 0%, transparent 55%), radial-gradient(ellipse at 75% 70%, rgba(60,20,70,0.25) 0%, transparent 50%)', pointerEvents: 'none' }} />

            <p style={{ position: 'relative', margin: '0 0 1.75rem', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
              {lang === 'en' ? 'Click to open · Drag windows' : 'Clique para abrir · Arraste as janelas'}
            </p>

            {/* Desktop icons */}
            <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: '1.75rem' }}>
              {filtered.map((project, i) => (
                <motion.div key={project.id} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.22, delay: i * 0.04, ease: E }}>
                  <div onClick={() => openWindow(project.id)} onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', width: 80, userSelect: 'none' }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, overflow: 'hidden', border: openWindows[project.id] ? '2px solid rgba(255,255,255,0.4)' : '2px solid rgba(255,255,255,0.08)', position: 'relative', background: '#1a1a1a', transition: 'all 0.2s', boxShadow: openWindows[project.id] ? '0 0 0 3px rgba(255,255,255,0.07), 0 8px 20px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.3)' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'scale(1.1) translateY(-2px)'; el.style.borderColor = openWindows[project.id] ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)' }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.borderColor = openWindows[project.id] ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.08)' }}>
                      <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <div style={{ position: 'absolute', bottom: 3, right: 3, width: 9, height: 9, borderRadius: '50%', background: CAT_COLOR[project.category] ?? '#fff', border: '1.5px solid rgba(0,0,0,0.4)' }} />
                    </div>
                    <span style={{ fontSize: '0.57rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 1.3, textShadow: '0 1px 5px rgba(0,0,0,0.9)', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {project.title}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Windows */}
            <AnimatePresence>
              {Object.entries(openWindows).map(([idStr, win]) => {
                const id      = Number(idStr)
                const project = projects.find(p => p.id === id)
                if (!project) return null
                return (
                  <motion.div key={id}
                    initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.88 }}
                    transition={{ duration: 0.18 }}
                    style={{ position: 'fixed', left: win.x, top: win.y, zIndex: win.z, width: 'min(440px, calc(100vw - 2rem)', background: '#141414', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04)' }}
                    onMouseDown={() => bringToFront(id)}>
                    {/* Title bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', background: '#1c1c1c', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'grab' }}
                      onMouseDown={e => { e.preventDefault(); startDrag(id, e.clientX, e.clientY) }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={e => { e.stopPropagation(); closeWindow(id) }}
                          style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', border: 'none', cursor: 'pointer', padding: 0 }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
                      </div>
                      <span style={{ flex: 1, textAlign: 'center', fontSize: '0.63rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.05em', pointerEvents: 'none', userSelect: 'none' }}>
                        {project.title} — {project.year}
                      </span>
                    </div>

                    {/* Window content */}
                    <div style={{ maxHeight: 370, overflowY: 'auto' }}>
                      <div style={{ height: 155, overflow: 'hidden', position: 'relative' }}>
                        <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 45%, #141414 100%)' }} />
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: CAT_COLOR[project.category] ?? '#fff', opacity: 0.6 }} />
                      </div>
                      <div style={{ padding: '0.9rem 1.1rem 1.15rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.26)', border: '1px solid rgba(255,255,255,0.09)', padding: '0.15rem 0.48rem', borderRadius: 999 }}>{project.category}</span>
                        </div>
                        <h3 style={{ margin: '0 0 0.4rem', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.15rem', color: '#fff', letterSpacing: '-0.025em' }}>
                          {project.title}
                        </h3>
                        <p style={{ margin: '0 0 0.7rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.42)', lineHeight: 1.55 }}>
                          {project.description}
                        </p>
                        <div style={{ display: 'flex', gap: '0.28rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                          {project.stack.map(t => (
                            <span key={t} style={{ fontSize: '0.55rem', fontWeight: 600, padding: '0.16rem 0.52rem', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.36)' }}>{t}</span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Link to={`/projects/${project.slug}`} onClick={() => closeWindow(id)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#fff', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)', padding: '0.48rem 0.9rem', borderRadius: 999, textDecoration: 'none' }}
                            onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}>
                            Ver projeto <ArrowUpRight size={10} />
                          </Link>
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.63rem', fontWeight: 700, color: 'rgba(255,255,255,0.38)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.48rem 0.9rem', borderRadius: 999, textDecoration: 'none' }}
                              onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}>
                              Live <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </AnimatePresence>

      <style>{`
        @media (max-width: 600px) {
          .proj-stack { display: none !important; }
          .proj-year  { display: none !important; }
          .proj-cat   { display: none !important; }
        }
      `}</style>
    </main>
  )
}
