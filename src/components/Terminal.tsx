import { useEffect, useRef, useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { projects } from '@/data/projects'

const COLS = 30
const ROWS = 18
const CELL = 16
const SNAKE_W = COLS * CELL  // 480
const SNAKE_H = ROWS * CELL  // 288

interface Pos { x: number; y: number }
type OutputItem =
  | { type: 'cmd'; text: string }
  | { type: 'out'; html: string }

const ASCII_LOGO = [
  '  ██████╗ █████╗ ██╗ ██████╗',
  '  ██╔════╝██╔══██╗██║██╔═══██╗',
  '  ██║     ███████║██║██║   ██║',
  '  ██║     ██╔══██║██║██║   ██║',
  '  ╚██████╗██║  ██║██║╚██████╔╝',
  '   ╚═════╝╚═╝  ╚═╝╚═╝ ╚═════╝',
  '',
  '  Full Stack Developer — Campinas, SP',
  '  Digite "help" para começar.',
].join('\n')

function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export default function Terminal({ onClose }: { onClose: () => void }) {
  const [lines, setLines] = useState<OutputItem[]>([{ type: 'out', html: ASCII_LOGO }])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const [mode, setMode] = useState<'cli' | 'snake'>('cli')
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Auto-scroll & focus
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 99999 })
  }, [lines])

  useEffect(() => {
    if (mode === 'cli') setTimeout(() => inputRef.current?.focus(), 50)
  }, [mode, lines.length])

  // ESC closes terminal (only in CLI mode)
  useEffect(() => {
    if (mode !== 'cli') return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [mode, onClose])

  // ── Command processor ─────────────────────────────────────────────────────
  const runCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase()

    const push = (html: string) =>
      setLines(prev => [
        ...prev,
        { type: 'cmd', text: `caio@portfolio:~$ ${raw.trim()}` },
        { type: 'out', html },
      ])

    if (!cmd) {
      setLines(prev => [...prev, { type: 'cmd', text: 'caio@portfolio:~$ ' }])
      return
    }

    if (cmd === 'clear') { setLines([]); return }
    if (cmd === 'exit')  { onClose(); return }

    if (cmd === 'help') {
      push([
        'Comandos disponíveis:',
        '',
        '  <span style="color:#4ade80">whoami</span>       → Quem sou eu',
        '  <span style="color:#4ade80">ls</span>           → Listar arquivos',
        '  <span style="color:#4ade80">ls projects</span>  → Listar projetos',
        '  <span style="color:#4ade80">cat about</span>    → Mais sobre mim',
        '  <span style="color:#4ade80">hire caio</span>    → Me contratar',
        '  <span style="color:#4ade80">snake</span>        → Jogar Snake 🐍',
        '  <span style="color:#4ade80">clear</span>        → Limpar terminal',
        '  <span style="color:#4ade80">exit</span>         → Fechar (ou ESC)',
      ].join('\n'))
      return
    }

    if (cmd === 'whoami') {
      push([
        'caio@portfolio — Full Stack Developer',
        '──────────────────────────────────────',
        'Nome:       Caio Diniz',
        'Local:      Campinas, SP — Brasil',
        'Stack:      React · TypeScript · Node.js · PostgreSQL',
        'Status:     <span style="color:#4ade80">● Disponível para projetos</span>',
        'Email:      cvdinizramos@gmail.com',
      ].join('\n'))
      return
    }

    if (cmd === 'ls') {
      push('projects/    about.md    contact.md    <span style="color:#f59e0b">snake.exe</span>')
      return
    }

    if (cmd === 'ls projects') {
      const list = projects
        .map(p => `  <span style="color:#60a5fa">${escHtml(p.title)}</span>  [${p.year}]  ${p.type}`)
        .join('\n')
      push(`Projetos (${projects.length}):\n\n${list}`)
      return
    }

    if (cmd === 'cat about') {
      push([
        'cat about.md',
        '──────────────────────────────────────',
        'Dev apaixonado por criar interfaces premium e APIs',
        'robustas. Construindo produtos de alto impacto desde 2022.',
        '',
        'Filosofia: "Código limpo. Design que converte."',
        '',
        '✉  cvdinizramos@gmail.com',
        '🔗  /contact',
      ].join('\n'))
      return
    }

    if (cmd === 'hire caio') {
      push([
        'Iniciando protocolo de contratação...',
        '──────────────────────────────────────',
        '<span style="color:#4ade80">✓</span> Verificando disponibilidade    [OK]',
        '<span style="color:#4ade80">✓</span> Calculando compatibilidade     [OK]',
        '<span style="color:#4ade80">✓</span> Gerando proposta               [OK]',
        '',
        'Redirecionando para /contact...',
        '<span style="color:rgba(255,255,255,0.35)">(você está tomando a decisão certa)</span>',
      ].join('\n'))
      setTimeout(() => { onClose(); window.location.href = '/contact' }, 1800)
      return
    }

    if (cmd === 'snake') {
      setLines(prev => [
        ...prev,
        { type: 'cmd', text: 'caio@portfolio:~$ snake' },
        { type: 'out', html: 'Carregando Snake...\nUse WASD ou setas para mover · Q para sair · R para reiniciar.' },
      ])
      setMode('snake')
      return
    }

    push(`<span style="color:#f87171">bash: ${escHtml(cmd)}: comando não encontrado</span>\nDigite "help" para ver os comandos disponíveis.`)
  }, [onClose])

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const val = input
      setInput('')
      setHistIdx(-1)
      if (val.trim()) setCmdHistory(prev => [val.trim(), ...prev])
      runCommand(val)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, cmdHistory.length - 1)
      setHistIdx(next)
      setInput(cmdHistory[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(histIdx - 1, -1)
      setHistIdx(next)
      setInput(next === -1 ? '' : cmdHistory[next])
    }
  }

  // ── Snake game ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'snake') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let snake: Pos[] = [{ x: 15, y: 9 }, { x: 14, y: 9 }, { x: 13, y: 9 }]
    let dir: Pos = { x: 1, y: 0 }
    let nextDir: Pos = { x: 1, y: 0 }
    let food: Pos = { x: 5, y: 5 }
    let score = 0
    let alive = true
    let tid: ReturnType<typeof setInterval>

    function placeFood() {
      let p: Pos
      do { p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) } }
      while (snake.some(s => s.x === p.x && s.y === p.y))
      food = p
    }

    function draw() {
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, SNAKE_W, SNAKE_H)

      // Subtle grid
      ctx.strokeStyle = 'rgba(74,222,128,0.04)'
      ctx.lineWidth = 0.5
      for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, SNAKE_H); ctx.stroke() }
      for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(SNAKE_W, y * CELL); ctx.stroke() }

      // Food
      ctx.shadowBlur = 10; ctx.shadowColor = '#f87171'
      ctx.fillStyle = '#f87171'
      ctx.fillRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6)

      // Snake body
      snake.forEach((seg, i) => {
        const fade = 1 - (i / snake.length) * 0.65
        ctx.fillStyle = `rgba(74,222,128,${fade})`
        ctx.shadowBlur = i === 0 ? 14 : 3
        ctx.shadowColor = '#4ade80'
        ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2)
      })
      ctx.shadowBlur = 0

      // HUD
      ctx.font = '600 11px "Courier New", monospace'
      ctx.fillStyle = 'rgba(74,222,128,0.6)'
      ctx.textAlign = 'left'
      ctx.fillText(`SCORE: ${score}`, 8, 16)
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      ctx.textAlign = 'right'
      ctx.fillText('Q = sair', SNAKE_W - 8, 16)
      ctx.textAlign = 'left'

      if (!alive) {
        ctx.fillStyle = 'rgba(0,0,0,0.72)'
        ctx.fillRect(0, 0, SNAKE_W, SNAKE_H)
        ctx.font = 'bold 24px "Courier New", monospace'
        ctx.fillStyle = '#f87171'
        ctx.textAlign = 'center'
        ctx.fillText('GAME OVER', SNAKE_W / 2, SNAKE_H / 2 - 18)
        ctx.font = '13px "Courier New", monospace'
        ctx.fillStyle = 'rgba(255,255,255,0.45)'
        ctx.fillText(`Score: ${score}`, SNAKE_W / 2, SNAKE_H / 2 + 10)
        ctx.fillStyle = 'rgba(255,255,255,0.22)'
        ctx.fillText('R = reiniciar  ·  Q = sair', SNAKE_W / 2, SNAKE_H / 2 + 32)
        ctx.textAlign = 'left'
      }
    }

    function tick() {
      if (!alive) return
      dir = nextDir
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y }
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || snake.some(s => s.x === head.x && s.y === head.y)) {
        alive = false; draw(); return
      }
      snake.unshift(head)
      if (head.x === food.x && head.y === food.y) { score++; placeFood() } else snake.pop()
      draw()
    }

    function restart() {
      clearInterval(tid)
      snake = [{ x: 15, y: 9 }, { x: 14, y: 9 }, { x: 13, y: 9 }]
      dir = { x: 1, y: 0 }; nextDir = { x: 1, y: 0 }
      score = 0; alive = true
      placeFood(); draw()
      tid = setInterval(tick, 115)
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') {
        clearInterval(tid)
        setLines(prev => [...prev, { type: 'out', html: `Snake encerrado · Score: <span style="color:#4ade80">${score}</span>` }])
        setMode('cli')
        return
      }
      if (!alive && (e.key === 'r' || e.key === 'R')) { restart(); return }
      const map: Record<string, Pos> = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 },
      }
      const nd = map[e.key]
      if (nd && (nd.x + dir.x !== 0 || nd.y + dir.y !== 0)) {
        nextDir = nd
        e.preventDefault()
      }
    }

    placeFood(); draw()
    tid = setInterval(tick, 115)
    window.addEventListener('keydown', onKeyDown)
    return () => { clearInterval(tid); window.removeEventListener('keydown', onKeyDown) }
  }, [mode])

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
      }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          width: '100%', maxWidth: 680,
          height: 'min(500px, calc(100svh - 3rem))',
          background: '#0d0d0d',
          border: '1px solid rgba(74,222,128,0.18)',
          borderRadius: 12,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 0 80px rgba(74,222,128,0.06), 0 32px 80px rgba(0,0,0,0.7)',
          fontFamily: '"Courier New", "Fira Code", monospace',
        }}
      >
        {/* Title bar */}
        <div style={{
          background: '#111',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          padding: '9px 14px',
          display: 'flex', alignItems: 'center', gap: 8,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={onClose}
              style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', border: 'none', cursor: 'pointer', padding: 0 }}
            />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
          </div>
          <span style={{ flex: 1, textAlign: 'center', fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
            caio@portfolio — zsh
          </span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.18)', cursor: 'pointer', padding: 0, lineHeight: 1, display: 'flex' }}
          >
            <X size={13} />
          </button>
        </div>

        {/* CLI mode */}
        {mode === 'cli' && (
          <>
            <div
              ref={scrollRef}
              style={{
                flex: 1, overflowY: 'auto', padding: '14px 18px',
                color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', lineHeight: 1.75,
              }}
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line, i) =>
                line.type === 'cmd' ? (
                  <div key={i} style={{ color: '#4ade80', marginTop: 4 }}>{line.text}</div>
                ) : (
                  <pre
                    key={i}
                    style={{ margin: '0 0 6px', whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: 'rgba(255,255,255,0.6)' }}
                    dangerouslySetInnerHTML={{ __html: line.html }}
                  />
                )
              )}
            </div>

            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.04)',
              padding: '10px 18px',
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#0a0a0a', flexShrink: 0,
            }}>
              <span style={{ color: '#4ade80', fontSize: '0.8rem', userSelect: 'none', whiteSpace: 'nowrap' }}>
                caio@portfolio:~$
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  color: '#fff', fontFamily: 'inherit', fontSize: '0.8rem',
                  caretColor: '#4ade80',
                }}
              />
            </div>
          </>
        )}

        {/* Snake mode */}
        {mode === 'snake' && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 10, background: '#0a0a0a', padding: '12px',
          }}>
            <canvas
              ref={canvasRef}
              width={SNAKE_W}
              height={SNAKE_H}
              style={{
                border: '1px solid rgba(74,222,128,0.15)',
                borderRadius: 6,
                display: 'block',
                maxWidth: '100%',
                height: 'auto',
              }}
            />
            <p style={{ margin: 0, color: 'rgba(74,222,128,0.3)', fontSize: '0.62rem', letterSpacing: '0.08em' }}>
              WASD · SETAS para mover · R reiniciar · Q sair
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
