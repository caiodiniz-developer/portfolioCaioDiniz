import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useT } from '@/hooks/useTranslation'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'
import { usePresentationStore } from '@/store/usePresentationStore'
import { NAV_LINKS, SITE } from '@/lib/constants'
import { CubertoBtn } from '@/components/sections/Hero'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [glowing, setGlowing] = useState(false)
  const { toggle, lang } = useLanguageStore()
  const t = useT()
  const setCursor = useCursorStore((s) => s.setState)
  const { active: presenting, toggle: togglePresentation } = usePresentationStore()

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  if (presenting) return null

  const navLabels: Record<string, string> = {
    home:     t.nav.home,
    about:    t.nav.about,
    projects: t.nav.projects,
    services: t.nav.services,
    contact:  t.nav.contact,
  }

  function handleToggle() {
    toggle()
    setGlowing(true)
    setTimeout(() => setGlowing(false), 650)
  }

  return (
    <>
      {/* ─── Floating pill header ─── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center"
        style={{ padding: '1.25rem 1rem', pointerEvents: 'none' }}
      >
        <div
          className="flex items-center"
          style={{
            pointerEvents:        'auto',
            background:           'rgba(10,10,10,0.88)',
            backdropFilter:       'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border:               '1px solid rgba(255,255,255,0.1)',
            borderRadius:         '999px',
            padding:              '0.5rem 0.5rem 0.5rem 1rem',
            width:                'min(920px, calc(100vw - 2rem))',
            gap:                  '0.25rem',
          }}
        >
          {/* Logo — double-click activates presentation mode */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0"
            onMouseEnter={() => setCursor('pointer')}
            onMouseLeave={() => setCursor('default')}
            onDoubleClick={() => togglePresentation()}
            style={{ marginRight: '0.375rem' }}
          >
            <img
              src="/icon.svg"
              width={28}
              height={28}
              alt="CD"
              style={{ borderRadius: '7px', flexShrink: 0 }}
            />
            <span style={{
              fontWeight:    700,
              fontSize:      '0.875rem',
              letterSpacing: '-0.02em',
              color:         '#ffffff',
              whiteSpace:    'nowrap',
            }}>
              Caio Diniz
            </span>
          </Link>

          {/* Separator */}
          <div style={{
            width:      1,
            height:     18,
            background: 'rgba(255,255,255,0.1)',
            flexShrink: 0,
            margin:     '0 0.625rem',
          }} />

          {/* Nav links — desktop only */}
          <nav className="hidden lg:flex items-center justify-center flex-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onMouseEnter={() => setCursor('pointer')}
                onMouseLeave={() => setCursor('default')}
                className={({ isActive }) =>
                  cn(
                    'px-3.5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.08em] rounded-full transition-colors duration-200 whitespace-nowrap',
                    isActive
                      ? 'text-white bg-white/[0.07]'
                      : 'text-white/40 hover:text-white/75'
                  )
                }
              >
                {navLabels[link.label]}
              </NavLink>
            ))}
            <NavLink
              to="/guestbook"
              onMouseEnter={() => setCursor('pointer')}
              onMouseLeave={() => setCursor('default')}
              className={({ isActive }) =>
                cn(
                  'px-3.5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.08em] rounded-full transition-colors duration-200 whitespace-nowrap',
                  isActive
                    ? 'text-white bg-white/[0.07]'
                    : 'text-white/40 hover:text-white/75'
                )
              }
            >
              {lang === 'en' ? 'Guestbook' : 'Livro de Visitas'}
            </NavLink>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Language toggle with shimmer glow */}
            <button
              onClick={handleToggle}
              onMouseEnter={() => setCursor('pointer')}
              onMouseLeave={() => setCursor('default')}
              className="hidden lg:flex relative overflow-hidden items-center justify-center"
              style={{
                height:        '2.25rem',
                padding:       '0 0.875rem',
                borderRadius:  '999px',
                border:        '1px solid rgba(255,255,255,0.12)',
                background:    'rgba(255,255,255,0.04)',
                color:         'rgba(255,255,255,0.5)',
                fontSize:      '0.6rem',
                fontWeight:    700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor:        'pointer',
                transition:    'color 0.25s, border-color 0.25s',
                flexShrink:    0,
              }}
            >
              {glowing && (
                <motion.span
                  key={String(glowing)}
                  initial={{ x: '-120%' }}
                  animate={{ x: '220%' }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  style={{
                    position:   'absolute',
                    inset:      0,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
                    borderRadius: 'inherit',
                  }}
                />
              )}
              <AnimatePresence mode="wait">
                <motion.span
                  key={lang}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="relative z-10"
                >
                  {lang === 'en' ? 'PT' : 'EN'}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* CTA — "Let's talk" / "Vamos conversar" */}
            <Link
              to="/contact"
              onMouseEnter={() => setCursor('pointer')}
              onMouseLeave={() => setCursor('default')}
              className="hidden lg:block flex-shrink-0"
              style={{ textDecoration: 'none' }}
            >
              <CubertoBtn>
                {lang === 'en' ? "Let's talk" : 'Vamos conversar'}
              </CubertoBtn>
            </Link>

            {/* Language toggle on mobile (hamburger replaced by bottom nav) */}
            <button
              onClick={handleToggle}
              onMouseEnter={() => setCursor('pointer')}
              onMouseLeave={() => setCursor('default')}
              className="flex lg:hidden relative overflow-hidden items-center justify-center"
              style={{
                height:        '2.25rem',
                padding:       '0 0.875rem',
                borderRadius:  '999px',
                border:        '1px solid rgba(255,255,255,0.12)',
                background:    'rgba(255,255,255,0.04)',
                color:         'rgba(255,255,255,0.5)',
                fontSize:      '0.6rem',
                fontWeight:    700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor:        'pointer',
                flexShrink:    0,
              }}
            >
              {lang === 'en' ? 'PT' : 'EN'}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile overlay menu ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[9990] flex flex-col"
            style={{ background: '#0d0d0d' }}
          >
            {/* Top bar */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/[0.07]">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5"
              >
                <img src="/icon.svg" width={28} height={28} style={{ borderRadius: '7px' }} alt="CD" />
                <span className="font-black text-white text-base tracking-[-0.03em]">Caio Diniz</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close"
                className="text-white/40 hover:text-white transition-colors"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 flex flex-col justify-center px-6">
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
                      onClick={() => setMobileOpen(false)}
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
                <motion.li
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.07 + NAV_LINKS.length * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-white/[0.07] overflow-hidden"
                >
                  <NavLink
                    to="/guestbook"
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'block py-5 text-5xl font-black tracking-[-0.03em] transition-colors duration-200',
                        isActive ? 'text-white' : 'text-white/25 hover:text-white'
                      )
                    }
                  >
                    {lang === 'en' ? 'Guestbook' : 'Livro de Visitas'}
                  </NavLink>
                </motion.li>
              </ul>
            </div>

            {/* Bottom */}
            <motion.div
              className="px-6 pb-8 pt-5 border-t border-white/[0.07] flex justify-between items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <a href={`mailto:${SITE.email}`} className="text-xs text-white/25 tracking-wide">
                {SITE.email}
              </a>
              <button
                onClick={handleToggle}
                className="text-xs font-semibold uppercase tracking-widest text-white/25"
              >
                {lang === 'en' ? 'PT' : 'EN'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
