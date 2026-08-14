import { useRef, useEffect, useMemo } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGitHubActivity, GH_USER, type GhDay } from '@/hooks/useGitHubActivity'
import { useLanguageStore } from '@/store/useLanguageStore'

gsap.registerPlugin(ScrollTrigger)

/* GitHub's own intensity ramp, restated in the site's monochrome palette so the
   heatmap reads as part of this page rather than a pasted-in widget. */
const LEVEL_BG = [
  'rgba(255,255,255,0.035)',
  'rgba(255,255,255,0.16)',
  'rgba(255,255,255,0.34)',
  'rgba(255,255,255,0.62)',
  'rgba(255,255,255,0.92)',
]

function relativeTime(iso: string, en: boolean): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 1)  return en ? 'just now'   : 'agora há pouco'
  if (h < 24) return en ? `${h}h ago`  : `há ${h}h`
  const d = Math.floor(h / 24)
  if (d === 1) return en ? 'yesterday' : 'ontem'
  if (d < 30)  return en ? `${d} days ago` : `há ${d} dias`
  const m = Math.floor(d / 30)
  return en ? `${m} month${m > 1 ? 's' : ''} ago` : `há ${m} ${m > 1 ? 'meses' : 'mês'}`
}

/** Chunk the flat day list into calendar weeks (columns of 7). */
function toWeeks(days: GhDay[]): GhDay[][] {
  if (!days.length) return []
  const weeks: GhDay[][] = []
  // Pad the first column so row index === weekday.
  const lead = new Date(days[0].date).getDay()
  let cur: GhDay[] = Array.from({ length: lead }, () => ({ date: '', count: -1, level: 0 }))

  for (const d of days) {
    cur.push(d)
    if (cur.length === 7) { weeks.push(cur); cur = [] }
  }
  if (cur.length) weeks.push(cur)
  return weeks
}

export default function GitHubActivity() {
  const state = useGitHubActivity()
  const lang  = useLanguageStore(s => s.lang)
  const en    = lang === 'en'
  const ref   = useRef<HTMLElement>(null)

  const data  = state.status === 'ready' ? state.data : null
  const weeks = useMemo(() => (data ? toWeeks(data.days) : []), [data])

  useEffect(() => {
    if (!ref.current || state.status !== 'ready') return

    const ctx = gsap.context(() => {
      const cells = gsap.utils.toArray<HTMLElement>('.gh-cell')
      const rows  = gsap.utils.toArray<HTMLElement>('.gh-reveal')

      gsap.set(rows, { opacity: 0, y: 18 })
      if (cells.length) gsap.set(cells, { opacity: 0, scale: 0.55 })

      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to(rows, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 })
          if (cells.length) {
            gsap.to(cells, {
              opacity: 1, scale: 1,
              duration: 0.5, ease: 'power2.out',
              // Sweep left→right across the year, like the calendar filling in.
              stagger: { each: 0.0016, from: 'start' },
            })
          }
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [state.status])

  // Nothing to show and nothing to explain — stay out of the way entirely.
  if (state.status === 'error') return null

  return (
    <section
      ref={ref}
      style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div
        className="container-custom"
        style={{ paddingTop: 'clamp(4.5rem,9vw,8rem)', paddingBottom: 'clamp(4.5rem,9vw,8rem)' }}
      >
        {/* ── Header ── */}
        <div
          className="gh-reveal gh-head"
          style={{ marginBottom: 'clamp(2.5rem,5vw,4rem)' }}
        >
          <div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontSize: '0.6rem', fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.26)',
            }}>
              <span style={{ width: 18, height: 1, background: 'rgba(255,255,255,0.15)' }} />
              {en ? 'Live from GitHub' : 'Ao vivo do GitHub'}
            </span>

            <h2 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 'clamp(2rem,5vw,3.6rem)',
              letterSpacing: '-0.045em', lineHeight: 0.95,
              color: '#fff', margin: '0.9rem 0 0',
            }}>
              {en ? 'I ship continuously.' : 'Eu entrego continuamente.'}
            </h2>

            <p style={{
              marginTop: '0.9rem', maxWidth: '46ch',
              fontSize: 'clamp(0.85rem,1.4vw,1rem)', lineHeight: 1.7,
              color: 'rgba(255,255,255,0.32)',
            }}>
              {en
                ? 'Not a claim — the numbers below are read from the public GitHub API every time this page loads.'
                : 'Não é promessa — os números abaixo são lidos da API pública do GitHub a cada carregamento desta página.'}
            </p>
          </div>

          {data?.lastPush && (
            <a
              href={`https://github.com/${GH_USER}`}
              target="_blank" rel="noopener noreferrer"
              className="gh-lastpush"
            >
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#4ade80', flexShrink: 0,
                animation: 'gh-pulse 2.2s ease-in-out infinite',
              }} />
              {en ? 'Last commit' : 'Último commit'} {relativeTime(data.lastPush, en)}
            </a>
          )}
        </div>

        {/* ── Stats ── */}
        <div className="gh-reveal gh-stats">
          {[
            { v: data?.totalContributions, l: en ? 'contributions this year' : 'contribuições no ano' },
            { v: data?.activeDays,         l: en ? 'days with commits'       : 'dias com commits'     },
            { v: data?.longestStreak,      l: en ? 'longest streak'          : 'maior sequência'      },
            { v: data?.publicRepos,        l: en ? 'public repositories'     : 'repositórios públicos'},
          ].map(({ v, l }) => (
            <div key={l} style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: 'clamp(1.9rem,4.5vw,3.2rem)',
                letterSpacing: '-0.05em', lineHeight: 1,
                color: '#fff',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {v ?? '—'}
              </div>
              <div style={{
                marginTop: '0.5rem',
                fontSize: '0.58rem', fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.22)',
              }}>
                {l}
              </div>
            </div>
          ))}
        </div>

        {/* ── Contribution heatmap ── */}
        {weeks.length > 0 && (
          <div className="gh-reveal" style={{ marginTop: 'clamp(2.5rem,5vw,4rem)' }}>
            <div className="gh-heat-scroll">
              <div className="gh-heat">
                {weeks.map((week, wi) => (
                  <div key={wi} className="gh-week">
                    {week.map((day, di) => (
                      <div
                        key={di}
                        className={day.count >= 0 ? 'gh-cell' : 'gh-pad'}
                        title={
                          day.count >= 0
                            ? `${day.count} ${en ? 'contributions on' : 'contribuições em'} ${day.date}`
                            : undefined
                        }
                        style={{
                          background: day.count >= 0 ? LEVEL_BG[day.level] ?? LEVEL_BG[0] : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              marginTop: '0.9rem',
              fontSize: '0.55rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)',
            }}>
              <span>{en ? 'less' : 'menos'}</span>
              {LEVEL_BG.map(bg => (
                <span key={bg} style={{ width: 10, height: 10, borderRadius: 2.5, background: bg }} />
              ))}
              <span>{en ? 'more' : 'mais'}</span>
            </div>
          </div>
        )}

        {/* ── Languages ── */}
        {data && data.languages.length > 0 && (
          <div className="gh-reveal" style={{ marginTop: 'clamp(2.5rem,5vw,4rem)' }}>
            <h3 style={{
              fontSize: '0.58rem', fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.22)', marginBottom: '1rem',
            }}>
              {en ? 'What I actually write' : 'O que eu realmente escrevo'}
            </h3>

            {/* Proportional bar — width reflects share of public repos */}
            <div style={{ display: 'flex', height: 6, borderRadius: 999, overflow: 'hidden', gap: 2 }}>
              {data.languages.slice(0, 6).map((l, i) => {
                const total = data.languages.slice(0, 6).reduce((a, b) => a + b.count, 0)
                return (
                  <div
                    key={l.name}
                    title={`${l.name} — ${l.count}`}
                    style={{
                      flexGrow: l.count / total,
                      background: LEVEL_BG[Math.max(0, 4 - i)] ?? LEVEL_BG[0],
                    }}
                  />
                )
              })}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.25rem', marginTop: '1rem' }}>
              {data.languages.slice(0, 6).map((l, i) => (
                <span key={l.name} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)',
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: 2,
                    background: LEVEL_BG[Math.max(0, 4 - i)] ?? LEVEL_BG[0],
                    flexShrink: 0,
                  }} />
                  {l.name}
                  <span style={{ color: 'rgba(255,255,255,0.18)' }}>{l.count}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes gh-pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%     { opacity: 0.35; transform: scale(0.7); }
        }

        .gh-head {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          align-items: end;
        }
        @media (min-width: 860px) {
          .gh-head { grid-template-columns: 1fr auto; }
        }

        .gh-lastpush {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.34);
          text-decoration: none;
          white-space: nowrap;
          width: fit-content;
          transition: color 0.22s, border-color 0.22s;
        }
        .gh-lastpush:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.24);
        }

        .gh-stats {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(1.5rem, 4vw, 3rem);
          padding-top: clamp(1.5rem, 3vw, 2.5rem);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        @media (min-width: 720px) {
          .gh-stats { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }

        /* The calendar is 53 columns wide. Columns flex to fill the container so
           the year spans the full width instead of sitting in a small block with
           dead space beside it; cells stay square via aspect-ratio. Below the
           min-width the whole grid scrolls inside its own box rather than
           stretching the page. */
        .gh-heat-scroll {
          overflow-x: auto;
          overflow-y: hidden;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .gh-heat-scroll::-webkit-scrollbar { display: none; }

        .gh-heat {
          display: flex;
          gap: 0.32%;
          min-width: 620px;   /* below this it scrolls instead of squashing */
        }
        .gh-week {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1 1 0;
          min-width: 0;
        }
        .gh-cell, .gh-pad {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 2.5px;
        }
      `}</style>
    </section>
  )
}
