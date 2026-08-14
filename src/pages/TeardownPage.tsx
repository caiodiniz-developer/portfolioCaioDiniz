import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { ArrowLeft, Github } from 'lucide-react'
import { findings, stack } from '@/data/teardown'
import { SITE } from '@/lib/constants'
import { useLanguageStore } from '@/store/useLanguageStore'
import { track } from '@/lib/analytics'

gsap.registerPlugin(ScrollTrigger)

function CodeBlock({ label, code, tone }: { label: string; code: string; tone: 'bad' | 'good' }) {
  const accent = tone === 'bad' ? '#f87171' : '#4ade80'
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        fontSize: '0.55rem', fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.24)', marginBottom: '0.55rem',
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent, flexShrink: 0 }} />
        {label}
      </div>
      <pre style={{
        margin: 0, padding: '0.9rem 1rem',
        borderRadius: 10,
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderLeft: `2px solid ${accent}44`,
        fontFamily: '"JetBrains Mono","Fira Code",monospace',
        fontSize: '0.68rem',
        lineHeight: 1.7,
        color: 'rgba(255,255,255,0.62)',
        overflowX: 'auto',
        whiteSpace: 'pre',
      }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default function TeardownPage() {
  const lang = useLanguageStore(s => s.lang)
  const en   = lang === 'en'
  const ref  = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<string | null>(findings[0]?.id ?? null)

  useEffect(() => {
    document.title = `${en ? 'How this site was built' : 'Como este site foi feito'} — ${SITE.name}`
  }, [en])

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.td-reveal')
      gsap.set(items, { opacity: 0, y: 22 })
      ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: batch =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 }),
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} style={{ background: '#0d0d0d', minHeight: '100vh' }}>
      <div
        className="container-custom"
        style={{ paddingTop: 'clamp(7rem,12vw,10rem)', paddingBottom: 'clamp(5rem,10vw,8rem)' }}
      >
        {/* ── Back ── */}
        <Link
          to="/"
          className="td-reveal td-back"
        >
          <ArrowLeft size={13} />
          {en ? 'Back' : 'Voltar'}
        </Link>

        {/* ── Header ── */}
        <header className="td-reveal" style={{ marginTop: '2rem', marginBottom: 'clamp(3rem,7vw,5rem)' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontSize: '0.6rem', fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.26)',
          }}>
            <span style={{ width: 18, height: 1, background: 'rgba(255,255,255,0.15)' }} />
            {en ? 'Engineering log' : 'Diário de engenharia'}
          </span>

          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(2.4rem,7vw,5.5rem)',
            letterSpacing: '-0.05em', lineHeight: 0.92,
            color: '#fff', margin: '1.1rem 0 0',
          }}>
            {en ? 'How this site' : 'Como este site'}<br />
            <span style={{ color: 'rgba(255,255,255,0.17)' }}>
              {en ? 'was built.' : 'foi feito.'}
            </span>
          </h1>

          <p style={{
            marginTop: '1.5rem', maxWidth: '62ch',
            fontSize: 'clamp(0.9rem,1.5vw,1.1rem)', lineHeight: 1.75,
            color: 'rgba(255,255,255,0.36)',
          }}>
            {en
              ? 'Most portfolios show the finished surface. This page shows the bugs underneath — six real defects that shipped here, why each one was hard to see, and what the fix actually was.'
              : 'A maioria dos portfólios mostra só a superfície pronta. Esta página mostra os bugs de baixo — seis defeitos reais que passaram por aqui, por que cada um era difícil de enxergar, e qual foi a correção de fato.'}
          </p>

          <p style={{
            marginTop: '1rem', maxWidth: '62ch',
            fontSize: '0.8rem', lineHeight: 1.7,
            color: 'rgba(255,255,255,0.22)',
            fontStyle: 'italic',
          }}>
            {en
              ? 'One of them I caused myself while fixing another. That one is included on purpose.'
              : 'Um deles fui eu que causei enquanto corrigia outro. Esse está aqui de propósito.'}
          </p>
        </header>

        {/* ── Stack ── */}
        <section className="td-reveal" style={{ marginBottom: 'clamp(3.5rem,7vw,5.5rem)' }}>
          <h2 className="td-h2">{en ? 'Stack' : 'Stack'}</h2>
          <div className="td-stack">
            {stack.map(s => (
              <div key={s.area} className="td-stack-row">
                <span className="td-stack-area">{s.area}</span>
                <span className="td-stack-choice">{s.choice}</span>
                <span className="td-stack-note">{s.note}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Findings ── */}
        <section>
          <h2 className="td-h2 td-reveal">
            {en ? `The bugs (${findings.length})` : `Os bugs (${findings.length})`}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {findings.map((f, i) => {
              const isOpen = open === f.id
              return (
                <article
                  key={f.id}
                  className="td-reveal"
                  style={{
                    borderRadius: 16,
                    border: `1px solid rgba(255,255,255,${isOpen ? 0.12 : 0.06})`,
                    background: `rgba(255,255,255,${isOpen ? 0.028 : 0.015})`,
                    overflow: 'hidden',
                    transition: 'border-color 0.25s, background 0.25s',
                  }}
                >
                  {/* Header row — toggles */}
                  <button
                    onClick={() => {
                      setOpen(isOpen ? null : f.id)
                      if (!isOpen) track('teardown-open', { finding: f.id })
                    }}
                    aria-expanded={isOpen}
                    className="td-toggle"
                  >
                    <span className="td-index">{String(i + 1).padStart(2, '0')}</span>
                    <span className="td-symptom">{f.symptom}</span>
                    <span className="td-chev" style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </button>

                  {isOpen && (
                    <div className="td-body">
                      <div className="td-block">
                        <h3 className="td-label">{en ? 'Cause' : 'Causa'}</h3>
                        <p className="td-text">{f.cause}</p>
                      </div>

                      <div className="td-block">
                        <h3 className="td-label">{en ? 'Fix' : 'Correção'}</h3>
                        <p className="td-text">{f.fix}</p>
                      </div>

                      <div className="td-code-grid">
                        <CodeBlock label={en ? 'before' : 'antes'} code={f.before} tone="bad" />
                        <CodeBlock label={en ? 'after' : 'depois'} code={f.after} tone="good" />
                      </div>

                      <div className="td-lesson">
                        <h3 className="td-label" style={{ marginBottom: '0.5rem' }}>
                          {en ? 'What it taught me' : 'O que isso me ensinou'}
                        </h3>
                        <p className="td-text" style={{ color: 'rgba(255,255,255,0.5)' }}>{f.lesson}</p>
                      </div>

                      <code className="td-file">{f.file}</code>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </section>

        {/* ── Footer CTA ── */}
        <section className="td-reveal td-cta">
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.4)', margin: 0, maxWidth: '48ch' }}>
            {en
              ? 'The whole thing is open. Read the code, or tell me what I got wrong.'
              : 'Tudo isso está aberto. Leia o código, ou me diga onde eu errei.'}
          </p>
          <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
            <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="td-btn td-btn-ghost">
              <Github size={13} /> {en ? 'Source' : 'Código'}
            </a>
            <Link to="/contact" className="td-btn td-btn-primary">
              {en ? 'Get in touch' : 'Entre em contato'}
            </Link>
          </div>
        </section>
      </div>

      <style>{`
        .td-back {
          display: inline-flex; align-items: center; gap: 0.45rem;
          font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); text-decoration: none;
          transition: color 0.22s;
        }
        .td-back:hover { color: #fff; }

        .td-h2 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(1.1rem, 2.2vw, 1.45rem);
          letter-spacing: -0.03em;
          color: #fff;
          margin: 0 0 1.5rem;
          padding-bottom: 0.9rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        /* ── Stack table ── */
        .td-stack { display: flex; flex-direction: column; }
        .td-stack-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.2rem;
          padding: 0.85rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        @media (min-width: 720px) {
          .td-stack-row {
            grid-template-columns: 130px 220px 1fr;
            gap: 1.5rem;
            align-items: baseline;
          }
        }
        .td-stack-area {
          font-size: 0.58rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.24);
        }
        .td-stack-choice { font-size: 0.85rem; font-weight: 600; color: #fff; }
        .td-stack-note   { font-size: 0.78rem; color: rgba(255,255,255,0.3); line-height: 1.6; }

        /* ── Finding toggle ── */
        .td-toggle {
          width: 100%;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 1rem;
          align-items: start;
          padding: clamp(1.1rem, 2.5vw, 1.6rem);
          background: transparent;
          border: 0;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
        }
        .td-index {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem; font-weight: 700;
          color: rgba(255,255,255,0.2);
          padding-top: 3px;
        }
        .td-symptom {
          font-size: clamp(0.85rem, 1.6vw, 0.98rem);
          line-height: 1.65;
          color: rgba(255,255,255,0.72);
          min-width: 0;
        }
        .td-chev {
          width: 26px; height: 26px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.4);
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), color 0.22s;
        }
        .td-toggle:hover .td-chev { color: #fff; border-color: rgba(255,255,255,0.3); }

        /* ── Finding body ── */
        .td-body {
          padding: 0 clamp(1.1rem, 2.5vw, 1.6rem) clamp(1.4rem, 3vw, 2rem);
          display: flex; flex-direction: column; gap: 1.4rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 1.4rem;
          margin-top: 0.2rem;
        }
        .td-block { display: flex; flex-direction: column; gap: 0.5rem; }
        .td-label {
          font-size: 0.55rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(255,255,255,0.24);
          margin: 0;
        }
        .td-text {
          font-size: 0.85rem; line-height: 1.8;
          color: rgba(255,255,255,0.4);
          margin: 0;
        }
        .td-code-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.9rem;
        }
        @media (min-width: 780px) {
          .td-code-grid { grid-template-columns: 1fr 1fr; }
        }
        .td-lesson {
          padding: 1rem 1.1rem;
          border-radius: 10;
          border-radius: 10px;
          background: rgba(255,255,255,0.022);
          border-left: 2px solid rgba(255,255,255,0.14);
        }
        .td-file {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          color: rgba(255,255,255,0.18);
          word-break: break-all;
        }

        /* ── CTA ── */
        .td-cta {
          margin-top: clamp(4rem, 8vw, 6rem);
          padding-top: clamp(2rem, 4vw, 3rem);
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: flex-start;
        }
        @media (min-width: 720px) {
          .td-cta { flex-direction: row; align-items: center; justify-content: space-between; }
        }
        .td-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.9rem 1.8rem; border-radius: 999px;
          font-size: 0.66rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none; white-space: nowrap;
          transition: all 0.22s;
        }
        .td-btn-primary { background: #fff; color: #0d0d0d; }
        .td-btn-primary:hover { background: #e2e2e2; }
        .td-btn-ghost {
          background: transparent;
          color: rgba(255,255,255,0.42);
          border: 1px solid rgba(255,255,255,0.12);
        }
        .td-btn-ghost:hover { color: #fff; border-color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  )
}
