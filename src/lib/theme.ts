import { flushSync } from 'react-dom'

/* Light mode.
 *
 * The site's palette is near-monochrome and written as hundreds of inline
 * rgba(255,255,255,x) values, so light mode is an inversion of the whole
 * page (see globals.css → "Light theme") rather than a second palette:
 * hue-rotate keeps the accent colours on their own hue, and photos, video
 * and canvases are inverted back so they look untouched.
 *
 * The switch runs as a View Transition: the new theme is revealed in a
 * circle growing from the button that was clicked. */

export type Theme = 'dark' | 'light'
const KEY = 'theme'
/** Fired on window whenever the theme changes, from anywhere. */
export const THEME_EVENT = 'themechange'

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f2f2f2' : '#0d0d0d')
  try { localStorage.setItem(KEY, theme) } catch { /* storage blocked */ }
  window.dispatchEvent(new Event(THEME_EVENT))
}

/** Called once at startup, before first paint (main.tsx). */
export function initTheme() {
  let saved: string | null = null
  try { saved = localStorage.getItem(KEY) } catch { /* storage blocked */ }
  if (saved === 'light') apply('light')
}

type VTDocument = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }

export function toggleTheme(origin?: { x: number; y: number }) {
  const next: Theme = getTheme() === 'light' ? 'dark' : 'light'
  const doc = document as VTDocument
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const run = () => apply(next)

  if (!doc.startViewTransition || reduced) { run(); return }

  const x = origin?.x ?? window.innerWidth / 2
  const y = origin?.y ?? 0
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

  document.documentElement.classList.add('theme-transition')
  const t = doc.startViewTransition(() => flushSync(run))
  t.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 650, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
    ).finished.finally(() => document.documentElement.classList.remove('theme-transition'))
  }).catch(() => document.documentElement.classList.remove('theme-transition'))
}
