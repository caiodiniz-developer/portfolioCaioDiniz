import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { useT } from '@/hooks/useTranslation'
import { useLanguageStore } from '@/store/useLanguageStore'
import { projects } from '@/data/projects'
import { useCursorStore } from '@/store/useCursorStore'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { CubertoBtn } from './Hero'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* ── Single project card ── */
function ProjectCard({ project, index, aspectRatio, disableTilt }: {
  project: typeof projects[0]
  index: number
  aspectRatio: string
  disableTilt?: boolean
}) {
  const setCursor = useCursorStore((s) => s.setState)
  const setLabel  = useCursorStore((s) => s.setLabel)
  const cardRef   = useRef<HTMLElement>(null)

  /* 3D tilt — event-driven, no ScrollTrigger needed */
  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (disableTilt || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2)
    const dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2)
    gsap.to(cardRef.current, {
      rotateX: -dy * 5, rotateY: dx * 5,
      transformPerspective: 900,
      duration: 0.35, ease: 'power2.out',
    })
  }

  function handleMouseLeave() {
    if (disableTilt || !cardRef.current) return
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.65, ease: 'power3.out' })
  }

  return (
    <motion.article
      ref={cardRef as React.RefObject<HTMLElement>}
      className="fp-card group"
      style={{ transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, ease: E }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main click → project detail */}
      <Link
        to={`/projects/${project.slug}`}
        onMouseEnter={() => { setCursor('view'); setLabel('Ver') }}
        onMouseLeave={() => { setCursor('default'); setLabel('') }}
        className="block"
      >
        {/* Image container */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{ aspectRatio, background: '#111' }}
        >
          {/* fp-wipe reveal — Framer Motion (IntersectionObserver, always reliable) */}
          <motion.div
            className="absolute inset-0 z-10"
            style={{ background: '#0d0d0d', transformOrigin: 'bottom' }}
            initial={{ scaleY: 1 }}
            whileInView={{ scaleY: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* Image with scale reveal */}
          <motion.img
            src={project.image}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ willChange: 'transform' }}
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.2, ease: E }}
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/18 transition-colors duration-500 z-20 pointer-events-none" />

          {/* Top row badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-none">
            <span
              className="inline-flex items-center px-2.5 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-white/65 rounded-full"
              style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
            >
              {project.category}
            </span>
            <span className="font-black tabular-nums text-white/25" style={{ fontSize: '0.55rem', letterSpacing: '0.12em' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Bottom gradient */}
          <div
            className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
            style={{ height: '55%', background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}
          />

          {/* External link — stops propagation so card link doesn't also fire */}
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            onMouseEnter={e => { e.stopPropagation(); setCursor('pointer'); setLabel('') }}
            onMouseLeave={e => { e.stopPropagation(); setCursor('view'); setLabel('Ver') }}
            className="absolute bottom-4 right-4 z-30 text-white/0 group-hover:text-white/70 transition-colors duration-300"
          >
            <ArrowUpRight size={17} />
          </a>
        </div>

        {/* Text block */}
        <motion.div
          className="mt-4 px-1 flex flex-col gap-1.5"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, delay: 0.42, ease: E }}
        >
          <div className="flex items-baseline justify-between gap-3">
            <h3
              className="font-black text-white group-hover:text-white/65 transition-colors duration-300"
              style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1rem, 1.6vw, 1.25rem)', letterSpacing: '-0.025em', lineHeight: '1.1' }}
            >
              {project.title}
            </h3>
            <span className="text-[0.6rem] text-white/22 flex-shrink-0">{project.year}</span>
          </div>
          <p className="text-[0.78rem] text-white/32 leading-relaxed line-clamp-2">{project.description}</p>
        </motion.div>
      </Link>
    </motion.article>
  )
}

export default function FeaturedProjects() {
  const t         = useT()
  const lang      = useLanguageStore((s) => s.lang)
  const setCursor = useCursorStore((s) => s.setState)
  const prefersReducedMotion = usePrefersReducedMotion()

  const aspectRatios = ['3/4', '4/3', '3/4', '4/3']
  const leftCol  = projects.filter((_, i) => i % 2 === 0)
  const rightCol = projects.filter((_, i) => i % 2 === 1)

  return (
    <section
      className="section-padding"
      style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="container-custom">
        {/* Header */}
        <motion.div
          className="flex items-end justify-between mb-16 gap-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: E }}
        >
          <div className="flex flex-col gap-4">
            {/* Section marker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.22)' }}>01</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontFamily: 'monospace', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
                {lang === 'en' ? 'selected work' : 'trabalhos selecionados'}
              </span>
            </div>

            <h2
              className="font-black text-white"
              style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.04em', lineHeight: '0.95' }}
            >
              {lang === 'en' ? 'What can I do for you?' : 'O que eu posso fazer por você!'}
            </h2>
          </div>

          <Link
            to="/projects"
            className="hidden sm:block flex-shrink-0"
            onMouseEnter={() => setCursor('pointer')}
            onMouseLeave={() => setCursor('default')}
          >
            <CubertoBtn theme="dark-outline">
              {t.projects.viewAll} <ArrowUpRight size={12} />
            </CubertoBtn>
          </Link>
        </motion.div>

        {/* Masonry 2-column */}
        <div className="hidden sm:grid gap-x-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {/* Left column */}
          <div className="flex flex-col gap-10">
            {leftCol.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i * 2}
                aspectRatio={aspectRatios[i % aspectRatios.length]}
                disableTilt={prefersReducedMotion}
              />
            ))}
          </div>

          {/* Right column — offset down for rhythm */}
          <div className="flex flex-col gap-10" style={{ marginTop: 'clamp(80px, 14vw, 140px)' }}>
            {rightCol.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i * 2 + 1}
                aspectRatio={aspectRatios[(i + 1) % aspectRatios.length]}
                disableTilt={prefersReducedMotion}
              />
            ))}
          </div>
        </div>

        {/* Mobile: single column */}
        <div className="flex sm:hidden flex-col gap-10">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} aspectRatio="4/3" disableTilt />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="flex sm:hidden justify-center mt-12">
          <Link to="/projects" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-white/30 hover:text-white transition-colors duration-300">
            {t.projects.viewAll} <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  )
}
