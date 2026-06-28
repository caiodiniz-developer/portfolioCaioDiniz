import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { SITE } from '@/lib/constants'

const W = 640, H = 240
const GY = H - 52          // ground y
const CX = 90              // character x (fixed)
const CHAR_W = 22, CHAR_H = 30
const JUMP_VY = -11.5
const GRAVITY = 0.55
const BASE_SPD = 4.2

interface Obs { x: number; w: number; h: number }

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playing, setPlaying] = useState(false)
  const [dead,    setDead]    = useState(false)
  const [score,   setScore]   = useState(0)
  const [best,    setBest]    = useState(0)

  useEffect(() => { document.title = `404 — ${SITE.name}` }, [])

  useEffect(() => {
    if (!playing) return
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    let raf      = 0
    let frame    = 0
    let curScore = 0
    let charY    = GY - CHAR_H
    let vy       = 0
    let onGround = true
    let obstacles: Obs[] = []
    let speed    = BASE_SPD
    let alive    = true

    function jump() {
      if (!alive) return
      if (onGround) { vy = JUMP_VY; onGround = false }
    }

    function onKey(e: KeyboardEvent) { if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump() } }
    function onTap() { jump() }
    window.addEventListener('keydown', onKey)
    canvas.addEventListener('click', onTap)

    function spawnObs() {
      const h = 18 + Math.random() * 34
      obstacles.push({ x: W + 20, w: 14 + Math.random() * 10, h })
    }

    /* ── Draw helpers ── */
    function drawGround() {
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'
      ctx.lineWidth   = 1
      ctx.beginPath(); ctx.moveTo(0, GY); ctx.lineTo(W, GY); ctx.stroke()
    }

    function drawChar(y: number) {
      const t = frame * 0.18
      /* Body */
      ctx.shadowBlur  = 12
      ctx.shadowColor = 'rgba(255,255,255,0.4)'
      ctx.fillStyle   = '#ffffff'
      ctx.fillRect(CX, y, CHAR_W, CHAR_H)
      /* "Screen" — monitor face */
      ctx.fillStyle   = '#0d0d0d'
      ctx.fillRect(CX + 4, y + 5, CHAR_W - 8, CHAR_H - 14)
      /* Eyes blink */
      const eyeY = y + 10
      ctx.fillStyle = onGround ? 'rgba(255,255,255,0.9)' : '#4ade80'
      ctx.fillRect(CX + 6,  eyeY, 4, 3)
      ctx.fillRect(CX + 12, eyeY, 4, 3)
      /* Legs — animate when running */
      ctx.shadowBlur = 0
      ctx.fillStyle  = 'rgba(255,255,255,0.7)'
      const lLeg = y + CHAR_H + Math.sin(t) * 4
      const rLeg = y + CHAR_H - Math.sin(t) * 4
      ctx.fillRect(CX + 2,  lLeg, 6, 5)
      ctx.fillRect(CX + 14, rLeg, 6, 5)
    }

    function drawObs(o: Obs) {
      ctx.shadowBlur  = 8
      ctx.shadowColor = 'rgba(255,80,80,0.5)'
      ctx.fillStyle   = '#ef4444'
      ctx.fillRect(o.x, GY - o.h, o.w, o.h)
      /* Bug antenna */
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth   = 1.5
      ctx.beginPath()
      ctx.moveTo(o.x + o.w / 2 - 3, GY - o.h)
      ctx.lineTo(o.x + o.w / 2 - 6, GY - o.h - 8)
      ctx.moveTo(o.x + o.w / 2 + 3, GY - o.h)
      ctx.lineTo(o.x + o.w / 2 + 6, GY - o.h - 8)
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    function drawHUD() {
      ctx.font      = '500 13px "Inter", monospace'
      ctx.fillStyle = 'rgba(255,255,255,0.25)'
      ctx.fillText(`${Math.floor(curScore)}`, W - 16, 24)
      ctx.textAlign = 'right'
      ctx.textAlign = 'left'
      /* Progress line */
      ctx.fillStyle = 'rgba(255,255,255,0.07)'
      ctx.fillRect(0, H - 3, W, 3)
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.fillRect(0, H - 3, (curScore / 999) * W, 3)
    }

    function drawBg() {
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, W, H)
      /* Stars */
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      for (let i = 0; i < 30; i++) {
        const sx = ((i * 137 + frame * 0.3) % W)
        const sy = (i * 53) % (GY - 20)
        ctx.fillRect(sx, sy, 1, 1)
      }
    }

    function checkHit(o: Obs): boolean {
      const pad = 4
      return (
        CX + pad < o.x + o.w &&
        CX + CHAR_W - pad > o.x &&
        charY + pad < GY &&
        charY + CHAR_H - pad > GY - o.h
      )
    }

    let nextObs = 90

    function tick() {
      raf   = requestAnimationFrame(tick)
      frame++
      curScore += speed * 0.05
      speed     = BASE_SPD + curScore * 0.007

      /* Physics */
      if (!onGround) { vy += GRAVITY; charY += vy }
      if (charY >= GY - CHAR_H) { charY = GY - CHAR_H; vy = 0; onGround = true }

      /* Spawn */
      nextObs--
      if (nextObs <= 0) { spawnObs(); nextObs = 52 + Math.random() * 60 - curScore * 0.04 }

      /* Move obstacles */
      obstacles = obstacles.filter(o => { o.x -= speed; return o.x > -60 })

      /* Collision */
      if (obstacles.some(checkHit)) {
        alive = false
        cancelAnimationFrame(raf)
        setBest(b => { const ns = Math.floor(curScore); return Math.max(b, ns) })
        setScore(Math.floor(curScore))
        setDead(true)
        setPlaying(false)

        /* Death flash */
        ctx.fillStyle = 'rgba(239,68,68,0.18)'
        ctx.fillRect(0, 0, W, H)
        return
      }

      /* Draw */
      drawBg()
      drawGround()
      obstacles.forEach(drawObs)
      drawChar(charY)
      drawHUD()
      setScore(Math.floor(curScore))
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
      canvas.removeEventListener('click', onTap)
    }
  }, [playing])

  function startGame() { setDead(false); setScore(0); setPlaying(true) }

  return (
    <main
      style={{
        minHeight: '100svh',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        padding: '2rem',
      }}
    >
      {/* Giant 404 */}
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(6rem, 20vw, 14rem)',
            lineHeight: 1,
            color: 'rgba(255,255,255,0.04)',
            userSelect: 'none',
            display: 'block',
          }}
        >
          404
        </span>
        <p
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {dead ? `Você morreu com ${score} pts` : 'Página não encontrada'}
        </p>
      </div>

      {/* Game canvas */}
      <div style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.07)',
            display: 'block',
            width: 'min(640px, calc(100vw - 48px))',
            height: 'auto',
            cursor: playing ? 'none' : 'default',
            background: '#0a0a0a',
          }}
        />

        {/* Overlay when not playing */}
        {!playing && (
          <div
            style={{
              position: 'absolute', inset: 0,
              borderRadius: 16,
              background: 'rgba(10,10,10,0.82)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            {dead && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#ef4444' }}>
                  GAME OVER
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                  {best > 0 ? `Recorde: ${best} pts` : ''}
                </p>
              </div>
            )}
            {!dead && (
              <p style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: 280 }}>
                Desvie dos bugs enquanto voltamos ao portfólio
              </p>
            )}
            <button
              onClick={startGame}
              style={{
                padding: '12px 32px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.9)',
                border: 'none',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                color: '#0a0a0a',
                transition: 'background 0.2s',
              }}
            >
              {dead ? 'Jogar novamente' : 'Jogar'}
            </button>
            <p style={{ margin: 0, fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}>
              Space / Click para pular
            </p>
          </div>
        )}
      </div>

      {/* Back home */}
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.25)',
          textDecoration: 'none',
          transition: 'color 0.25s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)' }}
      >
        <ArrowLeft size={13} /> Voltar ao portfólio
      </Link>
    </main>
  )
}
