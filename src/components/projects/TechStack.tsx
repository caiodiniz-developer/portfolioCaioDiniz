import { useState } from 'react'
import { resolveTech } from '@/data/techIcons'

/**
 * The stack of a project, drawn with the same marks and the same hover
 * behaviour as the carousel on the home page: greyscale and dimmed at rest,
 * full colour and slightly scaled on hover, with the label picking up the
 * brand colour. Technologies devicon has no mark for degrade to a lettered
 * badge rather than a broken image.
 */
function TechItem({ raw, index }: { raw: string; index: number }) {
  const t = resolveTech(raw)
  const [hovered, setHovered] = useState(false)

  const restFilter = t.invert
    ? 'grayscale(1) invert(1) brightness(1.2) opacity(0.4)'
    : 'grayscale(1) brightness(1.8) opacity(0.4)'
  const hoverFilter = t.invert ? 'invert(1)' : 'none'

  return (
    <div
      className="ts-item"
      style={{ animationDelay: `${index * 70}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="ts-icon">
        {t.icon ? (
          <img
            src={t.icon}
            alt={t.name}
            loading="lazy"
            draggable={false}
            style={{
              width: '100%', height: '100%', objectFit: 'contain',
              filter:     hovered ? hoverFilter : restFilter,
              transform:  hovered ? 'scale(1.15)' : 'scale(1)',
              transition: 'filter 0.35s ease, transform 0.35s ease',
              willChange: 'filter, transform',
            }}
          />
        ) : (
          <span
            className="ts-badge"
            style={{
              color:       hovered ? t.color : 'rgba(255,255,255,0.35)',
              borderColor: hovered ? t.color : 'rgba(255,255,255,0.14)',
              transform:   hovered ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {t.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      <span
        className="ts-name"
        style={{ color: hovered ? t.color : 'rgba(255,255,255,0.25)' }}
      >
        {t.name}
      </span>
    </div>
  )
}

export default function TechStack({ stack }: { stack: string[] }) {
  return (
    <div className="ts-grid">
      {stack.map((raw, i) => <TechItem key={raw} raw={raw} index={i} />)}

      <style>{`
        .ts-grid {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(1.25rem, 3vw, 2.25rem);
        }

        .ts-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          width: 82px;
          flex-shrink: 0;
          cursor: default;
          animation: ts-in 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes ts-in {
          from { opacity: 0; transform: translateY(14px) scale(0.9); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ts-item { animation: none; }
        }

        .ts-icon {
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
        }

        .ts-badge {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid;
          border-radius: 10px;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          transition: color 0.35s ease, border-color 0.35s ease, transform 0.35s ease;
        }

        .ts-name {
          font-size: 0.5rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-align: center;
          line-height: 1.25;
          transition: color 0.35s ease;
        }
      `}</style>
    </div>
  )
}
