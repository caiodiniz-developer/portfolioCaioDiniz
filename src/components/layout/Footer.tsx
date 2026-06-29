import { Link } from 'react-router-dom'
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
  const year        = new Date().getFullYear()

  if (presenting) return null

  const navLabels: Record<string, string> = {
    home:     t.nav.home,
    about:    t.nav.about,
    projects: t.nav.projects,
    services: t.nav.services,
    contact:  t.nav.contact,
  }

  return (
    <footer style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="container-custom py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Left */}
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="font-black text-white text-sm tracking-[-0.03em] select-none"
            >
              Caio Diniz
            </Link>
            <p className="text-[0.6875rem] text-white/20 tracking-wide">
              © {year} — Full Stack Developer
            </p>
          </div>

          {/* Center: nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/25 hover:text-white transition-colors duration-200"
                onMouseEnter={() => setCursor('pointer')}
                onMouseLeave={() => setCursor('default')}
              >
                {navLabels[link.label]}
              </Link>
            ))}
            <Link
              to="/guestbook"
              className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/25 hover:text-white transition-colors duration-200"
              onMouseEnter={() => setCursor('pointer')}
              onMouseLeave={() => setCursor('default')}
            >
              Guestbook
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
                className="text-white/20 hover:text-white transition-colors duration-200"
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
