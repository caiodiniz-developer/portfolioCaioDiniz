import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '@/data/projects'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'
import { SITE } from '@/lib/constants'

type Filter = 'All' | 'Full Stack' | 'Front-end' | 'Back-end' | 'Websites' | 'Creative'
const FILTERS: Filter[] = ['All', 'Full Stack', 'Front-end', 'Back-end', 'Websites', 'Creative']
const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* category accent colours */
const CAT_COLOR: Record<string, string> = {
  'Full Stack': 'rgba(100,180,255,0.7)',
  'Front-end':  'rgba(200,150,255,0.7)',
  'Back-end':   'rgba(255,160,100,0.7)',
  'Websites':   'rgba(100,220,150,0.7)',
  'Creative':   'rgba(255,210,80,0.7)',
}

export default function ProjectsPage() {
  const lang      = useLanguageStore(s => s.lang)
  const setCursor = useCursorStore(s => s.setState)
  const setLabel  = useCursorStore(s => s.setLabel)

  const [active,     setActive]     = useState<Filter>('All')
  const [hoveredId,  setHoveredId]  = useState<number | null>(null)
  const [mouse,      setMouse]      = useState({ x: 0, y: 0 })
  const [isWide,     setIsWide]     = useState(false)

  useEffect(() => {
    document.title = `Projects — ${SITE.name}`
    const check = () => setIsWide(window.innerWidth >= 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const filtered       = active === 'All' ? projects : projects.filter(p => p.category === active)
  const hoveredProject = hoveredId != null ? projects.find(p => p.id === hoveredId) ?? null : null

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setMouse({ x: e.clientX, y: e.clientY })
  }, [])

  /* clamp image so it never leaves viewport */
  const imgTop = Math.max(80, Math.min(mouse.y - 100, (typeof window !== 'undefined' ? window.innerHeight : 700) - 240))

  const filterLabel: Record<Filter, string> = {
    All:          lang === 'en' ? 'All'      : 'Todos',
    'Full Stack': 'Full Stack',
    'Front-end':  'Front-end',
    'Back-end':   'Back-end',
    Websites:     lang === 'en' ? 'Websites' : 'Sites',
    Creative:     lang === 'en' ? 'Creative' : 'Criativo',
  }

  return (
    <main
      onMouseMove={onMouseMove}
      style={{ paddingTop: '7rem', background: '#0d0d0d', minHeight: '100vh' }}
    >

      {/* ── Hero ── */}
      <section style={{ padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,5vw,5rem) 0' }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: E }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{
              fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ display: 'inline-block', width: 18, height: 1, background: 'rgba(255,255,255,0.15)' }} />
              {lang === 'en' ? 'Selected work' : 'Trabalhos selecionados'}
            </span>
            <h1 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 900,
              fontSize: 'clamp(3.5rem, 9vw, 8rem)',
              letterSpacing: '-0.055em', lineHeight: 0.88,
              color: '#fff', margin: 0, paddingBottom: '0.1em',
            }}>
              {lang === 'en' ? 'Projects.' : 'Projetos.'}
            </h1>
          </div>

          {/* Animated project counter */}
          <AnimatePresence mode="wait">
            <motion.div
              key={filtered.length}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: E }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, paddingBottom: '0.5rem' }}
            >
              <span style={{
                fontFamily: 'Syne', fontWeight: 900,
                fontSize: 'clamp(2.5rem,6vw,5.5rem)',
                letterSpacing: '-0.05em', color: 'rgba(255,255,255,0.06)', lineHeight: 1,
              }}>
                {String(filtered.length).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.16)' }}>
                {lang === 'en' ? 'projects' : 'projetos'}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── Filters ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.18 }}
        style={{ padding: '1.75rem clamp(1.5rem,5vw,5rem)', display: 'flex', gap: 6, flexWrap: 'wrap' }}
      >
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActive(f)}
            onMouseEnter={() => setCursor('pointer')}
            onMouseLeave={() => setCursor('default')}
            style={{
              padding: '0.4rem 1.05rem', borderRadius: 999,
              border: `1px solid ${active === f ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.08)'}`,
              background: active === f ? 'rgba(255,255,255,0.07)' : 'transparent',
              color: active === f ? '#fff' : 'rgba(255,255,255,0.32)',
              fontSize: '0.67rem', fontWeight: 600, letterSpacing: '0.04em',
              cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
          >
            {filterLabel[f]}
          </button>
        ))}
      </motion.div>

      {/* ── Project rows ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32, delay: i * 0.05, ease: E }}
            >
              <Link
                to={`/projects/${project.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}
                onMouseEnter={() => {
                  setHoveredId(project.id)
                  setCursor('view')
                  setLabel('Ver')
                }}
                onMouseLeave={() => {
                  setHoveredId(null)
                  setCursor('default')
                  setLabel('')
                }}
              >
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                  transition={{ duration: 0.15 }}
                  style={{
                    padding: 'clamp(0.9rem,2.2vw,1.6rem) clamp(1rem,5vw,5rem)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(2ch,3ch) 1fr auto',
                    gap: 'clamp(0.5rem,2vw,2.5rem)',
                    alignItems: 'center',
                    cursor: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Hover line fill from left */}
                  <motion.div
                    animate={{ scaleX: hoveredId === project.id ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: E }}
                    style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      height: 1, background: 'rgba(255,255,255,0.12)',
                      transformOrigin: 'left',
                    }}
                  />

                  {/* Index number */}
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.7rem', color: 'rgba(255,255,255,0.18)',
                    fontWeight: 500, letterSpacing: '0.04em',
                    transition: 'color 0.25s',
                    ...(hoveredId === project.id ? { color: 'rgba(255,255,255,0.4)' } : {}),
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Title + meta */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.28rem', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                      <span style={{
                        fontFamily: 'Syne, sans-serif', fontWeight: 800,
                        fontSize: 'clamp(0.9rem, 2.6vw, 2rem)',
                        letterSpacing: '-0.03em',
                        color: hoveredId === project.id ? '#fff' : 'rgba(255,255,255,0.82)',
                        transition: 'color 0.2s', lineHeight: 1.1,
                        wordBreak: 'break-word',
                      }}>
                        {project.title}
                      </span>
                      {/* Category dot */}
                      <span className="proj-cat" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.13em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.25)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        padding: '0.18rem 0.55rem', borderRadius: 999, whiteSpace: 'nowrap',
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: CAT_COLOR[project.category] ?? 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                        {project.category}
                      </span>
                    </div>
                    {/* Stack */}
                    <div className="proj-stack" style={{ display: 'flex', gap: '0.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      {project.stack.slice(0, 4).map((tech, ti, arr) => (
                        <span key={tech} style={{
                          fontSize: '0.63rem', color: 'rgba(255,255,255,0.2)',
                          fontWeight: 500, letterSpacing: '0.02em',
                        }}>
                          {tech}{ti < arr.length - 1 ? <span style={{ marginLeft: '0.2rem', opacity: 0.4 }}>·</span> : null}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Year + result badge + arrow */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem,1.5vw,1.25rem)', flexShrink: 0 }}>
                    {/* Result badge — slides in on hover, desktop only */}
                    <AnimatePresence>
                      {hoveredId === project.id && isWide && project.results[0] && (
                        <motion.span
                          initial={{ opacity: 0, x: 14 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.22, ease: E }}
                          style={{
                            fontSize:      '0.6rem',
                            fontWeight:    700,
                            letterSpacing: '0.03em',
                            color:         '#4ade80',
                            border:        '1px solid rgba(74,222,128,0.22)',
                            background:    'rgba(74,222,128,0.07)',
                            padding:       '0.22rem 0.75rem',
                            borderRadius:  999,
                            whiteSpace:    'nowrap',
                            flexShrink:    0,
                          }}
                        >
                          {project.results[0]}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    <span className="proj-year" style={{
                      fontSize: '0.68rem', color: 'rgba(255,255,255,0.18)',
                      fontWeight: 600, letterSpacing: '0.08em',
                      fontFamily: '"JetBrains Mono", monospace',
                      flexShrink: 0,
                    }}>
                      {project.year}
                    </span>
                    <motion.div
                      animate={{ x: hoveredId === project.id ? 3 : 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <ArrowUpRight
                        size={15}
                        style={{
                          color: hoveredId === project.id ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.12)',
                          transition: 'color 0.2s',
                        }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '5rem', color: 'rgba(255,255,255,0.18)', fontSize: '0.875rem' }}
          >
            {lang === 'en' ? 'No projects in this category.' : 'Nenhum projeto nessa categoria.'}
          </motion.p>
        )}
      </div>

      {/* ── Floating image preview (desktop hover only) ── */}
      <AnimatePresence>
        {hoveredProject && isWide && (
          <motion.div
            key={hoveredProject.id}
            initial={{ opacity: 0, scale: 0.88, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.88, rotate: 1 }}
            transition={{ duration: 0.2, ease: E }}
            style={{
              position: 'fixed',
              right: 'clamp(2rem,4vw,4.5rem)',
              top: imgTop,
              width: 'clamp(180px, 20vw, 320px)',
              aspectRatio: '16/10',
              borderRadius: 12,
              overflow: 'hidden',
              pointerEvents: 'none',
              zIndex: 300,
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.03)',
            }}
          >
            <img
              src={hoveredProject.image}
              alt={hoveredProject.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(13,13,13,0.72) 100%)' }} />
            {/* Bottom label */}
            <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
                {hoveredProject.title}
              </span>
              <span style={{
                fontSize: '0.56rem', color: 'rgba(255,255,255,0.4)',
                fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                {hoveredProject.year}
              </span>
            </div>
            {/* Category accent line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: CAT_COLOR[hoveredProject.category] ?? 'rgba(255,255,255,0.3)',
              opacity: 0.7,
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 600px) {
          .proj-stack  { display: none !important; }
          .proj-year   { display: none !important; }
          .proj-cat    { display: none !important; }
        }
      `}</style>
    </main>
  )
}
