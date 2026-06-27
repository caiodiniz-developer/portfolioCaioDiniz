import { useEffect, useRef, useState } from 'react'

interface LoaderProps {
  onComplete: () => void
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      current += 1
      const eased = Math.min(Math.round(Math.pow(current / 100, 0.6) * 100), 100)
      setProgress(eased)

      if (current >= 100) {
        clearInterval(interval)

        /* Wipe out with CSS transition — no Framer Motion dependency */
        setTimeout(() => {
          const el = ref.current
          if (el) {
            el.style.transition = 'clip-path 0.9s cubic-bezier(0.76,0,0.24,1)'
            el.style.clipPath   = 'inset(0 0 100% 0)'
          }
          setTimeout(onComplete, 950)
        }, 200)
      }
    }, 18)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[9999] flex flex-col justify-between"
      style={{
        background: '#0d0d0d',
        padding:    'clamp(1.5rem, 4vw, 3.5rem)',
        clipPath:   'inset(0 0 0% 0)',
      }}
    >
      <style>{`
        @keyframes loaderSlideUp {
          from { transform: translateY(110%); }
          to   { transform: translateY(0%); }
        }
        .loader-line {
          overflow: hidden;
        }
        .loader-line-inner {
          animation: loaderSlideUp 0.75s cubic-bezier(0.76,0,0.24,1) forwards;
        }
      `}</style>

      {/* Top label */}
      <div className="loader-line">
        <p
          className="loader-line-inner text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: 'rgba(255,255,255,0.25)', animationDelay: '0.05s' }}
        >
          Caio Diniz — Portfolio
        </p>
      </div>

      {/* Center big name */}
      <div>
        <div className="loader-line">
          <h1
            className="loader-line-inner font-black text-white select-none"
            style={{
              fontSize:      'clamp(3.5rem, 11vw, 9.5rem)',
              letterSpacing: '-0.05em',
              lineHeight:    '0.88',
              animationDelay: '0.12s',
            }}
          >
            CAIO
          </h1>
        </div>
        <div className="loader-line">
          <h1
            className="loader-line-inner font-black select-none"
            style={{
              fontSize:      'clamp(3.5rem, 11vw, 9.5rem)',
              letterSpacing: '-0.05em',
              lineHeight:    '0.88',
              color:         'rgba(255,255,255,0.2)',
              animationDelay: '0.2s',
            }}
          >
            DINIZ
          </h1>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center justify-between gap-8">
        <div className="flex-1" style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }}>
          <div
            style={{
              height:          '1px',
              background:      '#ffffff',
              transformOrigin: 'left',
              transform:       `scaleX(${progress / 100})`,
              transition:      'transform 0.04s linear',
            }}
          />
        </div>
        <span
          className="font-semibold tabular-nums flex-shrink-0"
          style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}
        >
          {String(progress).padStart(3, '0')}
        </span>
      </div>
    </div>
  )
}
