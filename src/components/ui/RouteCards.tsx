import { Link } from 'react-router-dom'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { FileText, BookOpen, ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCursorStore } from '@/store/useCursorStore'
import { useLanguageStore } from '@/store/useLanguageStore'

/**
 * Entry points for the site's secondary routes.
 *
 * Rather than crowd the main nav, each page is surfaced from the section where
 * a visitor is already in the right frame of mind — the résumé at the end of
 * "about" and "contact", where someone is deciding whether to hire.
 */

export type RouteKey = 'cv' | 'guestbook'

interface RouteDef {
  path: string
  Icon: LucideIcon
  titlePt: string
  titleEn: string
  descPt: string
  descEn: string
  tagPt: string
  tagEn: string
}

const ROUTES: Record<RouteKey, RouteDef> = {
  cv: {
    path: '/cv',
    Icon: FileText,
    titlePt: 'Currículo',
    titleEn: 'Résumé',
    descPt: 'Gerado a partir dos mesmos dados deste site, então nunca desatualiza. Exporta em PDF.',
    descEn: 'Generated from the same data as this site, so it never goes stale. Exports to PDF.',
    tagPt: 'PDF',
    tagEn: 'PDF',
  },
  guestbook: {
    path: '/guestbook',
    Icon: BookOpen,
    titlePt: 'Livro de visitas',
    titleEn: 'Guestbook',
    descPt: 'Deixe um recado. Fica salvo de verdade, para quem passar depois de você.',
    descEn: 'Leave a note. It really is saved, for whoever comes after you.',
    tagPt: 'Interativo',
    tagEn: 'Interactive',
  },
}

export default function RouteCards({
  show,
  headingPt = 'Explore mais',
  headingEn = 'Explore further',
}: {
  show: RouteKey[]
  headingPt?: string
  headingEn?: string
}) {
  const setCursor = useCursorStore(s => s.setState)
  const lang = useLanguageStore(s => s.lang)
  const en = lang === 'en'
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.rc-card')
      gsap.set(cards, { opacity: 0, y: 24 })
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 86%',
        once: true,
        onEnter: () =>
          gsap.to(cards, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.09 }),
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={ref}
      style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div
        className="container-custom"
        style={{ paddingTop: 'clamp(3.5rem,7vw,6rem)', paddingBottom: 'clamp(3.5rem,7vw,6rem)' }}
      >
        <h2 className="rc-heading">{en ? headingEn : headingPt}</h2>

        <div className="rc-grid">
          {show.map(key => {
            const r = ROUTES[key]
            const { Icon } = r
            return (
              <Link
                key={key}
                to={r.path}
                className="rc-card"
                onMouseEnter={() => setCursor('pointer')}
                onMouseLeave={() => setCursor('default')}
              >
                <div className="rc-top">
                  <span className="rc-icon"><Icon size={15} /></span>
                  <span className="rc-tag">{en ? r.tagEn : r.tagPt}</span>
                </div>

                <h3 className="rc-title">{en ? r.titleEn : r.titlePt}</h3>
                <p className="rc-desc">{en ? r.descEn : r.descPt}</p>

                <span className="rc-go">
                  {en ? 'Open' : 'Abrir'} <ArrowUpRight size={12} />
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      <style>{`
        .rc-heading {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.24);
          margin: 0 0 1.5rem;
        }

        .rc-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        @media (min-width: 700px)  { .rc-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1100px) { .rc-grid { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); } }

        .rc-card {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding: clamp(1.25rem, 2.5vw, 1.7rem);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          text-decoration: none;
          transition: border-color 0.25s, background 0.25s, transform 0.25s;
          will-change: transform;
        }
        .rc-card:hover {
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.04);
          transform: translateY(-3px);
        }

        .rc-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .rc-icon {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 9px;
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5);
          flex-shrink: 0;
          transition: color 0.25s, border-color 0.25s;
        }
        .rc-card:hover .rc-icon { color: #fff; border-color: rgba(255,255,255,0.25); }

        .rc-tag {
          font-size: 0.5rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          padding: 0.25rem 0.6rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.06);
          white-space: nowrap;
        }

        .rc-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          letter-spacing: -0.03em;
          line-height: 1.25;
          color: #fff;
          margin: 0.2rem 0 0;
        }
        .rc-desc {
          font-size: 0.78rem;
          line-height: 1.65;
          color: rgba(255,255,255,0.34);
          margin: 0;
          flex: 1;
        }
        .rc-go {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 0.4rem;
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          transition: color 0.25s;
        }
        .rc-card:hover .rc-go { color: #fff; }
      `}</style>
    </section>
  )
}
