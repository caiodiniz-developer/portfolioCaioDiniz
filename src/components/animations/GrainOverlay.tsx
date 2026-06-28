export default function GrainOverlay() {
  return (
    <>
      <div
        aria-hidden
        className="grain-overlay"
        style={{
          position:      'fixed',
          inset:         0,
          width:         '100%',
          height:        '100%',
          pointerEvents: 'none',
          zIndex:        9998,
          opacity:       0.28,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '220px 220px',
        }}
      />
      <style>{`
        .grain-overlay {
          animation: grain 0.9s steps(1) infinite;
        }
        @keyframes grain {
          0%   { background-position:   0%    0%   }
          11%  { background-position: -15%  -8%   }
          22%  { background-position:   8%  -22%  }
          33%  { background-position: -24%   4%   }
          44%  { background-position:  18%   16%  }
          55%  { background-position:  -7%  -34%  }
          66%  { background-position:  26%   8%   }
          77%  { background-position: -12%   22%  }
          88%  { background-position:  4%   -14%  }
          100% { background-position: -20%   30%  }
        }
      `}</style>
    </>
  )
}
