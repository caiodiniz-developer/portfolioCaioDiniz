import { useRef, useEffect, useState } from 'react'
import { useLanguageStore } from '@/store/useLanguageStore'

const DEV = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

const stacks = [
  { name: 'React',       icon: `${DEV}/react/react-original.svg`,                 color: '#61DAFB' },
  { name: 'TypeScript',  icon: `${DEV}/typescript/typescript-original.svg`,        color: '#3178C6' },
  { name: 'JavaScript',  icon: `${DEV}/javascript/javascript-original.svg`,        color: '#F7DF1E' },
  { name: 'Node.js',     icon: `${DEV}/nodejs/nodejs-original.svg`,                color: '#339933' },
  { name: 'HTML5',       icon: `${DEV}/html5/html5-original.svg`,                  color: '#E34F26' },
  { name: 'CSS3',        icon: `${DEV}/css3/css3-original.svg`,                    color: '#1572B6' },
  { name: 'Tailwind',    icon: `${DEV}/tailwindcss/tailwindcss-original.svg`,      color: '#06B6D4' },
  { name: 'PostgreSQL',  icon: `${DEV}/postgresql/postgresql-original.svg`,        color: '#4169E1' },
  { name: 'MySQL',       icon: `${DEV}/mysql/mysql-original.svg`,                  color: '#4479A1' },
  { name: 'Git',         icon: `${DEV}/git/git-original.svg`,                      color: '#F05032' },
  { name: 'Figma',       icon: `${DEV}/figma/figma-original.svg`,                  color: '#F24E1E' },
  { name: 'Vite',        icon: `${DEV}/vitejs/vitejs-original.svg`,                color: '#646CFF' },
  { name: 'Docker',      icon: `${DEV}/docker/docker-original.svg`,                color: '#2496ED' },
  { name: 'Prisma',      icon: `${DEV}/prisma/prisma-original.svg`,                color: '#5A67D8', invert: true },
]

function StackItem({ name, icon, color, invert = false }: {
  name: string
  icon: string
  color: string
  invert?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  const defaultFilter = invert
    ? 'grayscale(1) invert(1) brightness(1.2) opacity(0.4)'
    : 'grayscale(1) brightness(1.8) opacity(0.4)'

  const hoverFilter = invert ? 'invert(1)' : 'none'

  return (
    <div
      className="flex flex-col items-center gap-2.5 flex-shrink-0 cursor-default"
      style={{ width: '88px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-11 h-11 flex items-center justify-center">
        <img
          src={icon}
          alt={name}
          loading="lazy"
          className="w-full h-full object-contain select-none"
          draggable={false}
          style={{
            filter:     hovered ? hoverFilter : defaultFilter,
            transform:  hovered ? 'scale(1.15)' : 'scale(1)',
            transition: 'filter 0.35s ease, transform 0.35s ease',
            willChange: 'filter, transform',
          }}
        />
      </div>
      <span
        className="text-[0.5rem] font-semibold uppercase tracking-[0.1em] text-center leading-tight"
        style={{
          color:      hovered ? color : 'rgba(255,255,255,0.22)',
          transition: 'color 0.35s ease',
        }}
      >
        {name}
      </span>
    </div>
  )
}

function Track() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    let pos    = 0
    let paused = false
    let rafId: number

    function tick() {
      if (!paused) {
        pos -= 0.45
        const half = el!.scrollWidth / 2
        if (pos <= -half) pos = 0
        el!.style.transform = `translate3d(${pos}px, 0, 0)`
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    const pause  = () => { paused = true  }
    const resume = () => { paused = false }

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
  }, [])

  const doubled = [...stacks, ...stacks]

  return (
    <div
      className="overflow-hidden"
      style={{
        maskImage:       'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ width: 'max-content', gap: '2.5rem', padding: '2rem 0' }}
      >
        {doubled.map((s, i) => (
          <StackItem key={i} {...s} />
        ))}
      </div>
    </div>
  )
}

export default function StackCarousel() {
  const lang = useLanguageStore((s) => s.lang)

  return (
    <section
      style={{
        background:   '#111111',
        borderTop:    '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        overflow:     'hidden',
      }}
    >
      {/* Header */}
      <div className="container-custom pt-16 pb-4">
        <div className="flex flex-col gap-4">
          <span className="inline-flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/30">
            <span className="w-5 h-px bg-white/15" />
            {lang === 'en' ? 'Tech stack' : 'Tecnologias'}
          </span>
          <h2
            className="font-black text-white"
            style={{
              fontFamily:    'Syne, sans-serif',
              fontSize:      'clamp(1.8rem, 3.5vw, 3rem)',
              letterSpacing: '-0.04em',
              lineHeight:    '0.95',
            }}
          >
            {lang === 'en' ? 'Tools I work with' : 'Ferramentas que uso'}
          </h2>
        </div>
      </div>

      {/* Icon carousel */}
      <div className="py-4 pb-14">
        <Track />
      </div>
    </section>
  )
}
