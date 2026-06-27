import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate(self) {
        bar.style.transform = `scaleX(${self.progress})`
      },
    })

    return () => st.kill()
  }, [])

  return (
    <div
      ref={barRef}
      style={{
        position:       'fixed',
        top:            0,
        left:           0,
        right:          0,
        height:         '2px',
        background:     'rgba(255,255,255,0.55)',
        zIndex:         9999,
        transform:      'scaleX(0)',
        transformOrigin:'left',
        pointerEvents:  'none',
        willChange:     'transform',
      }}
    />
  )
}
