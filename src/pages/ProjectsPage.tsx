import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Github, ArrowUpRight } from 'lucide-react'
import { projects } from '@/data/projects'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'
import { SITE } from '@/lib/constants'

type Filter = 'All' | 'Full Stack' | 'Front-end' | 'Back-end'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]
const COLLAPSED = 74   // px — row height when closed
const EXPANDED  = 400  // px — row height when open

const CAT_COLOR: Record<string, string> = {
  'Full Stack': '#60a5fa',
  'Front-end':  '#a78bfa',
  'Back-end':   '#fb923c',
}

export default function ProjectsPage() {
  const lang      = useLanguageStore(s => s.lang)
  const setCursor = useCursorStore(s => s.setState)
  const setLabel  = useCursorStore(s => s.setLabel)

  const [active,   setActive]   = useState<Filter>('All')
  const [hovered,  setHovered]  = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const filtered        = active === 'All' ? projects : projects.filter(p => p.category === active)
  const selectedProject = projects.find(p => p.id === selected) ?? null
  const isBackend       = active === 'Back-end'

  useEffect(() => {
    document.title = `Projetos — ${SITE.name}`
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const isHov = (id: number) => !isMobile && hovered === id

  return (
    <main style={{ paddingTop: '7rem', background: '#0d0d0d', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{
        padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,5vw,5rem) 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <motion.span
            style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}
            initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: E }}
          >
            <span style={{ display: 'inline-block', width: 18, height: 1, background: 'rgba(255,255,255,0.15)' }} />
            {lang === 'en' ? 'Selected work' : 'Trabalhos selecionados'}
          </motion.span>
          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(3.5rem,9vw,8rem)', letterSpacing: '-0.055em', lineHeight: 0.88, color: '#fff', margin: 0 }}
              initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: E }}
            >
              {lang === 'en' ? 'Projects.' : 'Projetos.'}
            </motion.h1>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ paddingBottom: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={filtered.length}
              style={{ fontFamily: 'Syne', fontWeight: 900, fontSize: 'clamp(2.5rem,6vw,5.5rem)', letterSpacing: '-0.05em', color: 'rgba(255,255,255,0.05)', lineHeight: 1 }}
              initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.3, ease: E }}
            >
              {String(filtered.length).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
          <span style={{ fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.14)' }}>
            {lang === 'en' ? 'projects' : 'projetos'}
          </span>
        </motion.div>
      </section>

      {/* ── Filters ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.12 }}
        style={{ padding: '1.5rem clamp(1.5rem,5vw,5rem)', display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        {(['All', 'Full Stack', 'Front-end', 'Back-end'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => { setActive(f); setHovered(null); setSelected(null) }}
            onMouseEnter={() => setCursor('pointer')}
            onMouseLeave={() => setCursor('default')}
            style={{
              padding: '0.4rem 1.1rem', borderRadius: 999,
              border: `1px solid ${active === f ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
              background: active === f ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: active === f ? '#fff' : 'rgba(255,255,255,0.3)',
              fontSize: '0.67rem', fontWeight: 600, letterSpacing: '0.04em',
              cursor: 'pointer', transition: 'all 0.18s',
            }}
          >
            {f === 'All' ? (lang === 'en' ? 'All' : 'Todos') : f}
          </button>
        ))}
      </motion.div>

      {/* ══ Back-end redirect ══ */}
      <AnimatePresence>
        {isBackend && (
          <motion.div
            key="backend-gh"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: E }}
            style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,5rem)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
          >
            <style>{`@keyframes gh-ring { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            <div style={{ position: 'relative', width: 200, height: 200 }}>
              <svg viewBox="0 0 180 180" width="200" height="200" aria-hidden style={{ position: 'absolute', inset: 0, animation: 'gh-ring 18s linear infinite' }}>
                <defs><path id="ghR" d="M 90,90 m -72,0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0"/></defs>
                <text fill="rgba(255,255,255,0.22)" fontSize="7.5" fontFamily="monospace" fontWeight="700" letterSpacing="8">
                  <textPath href="#ghR">BACK-END · NODE.JS · API · DATABASE · </textPath>
                </text>
              </svg>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)' }} />
              <a href={SITE.github} target="_blank" rel="noopener noreferrer"
                style={{ position: 'absolute', inset: 22, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', transition: 'all 0.3s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.05)'; el.style.borderColor = 'rgba(255,255,255,0.28)'; setCursor('pointer') }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.borderColor = 'rgba(255,255,255,0.1)'; setCursor('default') }}>
                <Github size={28} color="#ffffff" />
                <span style={{ fontSize: '0.44rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>GITHUB</span>
              </a>
            </div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(1.6rem,4vw,2.8rem)', letterSpacing: '-0.04em', color: '#fff', margin: 0 }}>
              {lang === 'en' ? 'Back-end projects' : 'Projetos back-end'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.28)', lineHeight: 1.7, maxWidth: 480, margin: 0 }}>
              {lang === 'en'
                ? 'My back-end projects are pinned on GitHub. Check the featured repositories there.'
                : 'Meus projetos back-end estão fixados no GitHub. Confira os repositórios em destaque.'}
            </p>
            <a href={SITE.github} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fff', color: '#0d0d0d', borderRadius: 999, padding: '0.9rem 2rem', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', textDecoration: 'none', transition: 'opacity 0.25s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; setCursor('pointer') }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; setCursor('default') }}>
              <Github size={13} />
              {lang === 'en' ? 'See on GitHub' : 'Ver no GitHub'} <ArrowUpRight size={12} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ DESKTOP: Accordion Index List ══ */}
      {!isBackend && !isMobile && (
        <div style={{ paddingBottom: '6rem' }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => {
              const open   = isHov(project.id)
              const dimmed = hovered !== null && !open

              return (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{
                    height: open ? EXPANDED : COLLAPSED,
                    opacity: dimmed ? 0.15 : 1,
                  }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{
                    height:   { duration: 0.44, ease: [0.25, 0, 0.28, 1] },
                    opacity:  { duration: 0.22 },
                    layout:   { duration: 0.35 },
                    default:  { duration: 0.4, ease: E, delay: i * 0.04 },
                  }}
                  style={{
                    overflow: 'hidden', cursor: 'pointer',
                    borderBottom: '1px solid rgba(255,255,255,0.055)',
                    position: 'relative',
                  }}
                  onMouseEnter={() => { setHovered(project.id); setCursor('view'); setLabel('Abrir') }}
                  onMouseLeave={() => { setHovered(null); setCursor('default'); setLabel('') }}
                  onClick={() => setSelected(project.id)}
                >
                  {/* ─ Row header (always visible) ─ */}
                  <div style={{
                    height: COLLAPSED,
                    display: 'flex', alignItems: 'center',
                    gap: '1.5rem',
                    padding: '0 clamp(1.5rem,5vw,5rem)',
                    flexShrink: 0,
                  }}>
                    {/* Index */}
                    <span style={{ fontFamily: 'monospace', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.22)', minWidth: '2ch', flexShrink: 0 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Thumbnail (fades out when open) */}
                    <div
                      style={{
                        width: 64, height: 46, borderRadius: 5, overflow: 'hidden', flexShrink: 0,
                        opacity: open ? 0 : 1, transition: 'opacity 0.2s',
                      }}
                    >
                      <img src={project.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>

                    {/* Title (fades out when open — big title shown in expanded area) */}
                    <span
                      style={{
                        fontFamily: 'Syne, sans-serif', fontWeight: 800,
                        fontSize: 'clamp(0.88rem,1.5vw,1.35rem)', letterSpacing: '-0.03em',
                        color: '#fff', flexShrink: 0,
                        opacity: open ? 0 : 1, transition: 'opacity 0.18s',
                      }}
                    >
                      {project.title}
                    </span>

                    {/* Divider line */}
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />

                    {/* Meta */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: CAT_COLOR[project.category] ?? '#fff', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.54rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
                          {project.category}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.5rem', color: 'rgba(255,255,255,0.22)' }}>
                        {project.year}
                      </span>
                      <motion.span
                        animate={{ rotate: open ? -45 : 0, color: open ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)' }}
                        transition={{ duration: 0.3, ease: E }}
                        style={{ fontSize: '1.1rem', lineHeight: 1, display: 'block' }}
                      >
                        →
                      </motion.span>
                    </div>
                  </div>

                  {/* ─ Expanded content ─ */}
                  <div
                    style={{
                      display: 'flex',
                      height: EXPANDED - COLLAPSED,
                      opacity: open ? 1 : 0,
                      transform: open ? 'translateY(0)' : 'translateY(14px)',
                      transition: open
                        ? 'opacity 0.3s 0.12s, transform 0.3s 0.12s'
                        : 'opacity 0.18s, transform 0.18s',
                      pointerEvents: open ? 'auto' : 'none',
                    }}
                  >
                    {/* Image */}
                    <div style={{ flex: '0 0 55%', position: 'relative', overflow: 'hidden' }}>
                      <motion.img
                        layoutId={`pimg-${project.id}`}
                        src={project.image}
                        alt={project.title}
                        style={{
                          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                          transform: open ? 'scale(1)' : 'scale(1.04)',
                          transition: 'transform 0.55s ease',
                        }}
                      />
                      {/* Category accent */}
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2.5, background: CAT_COLOR[project.category] ?? '#fff', opacity: 0.65 }} />
                    </div>

                    {/* Right info */}
                    <div
                      style={{
                        flex: 1,
                        padding: '2rem clamp(2rem,4vw,4rem)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.85rem',
                      }}
                    >
                      {/* Project number */}
                      <span style={{ fontFamily: 'monospace', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.18)' }}>
                        {String(i + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}
                      </span>

                      <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(1.6rem,3.2vw,2.8rem)', letterSpacing: '-0.045em', color: '#fff', margin: 0, lineHeight: 0.95 }}>
                        {project.title}
                      </h2>

                      <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.68, margin: 0, maxWidth: '42ch' }}>
                        {project.description}
                      </p>

                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {project.stack.slice(0, 4).map(t => (
                          <span key={t} style={{ fontSize: '0.52rem', fontWeight: 600, padding: '0.22rem 0.55rem', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.42)' }}>
                            {t}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={e => { e.stopPropagation(); setSelected(project.id) }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.38)'; el.style.color = '#fff'; setCursor('pointer') }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.14)'; el.style.color = 'rgba(255,255,255,0.48)'; setCursor('default') }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 999, padding: '0.7rem 1.5rem', fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.48)', cursor: 'pointer', transition: 'all 0.2s', width: 'fit-content' }}
                      >
                        {lang === 'en' ? 'View project' : 'Ver projeto'} <ArrowUpRight size={11} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ══ MOBILE: Stacked cards ══ */}
      {!isBackend && isMobile && (
        <div style={{ padding: '0.3rem 1rem 5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.38, ease: E, delay: i * 0.05 }}
                style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden', borderRadius: 10, cursor: 'pointer' }}
                onClick={() => setSelected(project.id)}
              >
                <motion.img
                  layoutId={`pimg-${project.id}`}
                  src={project.image}
                  alt={project.title}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%)' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2.5, background: CAT_COLOR[project.category] ?? '#fff', opacity: 0.65 }} />
                <span style={{ position: 'absolute', top: 10, right: 10, fontFamily: 'monospace', fontSize: '0.46rem', fontWeight: 700, color: 'rgba(255,255,255,0.38)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', padding: '0.14rem 0.45rem', borderRadius: 999 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: CAT_COLOR[project.category] ?? '#fff' }} />
                    <span style={{ fontSize: '0.48rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)' }}>
                      {project.category} · {project.year}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: '1.45rem', letterSpacing: '-0.04em', color: '#fff', margin: 0, lineHeight: 1 }}>
                    {project.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ══ MODAL ══ */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ position: 'fixed', inset: 0, zIndex: 490, background: 'rgba(0,0,0,0.84)', backdropFilter: 'blur(20px)', cursor: 'pointer' }}
              onClick={() => setSelected(null)}
            />

            <motion.div
              key={`panel-${selectedProject.id}`}
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              transition={{ duration: 0.44, ease: E }}
              style={{
                position: 'fixed', zIndex: 500,
                ...(isMobile
                  ? { inset: '1rem', borderRadius: 16, flexDirection: 'column' }
                  : { top: '5%', left: '5%', right: '5%', bottom: '5%', borderRadius: 20 }),
                display: 'flex', overflow: 'hidden',
                background: '#0f0f0f',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 60px 140px rgba(0,0,0,0.9)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Image */}
              <div style={{ flex: isMobile ? '0 0 42%' : '0 0 54%', position: 'relative', overflow: 'hidden', minHeight: isMobile ? 200 : 'auto' }}>
                <motion.img
                  layoutId={`pimg-${selectedProject.id}`}
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: isMobile ? 'linear-gradient(to bottom, transparent 50%, rgba(15,15,15,0.98) 100%)' : 'linear-gradient(to right, transparent 60%, rgba(15,15,15,0.7) 100%)' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: CAT_COLOR[selectedProject.category] ?? '#fff', opacity: 0.7 }} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, padding: 'clamp(1.5rem,3.5vw,3rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto', position: 'relative' }}>
                <button
                  onClick={() => setSelected(null)}
                  style={{ position: 'absolute', top: '1rem', right: '1rem', width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', zIndex: 10 }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.4)'; el.style.color = '#fff' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.12)'; el.style.color = 'rgba(255,255,255,0.45)' }}
                >
                  <X size={14} />
                </button>

                <span style={{ fontFamily: 'monospace', fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.16)', marginBottom: '0.75rem' }}>
                  {String(projects.findIndex(p => p.id === selectedProject.id) + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: CAT_COLOR[selectedProject.category] ?? '#fff' }} />
                  <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)' }}>
                    {selectedProject.category} · {selectedProject.year}
                  </span>
                </div>

                <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(1.8rem,3.5vw,3.2rem)', letterSpacing: '-0.045em', color: '#fff', margin: '0 0 1rem', lineHeight: 0.95 }}>
                  {selectedProject.title}
                </h2>

                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.72, margin: '0 0 1.25rem', maxWidth: '44ch' }}>
                  {selectedProject.longDescription || selectedProject.description}
                </p>

                <div style={{ display: 'flex', gap: '0.28rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {selectedProject.stack.map(t => (
                    <span key={t} style={{ fontSize: '0.56rem', fontWeight: 600, padding: '0.24rem 0.6rem', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.45)' }}>
                      {t}
                    </span>
                  ))}
                </div>

                {selectedProject.results.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', marginBottom: '1.75rem' }}>
                    {selectedProject.results.slice(0, 4).map((r, ri) => (
                      <motion.div
                        key={ri}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 + ri * 0.06, duration: 0.3, ease: E }}
                        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '0.6rem 0.8rem' }}
                      >
                        <span style={{ fontSize: '0.63rem', color: '#4ade80', fontWeight: 700, lineHeight: 1.35, display: 'block' }}>{r}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <a
                    href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: '#ffffff', color: '#0d0d0d', borderRadius: 999, padding: '0.8rem 1.65rem', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; setCursor('pointer') }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; setCursor('default') }}
                  >
                    <ExternalLink size={11} />
                    {lang === 'en' ? 'Visit site' : 'Ver site'}
                  </a>
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'transparent', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999, padding: '0.8rem 1.65rem', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.2s' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#fff'; el.style.borderColor = 'rgba(255,255,255,0.3)'; setCursor('pointer') }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'rgba(255,255,255,0.45)'; el.style.borderColor = 'rgba(255,255,255,0.12)'; setCursor('default') }}
                    >
                      <Github size={11} /> GitHub
                    </a>
                  )}
                </div>

                <span style={{ marginTop: '1.5rem', fontSize: '0.48rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.12)' }}>
                  ESC {lang === 'en' ? 'to close' : 'para fechar'}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}
