import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

const STORAGE_KEY = 'caio_sound'

function playClick(ctx: AudioContext) {
  if (ctx.state === 'suspended') ctx.resume()

  const osc    = ctx.createOscillator()
  const gain   = ctx.createGain()
  const filter = ctx.createBiquadFilter()

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  filter.type = 'highpass'
  filter.frequency.value = 200

  osc.type = 'sine'
  osc.frequency.setValueAtTime(1100, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.055)

  gain.gain.setValueAtTime(0.055, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.08)
}

export default function ClickSound() {
  const [enabled,  setEnabled]  = useState(true)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  )
  const ctxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    setEnabled(localStorage.getItem(STORAGE_KEY) !== 'false')
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(enabled))
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    function getCtx() {
      if (!ctxRef.current) ctxRef.current = new AudioContext()
      return ctxRef.current
    }

    function handler(e: MouseEvent) {
      const target = e.target as Element
      if (target.closest('button, a, [role="button"]')) playClick(getCtx())
    }

    window.addEventListener('click', handler, { capture: true })
    return () => window.removeEventListener('click', handler, { capture: true })
  }, [enabled])

  if (isMobile) return null

  return (
    <button
      onClick={() => setEnabled(v => !v)}
      title={enabled ? 'Desativar sons' : 'Ativar sons de clique'}
      aria-label={enabled ? 'Desativar sons' : 'Ativar sons'}
      style={{
        position:       'fixed',
        bottom:         'clamp(12px, 3vw, 24px)',
        left:           'clamp(12px, 3vw, 24px)',
        zIndex:         200,
        width:          36,
        height:         36,
        borderRadius:   '50%',
        background:     'rgba(10,10,12,0.92)',
        border:         `1px solid ${enabled ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        color:          enabled ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.18)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        cursor:         'pointer',
        transition:     'color 0.25s, border-color 0.25s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.color = '#fff'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.28)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.color = enabled ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.18)'
        ;(e.currentTarget as HTMLElement).style.borderColor = enabled ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'
      }}
    >
      {enabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
    </button>
  )
}
