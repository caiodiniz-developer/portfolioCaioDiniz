/**
 * Privacy-respecting, self-hosted analytics.
 *
 * Provider-agnostic on purpose: the site calls `pageview()` and `track()`, and
 * this module decides who receives them. Swapping Umami for Plausible is an
 * env-var change, not a code change.
 *
 * INERT BY DEFAULT. With no env vars set, nothing loads and nothing is sent —
 * so local development, previews and forks never pollute production numbers.
 *
 * ── Setup (Umami, free & self-hosted) ─────────────────────────────────────
 *   1. Deploy Umami — one click on Railway/Vercel + any Postgres.
 *      https://umami.is/docs/install
 *   2. Add the site, copy the Website ID.
 *   3. Put both values in .env.local:
 *        VITE_UMAMI_URL=https://your-umami.example.com
 *        VITE_UMAMI_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 *
 * ── Or Plausible ──────────────────────────────────────────────────────────
 *        VITE_PLAUSIBLE_URL=https://your-plausible.example.com
 *        VITE_PLAUSIBLE_DOMAIN=caiodiniz.dev
 *
 * Neither sets cookies, so no consent banner is required under GDPR/LGPD.
 */

const UMAMI_URL       = import.meta.env.VITE_UMAMI_URL       as string | undefined
const UMAMI_ID        = import.meta.env.VITE_UMAMI_ID        as string | undefined
const PLAUSIBLE_URL   = import.meta.env.VITE_PLAUSIBLE_URL   as string | undefined
const PLAUSIBLE_DOMAIN= import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined

type Provider = 'umami' | 'plausible' | 'none'

const provider: Provider =
  UMAMI_URL && UMAMI_ID           ? 'umami'
  : PLAUSIBLE_URL && PLAUSIBLE_DOMAIN ? 'plausible'
  : 'none'

declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, unknown>) => void }
    plausible?: (event: string, opts?: { props?: Record<string, unknown> }) => void
  }
}

let loaded = false

/** Inject the tracker. Safe to call more than once. */
export function initAnalytics(): void {
  if (loaded || provider === 'none' || typeof document === 'undefined') return

  // Respect an explicit opt-out. Cheap to honour, and the right default.
  if (navigator.doNotTrack === '1') return

  const s = document.createElement('script')
  s.defer = true

  if (provider === 'umami') {
    s.src = `${UMAMI_URL!.replace(/\/$/, '')}/script.js`
    s.setAttribute('data-website-id', UMAMI_ID!)
    // We send pageviews ourselves — the router knows about navigation before
    // the History API patch would, and auto-tracking double-counts on the
    // transitions this site does.
    s.setAttribute('data-auto-track', 'false')
  } else {
    s.src = `${PLAUSIBLE_URL!.replace(/\/$/, '')}/js/script.manual.js`
    s.setAttribute('data-domain', PLAUSIBLE_DOMAIN!)
  }

  document.head.appendChild(s)
  loaded = true
}

/** Record a page view. Call on every route change, including the first. */
export function pageview(path: string): void {
  if (provider === 'none') return
  try {
    if (provider === 'umami') window.umami?.track(path)
    else window.plausible?.('pageview')
  } catch {
    // analytics must never break the page
  }
}

/**
 * Record a named interaction.
 * Keep the vocabulary small and intentional — a metric nobody reads is noise.
 */
export function track(event: string, props?: Record<string, unknown>): void {
  if (provider === 'none') return
  try {
    if (provider === 'umami') window.umami?.track(event, props)
    else window.plausible?.(event, props ? { props } : undefined)
  } catch {
    // ignore
  }
}

/** True when a provider is configured — useful for debug UI. */
export const analyticsEnabled = provider !== 'none'
export const analyticsProvider = provider
