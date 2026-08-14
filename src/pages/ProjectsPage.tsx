import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { Github, ArrowUpRight } from 'lucide-react'
import { projects } from '@/data/projects'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'
import { SITE } from '@/lib/constants'

type Filter = 'All' | 'Full Stack' | 'Front-end' | 'Back-end'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

const CAT_COLOR: Record<string, string> = {
  'Full Stack': '#60a5fa',
  'Front-end':  '#a78bfa',
  'Back-end':   '#fb923c',
}

const IMG_W = 420
const IMG_H = 275

export default function ProjectsPage() {
  const lang      = useLanguageStore(s => s.lang)
  const setCursor = useCursorStore(s => s.setState)
  const setLabel  = useCursorStore(s => s.setLabel)

  const navigate = useNavigate()

  const [active,   setActive]   = useState<Filter>('All')
  const [hovered,  setHovered]  = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const filtered       = active === 'All' ? projects : projects.filter(p => p.category === active)
  const hoveredProject = projects.find(p => p.id === hovered) ?? null
  const isBackend      = active === 'Back-end'

  // Floating image ref — follows cursor via GSAP
  const floatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = `Projetos — Caio Diniz`
    const check = () => setIsMobile(window.innerWidth < 700)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])


  // GSAP mouse-following image — uses GSAP ticker which is Lenis-synced
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!floatRef.current) return
    gsap.to(floatRef.current, {
      x: e.clientX - IMG_W / 2,
      y: e.clientY - IMG_H / 2,
      duration: 0.55,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <main style={{ paddingTop: '7rem', background: '#0d0d0d', minHeight: '100vh' }}>

      {/* ── Floating cursor image (global, position: fixed) ── */}
      <div
        ref={floatRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: IMG_W, height: IMG_H,
          zIndex: 400,
          pointerEvents: 'none',
          borderRadius: 14,
          overflow: 'hidden',
          opacity: (!isMobile && hovered !== null) ? 1 : 0,
          transition: 'opacity 0.25s',
          willChange: 'transform',
          boxShadow: '0 32px 80px rgba(0,0,0,0.75)',
        }}
      >
        {hoveredProject && (
          <>
            <img
              src={hoveredProject.image}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Category stripe */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: CAT_COLOR[hoveredProject.category] ?? '#fff', opacity: 0.8 }} />
          </>
        )}
      </div>

      {/* ── Hero ── */}
      <section style={{
        padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,5vw,5rem) 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        flexWrap: 'wrap', gap: '1rem',
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
        style={{ padding: '1.5rem clamp(1.5rem,5vw,5rem)', display: 'flex', gap: 6, flexWrap: 'wrap' }}
      >
        {(['All', 'Full Stack', 'Front-end', 'Back-end'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => { setActive(f); setHovered(null) }}
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

      {/* ══ Back-end GitHub redirect ══ */}
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
              <a
                href={SITE.github} target="_blank" rel="noopener noreferrer"
                style={{ position: 'absolute', inset: 22, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', transition: 'all 0.3s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.05)'; el.style.borderColor = 'rgba(255,255,255,0.28)'; setCursor('pointer') }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.borderColor = 'rgba(255,255,255,0.1)'; setCursor('default') }}
              >
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
            <a
              href={SITE.github} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fff', color: '#0d0d0d', borderRadius: 999, padding: '0.9rem 2rem', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', textDecoration: 'none', transition: 'opacity 0.25s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; setCursor('pointer') }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; setCursor('default') }}
            >
              <Github size={13} />
              {lang === 'en' ? 'See on GitHub' : 'Ver no GitHub'} <ArrowUpRight size={12} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ PROJECT LIST (Cuberto style) ══ */}
      {!isBackend && (
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingBottom: '6rem' }}
            onMouseLeave={() => setHovered(null)}
          >
            {filtered.map((project, i) => {
              const isHov    = !isMobile && hovered === project.id
              const isDimmed = !isMobile && hovered !== null && !isHov
              const accent   = CAT_COLOR[project.category] ?? '#fff'

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.48, ease: E, delay: i * 0.06 }}
                  onMouseEnter={() => { setHovered(project.id); setCursor('view'); setLabel('Abrir') }}
                  onMouseLeave={() => { setHovered(null); setCursor('default'); setLabel('') }}
                  onClick={() => navigate(`/projects/${project.slug}`)}
                  style={{
                    display: 'flex', alignItems: 'center',
                    padding: '0 clamp(1.5rem,5vw,5rem)',
                    height: isMobile ? 80 : 110,
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    cursor: 'pointer',
                    background: isHov ? 'rgba(255,255,255,0.022)' : 'transparent',
                    opacity: isDimmed ? 0.22 : 1,
                    transition: 'background 0.22s, opacity 0.18s',
                    gap: '1.5rem',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Hover accent bar */}
                  <motion.div
                    style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                      background: accent, transformOrigin: 'top',
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isHov ? 1 : 0 }}
                    transition={{ duration: 0.28, ease: E }}
                  />

                  {/* Index */}
                  <span style={{
                    fontFamily: 'monospace', fontSize: '0.52rem', fontWeight: 700,
                    letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)',
                    flexShrink: 0, minWidth: '2ch',
                    transition: 'color 0.2s',
                    ...(isHov ? { color: accent } : {}),
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Title */}
                  <motion.h2
                    animate={{ x: isHov ? 6 : 0 }}
                    transition={{ duration: 0.28, ease: E }}
                    style={{
                      fontFamily: 'Syne, sans-serif', fontWeight: 900,
                      fontSize: isMobile ? 'clamp(1.1rem,5vw,1.5rem)' : 'clamp(1.4rem,3vw,2.6rem)',
                      letterSpacing: '-0.04em', color: '#fff', margin: 0,
                      flex: 1, lineHeight: 1,
                    }}
                  >
                    {project.title}
                  </motion.h2>

                  {/* Spacer */}
                  <div style={{ flex: 1, display: isMobile ? 'none' : 'block' }} />

                  {/* Meta: category + year */}
                  {!isMobile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexShrink: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent, transition: 'opacity 0.2s', opacity: isHov ? 1 : 0.5 }} />
                        <span style={{ fontSize: '0.54rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                          {project.category}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.5rem', color: 'rgba(255,255,255,0.22)' }}>
                        {project.year}
                      </span>
                    </div>
                  )}

                  {/* Arrow */}
                  <motion.span
                    animate={{ rotate: isHov ? -45 : 0, x: isHov ? 4 : 0 }}
                    transition={{ duration: 0.28, ease: E }}
                    style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.25)', flexShrink: 0, lineHeight: 1 }}
                  >
                    →
                  </motion.span>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      )}

    </main>
  )
}
