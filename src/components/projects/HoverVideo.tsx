import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/* A few seconds of the live site, fading in over the screenshot while the
   card is hovered. `preload="none"` means nothing downloads until the first
   hover, and touch devices / reduced-motion users never mount it at all —
   the screenshot is the whole experience there. */
export default function HoverVideo({ src, active }: { src: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = usePrefersReducedMotion()
  const [canHover] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  )
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (active) {
      v.play().catch(() => { /* interrupted by a quick mouseleave */ })
    } else {
      v.pause()
      v.currentTime = 0
    }
  }, [active])

  if (reduced || !canHover) return null

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      onPlaying={() => setReady(true)}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      style={{
        opacity: active && ready ? 1 : 0,
        transition: 'opacity 0.45s cubic-bezier(0.16,1,0.3,1)',
      }}
    />
  )
}
