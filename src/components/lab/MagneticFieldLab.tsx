import { useEffect, useRef } from 'react'
import { useLanguageStore } from '@/store/useLanguageStore'

/* A grid of dots pulled toward the pointer — the same falloff the site's
   magnetic elements use (strength fades linearly to zero at a radius), drawn
   on one 2D canvas. Each dot eases toward its target instead of snapping, so
   the field has a little inertia and settles back when the pointer leaves. */

const GAP = 30          // px between dots
const RADIUS = 150      // pointer's reach
const STRENGTH = 0.42   // how far a dot at the pointer is dragged (× distance)
const EASE = 0.14

interface Dot { hx: number; hy: number; x: number; y: number }

export default function MagneticFieldLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const en = useLanguageStore(s => s.lang) === 'en'

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let dots: Dot[] = []
    let w = 0, h = 0
    const pointer = { x: -9999, y: -9999 }
    let raf = 0

    function layout() {
      const rect = canvas!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width; h = rect.height
      canvas!.width = Math.round(w * dpr); canvas!.height = Math.round(h * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Centre the grid so the margins match on both sides.
      const cols = Math.floor(w / GAP), rows = Math.floor(h / GAP)
      const ox = (w - (cols - 1) * GAP) / 2, oy = (h - (rows - 1) * GAP) / 2
      dots = []
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const hx = ox + c * GAP, hy = oy + r * GAP
        dots.push({ hx, hy, x: hx, y: hy })
      }
    }

    function frame() {
      ctx!.clearRect(0, 0, w, h)
      // Canvases are exempt from the light theme's inversion (like photos),
      // so the dots have to pick their own ink: dark on light, light on dark.
      const ink = document.documentElement.dataset.theme === 'light' ? '13,13,13' : '255,255,255'
      for (const d of dots) {
        const dx = pointer.x - d.hx, dy = pointer.y - d.hy
        const dist = Math.hypot(dx, dy)
        let tx = d.hx, ty = d.hy, pull = 0
        if (dist < RADIUS) {
          pull = 1 - dist / RADIUS
          tx += dx * pull * STRENGTH
          ty += dy * pull * STRENGTH
        }
        d.x += (tx - d.x) * EASE
        d.y += (ty - d.y) * EASE

        ctx!.beginPath()
        ctx!.arc(d.x, d.y, 1.4 + pull * 2.6, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${ink},${0.2 + pull * 0.8})`
        ctx!.fill()
      }
      raf = requestAnimationFrame(frame)
    }

    function move(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
    }
    function leave() { pointer.x = pointer.y = -9999 }

    layout()
    raf = requestAnimationFrame(frame)
    const ro = new ResizeObserver(layout)
    ro.observe(canvas)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerdown', move)
    canvas.addEventListener('pointerleave', leave)
    canvas.addEventListener('pointercancel', leave)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerdown', move)
      canvas.removeEventListener('pointerleave', leave)
      canvas.removeEventListener('pointercancel', leave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      data-cursor="none"
      aria-label={en ? 'Grid of dots pulled toward the pointer' : 'Grade de pontos atraídos pelo cursor'}
      role="img"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', touchAction: 'pan-y' }}
    />
  )
}
