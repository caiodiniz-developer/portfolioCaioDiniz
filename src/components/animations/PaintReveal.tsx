import { useRef, useEffect } from 'react'

interface Props {
  src: string
  alt?: string
  className?: string
  style?: React.CSSProperties
  brushSize?: number
}

export default function PaintReveal({ src, alt = '', className = '', style, brushSize = 100 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const colorImgRef  = useRef<HTMLImageElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas    = canvasRef.current
    const colorImg  = colorImgRef.current
    if (!container || !canvas || !colorImg) return

    const ctx = canvas.getContext('2d', { willReadFrequently: false })!

    /* Draw grayscale version onto canvas, replicating object-cover / object-top */
    function redraw() {
      if (!colorImg!.naturalWidth) return
      const w = container!.clientWidth
      const h = container!.clientHeight
      if (!w || !h) return

      canvas!.width  = w
      canvas!.height = h

      const iw = colorImg!.naturalWidth
      const ih = colorImg!.naturalHeight
      const ia = iw / ih
      const ca = w / h

      let sx = 0, sy = 0, sw = iw, sh = ih
      if (ia > ca) {
        /* Image wider than container — letterbox the sides, keep center */
        sw = ih * ca
        sx = (iw - sw) / 2
      } else {
        /* Image taller — crop from the top (object-position: top) */
        sh = iw / ca
        sy = 0
      }

      ctx.filter = 'grayscale(100%) contrast(1.1) brightness(0.88)'
      ctx.drawImage(colorImg!, sx, sy, sw, sh, 0, 0, w, h)
      ctx.filter = 'none'
    }

    if (colorImg.complete && colorImg.naturalWidth > 0) {
      redraw()
    } else {
      colorImg.addEventListener('load', redraw, { once: true })
    }

    const ro = new ResizeObserver(redraw)
    ro.observe(container)

    /* Paint (erase grayscale) where cursor passes — persistent reveal */
    let raf: number | undefined

    function paint(e: MouseEvent) {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect   = canvas!.getBoundingClientRect()
        const scaleX = canvas!.width  / rect.width
        const scaleY = canvas!.height / rect.height
        const x = (e.clientX - rect.left) * scaleX
        const y = (e.clientY - rect.top)  * scaleY
        const r = brushSize * Math.max(scaleX, scaleY)

        ctx.globalCompositeOperation = 'destination-out'
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
        grad.addColorStop(0,    'rgba(0,0,0,1)')
        grad.addColorStop(0.5,  'rgba(0,0,0,0.92)')
        grad.addColorStop(0.75, 'rgba(0,0,0,0.45)')
        grad.addColorStop(1,    'rgba(0,0,0,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalCompositeOperation = 'source-over'
      })
    }

    container.addEventListener('mousemove', paint, { passive: true })

    return () => {
      container.removeEventListener('mousemove', paint)
      ro.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [src, brushSize])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
    >
      {/* Color image underneath */}
      <img
        ref={colorImgRef}
        src={src}
        alt={alt}
        draggable={false}
        style={{
          position:      'absolute',
          inset:         0,
          width:         '100%',
          height:        '100%',
          objectFit:     'cover',
          objectPosition:'top',
          userSelect:    'none',
          pointerEvents: 'none',
        }}
      />
      {/* Grayscale canvas mask — erased by cursor, revealing color below */}
      <canvas
        ref={canvasRef}
        style={{
          position:      'absolute',
          inset:         0,
          width:         '100%',
          height:        '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
