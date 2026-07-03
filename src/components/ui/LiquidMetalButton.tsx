import { liquidMetalFragmentShader, ShaderMount } from '@paper-design/shaders'
import type React from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

interface LiquidMetalButtonProps {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  'aria-label'?: string
  height?: number
}

export function LiquidMetalButton({
  children,
  onClick,
  type = 'button',
  disabled,
  height = 46,
  style,
  ...rest
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])
  const [width, setWidth] = useState(142)

  const shaderRef   = useRef<HTMLDivElement>(null)
  // biome-ignore lint/suspicious/noExplicitAny: external lib
  const shaderMount = useRef<any>(null)
  const buttonRef   = useRef<HTMLButtonElement>(null)
  const measureRef  = useRef<HTMLSpanElement>(null)
  const rippleId    = useRef(0)

  // Measure natural text width so the button fits any label
  useLayoutEffect(() => {
    if (measureRef.current) {
      const w = Math.ceil(measureRef.current.offsetWidth) + 48
      setWidth(Math.max(w, 100))
    }
  }, [children])

  useEffect(() => {
    const styleId = 'lmb-canvas-style'
    if (!document.getElementById(styleId)) {
      const s = document.createElement('style')
      s.id = styleId
      s.textContent = `
        .lmb-shader canvas {
          width: 100% !important; height: 100% !important;
          display: block !important; position: absolute !important;
          top: 0 !important; left: 0 !important;
          border-radius: 100px !important;
        }
        @keyframes lmb-ripple {
          0%   { transform: translate(-50%,-50%) scale(0); opacity: .6; }
          100% { transform: translate(-50%,-50%) scale(4); opacity: 0; }
        }
      `
      document.head.appendChild(s)
    }

    if (shaderRef.current) {
      shaderMount.current?.destroy?.()
      shaderMount.current = new ShaderMount(
        shaderRef.current,
        liquidMetalFragmentShader,
        {
          u_repetition: 4, u_softness: 0.5,
          u_shiftRed: 0.3, u_shiftBlue: 0.3,
          u_distortion: 0, u_contour: 0,
          u_angle: 45, u_scale: 8,
          u_shape: 1, u_offsetX: 0.1, u_offsetY: -0.1,
        },
        undefined,
        0.6,
      )
    }

    return () => { shaderMount.current?.destroy?.(); shaderMount.current = null }
  }, [])

  const innerW = width - 4
  const innerH = height - 4

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (disabled) return
    shaderMount.current?.setSpeed?.(2.4)
    setTimeout(() => shaderMount.current?.setSpeed?.(isHovered ? 1 : 0.6), 300)

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const ripple = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: rippleId.current++ }
      setRipples(prev => [...prev, ripple])
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== ripple.id)), 600)
    }
    onClick?.(e)
  }

  const shadow = isPressed
    ? '0px 0px 0px 1px rgba(0,0,0,.5), 0px 1px 2px rgba(0,0,0,.3)'
    : isHovered
      ? '0px 0px 0px 1px rgba(0,0,0,.4), 0px 12px 6px rgba(0,0,0,.05), 0px 8px 5px rgba(0,0,0,.1), 0px 4px 4px rgba(0,0,0,.15), 0px 1px 2px rgba(0,0,0,.2)'
      : '0px 0px 0px 1px rgba(0,0,0,.3), 0px 20px 12px rgba(0,0,0,.08), 0px 9px 9px rgba(0,0,0,.12), 0px 2px 5px rgba(0,0,0,.15)'

  return (
    <div className="relative inline-block" style={{ opacity: disabled ? 0.45 : 1, ...style }}>
      {/* Hidden span to measure text width */}
      <span
        ref={measureRef}
        aria-hidden
        style={{ position: 'absolute', visibility: 'hidden', whiteSpace: 'nowrap', fontSize: 14, fontWeight: 400, pointerEvents: 'none', top: 0, left: 0 }}
      >
        {children}
      </span>

      <div style={{ perspective: 1000, perspectiveOrigin: '50% 50%' }}>
        <div style={{ position: 'relative', width, height, transformStyle: 'preserve-3d', transition: 'all .8s cubic-bezier(.34,1.56,.64,1)' }}>

          {/* Label layer */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, zIndex: 30, pointerEvents: 'none', transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
            <span style={{ fontSize: 14, color: '#666', fontWeight: 400, textShadow: '0px 1px 2px rgba(0,0,0,.5)', whiteSpace: 'nowrap', transition: 'all .3s' }}>
              {children}
            </span>
          </div>

          {/* Dark inner pill */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 20, transform: `translateZ(10px) ${isPressed ? 'translateY(1px) scale(.98)' : ''}`, transformStyle: 'preserve-3d', transition: 'all .8s cubic-bezier(.34,1.56,.64,1)' }}>
            <div style={{ width: innerW, height: innerH, margin: 2, borderRadius: 100, background: 'linear-gradient(180deg,#202020 0%,#000 100%)', boxShadow: isPressed ? 'inset 0 2px 4px rgba(0,0,0,.4)' : 'none', transition: 'box-shadow .15s' }} />
          </div>

          {/* Shader layer */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, transform: `translateZ(0px) ${isPressed ? 'translateY(1px) scale(.98)' : ''}`, transformStyle: 'preserve-3d', transition: 'all .8s cubic-bezier(.34,1.56,.64,1)' }}>
            <div style={{ width, height, borderRadius: 100, boxShadow: shadow, transition: 'box-shadow .15s', background: 'transparent' }}>
              <div
                ref={shaderRef}
                className="lmb-shader"
                style={{ borderRadius: 100, overflow: 'hidden', position: 'relative', width, height }}
              />
            </div>
          </div>

          {/* Invisible hit area */}
          <button
            ref={buttonRef}
            type={type}
            disabled={disabled}
            onClick={handleClick}
            onMouseEnter={() => { setIsHovered(true); shaderMount.current?.setSpeed?.(1) }}
            onMouseLeave={() => { setIsHovered(false); setIsPressed(false); shaderMount.current?.setSpeed?.(0.6) }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
            style={{ position: 'absolute', inset: 0, background: 'transparent', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', outline: 'none', zIndex: 40, transform: 'translateZ(25px)', borderRadius: 100, overflow: 'hidden' }}
            {...rest}
          >
            {ripples.map(r => (
              <span key={r.id} style={{ position: 'absolute', left: r.x, top: r.y, width: 20, height: 20, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,.4) 0%, transparent 70%)', pointerEvents: 'none', animation: 'lmb-ripple .6s ease-out' }} />
            ))}
          </button>

        </div>
      </div>
    </div>
  )
}
