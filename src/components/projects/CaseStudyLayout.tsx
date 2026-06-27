import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Github, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import type { Project } from '@/data/projects'
import { useT } from '@/hooks/useTranslation'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Magnetic from '@/components/animations/Magnetic'
import { staggerContainer, staggerItem } from '@/lib/animations'

gsap.registerPlugin(ScrollTrigger)

interface CaseStudyLayoutProps {
  project: Project
  nextProject?: Project
}

export default function CaseStudyLayout({ project, nextProject }: CaseStudyLayoutProps) {
  const t         = useT()
  const lang      = useLanguageStore((s) => s.lang)
  const setCursor = useCursorStore((s) => s.setState)
  const galleryRef = useRef<HTMLDivElement>(null)

  const galleryImages = project.gallery.slice(1)

  useEffect(() => {
    if (!galleryRef.current || galleryImages.length === 0) return
    const ctx = gsap.context(() => {
      gsap.set('.cs-gallery-item', { y: 30, opacity: 0 })
      gsap.to('.cs-gallery-item', {
        y: 0,
        opacity: 1,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: galleryRef.current!, start: 'top 82%', once: true },
      })
    }, galleryRef)
    return () => ctx.revert()
  }, [galleryImages.length])

  const isLive = project.liveUrl && project.liveUrl !== '#'

  return (
    <main className="pt-28 pb-24">
      {/* Back link */}
      <div className="container-custom mb-12">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-slate-text hover:text-white transition-colors text-sm group"
          onMouseEnter={() => setCursor('pointer')}
          onMouseLeave={() => setCursor('default')}
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          {t.common.allProjects}
        </Link>
      </div>

      {/* Hero meta */}
      <section className="container-custom mb-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col gap-8"
        >
          <motion.div variants={staggerItem} className="flex flex-col gap-4">
            <Badge variant="purple">{project.category}</Badge>
            <h1 className="text-hero font-black text-white tracking-tight leading-tight">
              {project.title}
            </h1>
            <p className="text-slate-text text-lg max-w-2xl leading-relaxed">
              {project.description}
            </p>
          </motion.div>

          {/* Meta row */}
          <motion.div variants={staggerItem} className="flex flex-wrap gap-6 pt-4 border-t border-white/[0.06]">
            <div>
              <span className="text-xs text-white/30 uppercase tracking-widest block mb-1">{t.common.year}</span>
              <span className="text-sm font-semibold text-white">{project.year}</span>
            </div>
            <div>
              <span className="text-xs text-white/30 uppercase tracking-widest block mb-1">{t.common.role}</span>
              <span className="text-sm font-semibold text-white">{project.role}</span>
            </div>
            <div>
              <span className="text-xs text-white/30 uppercase tracking-widest block mb-1">{t.common.tech}</span>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <span key={tech} className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.07] text-slate-text">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div variants={staggerItem} className="flex gap-4">
            {isLive && (
              <Magnetic strength={0.2}>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setCursor('pointer')}
                  onMouseLeave={() => setCursor('default')}
                >
                  <Button variant="primary" size="md">
                    <ExternalLink size={15} />
                    {t.common.live}
                  </Button>
                </a>
              </Magnetic>
            )}
            {project.githubUrl && project.githubUrl !== '#' && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setCursor('pointer')}
                onMouseLeave={() => setCursor('default')}
              >
                <Button variant="secondary" size="md">
                  <Github size={15} />
                  {t.common.github}
                </Button>
              </a>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Hero image — clickable when live URL is available */}
      <div className="container-custom mb-20">
        {isLive ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-3xl overflow-hidden aspect-video group relative"
            onMouseEnter={() => setCursor('view')}
            onMouseLeave={() => setCursor('default')}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              loading="eager"
            />
            {/* Hover overlay with "Visit" label */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-500">
              <span
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white border border-white/30 backdrop-blur-md bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ transform: 'translateY(6px)', transition: 'opacity 0.35s, transform 0.35s' }}
              >
                <ExternalLink size={11} />
                {lang === 'en' ? 'Visit project' : 'Ver projeto'}
              </span>
            </div>
          </a>
        ) : (
          <div className="rounded-3xl overflow-hidden aspect-video">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        )}
      </div>

      {/* Case study content */}
      <div className="container-custom">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-14">
            <section>
              <h2 className="text-2xl font-black text-white mb-4">{t.common.overview}</h2>
              <p className="text-slate-text leading-relaxed">{project.longDescription}</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">{t.common.problem}</h2>
              <p className="text-slate-text leading-relaxed">{project.problem}</p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white mb-4">{t.common.solution}</h2>
              <p className="text-slate-text leading-relaxed">{project.solution}</p>
            </section>

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <section ref={galleryRef}>
                <h2 className="text-2xl font-black text-white mb-6">
                  {lang === 'en' ? 'Gallery' : 'Galeria'}
                </h2>
                <div className="flex flex-col gap-4">
                  {/* First gallery image — full width */}
                  <div className="cs-gallery-item rounded-2xl overflow-hidden aspect-video group">
                    <img
                      src={galleryImages[0]}
                      alt={`${project.title} — screenshot 1`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                  {/* Remaining images — 2-column grid */}
                  {galleryImages.length > 1 && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {galleryImages.slice(1).map((img, i) => (
                        <div key={i} className="cs-gallery-item rounded-2xl overflow-hidden aspect-video group">
                          <img
                            src={img}
                            alt={`${project.title} — screenshot ${i + 2}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-8">
            {/* Features */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">{t.common.features}</h3>
              <ul className="flex flex-col gap-2">
                {project.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-text">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple mt-1.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Results */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">{t.common.results}</h3>
              <ul className="flex flex-col gap-3">
                {project.results.map((r) => (
                  <li key={r} className="text-sm font-semibold text-white flex items-start gap-2">
                    <span className="text-purple mt-0.5">✓</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Live link in sidebar */}
            {isLive && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-5 py-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 group"
                onMouseEnter={() => setCursor('pointer')}
                onMouseLeave={() => setCursor('default')}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/50 group-hover:text-white transition-colors">
                  {lang === 'en' ? 'View live project' : 'Ver projeto online'}
                </span>
                <ExternalLink size={14} className="text-white/30 group-hover:text-white transition-colors" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Next project */}
      {nextProject && (
        <div className="container-custom mt-24 pt-12 border-t border-white/[0.06]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs text-white/30 uppercase tracking-widest block mb-2">
                {t.common.nextProject}
              </span>
              <h3 className="text-2xl font-black text-white">{nextProject.title}</h3>
            </div>
            <Link
              to={`/projects/${nextProject.slug}`}
              onMouseEnter={() => setCursor('pointer')}
              onMouseLeave={() => setCursor('default')}
            >
              <Button variant="secondary" size="md">
                {t.common.view}
                <ArrowRight size={15} />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}
