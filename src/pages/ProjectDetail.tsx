import { useEffect } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ExternalLink, Github } from 'lucide-react'
import { getProjectBySlug, projects } from '@/data/projects'
import LiveDemo from '@/components/projects/LiveDemo'
import TechStack from '@/components/projects/TechStack'
import { SITE } from '@/lib/constants'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'

/**
 * Deliberately minimal case study: the running product and the stack that built
 * it. The long-form version (problem / solution / features / results / gallery)
 * was doing the talking that the product itself does better — a visitor can
 * click through the real thing right here instead of reading about it.
 */
export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = getProjectBySlug(slug ?? '')
  const lang = useLanguageStore(s => s.lang)
  const en = lang === 'en'
  const setCursor = useCursorStore(s => s.setState)

  const currentIndex = projects.findIndex(p => p.slug === slug)
  const nextProject = projects[(currentIndex + 1) % projects.length]

  useEffect(() => {
    if (project) document.title = `${project.title} — ${SITE.name}`
  }, [project])

  useEffect(() => { setCursor('default') }, [slug, setCursor])

  if (!project) return <Navigate to="/projects" replace />

  const isLive = project.liveUrl && project.liveUrl !== '#'

  return (
    <main style={{ background: '#0d0d0d', minHeight: '100vh' }}>
      <div
        className="container-custom"
        style={{ paddingTop: 'clamp(6.5rem,11vw,9rem)', paddingBottom: 'clamp(4rem,8vw,7rem)' }}
      >
        {/* Back */}
        <Link
          to="/projects"
          className="pd-back"
          onMouseEnter={() => setCursor('pointer')}
          onMouseLeave={() => setCursor('default')}
        >
          <ArrowLeft size={13} />
          {en ? 'All projects' : 'Todos os projetos'}
        </Link>

        {/* Title row */}
        <header className="pd-head">
          <div style={{ minWidth: 0 }}>
            <span className="pd-meta">
              {project.category} · {project.year}
            </span>
            <h1 className="pd-title">{project.title}</h1>
          </div>

          <div className="pd-actions">
            {isLive && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-btn pd-btn-primary"
                onMouseEnter={() => setCursor('pointer')}
                onMouseLeave={() => setCursor('default')}
              >
                <ExternalLink size={12} />
                {en ? 'Open site' : 'Abrir site'}
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-btn pd-btn-ghost"
                onMouseEnter={() => setCursor('pointer')}
                onMouseLeave={() => setCursor('default')}
              >
                <Github size={12} /> GitHub
              </a>
            )}
          </div>
        </header>

        {/* ── The product, running ── */}
        {project.embedUrl ? (
          <LiveDemo
            embedUrl={project.embedUrl}
            posterSrc={project.image}
            title={project.title}
            liveUrl={project.liveUrl}
          />
        ) : (
          <div className="pd-shot">
            <img src={project.image} alt={project.title} loading="eager" />
          </div>
        )}

        {/* ── Stack ── */}
        <section className="pd-stack-wrap">
          <h2 className="pd-label">{en ? 'Built with' : 'Tecnologias usadas'}</h2>
          <TechStack stack={project.stack} />
        </section>

        {/* Next */}
        {nextProject && nextProject.slug !== project.slug && (
          <Link
            to={`/projects/${nextProject.slug}`}
            className="pd-next"
            onMouseEnter={() => setCursor('pointer')}
            onMouseLeave={() => setCursor('default')}
          >
            <span className="pd-next-label">{en ? 'Next project' : 'Próximo projeto'}</span>
            <span className="pd-next-title">
              {nextProject.title} <ArrowRight size={16} />
            </span>
          </Link>
        )}
      </div>

      <style>{`
        .pd-back {
          display: inline-flex; align-items: center; gap: 0.45rem;
          font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); text-decoration: none;
          transition: color 0.22s;
        }
        .pd-back:hover { color: #fff; }

        .pd-head {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin: 1.75rem 0 clamp(2rem,4vw,3rem);
        }
        @media (min-width: 780px) {
          .pd-head { flex-direction: row; align-items: flex-end; justify-content: space-between; gap: 2rem; }
        }

        .pd-meta {
          display: block;
          font-size: 0.58rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          margin-bottom: 0.7rem;
        }
        .pd-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2.4rem, 6.5vw, 5rem);
          letter-spacing: -0.05em;
          line-height: 0.95;
          color: #fff;
          margin: 0;
        }

        .pd-actions { display: flex; gap: 0.6rem; flex-wrap: wrap; flex-shrink: 0; }
        .pd-btn {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.85rem 1.6rem; border-radius: 999px;
          font-size: 0.64rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none; white-space: nowrap;
          transition: all 0.22s;
        }
        .pd-btn-primary { background: #fff; color: #0d0d0d; }
        .pd-btn-primary:hover { background: #e2e2e2; }
        .pd-btn-ghost {
          background: transparent; color: rgba(255,255,255,0.45);
          border: 1px solid rgba(255,255,255,0.12);
        }
        .pd-btn-ghost:hover { color: #fff; border-color: rgba(255,255,255,0.32); }

        .pd-shot {
          border-radius: clamp(12px,2vw,18px);
          overflow: hidden;
          aspect-ratio: 16/9;
          margin-bottom: clamp(2.5rem,5vw,4rem);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .pd-shot img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .pd-stack-wrap {
          padding-top: clamp(1.5rem,3vw,2.25rem);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .pd-label {
          font-size: 0.58rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(255,255,255,0.24);
          margin: 0 0 1rem;
        }
        .pd-stack { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .pd-pill {
          font-size: 0.72rem; font-weight: 600;
          padding: 0.5rem 1.05rem; border-radius: 999px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.6);
        }

        .pd-next {
          display: flex; flex-direction: column; gap: 0.5rem;
          margin-top: clamp(3.5rem,7vw,5.5rem);
          padding-top: clamp(1.75rem,3.5vw,2.5rem);
          border-top: 1px solid rgba(255,255,255,0.06);
          text-decoration: none;
        }
        .pd-next-label {
          font-size: 0.56rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(255,255,255,0.24);
        }
        .pd-next-title {
          display: inline-flex; align-items: center; gap: 0.7rem;
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(1.5rem,3.5vw,2.4rem);
          letter-spacing: -0.04em;
          color: rgba(255,255,255,0.35);
          transition: color 0.22s;
        }
        .pd-next:hover .pd-next-title { color: #fff; }
      `}</style>
    </main>
  )
}
