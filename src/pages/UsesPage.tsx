import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { usesGroups, hardware } from '@/data/uses'
import { SITE } from '@/lib/constants'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'

gsap.registerPlugin(ScrollTrigger)

export default function UsesPage() {
  const lang = useLanguageStore(s => s.lang)
  const en   = lang === 'en'
  const setCursor = useCursorStore(s => s.setState)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = `/uses — ${SITE.name}`
  }, [])

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>('.us-reveal')
      gsap.set(rows, { opacity: 0, y: 20 })
      ScrollTrigger.batch(rows, {
        start: 'top 90%',
        once: true,
        onEnter: batch =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', stagger: 0.06 }),
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <main ref={ref} style={{ background: '#0d0d0d', minHeight: '100vh' }}>
      <div
        className="container-custom"
        style={{ paddingTop: 'clamp(6.5rem,11vw,9rem)', paddingBottom: 'clamp(3.5rem,7vw,6rem)' }}
      >
        <Link to="/" className="us-back" onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}>
          <ArrowLeft size={13} /> {en ? 'Back' : 'Voltar'}
        </Link>

        {/* ── Header ── */}
        <header className="us-reveal" style={{ marginTop: '1.75rem', marginBottom: 'clamp(2.5rem,5vw,4rem)' }}>
          <span className="us-eyebrow">
            <span className="us-dash" />
            {en ? 'What I build with' : 'Com o que eu construo'}
          </span>

          <h1 className="us-title">
            /uses
          </h1>

          <p className="us-lede">
            {en
              ? 'The tools, and — more usefully — why each one rather than the obvious alternative.'
              : 'As ferramentas e, mais útil que isso, por que cada uma em vez da alternativa óbvia.'}
          </p>
        </header>

        {/* ── Groups ── */}
        {usesGroups.map(group => (
          <section key={group.id} className="us-section">
            <h2 className="us-h2 us-reveal">{en ? group.titleEn : group.titlePt}</h2>

            <div className="us-list">
              {group.items.map(item => {
                const note = en ? item.noteEn : item.notePt
                const body = (
                  <>
                    <div className="us-item-head">
                      <span className="us-name">
                        {item.name}
                        {item.highlight && <span className="us-star" aria-hidden>◆</span>}
                      </span>
                      {item.url && <ArrowUpRight size={12} className="us-ext" />}
                    </div>
                    <p className="us-note">{note}</p>
                  </>
                )

                return item.url ? (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="us-item us-reveal is-link"
                    onMouseEnter={() => setCursor('pointer')}
                    onMouseLeave={() => setCursor('default')}
                  >
                    {body}
                  </a>
                ) : (
                  <div key={item.name} className="us-item us-reveal">{body}</div>
                )
              })}
            </div>
          </section>
        ))}

        {/* ── Hardware ── */}
        <section className="us-section">
          <h2 className="us-h2 us-reveal">{en ? 'Hardware' : 'Equipamento'}</h2>
          <div className="us-list">
            {hardware.map(h => (
              <div key={h.name} className="us-item us-reveal">
                <div className="us-item-head">
                  <span className="us-name">{h.name}</span>
                </div>
                <p className="us-note">{en ? h.noteEn : h.notePt}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer note */}
        <p className="us-reveal us-foot">
          {en
            ? 'This page follows the '
            : 'Esta página segue a convenção '}
          <a href="https://uses.tech" target="_blank" rel="noopener noreferrer">uses.tech</a>
          {en ? ' convention.' : '.'}
        </p>
      </div>

      <style>{`
        .us-back {
          display: inline-flex; align-items: center; gap: 0.45rem;
          font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); text-decoration: none;
          transition: color 0.22s;
        }
        .us-back:hover { color: #fff; }

        .us-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(255,255,255,0.26);
        }
        .us-dash { width: 18px; height: 1px; background: rgba(255,255,255,0.15); }

        .us-title {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          font-size: clamp(2.6rem, 8vw, 5.5rem);
          letter-spacing: -0.04em;
          line-height: 1;
          color: #fff;
          margin: 1rem 0 0;
        }
        .us-lede {
          margin-top: 1.1rem;
          max-width: 52ch;
          font-size: clamp(0.88rem, 1.5vw, 1.05rem);
          line-height: 1.75;
          color: rgba(255,255,255,0.36);
        }

        .us-section { margin-bottom: clamp(2.5rem, 5vw, 4rem); }
        .us-h2 {
          font-size: 0.58rem; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(255,255,255,0.24);
          margin: 0 0 1.1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .us-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.6rem;
        }
        @media (min-width: 760px)  { .us-list { grid-template-columns: repeat(2, 1fr); } }

        .us-item {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          padding: clamp(1rem, 2vw, 1.35rem);
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.018);
          text-decoration: none;
          transition: border-color 0.25s, background 0.25s, transform 0.25s;
        }
        .us-item.is-link:hover {
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.04);
          transform: translateY(-2px);
        }

        .us-item-head {
          display: flex; align-items: center; justify-content: space-between;
          gap: 0.75rem;
        }
        .us-name {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-size: 0.9rem; font-weight: 700;
          letter-spacing: -0.015em;
          color: #fff;
        }
        .us-star { font-size: 0.42rem; color: rgba(255,255,255,0.4); }
        .us-ext { color: rgba(255,255,255,0.2); flex-shrink: 0; }
        .us-item.is-link:hover .us-ext { color: #fff; }

        .us-note {
          margin: 0;
          font-size: 0.79rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.36);
        }

        .us-foot {
          margin-top: clamp(1.5rem, 3vw, 2.5rem);
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          font-size: 0.68rem;
          color: rgba(255,255,255,0.2);
        }
        .us-foot a { color: rgba(255,255,255,0.45); text-decoration: underline; text-underline-offset: 3px; }
        .us-foot a:hover { color: #fff; }
      `}</style>
    </main>
  )
}
