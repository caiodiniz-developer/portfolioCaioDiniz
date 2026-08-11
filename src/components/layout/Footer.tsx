import { Link, useLocation } from 'react-router-dom'
import { Github, Linkedin } from 'lucide-react'
import { useT } from '@/hooks/useTranslation'
import { NAV_LINKS, SITE } from '@/lib/constants'
import { useCursorStore } from '@/store/useCursorStore'
import { usePresentationStore } from '@/store/usePresentationStore'

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.68a8.27 8.27 0 0 0 4.84 1.55V6.78a4.85 4.85 0 0 1-1.07-.09z" />
    </svg>
  )
}

const socials = [
  { icon: Github,       href: SITE.github,   label: 'GitHub'   },
  { icon: Linkedin,     href: SITE.linkedin, label: 'LinkedIn' },
  { icon: TikTokIcon,   href: SITE.tiktok,   label: 'TikTok'   },
]

export default function Footer() {
  const t           = useT()
  const setCursor   = useCursorStore((s) => s.setState)
  const presenting  = usePresentationStore((s) => s.active)
  const { pathname} = useLocation()
  const year        = new Date().getFullYear()
  const isGuestbook = pathname === '/guestbook'

  if (presenting) return null

  const navLabels: Record<string, string> = {
    home:     t.nav.home,
    about:    t.nav.about,
    projects: t.nav.projects,
    services: t.nav.services,
    contact:  t.nav.contact,
  }

  return (
    <footer style={isGuestbook ? {
      position:        'relative',
      zIndex:          3,
      background:      'rgba(8,8,8,0.75)',
      backdropFilter:  'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop:       '1px solid rgba(255,255,255,0.18)',
      boxShadow:       '0 -1px 40px rgba(0,0,0,0.6)',
    } : {
      background: '#080808',
      borderTop:  '1px solid rgba(255,255,255,0.06)',
    }}>
      <div className="container-custom py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Left */}
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 select-none"
            >
              <img src="/icon.svg" alt="Caio Diniz" className="w-6 h-auto" style={{ filter: isGuestbook ? 'brightness(1.4)' : 'brightness(0.55)' }} />
              <span className="font-black text-white text-sm tracking-[-0.03em]">Caio Diniz</span>
            </Link>
            <p className={isGuestbook ? 'text-[0.6875rem] text-white/40 tracking-wide' : 'text-[0.6875rem] text-white/20 tracking-wide'}>
              {t.footer.tagline}
            </p>
            <p className={isGuestbook ? 'text-[0.6rem] text-white/25 tracking-wide' : 'text-[0.6rem] text-white/12 tracking-wide'}>
              © {year} Caio Diniz
            </p>
          </div>

          {/* Center: nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={isGuestbook
                  ? 'text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/50 hover:text-white transition-colors duration-200'
                  : 'text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/25 hover:text-white transition-colors duration-200'
                }
                onMouseEnter={() => setCursor('pointer')}
                onMouseLeave={() => setCursor('default')}
              >
                {navLabels[link.label]}
              </Link>
            ))}
            <Link
              to="/guestbook"
              className={isGuestbook
                ? 'text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white hover:text-white transition-colors duration-200'
                : 'text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/25 hover:text-white transition-colors duration-200'
              }
              onMouseEnter={() => setCursor('pointer')}
              onMouseLeave={() => setCursor('default')}
            >
              Livro de Visitas
            </Link>
          </nav>

          {/* Right: socials */}
          <div className="flex items-center gap-4">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={isGuestbook
                  ? 'text-white/45 hover:text-white transition-colors duration-200'
                  : 'text-white/20 hover:text-white transition-colors duration-200'
                }
                onMouseEnter={() => setCursor('pointer')}
                onMouseLeave={() => setCursor('default')}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
