import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { getTheme, toggleTheme, THEME_EVENT } from '@/lib/theme'
import type { Theme } from '@/lib/theme'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'

/** Sun/moon pill. The reveal circle grows from the button's centre. */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const en = useLanguageStore(s => s.lang) === 'en'
  const setCursor = useCursorStore(s => s.setState)
  const [theme, setTheme] = useState<Theme>(() => (typeof document === 'undefined' ? 'dark' : getTheme()))
  const light = theme === 'light'

  // Stay in sync when the theme is switched elsewhere (the Ctrl K palette).
  useEffect(() => {
    const sync = () => setTheme(getTheme())
    window.addEventListener(THEME_EVENT, sync)
    return () => window.removeEventListener(THEME_EVENT, sync)
  }, [])

  return (
    <button
      onClick={e => {
        const r = e.currentTarget.getBoundingClientRect()
        toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
      }}
      onMouseEnter={() => setCursor('pointer')}
      onMouseLeave={() => setCursor('default')}
      aria-label={light ? (en ? 'Switch to dark mode' : 'Mudar para o modo escuro') : (en ? 'Switch to light mode' : 'Mudar para o modo claro')}
      className={`items-center justify-center ${className}`}
      style={{
        width: '2.25rem', height: '2.25rem', borderRadius: '999px',
        border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)',
        color: 'rgba(255,255,255,0.6)', cursor: 'pointer', flexShrink: 0,
      }}
    >
      {light ? <Moon size={13} /> : <Sun size={13} />}
    </button>
  )
}
