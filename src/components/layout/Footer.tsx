import { useLocation } from 'react-router-dom'
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
        className="container-custom"
        style={{
          paddingTop:    '1.1rem',
          /* The secret-terminal button (bottom-left) and the clock widget
             (bottom-right) are position:fixed and would otherwise sit on top of
             this row. Reserve enough height for it to clear both. */
          paddingBottom: 'clamp(4.5rem, 7vw, 5.5rem)',
          display:       'flex',
          alignItems:    'center',
          justifyContent: 'space-between',
          gap:           '1rem',
          flexWrap:      'wrap',
        }}
      >
        {/* Copyright */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img
            src="/icon.svg"
            alt=""
            style={{ width: 14, height: 14, opacity: 0.3, filter: 'brightness(2)' }}
          />
          <span style={{
            fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase',
          }}>
            © {year} Caio Diniz · Full Stack Developer
          </span>
        </div>

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
    </footer>
  )
}
