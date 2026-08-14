import { useLocation, Link } from 'react-router-dom'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'
import { usePresentationStore } from '@/store/usePresentationStore'
import { getLenis } from '@/hooks/useLenis'

/**
 * Minimal closing bar.
 *
 * The large footer block (name, email, socials, nav) used to live here, but it
 * repeated everything the CTA section directly above it already says. Contact
 * details and the secondary links now belong to that section, and the footer is
 * just the legal line and a way back up.
 */
const NAV = [
  { path: '/',          pt: 'Início',   en: 'Home'     },
  { path: '/about',     pt: 'Sobre',    en: 'About'    },
  { path: '/projects',  pt: 'Projetos', en: 'Projects' },
  { path: '/services',  pt: 'Serviços', en: 'Services' },
  { path: '/contact',   pt: 'Contato',  en: 'Contact'  },
  { path: '/cv',        pt: 'Currículo',en: 'Résumé'   },
]

export default function Footer() {
  const lang       = useLanguageStore((s) => s.lang)
  const pt         = lang === 'pt'
  const setCursor  = useCursorStore((s) => s.setState)
  const presenting = usePresentationStore((s) => s.active)
  const { pathname } = useLocation()
  const year       = new Date().getFullYear()
  const isGuestbook = pathname === '/guestbook'

  function scrollToTop() {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { duration: 1.8 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (presenting) return null

  return (
    <footer
      style={{
        background: isGuestbook ? 'rgba(8,8,8,0.85)' : '#080808',
        backdropFilter: isGuestbook ? 'blur(20px)' : undefined,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
      }}
    >
      <div
        className="container-custom ft-bar"
        style={{
          paddingTop:    'clamp(1.25rem, 2.5vw, 1.75rem)',
          /* The secret-terminal button (bottom-left) and the clock widget
             (bottom-right) are position:fixed and would otherwise sit on top of
             this row — this clears them without leaving a dead band. */
          paddingBottom: 'clamp(3.5rem, 5vw, 4.25rem)',
        }}
      >
        {/* Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img
            src="/icon.svg"
            alt=""
            style={{ width: 15, height: 15, opacity: 0.35, filter: 'brightness(2)' }}
          />
          <span style={{
            fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase',
          }}>
            © {year} Caio Diniz
          </span>
        </div>

        {/* Navigation — the CTA above carries the contact channels, so this row
            only needs to be a way around the site. */}
        <nav className="ft-links">
          {NAV.map(({ path, pt: labelPt, en: labelEn }) => (
            <Link
              key={path}
              to={path}
              className="ft-link"
              onMouseEnter={() => setCursor('pointer')}
              onMouseLeave={() => setCursor('default')}
            >
              {pt ? labelPt : labelEn}
            </Link>
          ))}
        </nav>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          style={{
            display:    'inline-flex',
            alignItems: 'center',
            gap:        '0.4rem',
            background: 'transparent',
            border:     '1px solid rgba(255,255,255,0.1)',
            borderRadius: 999,
            padding:    '0.38rem 0.9rem',
            color:      'rgba(255,255,255,0.2)',
            fontSize:   '0.58rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor:     'pointer',
            transition: 'all 0.22s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.color = '#fff'
            el.style.borderColor = 'rgba(255,255,255,0.3)'
            el.style.background = 'rgba(255,255,255,0.05)'
            setCursor('pointer')
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.color = 'rgba(255,255,255,0.2)'
            el.style.borderColor = 'rgba(255,255,255,0.1)'
            el.style.background = 'transparent'
            setCursor('default')
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
          </svg>
          {pt ? 'Topo' : 'Top'}
        </button>
      </div>

      <style>{`
        .ft-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .ft-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1.4rem;
          justify-content: center;
          flex: 1;
        }
        .ft-link {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.22);
          text-decoration: none;
          transition: color 0.22s;
          white-space: nowrap;
        }
        .ft-link:hover { color: #fff; }

        @media (max-width: 720px) {
          .ft-bar   { justify-content: center; text-align: center; }
          .ft-links { order: 3; width: 100%; flex: none; }
        }
      `}</style>
    </footer>
  )
}
