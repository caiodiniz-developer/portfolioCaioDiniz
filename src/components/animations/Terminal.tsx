import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

interface Line { type: 'input' | 'output' | 'error' | 'success'; text: string }

const PROMPT = 'caio@portfolio:~$ '
const VERSION = '2.0.0'

const HELP = `
Available commands:
  help          Show this message
  whoami        About Caio Diniz
  ls            List site sections
  cd <page>     Navigate to a page (home, about, projects, contact, services)
  skills        Tech stack overview
  cat about.txt Caio's full bio
  date          Current time in São Paulo
  repo          Open GitHub profile
  ping          Check connection
  clear         Clear terminal
  exit          Close terminal
`.trim()

const WHOAMI = `
Caio Diniz — Full Stack Developer
Location: São Paulo, Brasil
Stack: React · Node.js · TypeScript · PostgreSQL
Status: 🟢 Available for projects
Contact: wa.me/5519999473425
`.trim()

const SKILLS = `
┌─────────────────────────────────┐
│ FRONTEND                        │
│  React 19 · TypeScript · GSAP  │
│  Framer Motion · Tailwind CSS  │
│  Three.js · Vite               │
├─────────────────────────────────┤
│ BACKEND                         │
│  Node.js · Express · Prisma    │
│  PostgreSQL · JWT · Zod        │
├─────────────────────────────────┤
│ TOOLS                           │
│  Git · Docker · Figma · Vercel │
└─────────────────────────────────┘`.trim()

const BIO = `Caio Diniz é desenvolvedor Full Stack de São Paulo,
especializado em criar experiências digitais premium.
Combina código limpo, animações suaves e estratégia
de negócios para entregar produtos que impressionam.

Apaixonado por interfaces únicas, performance e pelo
detalhe que faz a diferença entre bom e extraordinário.`.trim()

const PAGES: Record<string, string> = {
  home: '/', sobre: '/about', about: '/about',
  projects: '/projects', projetos: '/projects',
  contact: '/contact', contato: '/contact',
  services: '/services',
}

export default function Terminal() {
  const [open,    setOpen]    = useState(false)
  const [input,   setInput]   = useState('')
  const [lines,   setLines]   = useState<Line[]>([
    { type: 'success', text: `Caio Diniz Portfolio Terminal v${VERSION}` },
    { type: 'output',  text: 'Type "help" for available commands.' },
    { type: 'output',  text: '' },
  ])
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const inputRef  = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const navigate  = useNavigate()

  /* toggle on Ctrl+` */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === '`') { e.preventDefault(); setOpen(o => !o) }
      if (e.key === 'Escape' && open)  { setOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const push = useCallback((l: Line | Line[]) => {
    setLines(prev => [...prev, ...(Array.isArray(l) ? l : [l])])
  }, [])

  function run(cmd: string) {
    const raw  = cmd.trim()
    if (!raw) return
    push({ type: 'input', text: PROMPT + raw })
    setHistory(h => [raw, ...h.slice(0, 49)])
    setHistIdx(-1)

    const [verb, ...args] = raw.toLowerCase().split(' ')

    switch (verb) {
      case 'help': push({ type: 'output', text: HELP }); break
      case 'whoami': push({ type: 'output', text: WHOAMI }); break
      case 'skills': push({ type: 'output', text: SKILLS }); break
      case 'cat':
        if (args[0] === 'about.txt') push({ type: 'output', text: BIO })
        else push({ type: 'error', text: `cat: ${args[0] || ''}: No such file or directory` })
        break
      case 'ls': case 'dir':
        push({ type: 'output', text: 'home/    about/   projects/   contact/   services/' }); break
      case 'cd':
        if (!args[0]) { push({ type: 'error', text: 'cd: missing argument' }); break }
        if (PAGES[args[0]]) {
          push({ type: 'success', text: `Navigating to /${args[0]}...` })
          setTimeout(() => { navigate(PAGES[args[0]]); setOpen(false) }, 600)
        } else {
          push({ type: 'error', text: `cd: ${args[0]}: No such directory` })
        }
        break
      case 'date':
        push({ type: 'output', text: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'full', timeStyle: 'medium' }) }); break
      case 'ping':
        push([
          { type: 'output',  text: 'PING portfolio.caiodiniz.dev' },
          { type: 'success', text: '64 bytes from caiodiniz.dev: time=0.42ms' },
          { type: 'success', text: '64 bytes from caiodiniz.dev: time=0.38ms' },
          { type: 'output',  text: 'Round-trip min/avg/max = 0.38/0.40/0.42 ms' },
        ]); break
      case 'repo':
        push({ type: 'success', text: 'Opening GitHub...' })
        setTimeout(() => window.open('https://github.com/caiodiniz-dev', '_blank'), 400)
        break
      case 'clear': case 'cls':
        setLines([{ type: 'output', text: '' }]); break
      case 'exit': case 'quit':
        push({ type: 'output', text: 'Closing terminal...' })
        setTimeout(() => setOpen(false), 400)
        break
      default:
        push({ type: 'error', text: `Command not found: ${raw}. Type "help" for available commands.` })
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter')  { run(input); setInput(''); return }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(idx); setInput(history[idx] ?? '')
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = Math.max(histIdx - 1, -1)
      setHistIdx(idx); setInput(idx === -1 ? '' : history[idx] ?? '')
    }
  }

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      title="Open Terminal (Ctrl+`)"
      style={{
        position: 'fixed', bottom: 24, left: 24, zIndex: 200,
        width: 40, height: 40, borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontFamily: 'monospace', fontSize: '1rem',
        transition: 'all 0.25s', backdropFilter: 'blur(8px)',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)' }}
    >
      &gt;_
    </button>
  )

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
        padding: '0 0 24px 24px',
        pointerEvents: 'none',
      }}
    >
      {/* Backdrop */}
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)', pointerEvents: 'auto' }}
        onClick={() => setOpen(false)}
      />

      {/* Terminal window */}
      <div
        style={{
          position: 'relative', zIndex: 1,
          width: 'min(580px, calc(100vw - 48px))',
          height: 'min(380px, 60vh)',
          background: 'rgba(10,10,12,0.97)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
          display: 'flex', flexDirection: 'column',
          fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
          fontSize: '0.8rem',
          overflow: 'hidden',
          pointerEvents: 'auto',
          animation: 'terminalIn 0.22s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Title bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
          <span style={{ flex: 1, textAlign: 'center', fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
            terminal — caio@portfolio
          </span>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', padding: 0, fontSize: '1rem', lineHeight: 1 }}>✕</button>
        </div>

        {/* Output */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {lines.map((l, i) => (
            <pre key={i} style={{
              margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              color: l.type === 'input'   ? 'rgba(255,255,255,0.9)'
                   : l.type === 'error'   ? '#ff6b6b'
                   : l.type === 'success' ? '#50fa7b'
                   : 'rgba(255,255,255,0.45)',
              lineHeight: '1.6',
            }}>
              {l.text}
            </pre>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input row */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <span style={{ color: '#50fa7b', flexShrink: 0 }}>{PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'rgba(255,255,255,0.9)', fontFamily: 'inherit', fontSize: 'inherit',
              caretColor: '#50fa7b',
            }}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>

      <style>{`
        @keyframes terminalIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </div>
  )
}
