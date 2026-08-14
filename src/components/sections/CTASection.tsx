import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Github, Linkedin } from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'
import { SITE } from '@/lib/constants'

gsap.registerPlugin(ScrollTrigger)

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.68a8.27 8.27 0 0 0 4.84 1.55V6.78a4.85 4.85 0 0 1-1.07-.09z" />
    </svg>
  )
}

const SOCIALS = [
  { Icon: Github,     href: SITE.github,   label: 'GitHub'   },
  { Icon: Linkedin,   href: SITE.linkedin, label: 'LinkedIn' },
  { Icon: TikTokIcon, href: SITE.tiktok,   label: 'TikTok'   },
]

const MORE = [
  { path: '/cv',        pt: 'Currículo',        en: 'Résumé'          },
  { path: '/teardown',  pt: 'Como foi feito',   en: 'How it’s built'  },
  { path: '/guestbook', pt: 'Livro de visitas', en: 'Guestbook'       },
]

export default function CTASection() {
  const lang      = useLanguageStore((s) => s.lang)
  const setCursor = useCursorStore((s) => s.setState)
  const ref       = useRef<HTMLElement>(null)

  const en    = lang === 'en'
  const lines = en ? ['LET’S', 'TALK?'] : ['VAMOS', 'CONVERSAR?']

  useEffect(() => {
    if (!ref.current) return

    const ctx = gsap.context(() => {
      /* NOTE: deliberately NOT gsap.from().
         `from()` tweens carry immediateRender, and every ScrollTrigger.refresh()
         reverts them to their start state in order to measure layout. Once the
         trigger has been killed by `once: true`, that revert is never undone and
         the element stays invisible forever. Setting the start state explicitly
         and animating with to() has no such failure mode. */
      const line  = gsap.utils.toArray<HTMLElement>('.cta-topline')
      const words = gsap.utils.toArray<HTMLElement>('.cta-word')
      const subs  = gsap.utils.toArray<HTMLElement>('.cta-sub')

      gsap.set(line,  { scaleX: 0, transformOrigin: 'left' })
      gsap.set(words, { yPercent: 106 })
      gsap.set(subs,  { opacity: 0, y: 20 })

      ScrollTrigger.create({
        trigger: ref.current,
        start:   'top 88%',
        once:    true,
        onEnter: () => {
          gsap.to(line,  { scaleX: 1, duration: 1.3, ease: 'power4.inOut' })
          gsap.to(words, { yPercent: 0, duration: 1.05, ease: 'power4.out', stagger: 0.09 })
          gsap.to(subs,  { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1, delay: 0.15 })
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [lang])

  return (
    <section
      ref={ref}
      style={{ background: '#0d0d0d', position: 'relative', overflow: 'hidden' }}
    >
      {/* Top divider */}
      <div
        className="cta-topline"
        style={{ height: 1, background: 'rgba(255,255,255,0.08)', willChange: 'transform' }}
      />

      <div
        className="container-custom cta-wrap"
        style={{
          paddingTop:    'clamp(5rem,11vw,10rem)',
          paddingBottom: 'clamp(5rem,11vw,10rem)',
        }}
      >
        {/* Eyebrow */}
        <div
          className="cta-sub"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            marginBottom: 'clamp(2rem,4vw,3rem)',
          }}
        >
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#4ade80',
            animation: 'cta-pulse 2.2s ease-in-out infinite',
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: '0.6rem', fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.26)',
          }}>
            {en ? 'Available for projects' : 'Disponível para projetos'}
          </span>
        </div>

        {/* ── Headline — full width on its own row ──
             It must NOT share a row with the actions: "CONVERSAR?" is a single
             10-character word that needs ~1530px at this size, and squeezing it
             into a grid column left it clipped by the mask's overflow:hidden. */}
        <div className="cta-headline">
          {lines.map((word, i) => (
            <div key={i} style={{ overflow: 'hidden', lineHeight: 0.86 }}>
              <div
                className="cta-word"
                style={{
                  fontFamily:    'Syne, sans-serif',
                  fontWeight:    800,   /* Syne's real max — 900 would be faked */
                  letterSpacing: '-0.055em',
                  lineHeight:    0.86,
                  willChange:    'transform',
                  /* Second line is a muted SOLID fill, not an outline.
                     With -0.055em tracking the glyphs overlap, so an outlined
                     treatment draws each letter's stroke straight through its
                     neighbours — the diagonals of V/A/R read as random lines
                     crossing the word. Solid fill keeps the hierarchy, no noise. */
                  ...(i === 0
                    ? { color: '#ffffff' }
                    : { color: 'rgba(255,255,255,0.17)' }),
                }}
              >
                {word}
              </div>
            </div>
          ))}
        </div>

        {/* ── Actions row: description left · button + email right ── */}
        <div className="cta-row">
          <p className="cta-sub cta-lede">
            {en
              ? 'Got an idea, a product, or a problem to solve? Let’s turn it into something real.'
              : 'Tem uma ideia, um produto ou um problema pra resolver? Bora transformar isso em algo real.'}
          </p>

          <div className="cta-actions">
            <Link to="/contact" className="cta-sub" style={{ textDecoration: 'none' }}>
              <button
                className="cta-btn"
                onMouseEnter={e => { e.currentTarget.style.background = '#e2e2e2'; setCursor('pointer') }}
                onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; setCursor('default') }}
              >
                {en ? 'Get in touch' : 'Entre em contato'}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                </svg>
              </button>
            </Link>

            <a
              href={`mailto:${SITE.email}`}
              className="cta-sub cta-mail"
              onMouseEnter={() => setCursor('pointer')}
              onMouseLeave={() => setCursor('default')}
            >
              {SITE.email}
            </a>
          </div>
        </div>

        {/* ── Socials + secondary routes ──
             Moved here from the old footer block: this is where a visitor is
             already deciding how to reach out, so the channels and the
             supporting pages belong in the same breath. */}
        <div className="cta-sub cta-links">
          <div className="cta-socials">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="cta-social"
                onMouseEnter={() => setCursor('pointer')}
                onMouseLeave={() => setCursor('default')}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>

          <nav className="cta-more">
            {MORE.map(({ path, pt, en: enLabel }) => (
              <Link
                key={path}
                to={path}
                className="cta-more-link"
                onMouseEnter={() => setCursor('pointer')}
                onMouseLeave={() => setCursor('default')}
              >
                {en ? enLabel : pt}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom meta */}
        <div className="cta-sub cta-meta">
          <span>Campinas, SP · Brasil</span>
          <span className="cta-dot" />
          <span>Full Stack Developer</span>
          <span className="cta-dot" />
          <span>2026</span>
        </div>
      </div>

      <style>{`
        @keyframes cta-pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%     { opacity: 0.35; transform: scale(0.72); }
        }

        /* ── Headline ──
           7.2vw is derived, not guessed: the longest line ("CONVERSAR?") renders
           at ~11.2× the font size in Syne 800 at -0.055em tracking. The container
           is ~91vw wide, so 91 / 11.2 ≈ 8.1vw is the absolute ceiling — 7.2vw
           leaves headroom for the wider glyphs in the English string too. */
        .cta-headline {
          margin-bottom: clamp(2.5rem, 5vw, 4rem);
        }
        .cta-word {
          font-size: clamp(2.6rem, 7.2vw, 7.4rem);
        }

        /* ── Actions row ── */
        .cta-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2rem, 4vw, 3rem);
          align-items: end;
          padding-top: clamp(1.5rem, 3vw, 2.5rem);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        @media (min-width: 860px) {
          .cta-row {
            grid-template-columns: minmax(0, 1fr) auto;
            gap: clamp(3rem, 6vw, 6rem);
          }
        }

        .cta-lede {
          font-size: clamp(0.9rem, 1.5vw, 1.15rem);
          line-height: 1.65;
          color: rgba(255,255,255,0.35);
          max-width: 38ch;
          margin: 0;
        }

        .cta-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }
        @media (min-width: 860px) {
          .cta-actions { align-items: flex-end; }
          .cta-mail    { align-self: flex-end; }
        }

        /* ── Button ── */
        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          background: #ffffff;
          color: #0d0d0d;
          border: none;
          border-radius: 999px;
          padding: 1.05rem 2.2rem;
          font-family: inherit;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.22s ease, transform 0.22s ease;
          white-space: nowrap;
        }
        .cta-btn:hover  { transform: translateY(-2px); }
        .cta-btn:active { transform: translateY(0); }

        /* ── Email link ── */
        .cta-mail {
          align-self: flex-start;
          font-size: clamp(0.78rem, 1.3vw, 0.92rem);
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          letter-spacing: -0.01em;
          border-bottom: 1px solid rgba(255,255,255,0.12);
          padding-bottom: 2px;
          transition: color 0.22s ease, border-color 0.22s ease;
          word-break: break-all;
        }
        .cta-mail:hover {
          color: #ffffff;
          border-color: rgba(255,255,255,0.4);
        }

        /* ── Socials + secondary routes ── */
        .cta-links {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: flex-start;
          margin-top: clamp(2.5rem, 5vw, 4rem);
          padding-top: clamp(1.5rem, 3vw, 2.5rem);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        @media (min-width: 720px) {
          .cta-links {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .cta-socials { display: flex; gap: 0.7rem; }
        .cta-social {
          width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.32);
          text-decoration: none;
          transition: color 0.22s, border-color 0.22s, background 0.22s;
        }
        .cta-social:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.05);
        }

        .cta-more {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem 1.5rem;
        }
        .cta-more-link {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.26);
          text-decoration: none;
          transition: color 0.22s;
        }
        .cta-more-link:hover { color: #fff; }

        /* ── Meta row ── */
        .cta-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: clamp(1.5rem, 3vw, 2rem);
          font-size: 0.57rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.15);
        }
        .cta-dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(255,255,255,0.16);
          flex-shrink: 0;
        }

        /* ── Small phones ── */
        @media (max-width: 420px) {
          .cta-btn { width: 100%; justify-content: center; padding: 1rem 1.5rem; }
          .cta-actions { align-items: stretch; }
        }
      `}</style>
    </section>
  )
}
