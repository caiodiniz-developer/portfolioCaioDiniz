import * as ReactAll from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import './styles/animations.css'
import App from './App'

// Polyfill: R3F 8.x reads ReactCurrentOwner via React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
// which React 19 restructured. This shim restores the expected shape so R3F's reconciler initialises.
// Safe to remove once @react-three/fiber upgrades to v9+ (native React 19 support).
type _Obj = Record<string, unknown>
const _SEC = '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED'
const _CLI = '__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE'
let _internals = (ReactAll as _Obj)[_SEC] as _Obj | undefined
if (!_internals) {
  _internals = {};
  (ReactAll as _Obj)[_SEC] = _internals
}
if (!_internals['ReactCurrentOwner']) {
  const _cli = (ReactAll as _Obj)[_CLI] as _Obj | undefined
  _internals['ReactCurrentOwner'] = (_cli?.['A'] as _Obj | undefined) ?? { current: null }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
