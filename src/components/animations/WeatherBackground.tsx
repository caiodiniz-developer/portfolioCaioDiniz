import { useEffect, useRef } from 'react'

/* Open-Meteo WMO codes → weather type */
function getType(code: number): 'clear' | 'rain' | 'snow' | 'storm' | 'fog' {
  if (code === 0 || code === 1) return 'clear'
  if (code === 45 || code === 48) return 'fog'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow'
  if (code >= 95) return 'storm'
  return 'clear'
}

interface Particle {
  x: number; y: number; vx: number; vy: number
  size: number; alpha: number; life: number
}

export default function WeatherBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    let type: ReturnType<typeof getType> = 'clear'
    let particles: Particle[] = []
    let raf = 0
    let lightning = 0   // countdown frames for lightning flash

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    /* ── Fetch weather (silent fail) ── */
    navigator.geolocation?.getCurrentPosition(async ({ coords }) => {
      try {
        const res  = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=weather_code`
        )
        const data = await res.json()
        type = getType(data.current?.weather_code ?? 0)
      } catch { /* ignore */ }
    }, () => { /* permission denied — keep 'clear' */ })

    /* ── Spawn helpers ── */
    function spawnRain() {
      const x = Math.random() * canvas.width * 1.2 - canvas.width * 0.1
      particles.push({ x, y: -10, vx: -1.2, vy: 14 + Math.random() * 8, size: 0.8 + Math.random(), alpha: 0.12 + Math.random() * 0.1, life: 1 })
    }
    function spawnSnow() {
      particles.push({ x: Math.random() * canvas.width, y: -10, vx: (Math.random() - 0.5) * 0.8, vy: 0.6 + Math.random() * 1.4, size: 1.5 + Math.random() * 2.5, alpha: 0.18 + Math.random() * 0.14, life: 1 })
    }
    function spawnFog() {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height * 0.6, vx: 0.15, vy: 0, size: 80 + Math.random() * 120, alpha: 0.025, life: 1 })
    }

    let frame = 0
    function tick() {
      raf = requestAnimationFrame(tick)
      frame++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (type === 'fog' && frame % 80 === 0 && particles.length < 12) spawnFog()

      if (type === 'rain' || type === 'storm') {
        const count = type === 'storm' ? 4 : 2
        for (let i = 0; i < count; i++) spawnRain()
        if (type === 'storm') {
          if (lightning > 0) {
            ctx.fillStyle = `rgba(200,220,255,${0.06 * lightning / 8})`
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            lightning--
          } else if (Math.random() < 0.003) {
            lightning = 8
          }
        }
      }
      if (type === 'snow' && frame % 3 === 0) spawnSnow()

      /* update & draw particles */
      particles = particles.filter(p => {
        p.x += p.vx; p.y += p.vy
        if (type === 'fog') {
          p.alpha = Math.max(0, p.alpha - 0.0002)
        }

        if (type === 'rain' || type === 'storm') {
          ctx.save()
          ctx.strokeStyle = `rgba(180,210,255,${p.alpha})`
          ctx.lineWidth = p.size
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x + p.vx * 1.5, p.y + p.vy * 1.5)
          ctx.stroke()
          ctx.restore()
        } else if (type === 'snow') {
          ctx.save()
          ctx.fillStyle = `rgba(220,230,255,${p.alpha})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        } else if (type === 'fog') {
          ctx.save()
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
          g.addColorStop(0, `rgba(180,190,210,${p.alpha})`)
          g.addColorStop(1, 'rgba(180,190,210,0)')
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }

        return p.y < canvas.height + 20 && p.x > -200 && p.alpha > 0
      })

      /* cap particle count */
      if (particles.length > 300) particles.splice(0, 50)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        inset:         0,
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',
        zIndex:        3,
        mixBlendMode:  'screen',
      }}
    />
  )
}
