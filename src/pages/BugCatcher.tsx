import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Bug } from 'lucide-react'
import { SITE } from '@/lib/constants'

const W = 640
const H = 480
const MAX_LIVES = 3
const BEST_KEY  = 'bugcatcher_best'

interface BugObj {
  id:    number
  x:     number
  y:     number
  r:     number
  speed: number
  hue:   number
  legs:  number
  dead:  boolean
  splat: boolean
  splatT: number
}

let _id = 0

function makeBug(canvasW: number): BugObj {
  const r = 14 + Math.random() * 14
  return {
    id:     _id++,
    x:      r + Math.random() * (canvasW - r * 2),
    y:      -r - Math.random() * 60,
    r,
    speed:  1.2 + Math.random() * 2.4,
    hue:    Math.random() > 0.7 ? 0 : (Math.random() > 0.5 ? 120 : 50),
    legs:   0,
    dead:   false,
    splat:  false,
    splatT: 0,
  }
}

function drawBug(ctx: CanvasRenderingContext2D, b: BugObj, frame: number) {
  const { x, y, r, hue, legs } = b
  const clr = `hsl(${hue},85%,58%)`

  ctx.save()
  ctx.translate(x, y)

  // Glow
  ctx.shadowBlur  = 14
  ctx.shadowColor = clr

  // Abdomen (rear)
  ctx.beginPath()
  ctx.ellipse(0, r * 0.55, r * 0.55, r * 0.75, 0, 0, Math.PI * 2)
  ctx.fillStyle = clr
  ctx.fill()

  // Head (front, top)
  ctx.beginPath()
  ctx.arc(0, -r * 0.6, r * 0.48, 0, Math.PI * 2)
  ctx.fillStyle = clr
  ctx.fill()

  // Eyes
  ctx.shadowBlur = 0
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(-r * 0.18, -r * 0.65, r * 0.15, 0, Math.PI * 2)
  ctx.arc( r * 0.18, -r * 0.65, r * 0.15, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#111'
  ctx.beginPath()
  ctx.arc(-r * 0.17, -r * 0.64, r * 0.08, 0, Math.PI * 2)
  ctx.arc( r * 0.17, -r * 0.64, r * 0.08, 0, Math.PI * 2)
  ctx.fill()

  // Antennae
  ctx.strokeStyle = clr
  ctx.lineWidth   = 1.5
  ctx.beginPath()
  ctx.moveTo(-r * 0.15, -r * 1.0)
  ctx.lineTo(-r * 0.45, -r * 1.5)
  ctx.moveTo( r * 0.15, -r * 1.0)
  ctx.lineTo( r * 0.45, -r * 1.5)
  ctx.stroke()

  // Legs (3 pairs)
  const t  = frame * 0.14 + legs
  ctx.lineWidth = 1.3
  for (let i = 0; i < 3; i++) {
    const ly   = -r * 0.1 + i * r * 0.38
    const wave = Math.sin(t + i * 1.1) * r * 0.28
    // left
    ctx.beginPath()
    ctx.moveTo(-r * 0.7, ly)
    ctx.lineTo(-r * 1.6, ly + wave)
    ctx.stroke()
    // right
    ctx.beginPath()
    ctx.moveTo(r * 0.7, ly)
    ctx.lineTo(r * 1.6, ly - wave)
    ctx.stroke()
  }

  ctx.restore()
}

function drawSplat(ctx: CanvasRenderingContext2D, b: BugObj, frame: number) {
  const age  = frame - b.splatT
  const fade = Math.max(0, 1 - age / 18)
  if (fade <= 0) return
  const { x, y, r, hue } = b
  ctx.save()
  ctx.globalAlpha = fade
  ctx.fillStyle   = `hsl(${hue},85%,58%)`
  ctx.shadowBlur  = 8
  ctx.shadowColor = `hsl(${hue},85%,58%)`

  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2
    const dist  = r * 0.9 * (age / 18)
    const pr    = r * 0.28 * (1 - age / 22)
    ctx.beginPath()
    ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, Math.max(pr, 2), 0, Math.PI * 2)
    ctx.fill()
  }

  // Plus/X mark
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font      = `bold ${r * 1.1}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('✓', x, y - r * 0.3)

  ctx.restore()
}

export default function BugCatcher() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase,   setPhase]   = useState<'idle' | 'playing' | 'dead'>('idle')
  const [score,   setScore]   = useState(0)
  const [lives,   setLives]   = useState(MAX_LIVES)
  const [best,    setBest]    = useState(() => parseInt(localStorage.getItem(BEST_KEY) ?? '0'))

  useEffect(() => { document.title = `Bug Catcher — ${SITE.name}` }, [])

  useEffect(() => {
    if (phase !== 'playing') return

    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    let raf    = 0
    let frame  = 0
    let bugs:  BugObj[]  = []
    let splats: BugObj[] = []
    let cur_score = 0
    let cur_lives = MAX_LIVES
    let spawn_timer = 0
    let spawn_interval = 90

    function spawnBug() { bugs.push(makeBug(W)) }

    function drawBg() {
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, W, H)
      // Subtle grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'
      ctx.lineWidth = 1
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }
    }

    function drawHUD() {
      // Score
      ctx.font      = '600 14px "Inter",sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.textAlign = 'left'
      ctx.fillText(`Score: ${cur_score}`, 16, 30)
      // Best
      ctx.fillStyle = 'rgba(255,255,255,0.22)'
      ctx.font      = '500 11px "Inter",sans-serif'
      ctx.fillText(`Recorde: ${Math.max(best, cur_score)}`, 16, 50)
      // Lives (hearts)
      ctx.textAlign = 'right'
      ctx.font      = '18px sans-serif'
      let hud = ''
      for (let i = 0; i < MAX_LIVES; i++) hud += i < cur_lives ? '🐞 ' : '💀 '
      ctx.fillText(hud.trim(), W - 14, 30)
      // Danger zone
      ctx.fillStyle = 'rgba(239,68,68,0.07)'
      ctx.fillRect(0, H - 28, W, 28)
      ctx.strokeStyle = 'rgba(239,68,68,0.18)'
      ctx.lineWidth   = 1
      ctx.beginPath(); ctx.moveTo(0, H - 28); ctx.lineTo(W, H - 28); ctx.stroke()
      ctx.fillStyle   = 'rgba(239,68,68,0.3)'
      ctx.font        = '600 9px "Inter",sans-serif'
      ctx.textAlign   = 'center'
      ctx.fillText('ZONA DE ESCAPE', W / 2, H - 10)
    }

    function hitTest(mx: number, my: number) {
      for (const b of bugs) {
        if (b.dead || b.splat) continue
        const dx = mx - b.x, dy = my - b.y
        if (dx * dx + dy * dy <= b.r * b.r * 1.4) {
          b.dead  = true
          b.splat = true
          b.splatT = frame
          splats.push(b)
          cur_score++
          setScore(cur_score)
          if (cur_score > best) {
            setBest(cur_score)
            localStorage.setItem(BEST_KEY, String(cur_score))
          }
          return
        }
      }
    }

    function onClick(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect()
      const sx   = W / rect.width
      hitTest((e.clientX - rect.left) * sx, (e.clientY - rect.top) * sx)
    }

    function onTouch(e: TouchEvent) {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const sx   = W / rect.width
      for (const t of e.changedTouches) {
        hitTest((t.clientX - rect.left) * sx, (t.clientY - rect.top) * sx)
      }
    }

    canvas.addEventListener('click', onClick)
    canvas.addEventListener('touchstart', onTouch, { passive: false })

    function tick() {
      raf = requestAnimationFrame(tick)
      frame++

      // Spawn
      spawn_timer++
      if (spawn_timer >= spawn_interval) {
        spawnBug()
        spawn_timer = 0
        spawn_interval = Math.max(30, 90 - Math.floor(cur_score * 2.5))
      }

      drawBg()

      // Update + draw bugs
      const alive_bugs: BugObj[] = []
      for (const b of bugs) {
        if (b.dead) continue
        b.y     += b.speed * (1 + cur_score * 0.015)
        b.legs  += 0.06

        if (b.y - b.r > H - 28) {
          // Escaped!
          cur_lives = Math.max(0, cur_lives - 1)
          setLives(cur_lives)
          if (cur_lives <= 0) {
            cancelAnimationFrame(raf)
            ctx.fillStyle = 'rgba(0,0,0,0.7)'
            ctx.fillRect(0, 0, W, H)
            ctx.font      = 'bold 36px "Syne",sans-serif'
            ctx.fillStyle = '#ef4444'
            ctx.textAlign = 'center'
            ctx.fillText('GAME OVER', W / 2, H / 2 - 24)
            ctx.font      = '16px "Inter",sans-serif'
            ctx.fillStyle = 'rgba(255,255,255,0.45)'
            ctx.fillText(`Bugs capturados: ${cur_score}`, W / 2, H / 2 + 12)
            setPhase('dead')
          }
          continue
        }
        alive_bugs.push(b)
        drawBug(ctx, b, frame)
      }
      bugs = alive_bugs

      // Splat animations
      splats = splats.filter(s => frame - s.splatT < 22)
      splats.forEach(s => drawSplat(ctx, s, frame))

      drawHUD()
    }

    tick()
    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('touchstart', onTouch)
    }
  }, [phase, best])

  function startGame() {
    setScore(0)
    setLives(MAX_LIVES)
    setPhase('playing')
  }

  return (
    <main style={{ minHeight: '100svh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32, padding: '2rem' }}>

      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Bug size={20} style={{ color: '#ef4444' }} />
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(1.6rem,5vw,3rem)', color: '#fff', letterSpacing: '-0.04em' }}>
            Bug Catcher
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.04em' }}>
          {phase === 'dead'
            ? `Game Over · ${score} bugs capturados`
            : phase === 'playing'
            ? 'Clique nos bugs antes que escapem!'
            : 'Capture os bugs. Não deixe nenhum escapar.'
          }
        </p>
      </div>

      {/* Canvas */}
      <div style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', display: 'block', width: 'min(640px, calc(100vw - 32px))', height: 'auto', background: '#0a0a0a', cursor: phase === 'playing' ? 'crosshair' : 'default' }}
        />

        {/* Overlay when not playing */}
        {phase !== 'playing' && (
          <div style={{ position: 'absolute', inset: 0, borderRadius: 16, background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
            {phase === 'dead' && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 4px', fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(1.6rem,4vw,2.5rem)', color: '#ef4444', letterSpacing: '-0.03em' }}>
                  GAME OVER
                </p>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>
                  Recorde: {best} bugs
                </p>
              </div>
            )}

            {/* Score if died */}
            {phase === 'dead' && score > 0 && (
              <div style={{ textAlign: 'center', padding: '10px 24px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
                <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 4 }}>Bugs capturados</p>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: '2.4rem', color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>{score}</span>
              </div>
            )}

            {phase === 'idle' && (
              <p style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', maxWidth: 260, lineHeight: 1.4 }}>
                Bugs caem do topo.<br />Clique para capturá-los.
              </p>
            )}

            <button
              onClick={startGame}
              style={{ padding: '13px 36px', borderRadius: 999, background: 'rgba(255,255,255,0.92)', border: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', color: '#0a0a0a', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.92)'; (e.currentTarget as HTMLElement).style.transform = '' }}
            >
              {phase === 'dead' ? 'Jogar novamente' : 'Iniciar caçada'}
            </button>

            <p style={{ margin: 0, fontSize: '0.62rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.08em' }}>
              Click / Tap para capturar
            </p>
          </div>
        )}
      </div>

      {/* Stats bar */}
      {phase === 'playing' && (
        <div style={{ display: 'flex', gap: 32 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 4 }}>Score</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: '2rem', color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>{score}</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 4 }}>Vidas</div>
            <div style={{ fontSize: '1.4rem', lineHeight: 1 }}>
              {Array.from({ length: MAX_LIVES }).map((_, i) => (
                <span key={i}>{i < lives ? '🐞' : '💀'}</span>
              ))}
            </div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 4 }}>Recorde</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: '2rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '-0.04em', lineHeight: 1 }}>{Math.max(best, score)}</div>
          </div>
        </div>
      )}

      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', textDecoration: 'none', transition: 'color 0.25s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.2)' }}>
        <ArrowLeft size={13} /> Voltar ao portfólio
      </Link>
    </main>
  )
}
