import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useT } from '@/hooks/useTranslation'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'
import Navigation from './Navigation'
import { SITE } from '@/lib/constants'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { toggle, lang } = useLanguageStore()
  const setCursor = useCursorStore((s) => s.setState)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'py-4 border-b border-white/[0.06]' : 'py-6'
        )}
        style={{
          background: scrolled ? 'rgba(13,13,13,0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
        }}
      >
        <div className="container-custom flex items-center justify-between gap-8">
          {/* Logo */}
          <Link
            to="/"
            className="font-black text-white text-base tracking-[-0.03em] select-none flex-shrink-0"
            onMouseEnter={() => setCursor('pointer')}
            onMouseLeave={() => setCursor('default')}
          >
            Caio Diniz
          </Link>

          {/* Center: nav */}
          <div className="hidden lg:flex items-center">
            <Navigation />
          </div>

          {/* Right: email + lang */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href={`mailto:${SITE.email}`}
              className="text-[0.6875rem] font-medium text-white/30 hover:text-white/70 uppercase tracking-[0.08em] transition-colors duration-200"
              onMouseEnter={() => setCursor('pointer')}
              onMouseLeave={() => setCursor('default')}
            >
              {SITE.email}
            </a>
            <button
              onClick={toggle}
              className="text-[0.6875rem] font-semibold text-white/30 hover:text-white uppercase tracking-[0.12em] transition-colors duration-200"
              onMouseEnter={() => setCursor('pointer')}
              onMouseLeave={() => setCursor('default')}
            >
              {lang === 'en' ? 'PT' : 'EN'}
            </button>
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden items-center gap-5">
            <button
              onClick={toggle}
              className="text-[0.6875rem] font-semibold text-white/30 uppercase tracking-[0.12em]"
            >
              {lang === 'en' ? 'PT' : 'EN'}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="text-white/50 hover:text-white transition-colors"
              onMouseEnter={() => setCursor('pointer')}
              onMouseLeave={() => setCursor('default')}
            >
              <Menu size={22} strokeWidth={1.5} />
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
              <span className="font-black text-white text-base tracking-[-0.03em]">
                Caio Diniz
              </span>
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
              <Navigation mobile onClose={() => setMobileOpen(false)} />
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
                onClick={toggle}
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
