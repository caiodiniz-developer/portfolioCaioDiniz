import { useRef, useEffect } from 'react'

const ITEMS_A = [
  'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'MySQL',
  'GSAP', 'Framer Motion', 'UI Design', 'Web Apps', 'APIs',
  'JavaScript', 'CSS', 'HTML', 'Git', 'GitHub',
]

const ITEMS_B = [
  'Three.js', 'Tailwind CSS', 'Vite', 'Performance', 'Prisma',
  'Figma', 'Vercel', 'Clean Code', 'Motion Design', 'Full Stack',
  'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'MySQL',
]

function Dot() {
  return (
    <span
      className="flex-shrink-0 rounded-full inline-block"
      style={{ width: '3px', height: '3px', background: 'rgba(255,255,255,0.18)', flexShrink: 0 }}
    />
  )
}

function Track({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null)

  /* RAF-based seamless marquee — pause on hover, touch-friendly */
  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    const speed   = reverse ? -0.45 : 0.45   /* px per frame */
    let pos       = reverse ? -el.scrollWidth / 2 : 0
    let paused    = false
    let rafId: number

    function tick() {
      if (!paused) {
        pos += speed
        /* Seamlessly wrap: content is doubled so at half we reset */
        const half = el!.scrollWidth / 2
        if (!reverse && pos <= -half) pos = 0
        if (reverse  && pos >= 0)    pos = -half
        el!.style.transform = `translate3d(${pos}px, 0, 0)`
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    const pause   = () => { paused = true  }
    const resume  = () => { paused = false }

    el.addEventListener('mouseenter', pause,  { passive: true })
    el.addEventListener('mouseleave', resume, { passive: true })
    el.addEventListener('touchstart', pause,  { passive: true })
    el.addEventListener('touchend',   resume, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      el.removeEventListener('mouseenter', pause)
      el.removeEventListener('mouseleave', resume)
      el.removeEventListener('touchstart', pause)
      el.removeEventListener('touchend',   resume)
    }
  }, [reverse])

  /* Double the items for seamless loop */
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden py-3.5" style={{ willChange: 'transform' }}>
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ width: 'max-content', whiteSpace: 'nowrap' }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-5 px-5" style={{ flexShrink: 0 }}>
            <span
              className="font-semibold uppercase"
              style={{ fontSize: '0.6875rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.26)' }}
            >
              {item}
            </span>
            <Dot />
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Marquee() {
  return (
    <section
      style={{
        borderTop:    '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background:   '#111111',
        overflow:     'hidden',
      }}
    >
      <Track items={ITEMS_A} />
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
      <Track items={ITEMS_B} reverse />
    </section>
  )
}
