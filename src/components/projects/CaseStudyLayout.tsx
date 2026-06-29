import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Github, ArrowRight, Check, Share2 } from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import type { Project } from '@/data/projects'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'
import { useT } from '@/hooks/useTranslation'

gsap.registerPlugin(ScrollTrigger)

interface Props { project: Project; nextProject?: Project }

export default function CaseStudyLayout({ project, nextProject }: Props) {
  const t         = useT()
  const lang      = useLanguageStore((s) => s.lang)
  const setCursor = useCursorStore((s) => s.setState)
  const galleryRef = useRef<HTMLDivElement>(null)
  const galleryImages = project.gallery.slice(1)
  const isLive = project.liveUrl && project.liveUrl !== '#'

  async function shareProject() {
    try {
      if (navigator.share) {
        await navigator.share({ title: `${project.title} — Caio Diniz`, url: window.location.href })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
        alert(lang === 'en' ? 'Link copied!' : 'Link copiado!')
      }
    } catch {/* user cancelled */}
  }

  useEffect(() => {
    if (!galleryRef.current || galleryImages.length === 0) return
    const ctx = gsap.context(() => {
      gsap.set('.cs-gallery-item', { y: 30, opacity: 0 })
      gsap.to('.cs-gallery-item', {
        y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: galleryRef.current!, start: 'top 85%', once: true },
      })
    }, galleryRef)
    return () => ctx.revert()
  }, [galleryImages.length])

  const S: Record<string, React.CSSProperties> = {
    wrap:     { paddingTop: 'clamp(5rem,10vw,7rem)', paddingBottom: 'clamp(3rem,6vw,5rem)', minHeight: '100vh', background: '#0d0d0d' },
    inner:    { maxWidth: 1200, margin: '0 auto', padding: '0 clamp(1.25rem,4vw,4rem)' },
    tag:      { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', letterSpacing: '0.04em', padding: '0.4rem 0', transition: 'color 0.25s' },
    badge:    { display: 'inline-block', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999, padding: '0.3rem 0.9rem', marginBottom: '0.75rem' },
    h1:       { fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(2.2rem,6vw,5.5rem)', letterSpacing: '-0.05em', lineHeight: '0.9', color: '#fff', margin: 0 },
    desc:     { fontSize: 'clamp(0.85rem,1.5vw,1rem)', color: 'rgba(255,255,255,0.35)', lineHeight: 1.75, maxWidth: 640 },
    metaRow:  { display: 'flex', flexWrap: 'wrap', gap: 'clamp(1rem,3vw,2rem)', padding: 'clamp(1rem,2.5vw,1.5rem) 0', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' },
    metaKey:  { fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 4 },
    metaVal:  { fontSize: '0.82rem', fontWeight: 600, color: '#fff' },
    techPill: { fontSize: '0.65rem', padding: '0.25rem 0.7rem', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' },
    btn:      { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '0.7rem 1.4rem', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.25s', cursor: 'pointer' },
    divider:  { height: 1, background: 'rgba(255,255,255,0.07)', margin: 'clamp(2rem,5vw,3.5rem) 0' },
  }

  return (
    <main style={S.wrap}>
      <div style={S.inner}>

        {/* Back */}
        <Link to="/projects" style={S.tag}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; setCursor('pointer') }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; setCursor('default') }}>
          <ArrowLeft size={14} /> {t.common.allProjects}
        </Link>

        <div style={{ height: 'clamp(1.5rem,3vw,2.5rem)' }} />

        {/* Hero meta — no initial:0 so it renders on first navigation, PageTransition handles entrance */}
        <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem,2vw,1.5rem)' }}>
          <span style={S.badge}>{project.category}</span>
          <h1 style={S.h1}>{project.title}</h1>
          <p style={S.desc}>{project.description}</p>

          {/* Meta row */}
          <div style={S.metaRow}>
            <div>
              <p style={S.metaKey}>{t.common.year}</p>
              <p style={S.metaVal}>{project.year}</p>
            </div>
            <div>
              <p style={S.metaKey}>{t.common.role}</p>
              <p style={S.metaVal}>{project.role}</p>
            </div>
            <div>
              <p style={S.metaKey}>{t.common.tech}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: 4 }}>
                {project.stack.map(tech => <span key={tech} style={S.techPill}>{tech}</span>)}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {isLive && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                style={{ ...S.btn, background: '#fff', color: '#0d0d0d' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; setCursor('pointer') }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; setCursor('default') }}>
                <ExternalLink size={13} /> {t.common.live}
              </a>
            )}
            {project.githubUrl && project.githubUrl !== '#' && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                style={{ ...S.btn, background: 'transparent', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.14)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)'; setCursor('pointer') }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)'; setCursor('default') }}>
                <Github size={13} /> {t.common.github}
              </a>
            )}
            <button
              onClick={shareProject}
              style={{ ...S.btn, background: 'transparent', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)'; setCursor('pointer') }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; setCursor('default') }}>
              <Share2 size={13} /> {lang === 'en' ? 'Share' : 'Compartilhar'}
            </button>
          </div>
        </motion.div>

        <div style={S.divider} />

        {/* Hero image — clickable, with persistent "Visit site" badge */}
        <div style={{ borderRadius: 'clamp(12px,2vw,20px)', overflow: 'hidden', aspectRatio: '16/9', position: 'relative', marginBottom: 'clamp(2.5rem,5vw,4rem)' }}>
          {isLive ? (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', height: '100%', position: 'relative' }}
              onMouseEnter={() => setCursor('view')} onMouseLeave={() => setCursor('default')}>
              <img src={project.image} alt={project.title} loading="eager"
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease', display: 'block' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.025)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />

              {/* Persistent "Visit site" badge — always visible */}
              <div style={{
                position: 'absolute', bottom: 'clamp(10px,2vw,18px)', left: 'clamp(10px,2vw,18px)',
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '0.5rem 1rem', borderRadius: 999,
                background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#fff', fontSize: '0.68rem', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                pointerEvents: 'none',
              }}>
                <ExternalLink size={10} />
                {lang === 'en' ? 'Visit site' : 'Visitar site'}
              </div>

              {/* Hover overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.4s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.18)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0)')} />
            </a>
          ) : (
            <img src={project.image} alt={project.title} loading="eager"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          )}
        </div>

        {/* Two-column content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px,100%), 1fr))', gap: 'clamp(2rem,5vw,4rem)', alignItems: 'start' }}>

          {/* Main */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2rem,4vw,3rem)' }}>
            {[
              { head: t.common.overview, body: project.longDescription },
              { head: t.common.problem,  body: project.problem },
              { head: t.common.solution, body: project.solution },
            ].map(({ head, body }) => (
              <section key={head}>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>{head}</h2>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.8 }}>{body}</p>
              </section>
            ))}

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <section ref={galleryRef}>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', color: '#fff', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                  {lang === 'en' ? 'Gallery' : 'Galeria'}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="cs-gallery-item" style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '16/9' }}>
                    <img src={galleryImages[0]} alt={`${project.title} 1`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                  </div>
                  {galleryImages.length > 1 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px,100%),1fr))', gap: '0.75rem' }}>
                      {galleryImages.slice(1).map((img, i) => (
                        <div key={i} className="cs-gallery-item" style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '16/9' }}>
                          <img src={img} alt={`${project.title} ${i + 2}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
                            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '7rem' }}>

            {/* Features */}
            <div style={{ borderRadius: 16, padding: 'clamp(1.25rem,2.5vw,1.75rem)', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '1rem' }}>{t.common.features}</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {project.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.35)', flexShrink: 0, marginTop: 5 }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Results */}
            <div style={{ borderRadius: 16, padding: 'clamp(1.25rem,2.5vw,1.75rem)', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '1rem' }}>{t.common.results}</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {project.results.map(r => (
                  <li key={r} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                    <Check size={12} style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0, marginTop: 2 }} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Live link */}
            {isLive && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', textDecoration: 'none', transition: 'all 0.25s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.22)'; setCursor('pointer') }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; setCursor('default') }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', transition: 'color 0.25s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
                  {lang === 'en' ? 'Visit the site' : 'Visitar o site'}
                </span>
                <ExternalLink size={13} style={{ color: 'rgba(255,255,255,0.25)' }} />
              </a>
            )}
          </div>
        </div>

        {/* Next project */}
        {nextProject && (
          <>
            <div style={{ ...S.divider, marginTop: 'clamp(3rem,6vw,5rem)' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: '0.5rem' }}>{t.common.nextProject}</p>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(1.4rem,3vw,2.2rem)', letterSpacing: '-0.04em', color: '#fff' }}>{nextProject.title}</h3>
              </div>
              <Link to={`/projects/${nextProject.slug}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.7rem 1.4rem', borderRadius: 999, border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.55)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.25s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)'; setCursor('pointer') }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)'; setCursor('default') }}>
                {t.common.view} <ArrowRight size={13} />
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
