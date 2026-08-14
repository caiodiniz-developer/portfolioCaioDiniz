/**
 * Signals the moment the preloader is gone and the page is actually visible.
 *
 * The router mounts at the same time as the preloader, so every entrance
 * animation used to run behind a full-screen overlay and be finished before
 * anyone could see it. Anything that animates on arrival should wait for this
 * instead of for its own mount.
 *
 * Deliberately not React state: the hero needs this inside a GSAP context that
 * must not re-run, and a store subscription would re-render it.
 */

let ready = false
const waiting = new Set<() => void>()

export function isAppReady(): boolean {
  return ready
}

/** Called once, by App, when the preloader finishes. */
export function markAppReady(): void {
  if (ready) return
  ready = true
  waiting.forEach(cb => cb())
  waiting.clear()
}

/**
 * Run `cb` when the app becomes visible — immediately if that already happened
 * (a route mounted later, a returning visitor who skipped the preloader).
 * Returns an unsubscribe function.
 */
export function onAppReady(cb: () => void): () => void {
  if (ready) {
    cb()
    return () => {}
  }
  waiting.add(cb)
  return () => { waiting.delete(cb) }
}
