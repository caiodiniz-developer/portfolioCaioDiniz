import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { useT } from '@/hooks/useTranslation'
import { useLanguageStore } from '@/store/useLanguageStore'
import { projects } from '@/data/projects'
import { useCursorStore } from '@/store/useCursorStore'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { CubertoBtn } from './Hero'

gsap.registerPlugin(ScrollTrigger)

/* ── Single project card ── */
function ProjectCard({ project, index, aspectRatio }: {
  project: typeof projects[0]
  index: number
  aspectRatio: string
}) {
  const setCursor = useCursorStore((s) => s.setState)
  const setLabel  = useCursorStore((s) => s.setLabel)

  return (
    <article className="fp-card group">
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => { setCursor('view'); setLabel('Ver') }}
        onMouseLeave={() => { setCursor('default'); setLabel('') }}
        className="block"
      >
        {/* Image */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{ aspectRatio, background: '#111' }}
        >
          <div
            className="fp-wipe absolute inset-0 z-10"
            style={{ background: '#0d0d0d', transformOrigin: 'bottom' }}
          />
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="fp-img absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            style={{ willChange: 'transform' }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/18 transition-colors duration-500 z-20 pointer-events-none" />

          {/* Top row */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30">
            <span
              className="inline-flex items-center px-2.5 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-white/65 rounded-full"
              style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
            >
              {project.category}
            </span>
            <span
              className="font-black tabular-nums text-white/25"
              style={{ fontSize: '0.55rem', letterSpacing: '0.12em' }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Bottom overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
            style={{ height: '55%', background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}
          />

          {/* Arrow */}
          <div className="absolute bottom-4 right-4 z-30 text-white/0 group-hover:text-white/70 transition-colors duration-300">
            <ArrowUpRight size={17} />
          </div>
        </div>

        {/* Text */}
        <div className="mt-4 px-1 flex flex-col gap-1.5">
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
        </div>
      </a>
    </article>
  )
}

export default function FeaturedProjects() {
  const t         = useT()
  const lang      = useLanguageStore((s) => s.lang)
  const ref       = useRef<HTMLElement>(null)
  const setCursor = useCursorStore((s) => s.setState)
  const prefersReducedMotion = usePrefersReducedMotion()

  /* Alternate aspect ratios create visual rhythm */
  const aspectRatios = ['3/4', '4/3', '3/4', '4/3']

  const leftCol  = projects.filter((_, i) => i % 2 === 0)
  const rightCol = projects.filter((_, i) => i % 2 === 1)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('.fp-hdr, .fp-card', { clearProps: 'all' })
        return
      }

      // ── Section heading: word-by-word SplitType reveal
      const headline = ref.current!.querySelector<HTMLElement>('.fp-headline')
      if (headline) {
        const split = new SplitType(headline, { types: 'words' })
        gsap.from(split.words!, {
          y:        '115%',
          opacity:  0,
          duration: 0.8,
          ease:     'power3.out',
          stagger:  0.055,
          scrollTrigger: {
            trigger: ref.current!,
            start:   'top 80%',
            once:    true,
          },
        })
      }

      // ── Badge fade-in
      gsap.set('.fp-hdr-badge', { y: 18, opacity: 0 })
      gsap.to('.fp-hdr-badge', {
        y: 0, opacity: 1, duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current!, start: 'top 82%', once: true },
      })

      /* ── Staggered wipe entrance for each card */
      ref.current!.querySelectorAll<HTMLElement>('.fp-card').forEach((card) => {
        const wipe = card.querySelector<HTMLElement>('.fp-wipe')
        const img  = card.querySelector<HTMLElement>('.fp-img')
        const text = card.querySelector<HTMLElement>('.mt-4')

        if (wipe) gsap.set(wipe, { scaleY: 1 })
        if (img)  gsap.set(img,  { scale: 1.12 })
        if (text) gsap.set(text, { y: 16, opacity: 0 })

        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 86%', once: true },
          defaults: { ease: 'power4.inOut' },
        })
        if (wipe) tl.to(wipe, { scaleY: 0, duration: 1.0 }, 0)
        if (img)  tl.to(img,  { scale: 1, duration: 1.3, ease: 'power3.out' }, 0)
        if (text) tl.to(text, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.5)

        /* Scroll parallax on image */
        if (img) {
          gsap.to(img, {
            yPercent: -7, ease: 'none',
            scrollTrigger: {
              trigger: card,
              start:   'top bottom',
              end:     'bottom top',
              scrub:   1.2,
            },
          })
        }
      })
    }, ref)

    return () => ctx.revert()
  }, [prefersReducedMotion, lang])

  return (
    <section
      ref={ref}
      className="section-padding"
      style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="container-custom">
        {/* Header */}
        <div className="fp-hdr flex items-end justify-between mb-16 gap-6">
          <div className="flex flex-col gap-4">
            <span className="fp-hdr-badge inline-flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/30">
              <span className="w-5 h-px bg-white/15" />
              {t.projects.badge}
            </span>
            <div style={{ overflow: 'hidden' }}>
              <h2
                className="fp-headline font-black text-white"
                style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.04em', lineHeight: '0.95', display: 'block' }}
              >
                {t.projects.headline}
              </h2>
            </div>
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
        </div>

        {/* Masonry 2-column — right column offset down */}
        <div className="hidden sm:grid gap-x-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {/* Left column */}
          <div className="flex flex-col gap-10">
            {leftCol.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i * 2}
                aspectRatio={aspectRatios[i % aspectRatios.length]}
              />
            ))}
          </div>

          {/* Right column — intentionally offset downward */}
          <div className="flex flex-col gap-10" style={{ marginTop: 'clamp(80px, 14vw, 140px)' }}>
            {rightCol.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i * 2 + 1}
                aspectRatio={aspectRatios[(i + 1) % aspectRatios.length]}
              />
            ))}
          </div>
        </div>

        {/* Mobile: single column */}
        <div className="flex sm:hidden flex-col gap-10">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} aspectRatio="4/3" />
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
