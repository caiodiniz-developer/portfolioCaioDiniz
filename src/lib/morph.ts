import { flushSync } from 'react-dom'
import type { MouseEvent } from 'react'

/* Card → case study morph, via the View Transitions API.
 *
 * The clicked card's media and the case study's hero share one
 * view-transition-name, so the browser animates one into the other across
 * the route change. While a morph runs, the router keeps its page-transition
 * key (see RootLayout) so the regular fade/wipe doesn't replay over it.
 *
 * Browsers without the API, and visitors who prefer reduced motion, just
 * navigate normally. */

export const MORPH_NAME = 'project-media'
export const MORPH_TARGET = '[data-morph-target]'

let morphing = false
export const isMorphing = () => morphing

type ViewTransitionDocument = Document & {
  startViewTransition?: (cb: () => Promise<void> | void) => { finished: Promise<void> }
}

/* Polls with setTimeout, not requestAnimationFrame: the browser suppresses
   rendering — rAF included — until this update callback resolves. */
function waitForTarget(timeout = 2000): Promise<void> {
  return new Promise(resolve => {
    const start = performance.now()
    const tick = () => {
      // A short beat after the target appears lets the scroll reset land
      // before the browser snapshots the new state.
      if (document.querySelector(MORPH_TARGET)) setTimeout(resolve, 30)
      else if (performance.now() - start > timeout) resolve()
      else setTimeout(tick, 16)
    }
    tick()
  })
}

export function morphNavigate(source: HTMLElement | null, go: () => void) {
  const doc = document as ViewTransitionDocument
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!source || !doc.startViewTransition || reduced) { go(); return }

  morphing = true
  source.style.viewTransitionName = MORPH_NAME
  const transition = doc.startViewTransition(async () => {
    // The old page lingers for a frame while it unmounts; it must not also
    // claim the name, or the browser skips the whole transition.
    source.style.viewTransitionName = ''
    flushSync(go)
    await waitForTarget()
  })
  transition.finished.finally(() => { morphing = false })
}

/** Plain left-click only — let cmd/ctrl/middle-click open a new tab as usual. */
export function isPlainClick(e: MouseEvent) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey
}

/** Warm the case-study chunk on hover so the morph isn't waiting on network. */
export function prefetchProjectDetail() {
  void import('@/pages/ProjectDetail')
}
