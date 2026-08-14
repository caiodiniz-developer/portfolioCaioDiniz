import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowRight, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'
import { SITE } from '@/lib/constants'
import RouteCards from '@/components/ui/RouteCards'

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
  { kind: 'kv',    text: '  whatsapp    +55 19 99473-7425' },
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
  { kind: 'kv',    text: '  whatsapp    +55 19 99473-7425' },
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
    <section style={{ padding: 'clamp(5rem,8vw,7rem) clamp(1.5rem,5vw,4rem)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ width: '100%', maxWidth: 700, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.85, ease: E }}
          style={{ background: 'rgba(255,255,255,0.026)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 48px 96px rgba(0,0,0,0.55)' }}>
          <div style={{ padding: '0.75rem 1.1rem', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <button onClick={skipAll} style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e', display: 'block' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f', display: 'block' }} />
            <span style={{ marginLeft: 'auto', fontFamily: '"SF Mono","Fira Code",monospace', fontSize: '0.56rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
              bash — caio@portfolio — 80×24
            </span>
          </div>
          <div style={{ padding: 'clamp(1.2rem,3vw,1.8rem)', fontFamily: '"SF Mono","Fira Code","Cascadia Code",monospace', fontSize: 'clamp(0.72rem,1.35vw,0.86rem)', lineHeight: 1.88, minHeight: 340 }}>
            <div style={{ display: 'flex', gap: '0.55em', marginBottom: 2 }}>
              <span style={{ color: '#4ade80', userSelect: 'none' }}>caio@portfolio</span>
              <span style={{ color: 'rgba(255,255,255,0.25)', userSelect: 'none' }}>:~$</span>
              <span style={{ color: '#fff' }}>
                {typingCmd ? LINES[0].text.slice(0, charIdx) : shown.some(l => l.kind === 'cmd') ? 'caio --contact' : ''}
                {typingCmd && <span style={{ display: 'inline-block', width: 7, height: '1em', background: '#fff', verticalAlign: 'text-bottom', animation: 'tblink .9s step-end infinite' }} />}
              </span>
            </div>
            {shown.filter(l => l.kind !== 'cmd').map((line, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.12 }}
                style={{ color: lineColor(line.kind), whiteSpace: 'pre', minHeight: line.kind === 'blank' ? '0.4em' : undefined }}>
                {line.text}
              </motion.div>
            ))}
            {typingOther && curLine && (
              <div style={{ color: lineColor(curLine.kind), whiteSpace: 'pre' }}>
                {curLine.text.slice(0, charIdx)}
                <span style={{ display: 'inline-block', width: 7, height: '1em', background: 'currentColor', opacity: 0.7, verticalAlign: 'text-bottom', animation: 'tblink .9s step-end infinite' }} />
              </div>
            )}
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
   CALENDAR AVAILABILITY
═══════════════════════════════════════ */
const MONTH_NAMES_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const MONTH_NAMES_EN = ['January','February','March','April','May','June','July','August','September','October','November','December']
const WDAYS_PT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
const WDAYS_EN = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const TIME_SLOTS = ['09:00','10:00','11:00','14:00','15:00','16:00','17:00']

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
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const clock  = useClock()
  const setCursor = useCursorStore(s => s.setState)
  const pt = lang === 'pt'

  const today = new Date()
  const [viewDate,     setViewDate]     = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDay,  setSelectedDay]  = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [hoveredDay,   setHoveredDay]   = useState<number | null>(null)
  const [hoveredTime,  setHoveredTime]  = useState<string | null>(null)

  const year  = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDow    = new Date(year, month, 1).getDay() // 0=Sun

  // Build grid: fill leading empty cells, then days, pad to multiple of 7
  const cells: Array<number | null> = Array(firstDow).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const getDoW = (d: number) => new Date(year, month, d).getDay()
  const isWeekend = (d: number) => { const dow = getDoW(d); return dow === 0 || dow === 6 }
  const isPast    = (d: number) => {
    const date = new Date(year, month, d)
    date.setHours(23, 59, 59)
    return date < today
  }
  const isToday   = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  const isAvail   = (d: number) => !isWeekend(d) && !isPast(d)

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1))
    setSelectedDay(null); setSelectedTime(null)
  }
  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1))
    setSelectedDay(null); setSelectedTime(null)
  }

  function handleDayClick(d: number) {
    if (!isAvail(d)) return
    if (d === selectedDay) { setSelectedDay(null); setSelectedTime(null); return }
    setSelectedDay(d)
    setSelectedTime(null)
  }

  function handleTimeClick(time: string) {
    if (!selectedDay) return
    setSelectedTime(time)
    const date   = new Date(year, month, selectedDay)
    const dowPt  = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'][date.getDay()]
    const dowEn  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][date.getDay()]
    const label  = pt
      ? `${dowPt}, ${selectedDay} de ${MONTH_NAMES_PT[month].toLowerCase()} — ${time}`
      : `${dowEn}, ${MONTH_NAMES_EN[month]} ${selectedDay} — ${time}`
    onSelect(label)
  }

  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  const wdays = pt ? WDAYS_PT : WDAYS_EN

  return (
    <section ref={ref} style={{ padding: 'clamp(5rem,9vw,8rem) clamp(1.5rem,5vw,4rem)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: E }}
        style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(2rem,4vw,3rem)' }}
      >
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', margin: '0 0 0.65rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 20, height: 1, background: 'rgba(255,255,255,0.15)' }} />
              {pt ? 'Disponibilidade' : 'Availability'}
            </p>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(1.8rem,4.5vw,3.5rem)', letterSpacing: '-0.048em', lineHeight: 0.95, color: '#fff', margin: 0 }}>
              {pt ? 'Quando quer\nconversar?' : 'When would you\nlike to talk?'}
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', margin: '0 0 5px' }}>
              {pt ? 'Horário em Campinas, SP' : 'Campinas, SP time'}
            </p>
            <div style={{ fontFamily: '"SF Mono","Fira Code",monospace', fontSize: 'clamp(1.1rem,2.2vw,1.6rem)', fontWeight: 700, color: '#fff', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 9, justifyContent: 'flex-end' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e80', flexShrink: 0, animation: 'cpulse 2.2s ease-in-out infinite' }} />
              {clock}
            </div>
          </div>
        </div>

        {/* Calendar card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: E, delay: 0.12 }}
          style={{ background: 'rgba(255,255,255,0.026)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}
        >
          {/* Month navigation bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.4rem', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
            <button onClick={prevMonth} onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}
              style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s' }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)' }}>
              <ChevronLeft size={15} />
            </button>

            <AnimatePresence mode="wait">
              <motion.div key={`${year}-${month}`}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: E }}
                style={{ textAlign: 'center' }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(0.9rem,2vw,1.15rem)', letterSpacing: '-0.03em', color: '#fff' }}>
                  {pt ? MONTH_NAMES_PT[month] : MONTH_NAMES_EN[month]}
                </span>
                <span style={{ marginLeft: 8, fontFamily: '"SF Mono",monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>
                  {year}
                </span>
              </motion.div>
            </AnimatePresence>

            <button onClick={nextMonth} onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}
              style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s' }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)' }}>
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0.8rem 1rem 0.4rem', gap: 0 }}>
            {wdays.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', paddingBottom: '0.5rem' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <AnimatePresence mode="wait">
            <motion.div key={`${year}-${month}`}
              initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.28, ease: E }}
              style={{ padding: '0 1rem 1.2rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {weeks.map((week, wi) => (
                <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                  {week.map((d, di) => {
                    if (!d) return <div key={di} />
                    const avail   = isAvail(d)
                    const today_  = isToday(d)
                    const sel     = selectedDay === d
                    const hov     = hoveredDay === d
                    return (
                      <motion.button
                        key={di}
                        onClick={() => handleDayClick(d)}
                        onMouseEnter={() => { if (avail) { setHoveredDay(d); setCursor('pointer') } }}
                        onMouseLeave={() => { setHoveredDay(null); setCursor('default') }}
                        disabled={!avail}
                        whileHover={avail ? { scale: 1.08 } : {}}
                        whileTap={avail ? { scale: 0.96 } : {}}
                        transition={{ duration: 0.15 }}
                        style={{
                          height: 44, borderRadius: 10, border: `1px solid ${sel ? 'rgba(255,255,255,0.55)' : today_ ? 'rgba(255,255,255,0.35)' : avail ? hov ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.06)' : 'transparent'}`,
                          background: sel ? '#fff' : today_ ? 'rgba(255,255,255,0.08)' : avail && hov ? 'rgba(255,255,255,0.07)' : 'transparent',
                          cursor: avail ? 'pointer' : 'default',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
                          transition: 'background 0.18s, border-color 0.18s',
                          boxShadow: sel ? '0 8px 24px rgba(255,255,255,0.18)' : 'none',
                        }}
                      >
                        <span style={{ fontSize: '0.78rem', fontWeight: sel ? 800 : today_ ? 700 : avail ? 600 : 400, color: sel ? '#0d0d0d' : today_ ? '#fff' : avail ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.15)', lineHeight: 1, transition: 'color 0.18s' }}>
                          {d}
                        </span>
                        {avail && !sel && (
                          <span style={{ width: 4, height: 4, borderRadius: '50%', background: today_ ? '#22c55e' : 'rgba(255,255,255,0.25)', transition: 'background 0.18s' }} />
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Time slots — shown when day selected */}
          <AnimatePresence>
            {selectedDay && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: E }}
                style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div style={{ padding: '1.2rem 1.4rem 1.4rem' }}>
                  <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '0.85rem' }}>
                    {pt
                      ? `Horários disponíveis — ${selectedDay} de ${MONTH_NAMES_PT[month].slice(0, 3).toLowerCase()}`
                      : `Available times — ${MONTH_NAMES_EN[month].slice(0, 3)} ${selectedDay}`}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {TIME_SLOTS.map(time => {
                      const isSel = selectedTime === time
                      const isHov = hoveredTime === time
                      return (
                        <motion.button
                          key={time}
                          onClick={() => handleTimeClick(time)}
                          onMouseEnter={() => { setHoveredTime(time); setCursor('pointer') }}
                          onMouseLeave={() => { setHoveredTime(null); setCursor('default') }}
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                          style={{
                            padding: '0.5rem 1rem', borderRadius: 8,
                            border: `1px solid ${isSel ? '#22c55e' : isHov ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.1)'}`,
                            background: isSel ? 'rgba(34,197,94,0.12)' : isHov ? 'rgba(255,255,255,0.07)' : 'transparent',
                            color: isSel ? '#22c55e' : isHov ? '#fff' : 'rgba(255,255,255,0.45)',
                            fontFamily: '"SF Mono","Fira Code",monospace', fontSize: '0.76rem', fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.18s',
                            boxShadow: isSel ? '0 4px 16px rgba(34,197,94,0.2)' : 'none',
                          }}
                        >
                          {time}
                          {isSel && <span style={{ marginLeft: 6, fontSize: '0.6rem' }}>✓</span>}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Selected summary */}
        <AnimatePresence>
          {selectedTime && selectedDay && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: E }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.75rem 1.1rem', borderRadius: 10, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e60', flexShrink: 0, animation: 'cpulse 2.2s infinite' }} />
              <span style={{ fontSize: '0.72rem', color: '#4ade80', fontFamily: '"SF Mono","Fira Code",monospace', fontWeight: 600 }}>
                {pt ? 'Horário selecionado:' : 'Selected slot:'} <span style={{ color: '#fff' }}>{selectedDay} {pt ? MONTH_NAMES_PT[month] : MONTH_NAMES_EN[month]}, {selectedTime}</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <p style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em', margin: 0 }}>
          {pt ? '● disponível — clique para selecionar e preencher o formulário abaixo' : '● available — click to select and pre-fill the form below'}
        </p>
      </motion.div>
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
        <img src="/assets/minha-foto-1.png" alt="Caio"
          style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, marginRight: 8, alignSelf: 'flex-end', border: '1px solid rgba(255,255,255,0.12)' }} />
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
    const t = setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true })
      textareaRef.current?.focus({ preventScroll: true })
    }, 350)
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
    <section ref={ref} style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
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
        <motion.div initial={{ opacity: 0, x: -18 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, ease: E, delay: 0.1 }}>
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

        <motion.div className="preview-col" initial={{ opacity: 0, x: 18 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, ease: E, delay: 0.2 }}>
          <LivePreview values={values} slot={slot} lang={lang} />
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════
   PAGE  — new order: Calendar → Form → Terminal
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
      <AvailabilitySection onSelect={handleSlot} lang={lang} />
      <div ref={formRef}>
        <ChatForm slot={slot} lang={lang} />
      </div>
      <TerminalSection lang={lang} />
      {/* A visitor on the contact page is evaluating whether to hire — the CV
          is the single most likely thing they still need. */}
      <RouteCards
        show={['cv', 'guestbook']}
        headingPt="Antes de decidir"
        headingEn="Before you decide"
      />
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
