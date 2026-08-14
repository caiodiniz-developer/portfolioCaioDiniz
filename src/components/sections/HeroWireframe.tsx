/**
 * The wireframe the hero assembles itself from.
 *
 * Overlays the real layout with grey outlined boxes at the same proportions,
 * then hands over: the boxes draw in, the real content fades up inside them,
 * and colour arrives last. The whole point is to show the interface being
 * built rather than presented.
 *
 * Purely decorative and non-interactive — the real hero is always mounted
 * underneath, so if the timeline never runs the visitor still gets the page.
 */
export default function HeroWireframe() {
  return (
    <div className="hw-root" aria-hidden>
      {/* LEFT column — badge, three headline bars, sub, buttons */}
      <div className="hw-col hw-left">
        <div className="hw-box hw-badge" />

        <div className="hw-stack">
          <div className="hw-box hw-line" style={{ width: '62%' }} />
          <div className="hw-box hw-line" style={{ width: '78%' }} />
          <div className="hw-box hw-line" style={{ width: '48%' }} />
        </div>

        <div className="hw-stack hw-sub">
          <div className="hw-box hw-thin" style={{ width: '52%' }} />
          <div className="hw-box hw-thin" style={{ width: '38%' }} />
        </div>

        <div className="hw-row">
          <div className="hw-box hw-btn" />
          <div className="hw-box hw-btn hw-btn-sm" />
        </div>
      </div>

      {/* RIGHT column — the portrait panel */}
      <div className="hw-col hw-right">
        <div className="hw-box hw-photo">
          {/* Diagonal cross — the universal "image goes here" mark */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="hw-cross">
            <line x1="0" y1="0" x2="100" y2="100" vectorEffect="non-scaling-stroke" />
            <line x1="100" y1="0" x2="0" y2="100" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>

      <style>{`
        .hw-root {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: grid;
          grid-template-columns: 1fr 42%;
          min-height: 100svh;
          pointer-events: none;
          /* Drawn by GSAP; starts hidden so a failed timeline never leaves a
             grey skeleton stranded over the real hero. */
          opacity: 0;
        }

        .hw-col {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(6rem,11vw,8.5rem) clamp(1.5rem,5vw,4.5rem);
          gap: clamp(1rem, 2vw, 1.75rem);
          min-width: 0;
        }
        .hw-right { padding-left: 0; padding-right: 0; justify-content: flex-end; }

        .hw-box {
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.025);
          border-radius: 4px;
          transform-origin: left center;
        }

        .hw-badge { width: 190px; height: 26px; border-radius: 999px; }

        .hw-stack { display: flex; flex-direction: column; gap: clamp(0.5rem,1vw,0.85rem); }
        .hw-line  { height: clamp(2.6rem, 6.6vw, 6.2rem); }
        .hw-sub   { margin-top: clamp(0.5rem,1.2vw,1rem); }
        .hw-thin  { height: 14px; border-radius: 3px; }

        .hw-row { display: flex; gap: 0.75rem; margin-top: clamp(0.5rem,1.2vw,1rem); }
        .hw-btn { width: 168px; height: 48px; border-radius: 999px; }
        .hw-btn-sm { width: 132px; }

        .hw-photo {
          position: relative;
          width: 100%;
          height: 62%;
          border-radius: 16px 16px 0 0;
          transform-origin: bottom center;
          overflow: hidden;
        }
        .hw-cross {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          stroke: rgba(255,255,255,0.1);
          stroke-width: 1;
        }

        /* Mobile: the real hero collapses to one column, so the skeleton must
           too — otherwise the boxes sit over the wrong things. */
        @media (max-width: 1024px) {
          .hw-root { grid-template-columns: 1fr; }
          .hw-right { display: none; }
        }
      `}</style>
    </div>
  )
}
