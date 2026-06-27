import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useT } from '@/hooks/useTranslation'
import { NAV_LINKS } from '@/lib/constants'
import { useCursorStore } from '@/store/useCursorStore'

interface NavigationProps {
  mobile?: boolean
  onClose?: () => void
}

export default function Navigation({ mobile = false, onClose }: NavigationProps) {
  const t = useT()
  const setCursor = useCursorStore((s) => s.setState)

  const navLabels: Record<string, string> = {
    home: t.nav.home,
    about: t.nav.about,
    projects: t.nav.projects,
    services: t.nav.services,
    contact: t.nav.contact,
  }

  if (mobile) {
    return (
      <nav>
        <ul className="flex flex-col">
          {NAV_LINKS.map((link, i) => (
            <motion.li
              key={link.path}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 + i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-white/[0.07] overflow-hidden"
            >
              <NavLink
                to={link.path}
                end={link.path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'block py-5 text-5xl font-black tracking-[-0.03em] transition-colors duration-200',
                    isActive ? 'text-white' : 'text-white/25 hover:text-white'
                  )
                }
              >
                {navLabels[link.label]}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>
    )
  }

  return (
    <nav>
      <ul className="flex items-center gap-0.5">
        {NAV_LINKS.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              end={link.path === '/'}
              onMouseEnter={() => setCursor('pointer')}
              onMouseLeave={() => setCursor('default')}
              className={({ isActive }) =>
                cn(
                  'block px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] transition-colors duration-200',
                  isActive ? 'text-white' : 'text-white/40 hover:text-white'
                )
              }
            >
              {navLabels[link.label]}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
