import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { stopLenis, startLenis } from '@/hooks/useLenis'

/* ─── VS Code Dark+ palette ─────────────────────────────────── */
const KW = '#569cd6'  // const, import, true, false
const PR = '#9cdcfe'  // property / parameter names
const ST = '#ce9178'  // string literals
const CM = '#6a9955'  // comments
const FN = '#dcdcaa'  // function / method names
const TX = '#d4d4d4'  // default text, punctuation
const SP = '#4fc1ff'  // special values (Infinity, etc.)

/* ─── Editor code ───────────────────────────────────────────── */
type Seg  = { t: string; c: string }
type Line = Seg[]

const CODE: Line[] = [
  [{ t: '// iniciando portfolio...', c: CM }],
  [],
  [
    { t: 'import', c: KW }, { t: ' { ', c: TX },
    { t: 'Passion', c: PR }, { t: ' } ', c: TX },
    { t: 'from', c: KW }, { t: " 'caio-diniz'", c: ST },
  ],
  [],
  [
    { t: 'const ', c: KW }, { t: 'portfolio', c: PR }, { t: ' = {', c: TX },
  ],
  [
    { t: '  name', c: PR }, { t: ':     ', c: TX },
    { t: "'Caio Diniz'", c: ST }, { t: ',', c: TX },
  ],
  [
    { t: '  building', c: PR }, { t: ': ', c: TX },
    { t: 'true', c: KW }, { t: ',', c: TX },
  ],
  [
    { t: '  coffee', c: PR }, { t: ':   ', c: TX },
    { t: 'Infinity', c: SP }, { t: ',', c: TX },
  ],
  [{ t: '}', c: TX }],
  [],
  [
    { t: 'portfolio', c: PR }, { t: '.', c: TX },
    { t: 'launch', c: FN }, { t: '()', c: TX },
  ],
]

/* ─── Terminal output ────────────────────────────────────────── */
const TERM: { t: string; c: string }[] = [
  { t: '$ npm run dev', c: TX },
  { t: '', c: '' },
  { t: '> portfolio-caio@1.0.0 dev', c: CM },
  { t: '> vite', c: CM },
  { t: '', c: '' },
  { t: '  VITE v5.4.0  ready in 312 ms', c: SP },
  { t: '', c: '' },
  { t: '  ➜  Local:   http://caiodiniz.dev.br', c: '#4ade80' },
]

/* ─── Precompute char positions ──────────────────────────────── */
const LINE_LENS   = CODE.map(l => l.reduce((s, seg) => s + seg.t.length, 0))
const LINE_STARTS: number[] = []
let _n = 0
for (let i = 0; i < CODE.length; i++) { LINE_STARTS.push(_n); _n += LINE_LENS[i] }
const TOTAL_CHARS = _n

/* ─── Sidebar file tree ──────────────────────────────────────── */
const SIDEBAR = [
  { label: '▾ PORTFOLIO-CAIO', indent: 0,   head: true  },
  { label: '▸ src',            indent: 1,   dir:  true  },
  { label: '▸ components',     indent: 2,   dir:  true  },
  { label: '▸ hooks',          indent: 2,   dir:  true  },
  { label: '▸ pages',          indent: 2,   dir:  true  },
  { label: 'App.tsx',          indent: 2,   color: '#519aba' },
  { label: '● portfolio.ts',   indent: 2,   color: '#519aba', active: true },
  { label: 'package.json',     indent: 1,   color: '#e8c568' },
  { label: 'vite.config.ts',   indent: 1,   color: '#519aba' },
]

/* ─── Activity icon ──────────────────────────────────────────── */
function VscIcon({ children, active, style }: {
  children: ReactNode; active?: boolean; style?: CSSProperties
}) {
  return (
    <div style={{
      width: 48, height: 48,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: active ? '#d4d4d4' : 'rgba(255,255,255,0.28)',
      borderLeft: `2px solid ${active ? '#d4d4d4' : 'transparent'}`,
      cursor: 'default',
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PRELOADER
════════════════════════════════════════════════════════════════ */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [revealed,  setRevealed]  = useState(0)
  const [termCount, setTermCount] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'terminal' | 'out'>('typing')

  /* Lock scroll while the preloader is up.
     Using Lenis' own stop/start (instead of setting overflow on <html>) keeps the
     engine's internal dimensions consistent — startLenis() re-measures Lenis and
     every ScrollTrigger once the real page is visible. */
  useEffect(() => {
    stopLenis()
    return () => { startLenis() }
  }, [])

  /* Typing: advance one char every 10ms */
  useEffect(() => {
    if (phase !== 'typing') return
    if (revealed >= TOTAL_CHARS) {
      const t = setTimeout(() => setPhase('terminal'), 260)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setRevealed(r => r + 1), 10)
    return () => clearTimeout(t)
  }, [revealed, phase])

  /* Terminal: reveal one line every 130ms */
  useEffect(() => {
    if (phase !== 'terminal') return
    if (termCount >= TERM.length) {
      const t = setTimeout(() => setPhase('out'), 680)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setTermCount(c => c + 1), 130)
    return () => clearTimeout(t)
  }, [termCount, phase])

  /* Fade-out then call onDone */
  useEffect(() => {
    if (phase !== 'out') return
    const t = setTimeout(onDone, 520)
    return () => clearTimeout(t)
  }, [phase, onDone])

  /* Build visible code state from revealed count */
  const visLines = CODE.map((line, li) => {
    const lineStart = LINE_STARTS[li]
    const lineLen   = LINE_LENS[li]
    const chars     = Math.max(0, Math.min(lineLen, revealed - lineStart))
    const isCurrent = lineLen > 0 && revealed >= lineStart && revealed < lineStart + lineLen

    let rem = chars
    const segs: { text: string; color: string }[] = []
    for (const seg of line) {
      if (rem <= 0) break
      const take = Math.min(rem, seg.t.length)
      segs.push({ text: seg.t.slice(0, take), color: seg.c })
      rem -= take
    }
    return { segs, isCurrent }
  })

  /* Current line number for status bar */
  let statusLine = 1
  for (let li = 0; li < CODE.length; li++) {
    if (LINE_STARTS[li] <= revealed) statusLine = li + 1
    else break
  }

  return (
    <motion.div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#1e1e1e',
        display: 'flex', flexDirection: 'column',
        fontFamily: '"JetBrains Mono","Fira Code",Consolas,monospace',
        fontSize: 13, lineHeight: 1.6,
        color: TX,
        userSelect: 'none',
        overflow: 'hidden',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === 'out' ? 0 : 1 }}
      transition={{ duration: phase === 'out' ? 0.52 : 0.22, ease: 'easeInOut' }}
    >

      {/* ── Title bar ──────────────────────────────────────────── */}
      <div style={{
        height: 32, flexShrink: 0,
        background: '#323233',
        display: 'flex', alignItems: 'center',
        padding: '0 14px',
        borderBottom: '1px solid #191919',
      }}>
        {/* macOS traffic lights */}
        <div style={{ display: 'flex', gap: 7, marginRight: 18 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((bg, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: bg, opacity: 0.85 }} />
          ))}
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.02em' }}>
          portfolio.ts — Caio Diniz — Visual Studio Code
        </div>
      </div>

      {/* ── Main body ──────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Activity bar */}
        <div style={{
          width: 48, flexShrink: 0,
          background: '#333333',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          borderRight: '1px solid #191919',
        }}>
          <VscIcon active>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
            </svg>
          </VscIcon>
          <VscIcon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </VscIcon>
          <VscIcon>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/>
              <path d="M13 6h3a2 2 0 012 2v7"/><line x1="6" y1="9" x2="6" y2="21"/>
            </svg>
          </VscIcon>
          <VscIcon style={{ marginTop: 'auto', marginBottom: 4 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            </svg>
          </VscIcon>
        </div>

        {/* Sidebar — hidden on small screens via CSS */}
        <div
          className="vsc-sidebar"
          style={{
            width: 220, flexShrink: 0,
            background: '#252526',
            borderRight: '1px solid #191919',
            display: 'none',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '10px 12px 6px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
            Explorador
          </div>
          {SIDEBAR.map((f, i) => (
            <div key={i} style={{
              padding: `2px 0 2px ${8 + f.indent * 14}px`,
              display: 'flex', alignItems: 'center', gap: 5,
              background: f.active ? 'rgba(255,255,255,0.08)' : 'transparent',
              fontSize: 12,
              color: f.head
                ? 'rgba(255,255,255,0.6)'
                : f.active
                  ? '#d4d4d4'
                  : (f as { dir?: boolean }).dir
                    ? 'rgba(255,255,255,0.4)'
                    : ((f as { color?: string }).color || 'rgba(255,255,255,0.38)'),
              fontWeight: f.head ? 700 : 400,
            }}>
              {f.label}
            </div>
          ))}
        </div>

        {/* Editor + Terminal column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Tab bar */}
          <div style={{
            height: 35, flexShrink: 0,
            background: '#2d2d2d',
            display: 'flex', alignItems: 'stretch',
            borderBottom: '1px solid #191919',
          }}>
            {/* Active tab */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '0 16px',
              background: '#1e1e1e',
              borderTop: '1px solid #007acc',
              borderRight: '1px solid #191919',
              fontSize: 12, color: '#d4d4d4',
              flexShrink: 0,
            }}>
              {/* TypeScript badge */}
              <div style={{
                width: 14, height: 14, borderRadius: 2,
                background: '#3178c6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: 8, fontWeight: 900, color: '#fff', lineHeight: 1 }}>TS</span>
              </div>
              portfolio.ts
              <span style={{ color: '#4ade80', fontSize: 10 }}>●</span>
            </div>
          </div>

          {/* ── Code editor ── */}
          <div style={{
            flex: 1, background: '#1e1e1e',
            padding: '12px 0', overflow: 'hidden',
            position: 'relative',
          }}>
            {visLines.map((line, li) => (
              <div key={li} style={{
                display: 'flex', alignItems: 'center',
                height: 20,
                background: line.isCurrent ? 'rgba(255,255,255,0.03)' : 'transparent',
              }}>
                {/* Gutter line number */}
                <span style={{
                  width: 52, flexShrink: 0,
                  textAlign: 'right', paddingRight: 20,
                  fontSize: 12,
                  color: line.isCurrent ? 'rgba(255,255,255,0.48)' : '#3c3c3c',
                  userSelect: 'none',
                }}>
                  {li + 1}
                </span>
                {/* Code segments */}
                <span style={{ whiteSpace: 'pre' }}>
                  {line.segs.map((seg, si) => (
                    <span key={si} style={{ color: seg.color }}>{seg.text}</span>
                  ))}
                  {/* Blinking block cursor */}
                  {line.isCurrent && (
                    <span style={{
                      display: 'inline-block',
                      width: 2, height: 14,
                      background: '#aeafad',
                      verticalAlign: 'text-bottom',
                      animation: 'vscBlink 1.1s step-end infinite',
                    }} />
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* ── Terminal panel ── */}
          {phase !== 'typing' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              style={{ flexShrink: 0, overflow: 'hidden', borderTop: '1px solid #3e3e3e' }}
            >
              {/* Terminal tabs */}
              <div style={{
                height: 27, flexShrink: 0,
                background: '#252526',
                display: 'flex', alignItems: 'stretch',
                borderBottom: '1px solid #191919',
              }}>
                {(['TERMINAL', 'PROBLEMS', 'OUTPUT'] as const).map((tab, i) => (
                  <div key={tab} style={{
                    display: 'flex', alignItems: 'center',
                    padding: '0 16px',
                    fontSize: 11,
                    color: i === 0 ? '#d4d4d4' : 'rgba(255,255,255,0.28)',
                    background: i === 0 ? '#1e1e1e' : 'transparent',
                    borderTop: i === 0 ? '1px solid #007acc' : '1px solid transparent',
                    borderRight: i === 0 ? '1px solid #191919' : 'none',
                  }}>
                    {tab}
                  </div>
                ))}
              </div>
              {/* Terminal content */}
              <div style={{ padding: '10px 18px 14px', minHeight: 130, background: '#1e1e1e' }}>
                {TERM.slice(0, termCount).map((line, i) => (
                  <div key={i} style={{ minHeight: 20, color: line.c, fontSize: 12.5, whiteSpace: 'pre' }}>
                    {line.t}
                    {/* Block cursor on last active line */}
                    {i === termCount - 1 && phase !== 'out' && (
                      <span style={{
                        display: 'inline-block',
                        width: 8, height: 13,
                        background: '#aeafad',
                        verticalAlign: 'text-bottom',
                        marginLeft: 1,
                        animation: 'vscBlink 1.1s step-end infinite',
                      }} />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Status bar ──────────────────────────────────────────── */}
      <div style={{
        height: 22, flexShrink: 0,
        background: phase === 'out' ? '#16825d' : '#007acc',
        transition: 'background 0.45s ease',
        display: 'flex', alignItems: 'center',
        padding: '0 10px', gap: 14,
        fontSize: 11, color: 'rgba(255,255,255,0.9)',
      }}>
        {/* Git branch icon + name */}
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.75">
            <line x1="6" y1="3" x2="6" y2="15"/>
            <circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
            <path d="M18 9a9 9 0 01-9 9"/>
          </svg>
          main
        </span>

        {/* Right-side info */}
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>TypeScript</span>
          <span>Ln {statusLine}, Col 1</span>
          <span>UTF-8</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, opacity: 0.85 }}>
            {phase === 'out'
              ? <><span>✓</span><span>Ready</span></>
              : <><span style={{ animation: 'vscSpin 1.4s linear infinite', display: 'inline-block' }}>⟳</span><span>Compilando</span></>
            }
          </span>
        </span>
      </div>

      {/* Keyframes + sidebar responsive */}
      <style>{`
        @keyframes vscBlink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0; }
        }
        @keyframes vscSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (min-width: 600px) {
          .vsc-sidebar { display: block !important; }
        }
      `}</style>
    </motion.div>
  )
}
