import { useLocation, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, User, FolderOpen, Layers, Mail, BookOpen } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { usePresentationStore } from '@/store/usePresentationStore'

const TABS = [
  { path: '/',          icon: Home,       en: 'Home',    pt: 'Início'  },
  { path: '/about',     icon: User,       en: 'About',   pt: 'Sobre'   },
  { path: '/projects',  icon: FolderOpen, en: 'Work',    pt: 'Work'    },
  { path: '/services',  icon: Layers,     en: 'Services',pt: 'Serviços'},
  { path: '/contact',   icon: Mail,       en: 'Contact', pt: 'Contato' },
  { path: '/guestbook', icon: BookOpen,   en: 'Book',    pt: 'Visitas' },
]

export default function MobileNav() {
  const { pathname }  = useLocation()
  const lang          = useLanguageStore(s => s.lang)
  const presenting    = usePresentationStore(s => s.active)

  if (presenting) return null

  return (
    <nav
      className="lg:hidden"
      style={{
        position:             'fixed',
        bottom:               0,
        left:                 0,
        right:                0,
        zIndex:               990,
        background:           'rgba(8,8,10,0.92)',
        backdropFilter:       'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderTop:            '1px solid rgba(255,255,255,0.08)',
        paddingBottom:        'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div style={{ display: 'flex', padding: '0 0.25rem' }}>
        {TABS.map(({ path, icon: Icon, en, pt }) => {
          const isActive = path === '/' ? pathname === '/' : pathname.startsWith(path)
          const label    = lang === 'en' ? en : pt

          return (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              style={{
                flex:           1,
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                gap:            3,
                padding:        '11px 4px 9px',
                textDecoration: 'none',
                position:       'relative',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {/* Sliding background pill */}
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-pill"
                  style={{
                    position:     'absolute',
                    inset:        '5px 3px',
                    borderRadius: 12,
                    background:   'rgba(255,255,255,0.07)',
                    border:       '1px solid rgba(255,255,255,0.1)',
                  }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                />
              )}

              <motion.div
                animate={{ y: isActive ? -1 : 0, scale: isActive ? 1.08 : 1 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: 'relative', zIndex: 1 }}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.2 : 1.6}
                  style={{
                    color:      isActive ? '#ffffff' : 'rgba(255,255,255,0.28)',
                    transition: 'color 0.2s',
                  }}
                />
              </motion.div>

              <span style={{
                fontSize:      '0.48rem',
                fontWeight:    isActive ? 700 : 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color:         isActive ? '#ffffff' : 'rgba(255,255,255,0.28)',
                transition:    'color 0.2s',
                position:      'relative',
                zIndex:        1,
                whiteSpace:    'nowrap',
              }}>
                {label}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
