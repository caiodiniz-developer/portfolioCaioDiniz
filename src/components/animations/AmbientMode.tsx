import { useState, useRef } from 'react'
import { Music, Volume1, Volume2, VolumeX } from 'lucide-react'

export default function AmbientMode() {
  const [active, setActive] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  function toggle() {
    if (!active) {
      if (!audioRef.current) {
        const audio = new Audio('/musica.mp3')
        audio.loop    = true
        audio.volume  = volume
        audioRef.current = audio
      }
      audioRef.current.volume = volume
      audioRef.current.play().catch(() => {})
      document.body.setAttribute('data-ambient', 'true')
      setActive(true)
    } else {
      audioRef.current?.pause()
      document.body.removeAttribute('data-ambient')
      setActive(false)
    }
  }

  function handleVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  return (
    <div
      style={{
        position:        'fixed',
        bottom:          76,
        left:            24,
        zIndex:          200,
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'flex-start',
        gap:             6,
      }}
    >
      {/* Volume panel — only when active */}
      {active && (
        <div
          style={{
            background:     'rgba(10,10,12,0.96)',
            border:         '1px solid rgba(255,255,255,0.1)',
            borderRadius:   12,
            padding:        '12px 14px',
            backdropFilter: 'blur(20px)',
            display:        'flex',
            flexDirection:  'column',
            gap:            10,
            minWidth:       150,
            animation:      'ambientIn 0.22s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
              Volume
            </span>
            <VolumeIcon size={12} color="rgba(255,255,255,0.35)" />
          </div>

          {/* Slider */}
          <div style={{ position: 'relative' }}>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolume}
              className="ambient-slider"
            />
          </div>

          {/* Level indicator */}
          <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 14 }}>
            {Array.from({ length: 12 }).map((_, i) => {
              const threshold = (i + 1) / 12
              return (
                <div
                  key={i}
                  style={{
                    flex:       1,
                    height:     `${40 + i * 5}%`,
                    borderRadius: 1,
                    background: volume >= threshold
                      ? `rgba(255,255,255,${0.35 + i * 0.045})`
                      : 'rgba(255,255,255,0.08)',
                    transition: 'background 0.1s',
                  }}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={toggle}
        title={active ? 'Pausar música' : 'Tocar música ambiente'}
        style={{
          width:          40,
          height:         40,
          borderRadius:   '50%',
          background:     active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
          border:         `1px solid ${active ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.1)'}`,
          color:          active ? '#ffffff' : 'rgba(255,255,255,0.4)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          cursor:         'pointer',
          backdropFilter: 'blur(8px)',
          transition:     'all 0.3s ease',
          animation:      active ? 'ambientPulse 3.5s ease-in-out infinite' : 'none',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.color = '#fff'
          el.style.borderColor = 'rgba(255,255,255,0.25)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          if (!active) { el.style.color = 'rgba(255,255,255,0.4)'; el.style.borderColor = 'rgba(255,255,255,0.1)' }
        }}
      >
        {active ? <Volume2 size={16} /> : <Music size={16} />}
      </button>

      <style>{`
        @keyframes ambientPulse {
          0%,100% { box-shadow: 0 0 0   0  rgba(255,255,255,0.12); }
          50%      { box-shadow: 0 0 0 10px rgba(255,255,255,0);    }
        }
        @keyframes ambientIn {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .ambient-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 2px;
          background: rgba(255,255,255,0.12);
          border-radius: 2px;
          outline: none;
          cursor: pointer;
        }
        .ambient-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 0 6px rgba(255,255,255,0.35);
          transition: transform 0.15s;
        }
        .ambient-slider::-webkit-slider-thumb:hover {
          transform: scale(1.25);
        }
        .ambient-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}
