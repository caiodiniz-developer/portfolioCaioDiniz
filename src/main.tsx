import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
