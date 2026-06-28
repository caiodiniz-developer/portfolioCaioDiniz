import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'
import { SITE } from '@/lib/constants'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

function tick() {
  try {
    const ac = new AudioContext()
    const o = ac.createOscillator(); const g = ac.createGain()
    o.connect(g); g.connect(ac.destination)
    o.frequency.value = 550 + Math.random() * 300
    g.gain.setValueAtTime(0.04, ac.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.038)
    o.start(); o.stop(ac.currentTime + 0.038)
  } catch (_) {}
}

/* ═══════════════════════════════════════
   TERMINAL
═══════════════════════════════════════ */
type TKind = 'cmd' | 'blank' | 'info' | 'kv' | 'ok' | 'hint'
type TLine = { kind: TKind; text: string }

const LINES_PT: TLine[] = [
  { kind: 'cmd',   text: 'caio --contact' },
  { kind: 'blank', text: '' },
  { kind: 'info',  text: '  Inicializando conexão...' },
  { kind: 'blank', text: '' },
  { kind: 'kv',    text: '  nome        Caio Diniz' },
  { kind: 'kv',    text: '  cargo       Full Stack Developer' },
  { kind: 'kv',    text: '  email       cvdinizramos@gmail.com' },
  { kind: 'kv',    text: '  whatsapp    +55 19 99947-3425' },
  { kind: 'kv',    text: '  github      github.com/caiodiniz-dev' },
  { kind: 'blank', text: '' },
  { kind: 'ok',    text: '  status      ✓  disponível para projetos' },
  { kind: 'blank', text: '' },
  { kind: 'hint',  text: '  role para baixo para continuar ↓' },
]
const LINES_EN: TLine[] = [
  { kind: 'cmd',   text: 'caio --contact' },
  { kind: 'blank', text: '' },
  { kind: 'info',  text: '  Initializing connection...' },
  { kind: 'blank', text: '' },
  { kind: 'kv',    text: '  name        Caio Diniz' },
  { kind: 'kv',    text: '  role        Full Stack Developer' },
  { kind: 'kv',    text: '  email       cvdinizramos@gmail.com' },
  { kind: 'kv',    text: '  whatsapp    +55 19 99947-3425' },
  { kind: 'kv',    text: '  github      github.com/caiodiniz-dev' },
  { kind: 'blank', text: '' },
  { kind: 'ok',    text: '  status      ✓  available for projects' },
  { kind: 'blank', text: '' },
  { kind: 'hint',  text: '  scroll down to continue ↓' },
]

const lineColor = (kind: TKind) =>
  kind === 'ok'   ? '#4ade80'
  : kind === 'hint' ? 'rgba(255,255,255,0.28)'
  : kind === 'info' ? 'rgba(255,255,255,0.45)'
  : '#e0e0e0'

function TerminalSection({ lang }: { lang: string }) {
  const LINES = lang === 'pt' ? LINES_PT : LINES_EN
  const [shown,   setShown]   = useState<TLine[]>([])
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [done,    setDone]    = useState(false)

  function skipAll() { setShown(LINES); setLineIdx(LINES.length); setDone(true) }

  useEffect(() => {
    if (lineIdx >= LINES.length) { setDone(true); return }
    const line = LINES[lineIdx]

    if (line.kind === 'blank') {
      const t = setTimeout(() => { setShown(p => [...p, line]); setLineIdx(i => i + 1); setCharIdx(0) }, 70)
      return () => clearTimeout(t)
    }
    if (line.kind === 'info') {
      const t = setTimeout(() => { setShown(p => [...p, line]); setLineIdx(i => i + 1); setCharIdx(0) }, 380)
      return () => clearTimeout(t)
    }

    const isCmd  = line.kind === 'cmd'
    const speed  = isCmd ? 88 : 28
    const init   = lineIdx === 0 ? 600 : isCmd ? 500 : 55

    if (charIdx === 0) {
      const t = setTimeout(() => setCharIdx(1), init)
      return () => clearTimeout(t)
    }
    if (charIdx < line.text.length) {
      const t = setTimeout(() => { if (isCmd) tick(); setCharIdx(c => c + 1) }, speed)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => { setShown(p => [...p, line]); setLineIdx(i => i + 1); setCharIdx(0) }, 30)
    return () => clearTimeout(t)
  }, [lineIdx, charIdx, LINES])

  const curLine    = lineIdx < LINES.length ? LINES[lineIdx] : null
  const typingCmd  = curLine?.kind === 'cmd'
  const typingOther = curLine && curLine.kind !== 'cmd' && curLine.kind !== 'blank' && curLine.kind !== 'info'

  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(6rem,10vw,8rem) clamp(1.5rem,5vw,4rem)' }}>
      <div style={{ width: '100%', maxWidth: 700 }}>
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: E }}
          style={{ background: 'rgba(255,255,255,0.026)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 48px 96px rgba(0,0,0,0.55)' }}>

          {/* Chrome bar */}
          <div style={{ padding: '0.75rem 1.1rem', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <button onClick={skipAll} style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e', display: 'block' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f', display: 'block' }} />
            <span style={{ marginLeft: 'auto', fontFamily: '"SF Mono","Fira Code",monospace', fontSize: '0.56rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
              bash — caio@portfolio — 80×24
            </span>
          </div>

          {/* Terminal body */}
          <div style={{ padding: 'clamp(1.2rem,3vw,1.8rem)', fontFamily: '"SF Mono","Fira Code","Cascadia Code",monospace', fontSize: 'clamp(0.72rem,1.35vw,0.86rem)', lineHeight: 1.88, minHeight: 340 }}>

            {/* Prompt row */}
            <div style={{ display: 'flex', gap: '0.55em', marginBottom: 2 }}>
              <span style={{ color: '#4ade80', userSelect: 'none' }}>caio@portfolio</span>
              <span style={{ color: 'rgba(255,255,255,0.25)', userSelect: 'none' }}>:~$</span>
              <span style={{ color: '#fff' }}>
                {typingCmd
                  ? LINES[0].text.slice(0, charIdx)
                  : shown.some(l => l.kind === 'cmd') ? 'caio --contact' : ''}
                {typingCmd && <span style={{ display: 'inline-block', width: 7, height: '1em', background: '#fff', verticalAlign: 'text-bottom', animation: 'tblink .9s step-end infinite' }} />}
              </span>
            </div>

            {/* Output lines */}
            {shown.filter(l => l.kind !== 'cmd').map((line, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.12 }}
                style={{ color: lineColor(line.kind), whiteSpace: 'pre', minHeight: line.kind === 'blank' ? '0.4em' : undefined }}>
                {line.text}
              </motion.div>
            ))}

            {/* Typing in progress (non-cmd) */}
            {typingOther && curLine && (
              <div style={{ color: lineColor(curLine.kind), whiteSpace: 'pre' }}>
                {curLine.text.slice(0, charIdx)}
                <span style={{ display: 'inline-block', width: 7, height: '1em', background: 'currentColor', opacity: 0.7, verticalAlign: 'text-bottom', animation: 'tblink .9s step-end infinite' }} />
              </div>
            )}

            {/* Idle cursor */}
            {done && (
              <div style={{ display: 'flex', gap: '0.55em', marginTop: 4 }}>
                <span style={{ color: '#4ade80' }}>caio@portfolio</span>
                <span style={{ color: 'rgba(255,255,255,0.25)' }}>:~$</span>
                <span style={{ display: 'inline-block', width: 7, height: '1em', background: 'rgba(255,255,255,0.7)', verticalAlign: 'text-bottom', animation: 'tblink .9s step-end infinite' }} />
              </div>
            )}
          </div>
        </motion.div>

        {!done && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
            onClick={skipAll}
            style={{ marginTop: '0.8rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.18)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.18)')}>
            {lang === 'pt' ? 'pular →' : 'skip →'}
          </motion.button>
        )}
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════
   AVAILABILITY
═══════════════════════════════════════ */
const DAYS_PT = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
const DAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const SLOTS   = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

type SlotStatus = 'free' | 'busy'
const AVAIL: Record<string, Record<string, SlotStatus>> = {
  'Segunda': { '09:00':'free', '10:00':'free', '11:00':'free', '14:00':'free', '15:00':'free', '16:00':'free', '17:00':'free' },
  'Terça':   { '09:00':'free', '10:00':'free', '11:00':'free', '14:00':'free', '15:00':'free', '16:00':'free', '17:00':'free' },
  'Quarta':  { '09:00':'free', '10:00':'free', '11:00':'free', '14:00':'free', '15:00':'free', '16:00':'free', '17:00':'free' },
  'Quinta':  { '09:00':'free', '10:00':'free', '11:00':'free', '14:00':'free', '15:00':'free', '16:00':'free', '17:00':'free' },
  'Sexta':   { '09:00':'free', '10:00':'free', '11:00':'free', '14:00':'free', '15:00':'free', '16:00':'free', '17:00':'free' },
}

function useClock() {
  const [t, setT] = useState('')
  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setT(fmt())
    const id = setInterval(() => setT(fmt()), 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

function AvailabilitySection({ onSelect, lang }: { onSelect: (slot: string) => void; lang: string }) {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const clock  = useClock()
  const [hovered, setHovered] = useState<string | null>(null)
  const setCursor = useCursorStore(s => s.setState)
  const pt  = lang === 'pt'
  const days = pt ? DAYS_PT : DAYS_EN

  return (
    <section ref={ref} style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: E }}
        style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
        <div>
          <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', margin: '0 0 0.65rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-block', width: 20, height: 1, background: 'rgba(255,255,255,0.15)' }} />
            {pt ? 'Disponibilidade' : 'Availability'}
          </p>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(1.8rem,4.5vw,3.5rem)', letterSpacing: '-0.048em', lineHeight: 0.95, color: '#fff', margin: 0 }}>
            {pt ? 'Quando quer\nconversar?' : 'When would you\nlike to talk?'}
          </h2>
        </div>
        {/* Live clock */}
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', margin: '0 0 5px' }}>
            {pt ? 'Horário em Campinas, SP' : 'Campinas, SP time'}
          </p>
          <div style={{ fontFamily: '"SF Mono","Fira Code",monospace', fontSize: 'clamp(1.1rem,2.2vw,1.6rem)', fontWeight: 700, color: '#fff', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 9, justifyContent: 'flex-end' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e80', flexShrink: 0, animation: 'cpulse 2.2s ease-in-out infinite' }} />
            {clock}
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: E, delay: 0.15 }}
        style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 460 }}>
          <thead>
            <tr>
              <th style={{ width: 60, padding: '0 0 0.9rem', textAlign: 'left' }} />
              {days.map(d => (
                <th key={d} style={{ padding: '0 5px 0.9rem', textAlign: 'center', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                  {d.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot, si) => (
              <tr key={slot}>
                <td style={{ padding: '4px 12px 4px 0', fontFamily: '"SF Mono","Fira Code",monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.26)', whiteSpace: 'nowrap' }}>
                  {slot}
                </td>
                {DAYS_PT.map((day, di) => {
                  const status = AVAIL[day]?.[slot] ?? 'free'
                  const isFree = status === 'free'
                  const key    = `${day}-${slot}`
                  const isHov  = hovered === key
                  return (
                    <td key={day} style={{ padding: '4px 5px', textAlign: 'center' }}>
                      <motion.button
                        initial={{ opacity: 0, scale: 0.75 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.35, ease: E, delay: 0.2 + si * 0.035 + di * 0.018 }}
                        onClick={() => isFree && onSelect(`${DAYS_PT[di]}, ${slot}`)}
                        onMouseEnter={() => { if (isFree) { setHovered(key); setCursor('pointer') } }}
                        onMouseLeave={() => { setHovered(null); setCursor('default') }}
                        disabled={!isFree}
                        style={{
                          width: 36, height: 36, borderRadius: 9,
                          background: isFree ? isHov ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.018)',
                          border: `1px solid ${isFree ? isHov ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.035)'}`,
                          cursor: isFree ? 'pointer' : 'not-allowed',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.18s',
                        }}
                        title={isFree ? `${pt ? 'Disponível' : 'Available'} — ${DAYS_PT[di]}, ${slot}` : pt ? 'Ocupado' : 'Busy'}
                      >
                        {isFree
                          ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: isHov ? '#4ade80' : 'rgba(255,255,255,0.32)', transition: 'background 0.18s' }} />
                          : <span style={{ width: 14, height: 1, background: 'rgba(255,255,255,0.09)' }} />}
                      </motion.button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Legend */}
      <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.55 }}
        style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.18)', marginTop: '1.1rem', letterSpacing: '0.06em' }}>
        {pt ? '● disponível — clique para pré-preencher o formulário abaixo' : '● available — click to pre-fill the form below'}
      </motion.p>
    </section>
  )
}

/* ═══════════════════════════════════════
   CHAT FORM + LIVE PREVIEW
═══════════════════════════════════════ */
type StepId = 'name' | 'email' | 'type' | 'budget' | 'message'
type FormVals = Record<StepId, string>
const EMPTY: FormVals = { name: '', email: '', type: '', budget: '', message: '' }

interface Step {
  id:   StepId
  qPt:  string
  qEn:  string
  type: 'text' | 'email' | 'options' | 'textarea'
  opts?: string[]
}

const STEPS: Step[] = [
  { id: 'name',    qPt: 'Qual é o seu nome?',                qEn: 'What is your name?',           type: 'text'  },
  { id: 'email',   qPt: 'Qual é o seu e-mail?',              qEn: 'What is your email?',           type: 'email' },
  { id: 'type',    qPt: 'Que tipo de projeto você precisa?', qEn: 'What type of project?',         type: 'options',
    opts: ['Website', 'Landing Page', 'Web App', 'API / Backend', 'Outro'] },
  { id: 'budget',  qPt: 'Qual é o orçamento aproximado?',    qEn: 'What is the approximate budget?', type: 'options',
    opts: ['até R$ 1k', 'R$ 1k–R$ 3k', 'R$ 3k–R$ 8k', 'R$ 8k–R$ 20k', '> R$ 20k'] },
  { id: 'message', qPt: 'Me conta sobre o projeto.',         qEn: 'Tell me about the project.',   type: 'textarea' },
]

function Bubble({ from, text }: { from: 'caio' | 'user'; text: string }) {
  const isCaio = from === 'caio'
  return (
    <motion.div initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3, ease: E }}
      style={{ display: 'flex', justifyContent: isCaio ? 'flex-start' : 'flex-end', marginBottom: '0.5rem' }}>
      {isCaio && (
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0, marginRight: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
          C
        </div>
      )}
      <div style={{
        maxWidth: '76%', padding: '0.6rem 0.95rem',
        borderRadius: isCaio ? '14px 14px 14px 3px' : '14px 14px 3px 14px',
        background: isCaio ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.13)',
        border: `1px solid ${isCaio ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.17)'}`,
        fontSize: '0.88rem', color: isCaio ? 'rgba(255,255,255,0.72)' : '#fff', lineHeight: 1.5,
      }}>
        {text}
      </div>
    </motion.div>
  )
}

function LivePreview({ values, slot, lang }: { values: FormVals; slot: string; lang: string }) {
  const pt = lang === 'pt'
  const any = Object.values(values).some(v => v)
  return (
    <div style={{ position: 'sticky', top: '6rem', background: 'rgba(255,255,255,0.022)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.4rem', fontFamily: '"SF Mono","Fira Code",monospace', fontSize: '0.76rem', lineHeight: 1.9 }}>
      <p style={{ fontSize: '0.48rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'cpulse 2.2s infinite' }} />
        {pt ? 'prévia da mensagem' : 'message preview'}
      </p>

      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '0.65rem', marginBottom: '0.65rem' }}>
        <div><span style={{ color: 'rgba(255,255,255,0.25)' }}>Para:  </span><span style={{ color: '#fff' }}>Caio Diniz</span></div>
        {values.name && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><span style={{ color: 'rgba(255,255,255,0.25)' }}>De:    </span><span style={{ color: '#fff' }}>{values.name}</span></motion.div>}
      </div>

      <div style={{ color: 'rgba(255,255,255,0.5)', whiteSpace: 'pre-wrap', lineHeight: 1.85 }}>
        {!any && <span style={{ color: 'rgba(255,255,255,0.14)', fontStyle: 'italic' }}>{pt ? '// Aguardando...' : '// Waiting...'}</span>}
        {values.name && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ margin: '0 0 0.4rem', color: 'rgba(255,255,255,0.8)' }}>{pt ? `Oi Caio! Me chamo ${values.name}.` : `Hey Caio! My name is ${values.name}.`}</motion.p>}
        {values.email   && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ margin: '0 0 0.3rem' }}>{pt ? `Email: ` : `Email: `}<span style={{ color: '#fff' }}>{values.email}</span></motion.p>}
        {values.type    && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ margin: '0 0 0.3rem' }}>{pt ? `Projeto: ` : `Project: `}<span style={{ color: '#fff' }}>{values.type}</span></motion.p>}
        {values.budget  && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ margin: '0 0 0.3rem' }}>{pt ? `Orçamento: ` : `Budget: `}<span style={{ color: '#fff' }}>{values.budget}</span></motion.p>}
        {slot           && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ margin: '0 0 0.3rem' }}>{pt ? `Horário: ` : `Slot: `}<span style={{ color: '#fff' }}>{slot}</span></motion.p>}
        {values.message && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ margin: '0.5rem 0 0', color: 'rgba(255,255,255,0.75)', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '0.5rem' }}>{values.message}</motion.p>}
      </div>
    </div>
  )
}

function ChatForm({ slot, lang }: { slot: string; lang: string }) {
  const setCursor = useCursorStore(s => s.setState)
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef    = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [step,   setStep]   = useState(0)
  const [values, setValues] = useState<FormVals>(EMPTY)
  const [input,  setInput]  = useState('')
  const [sent,   setSent]   = useState(false)
  const pt      = lang === 'pt'
  const current = STEPS[step]

  // Build displayed bubbles
  const bubbles: { from: 'caio' | 'user'; text: string }[] = []
  for (let i = 0; i < step; i++) {
    bubbles.push({ from: 'caio', text: pt ? STEPS[i].qPt : STEPS[i].qEn })
    bubbles.push({ from: 'user', text: values[STEPS[i].id] })
  }
  if (!sent) bubbles.push({ from: 'caio', text: pt ? current.qPt : current.qEn })

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
  }, [bubbles.length])

  useEffect(() => {
    const t = setTimeout(() => { inputRef.current?.focus(); textareaRef.current?.focus() }, 350)
    return () => clearTimeout(t)
  }, [step])

  function doSubmit(finalVals: FormVals) {
    const lines = [
      `Oi Caio! Me chamo *${finalVals.name}*.`,
      `Email: ${finalVals.email}`,
      finalVals.type   ? `Projeto: ${finalVals.type}`     : null,
      finalVals.budget ? `Orçamento: ${finalVals.budget}` : null,
      slot             ? `Horário preferido: ${slot}`      : null,
      '', 'Mensagem:', finalVals.message,
    ].filter(Boolean).join('\n')
    window.open(`https://wa.me/${SITE.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(lines)}`, '_blank', 'noopener')
    setSent(true)
  }

  const advance = useCallback(() => {
    const val = input.trim()
    if (!val) return
    const next = { ...values, [current.id]: val }
    setValues(next)
    setInput('')
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else doSubmit(next)
  }, [input, values, current, step, slot])

  function pickOption(opt: string) {
    const next = { ...values, [current.id]: opt }
    setValues(next)
    setInput('')
    setTimeout(() => {
      if (step < STEPS.length - 1) setStep(s => s + 1)
      else doSubmit(next)
    }, 220)
  }

  const lineStyle: React.CSSProperties = {
    background: 'transparent', border: 'none', outline: 'none',
    color: '#fff', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif',
    width: '100%', caretColor: '#fff',
  }

  return (
    <section ref={ref} style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: E }}
        style={{ marginBottom: 'clamp(2rem,4vw,3.5rem)' }}>
        <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', margin: '0 0 0.65rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-block', width: 20, height: 1, background: 'rgba(255,255,255,0.15)' }} />
          {pt ? 'Formulário' : 'Get in touch'}
        </p>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(1.8rem,4.5vw,3.5rem)', letterSpacing: '-0.048em', lineHeight: 0.95, color: '#fff', margin: 0 }}>
          {pt ? 'Me conta sobre\no projeto.' : 'Tell me about\nthe project.'}
        </h2>
        {slot && (
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.28)', margin: '0.8rem 0 0', fontFamily: '"SF Mono","Fira Code",monospace' }}>
            ✓ {pt ? `Horário selecionado: ${slot}` : `Selected slot: ${slot}`}
          </p>
        )}
      </motion.div>

      <div className="chat-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2rem,5vw,5rem)', alignItems: 'start' }}>

        {/* LEFT — chat */}
        <motion.div initial={{ opacity: 0, x: -18 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, ease: E, delay: 0.1 }}>
          {/* Bubble scroll area */}
          <div ref={chatRef} style={{ maxHeight: 380, overflowY: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none' }}>
            <AnimatePresence>
              {sent ? (
                <motion.div key="sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: E }}>
                  <Bubble from="caio" text={pt ? '✓ Mensagem enviada! Te vejo no WhatsApp.' : '✓ Message sent! See you on WhatsApp.'} />
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                    <button onClick={() => { setSent(false); setStep(0); setValues(EMPTY); setInput('') }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.2s' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.22)')}>
                      <RotateCcw size={11} /> {pt ? 'Nova mensagem' : 'Send another'}
                    </button>
                  </div>
                </motion.div>
              ) : (
                bubbles.map((b, i) => <Bubble key={i} from={b.from} text={b.text} />)
              )}
            </AnimatePresence>
          </div>

          {/* Input area */}
          {!sent && (
            <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: E }}
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '0.9rem', marginTop: '0.4rem' }}>

              {current.type === 'options' ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {current.opts?.map(opt => (
                    <button key={opt} onClick={() => pickOption(opt)}
                      onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}
                      style={{ padding: '0.45rem 0.9rem', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseOver={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.1)'; el.style.color = '#fff'; el.style.borderColor = 'rgba(255,255,255,0.22)' }}
                      onMouseOut={e  => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.04)'; el.style.color = 'rgba(255,255,255,0.5)'; el.style.borderColor = 'rgba(255,255,255,0.1)' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8, alignItems: current.type === 'textarea' ? 'flex-end' : 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '0.7rem 0.9rem', transition: 'border-color 0.2s' }}
                  onFocusCapture={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)')}
                  onBlurCapture={e  => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)')}>
                  {current.type === 'textarea' ? (
                    <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)} rows={3}
                      placeholder={pt ? 'Descreva o projeto...' : 'Describe the project...'}
                      style={{ ...lineStyle, resize: 'none' }} />
                  ) : (
                    <input ref={inputRef} type={current.type} value={input} onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); advance() } }}
                      placeholder={pt ? 'Digite aqui...' : 'Type here...'}
                      style={lineStyle} autoComplete="off" />
                  )}
                  <button onClick={advance} disabled={!input.trim()}
                    onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}
                    style={{ width: 34, height: 34, borderRadius: 8, background: input.trim() ? '#fff' : 'rgba(255,255,255,0.06)', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.18s' }}>
                    <ArrowRight size={14} style={{ color: input.trim() ? '#0d0d0d' : 'rgba(255,255,255,0.2)' }} />
                  </button>
                </div>
              )}

              {step > 0 && (
                <button onClick={() => { setStep(s => s - 1); setInput('') }}
                  style={{ marginTop: '0.6rem', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.2s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.18)')}>
                  ← {pt ? 'Voltar' : 'Back'}
                </button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* RIGHT — live preview */}
        <motion.div className="preview-col" initial={{ opacity: 0, x: 18 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, ease: E, delay: 0.2 }}>
          <LivePreview values={values} slot={slot} lang={lang} />
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════
   PAGE
═══════════════════════════════════════ */
export default function ContactPage() {
  const lang = useLanguageStore(s => s.lang)
  const [slot, setSlot] = useState('')
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => { document.title = `Contato — ${SITE.name}` }, [])

  function handleSlot(s: string) {
    setSlot(s)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
  }

  return (
    <main style={{ background: '#0d0d0d', minHeight: '100vh', overflowX: 'hidden' }}>
      <TerminalSection lang={lang} />
      <AvailabilitySection onSelect={handleSlot} lang={lang} />
      <div ref={formRef}>
        <ChatForm slot={slot} lang={lang} />
      </div>
      <style>{`
        @keyframes tblink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes cpulse  { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.5)} 50%{box-shadow:0 0 0 7px rgba(34,197,94,0)} }
        @media (max-width:860px) {
          .chat-grid    { grid-template-columns: 1fr !important; }
          .preview-col  { display: none !important; }
        }
      `}</style>
    </main>
  )
}
