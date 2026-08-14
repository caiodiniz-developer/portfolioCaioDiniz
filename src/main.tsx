import { createRoot } from 'react-dom/client'
// Lenis ships a REQUIRED stylesheet. Without it html/body keep their default
// height rules and `scroll-behavior` is never forced to `auto`, so the browser
// fights Lenis on every wheel event and scroll feels native/choppy.
import 'lenis/dist/lenis.css'
import './styles/globals.css'
import './styles/animations.css'
import App from './App'

// R3F v8 + React 19 shim: restore ReactCurrentOwner that R3F's reconciler expects.
// Wrapped in try-catch because namespace objects may be sealed in production bundles.
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react') as Record<string, unknown>
  const SEC = '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED'
  const CLI = '__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE'
  if (!React[SEC]) {
    React[SEC] = {}
  }
  const internals = React[SEC] as Record<string, unknown>
  if (!internals['ReactCurrentOwner']) {
    const cli = React[CLI] as Record<string, unknown> | undefined
    internals['ReactCurrentOwner'] = (cli?.['A'] as Record<string, unknown> | undefined) ?? { current: null }
  }
} catch (_) {
  // silently skip — R3F may already work without the shim in newer versions
}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {/* SW registration optional */})
  })
}

// NOTE: StrictMode is intentionally omitted. In dev it mounts every effect twice,
// which tears down and rebuilds Lenis + all ScrollTrigger instances mid-frame —
// that produced stale pin/scroll measurements and visible jank while developing.
createRoot(document.getElementById('root')!).render(<App />)
