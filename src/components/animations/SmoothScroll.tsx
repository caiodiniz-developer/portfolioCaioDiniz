import { useLenis } from '@/hooks/useLenis'

/**
 * Mounts the Lenis smooth-scroll singleton and wires it to GSAP's ticker.
 * Respects prefers-reduced-motion — the hook skips initialization when set.
 * Must be rendered once, outside of any scrollable wrapper.
 */
export default function SmoothScroll() {
  useLenis()
  return null
}
