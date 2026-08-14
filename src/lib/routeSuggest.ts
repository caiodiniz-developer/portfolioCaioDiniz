import { projects } from '@/data/projects'

/**
 * "Did you mean …?" for mistyped URLs.
 *
 * Uses Levenshtein edit distance against the site's real routes. The threshold
 * scales with the length of what was typed — a 5-character path may only be 2
 * edits away to count, while a long one tolerates more — so we suggest
 * `/projects` for `/projetcs` but stay silent on genuine nonsense.
 */

/** Every navigable path on the site, built from the same data the router uses. */
export function allRoutes(): string[] {
  return [
    '/',
    '/about',
    '/projects',
    '/services',
    '/contact',
    '/guestbook',
    '/cv',
    ...projects.map(p => `/projects/${p.slug}`),
  ]
}

/** Classic iterative Levenshtein with a rolling two-row buffer. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  let curr = new Array<number>(b.length + 1)

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(
        curr[j - 1] + 1,      // insertion
        prev[j] + 1,          // deletion
        prev[j - 1] + cost,   // substitution
      )
    }
    ;[prev, curr] = [curr, prev]
  }

  return prev[b.length]
}

export interface Suggestion {
  path: string
  distance: number
}

/**
 * Closest real route to `typed`, or null when nothing is close enough to be
 * worth offering. Comparison is case-insensitive and ignores a trailing slash.
 */
export function suggestRoute(typed: string): Suggestion | null {
  const clean = typed.toLowerCase().replace(/\/+$/, '') || '/'
  if (clean === '/') return null

  let best: Suggestion | null = null

  for (const route of allRoutes()) {
    const d = levenshtein(clean, route.toLowerCase())
    if (!best || d < best.distance) best = { path: route, distance: d }
  }

  if (!best) return null

  // Allow roughly one edit per 3 characters typed, capped — long garbage
  // strings shouldn't match a short route just because the cap is generous.
  const budget = Math.min(5, Math.max(2, Math.floor(clean.length / 3)))
  return best.distance <= budget ? best : null
}
