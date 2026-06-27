import { useState, useRef, useEffect, useCallback } from 'react'

export default function AmbientMode() {
  const [active, setActive] = useState(false)
  const ctxRef   = useRef<AudioContext | null>(null)
  const nodesRef = useRef<AudioNode[]>([])
  const canvasRef= useRef<HTMLCanvasElement>(null)
  const rafRef   = useRef<number>(0)

  /* ── Start ambient audio ── */
  const startAudio = useCallback(() => {
    const ac = new AudioContext()
    ctxRef.current = ac

    const master = ac.createGain()
    master.gain.setValueAtTime(0, ac.currentTime)
    master.gain.linearRampToValueAtTime(0.06, ac.currentTime + 2)
    master.connect(ac.destination)

    const defs = [
      { freq: 55,    type: 'sine'     as OscillatorType, gain: 0.5  },
      { freq: 82.4,  type: 'sine'     as OscillatorType, gain: 0.35 },
      { freq: 110,   type: 'sine'     as OscillatorType, gain: 0.2  },
      { freq: 220,   type: 'triangle' as OscillatorType, gain: 0.1  },
    ]

    const delay = ac.createDelay(2)
    delay.delayTime.value = 0.45
    const fb = ac.createGain(); fb.gain.value = 0.28
    const filter = ac.createBiquadFilter()
    filter.type = 'lowpass'; filter.frequency.value = 900
    delay.connect(fb); fb.connect(delay); delay.connect(filter); filter.connect(master)

    defs.forEach(({ freq, type, gain: g }) => {
      const osc  = ac.createOscillator()
      const gain = ac.createGain()
      osc.type      = type
      osc.frequency.value = freq
      gain.gain.value     = g
      osc.connect(gain)
      gain.connect(master)
      gain.connect(delay)
      osc.start()
      nodesRef.current.push(osc, gain)
    })

    nodesRef.current.push(master, delay, fb, filter)
  }, [])

  const stopAudio = useCallback(() => {
    const ac = ctxRef.current
    if (!ac) return
    nodesRef.current.forEach(n => { try { (n as OscillatorNode).stop?.() } catch {} })
    nodesRef.current = []
    ac.close()
    ctxRef.current = null
  }, [])

  /* ── Floating particles canvas ── */
  useEffect(() => {
    if (!active) { cancelAnimationFrame(rafRef.current); return }
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    canvas.width = window.innerWidth; canvas.height = window.innerHeight

    type P = { x:number; y:number; vy:number; size:number; alpha:number; life:number; decay:number }
    const pts: P[] = []
    let frame = 0

    function tick() {
      rafRef.current = requestAnimationFrame(tick)
      frame++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (frame % 12 === 0) {
        pts.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 10,
          vy: -(0.3 + Math.random() * 0.7),
          size: 1 + Math.random() * 2,
          alpha: 0.2 + Math.random() * 0.2,
          life: 1,
          decay: 0.003 + Math.random() * 0.003,
        })
      }

      pts.forEach((p, i) => {
        p.y   += p.vy
        p.life -= p.decay
        if (p.life <= 0) { pts.splice(i, 1); return }
        ctx.save()
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.alpha * p.life})`
        ctx.shadowBlur = 6
        ctx.shadowColor = 'rgba(200,220,255,0.6)'
        ctx.fill()
        ctx.restore()
      })
    }
    tick()

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize) }
  }, [active])

  function toggle() {
    if (!active) { startAudio(); setActive(true); document.body.setAttribute('data-ambient', 'true') }
    else         { stopAudio();  setActive(false); document.body.removeAttribute('data-ambient') }
  }

  return (
    <>
      {/* Particle canvas — only rendered when active */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          zIndex: 4,
          opacity: active ? 1 : 0,
          transition: 'opacity 1.5s',
        }}
      />

      {/* Toggle button */}
      <button
        onClick={toggle}
        title={active ? 'Desativar modo ambiente' : 'Ativar modo ambiente'}
        style={{
          position: 'fixed', bottom: 76, left: 24, zIndex: 200,
          width: 40, height: 40, borderRadius: '50%',
          background: active ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${active ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
          color: active ? '#ffffff' : 'rgba(255,255,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '1rem',
          transition: 'all 0.3s', backdropFilter: 'blur(8px)',
          animation: active ? 'ambientPulse 3s ease-in-out infinite' : 'none',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff' }}
        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)' }}
      >
        {active ? '🔊' : '🔇'}
      </button>

      <style>{`
        @keyframes ambientPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.1); }
          50%       { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
        }
        [data-ambient="true"] .hero-photo-inner img {
          filter: saturate(1.15) brightness(1.05);
          transition: filter 2s;
        }
      `}</style>
    </>
  )
}
