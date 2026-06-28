import { useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowUpRight, ArrowRight, RotateCcw, MessageCircle,
  MapPin, Zap, Clock3, CheckCircle2, Send, Github, Linkedin,
} from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'
import { SITE } from '@/lib/constants'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* ── Animated card wrapper ── */
function BentoCard({
  children, delay = 0, style = {}, className = '',
  accent,
}: {
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
  className?: string
  accent?: string
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: E, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered && accent ? accent : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 20,
        padding: 'clamp(1.25rem,3vw,1.75rem)',
        transition: 'background 0.3s, border-color 0.3s, transform 0.3s',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      className={className}
    >
      {hovered && accent && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          opacity: 0.6,
        }} />
      )}
      {children}
    </motion.div>
  )
}

/* ── Live São Paulo clock ── */
function LiveClock() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const sp = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
  void tick
  const hh = String(sp.getHours()).padStart(2, '0')
  const mm = String(sp.getMinutes()).padStart(2, '0')
  const blink = sp.getSeconds() % 2 === 0
  return (
    <span style={{ fontFamily: '"JetBrains Mono","Fira Code",monospace', letterSpacing: '0.04em' }}>
      {hh}
      <span style={{ opacity: blink ? 1 : 0.2, transition: 'opacity 0.12s' }}>:</span>
      {mm}
    </span>
  )
}

/* ── Multi-step form ── */
type StepId = 'name' | 'email' | 'type' | 'budget' | 'message'
interface Step { id: StepId; qPt: string; qEn: string; type: 'text' | 'email' | 'options' | 'textarea'; options?: string[] }

const STEPS: Step[] = [
  { id: 'name',    qPt: 'Qual é o seu nome?',               qEn: 'What is your name?',                type: 'text'    },
  { id: 'email',   qPt: 'E o seu e-mail?',                  qEn: 'And your e-mail?',                  type: 'email'   },
  { id: 'type',    qPt: 'Que tipo de projeto?',             qEn: 'What kind of project?',             type: 'options',
    options: ['Website', 'Landing Page', 'Web App', 'API / Backend', 'Outro'] },
  { id: 'budget',  qPt: 'Qual é o orçamento aproximado?',   qEn: "What's your budget range?",         type: 'options',
    options: ['até R$ 1k', 'R$ 1k–R$ 3k', 'R$ 3k–R$ 8k', 'R$ 8k–R$ 20k', '> R$ 20k'] },
  { id: 'message', qPt: 'Me conte mais sobre o projeto.',   qEn: 'Tell me more about the project.',   type: 'textarea' },
]

type FormValues = Record<StepId, string>
const EMPTY: FormValues = { name: '', email: '', type: '', budget: '', message: '' }

function ConversationalForm({ lang }: { lang: string }) {
  const setCursor = useCursorStore(s => s.setState)
  const [step,   setStep]   = useState(0)
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [sent,   setSent]   = useState(false)
  const [dir,    setDir]    = useState(1)
  const inputRef    = useRef<HTMLInputElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const id = setTimeout(() => { inputRef.current?.focus(); textareaRef.current?.focus() }, 300)
    return () => clearTimeout(id)
  }, [step])

  const current = STEPS[step]

  const advance = useCallback(() => {
    const val = values[current.id].trim()
    if (!val && current.type !== 'options') return
    if (step < STEPS.length - 1) { setDir(1); setStep(s => s + 1) }
    else submit()
  }, [values, current, step])

  function submit() {
    const { name, email, type, budget, message } = values
    const lines = [
      `Olá Caio! Me chamo *${name}*.`,
      `Email: ${email}`,
      type   ? `Projeto: ${type}`     : null,
      budget ? `Orçamento: ${budget}` : null,
      '', 'Mensagem:', message,
    ].filter(Boolean).join('\n')
    window.open(`https://wa.me/${SITE.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(lines)}`, '_blank', 'noopener')
    setSent(true)
  }

  function reset() { setDir(-1); setStep(0); setValues(EMPTY); setSent(false) }

  const inputStyle: React.CSSProperties = {
    background: 'transparent', border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    padding: '12px 0', color: '#fff', fontSize: '1rem', outline: 'none',
    width: '100%', fontFamily: 'Inter,sans-serif', caretColor: '#fff',
    transition: 'border-color 0.2s',
  }

  if (sent) return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: E }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CheckCircle2 size={20} style={{ color: '#4ade80' }} />
      </div>
      <div>
        <p style={{ fontFamily: 'Syne', fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.2rem)', letterSpacing: '-0.04em', color: '#fff', margin: '0 0 0.5rem' }}>
          {lang === 'en' ? 'Message sent!' : 'Mensagem enviada!'}
        </p>
        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.7, margin: 0 }}>
          {lang === 'en' ? 'WhatsApp opened. I usually reply within a few hours.' : 'WhatsApp aberto. Retorno em poucas horas!'}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {[
          { label: lang === 'en' ? 'View projects' : 'Ver projetos', to: '/projects', ext: false },
          { label: 'GitHub', to: SITE.github, ext: true },
          { label: 'LinkedIn', to: SITE.linkedin, ext: true },
        ].map(({ label, to, ext }) => ext ? (
          <a key={label} href={to} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>{label}</span>
            <ArrowUpRight size={13} style={{ color: 'rgba(255,255,255,0.18)' }} />
          </a>
        ) : (
          <Link key={label} to={to}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>{label}</span>
            <ArrowUpRight size={13} style={{ color: 'rgba(255,255,255,0.18)' }} />
          </Link>
        ))}
      </div>
      <button onClick={reset} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)')}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.2)')}>
        <RotateCcw size={11} /> {lang === 'en' ? 'Send another' : 'Nova mensagem'}
      </button>
    </motion.div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {STEPS.map((_, i) => (
          <motion.div key={i}
            animate={{ width: i === step ? 28 : 6, background: i < step ? 'rgba(255,255,255,0.45)' : i === step ? '#fff' : 'rgba(255,255,255,0.1)' }}
            transition={{ duration: 0.4, ease: E }}
            style={{ height: 3, borderRadius: 99 }}
          />
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.2)' }}>
          {step + 1} / {STEPS.length}
        </span>
      </div>

      {/* Ghost previous answer */}
      <AnimatePresence>
        {step > 0 && (
          <motion.div key={`prev-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.15)', margin: '0 0 3px' }}>
              {lang === 'en' ? STEPS[step - 1].qEn : STEPS[step - 1].qPt}
            </p>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.28)', fontStyle: 'italic', margin: 0 }}>
              {values[STEPS[step - 1].id] || '—'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current question */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={step} custom={dir}
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.28, ease: E }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
        >
          <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.15rem,2.5vw,1.75rem)', letterSpacing: '-0.03em', lineHeight: 1.2, color: '#fff', margin: 0 }}>
            {lang === 'en' ? current.qEn : current.qPt}
          </p>

          {(current.type === 'text' || current.type === 'email') && (
            <input ref={inputRef} type={current.type}
              value={values[current.id]}
              onChange={e => setValues(v => ({ ...v, [current.id]: e.target.value }))}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); advance() } }}
              placeholder={lang === 'en' ? 'Type here…' : 'Digite aqui…'}
              autoComplete="off" style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.4)')}
              onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.1)')}
            />
          )}

          {current.type === 'options' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {current.options?.map(opt => {
                const sel = values[current.id] === opt
                return (
                  <button key={opt}
                    onClick={() => { setValues(v => ({ ...v, [current.id]: opt })); setTimeout(() => { setDir(1); setStep(s => s + 1) }, 200) }}
                    onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}
                    style={{
                      padding: '0.5rem 1rem', borderRadius: 999,
                      border: `1px solid ${sel ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.1)'}`,
                      background: sel ? 'rgba(255,255,255,0.08)' : 'transparent',
                      color: sel ? '#fff' : 'rgba(255,255,255,0.38)',
                      fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s',
                    }}
                  >{opt}</button>
                )
              })}
            </div>
          )}

          {current.type === 'textarea' && (
            <textarea ref={textareaRef}
              value={values[current.id]}
              onChange={e => setValues(v => ({ ...v, [current.id]: e.target.value }))}
              rows={4} placeholder={lang === 'en' ? 'Describe the project…' : 'Descreva o projeto…'}
              style={{ ...inputStyle, resize: 'none', paddingTop: 12 }}
              onFocus={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.4)')}
              onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.1)')}
            />
          )}

          {current.type !== 'options' && (
            <button onClick={advance}
              disabled={!values[current.id].trim()}
              onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}
              style={{
                alignSelf: 'flex-start',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '0.75rem 1.5rem', borderRadius: 999,
                background: values[current.id].trim() ? '#fff' : 'rgba(255,255,255,0.06)',
                color: values[current.id].trim() ? '#0d0d0d' : 'rgba(255,255,255,0.2)',
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                border: 'none', cursor: values[current.id].trim() ? 'pointer' : 'not-allowed', transition: 'all 0.22s',
              }}>
              {step < STEPS.length - 1
                ? (lang === 'en' ? 'Next' : 'Próximo')
                : (lang === 'en' ? 'Send via WhatsApp' : 'Enviar pelo WhatsApp')}
              {step < STEPS.length - 1 ? <ArrowRight size={13} /> : <MessageCircle size={13} />}
            </button>
          )}
        </motion.div>
      </AnimatePresence>

      {step > 0 && (
        <button onClick={() => { setDir(-1); setStep(s => s - 1) }}
          style={{ alignSelf: 'flex-start', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.2s' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.18)')}>
          ← {lang === 'en' ? 'Back' : 'Voltar'}
        </button>
      )}
    </div>
  )
}

/* ── Social link row ── */
function SocialRow({ href, icon, label, sub, delay }: { href: string; icon: React.ReactNode; label: string; sub: string; delay: number }) {
  const setCursor = useCursorStore(s => s.setState)
  const [hov, setHov] = useState(false)
  return (
    <motion.a
      href={href}
      target={href.startsWith('mailto') ? undefined : '_blank'}
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: E, delay }}
      onMouseEnter={() => { setHov(true); setCursor('pointer') }}
      onMouseLeave={() => { setHov(false); setCursor('default') }}
      style={{
        display: 'flex', alignItems: 'center', gap: '1rem',
        padding: '0.9rem 1rem', borderRadius: 14,
        border: `1px solid ${hov ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'}`,
        background: hov ? 'rgba(255,255,255,0.03)' : 'transparent',
        textDecoration: 'none', transition: 'all 0.22s',
        transform: hov ? 'translateX(4px)' : 'translateX(0)',
      }}
    >
      <span style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s, background 0.2s', ...(hov ? { background: 'rgba(255,255,255,0.1)', color: '#fff' } : {}) }}>
        {icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: hov ? '#fff' : 'rgba(255,255,255,0.6)', transition: 'color 0.2s', lineHeight: 1.2 }}>{label}</div>
        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', fontFamily: '"JetBrains Mono",monospace', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</div>
      </div>
      <ArrowUpRight size={14} style={{ color: hov ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)', transition: 'color 0.2s', flexShrink: 0 }} />
    </motion.a>
  )
}

/* ══════════════════════════════════════════ */
export default function ContactPage() {
  const lang = useLanguageStore(s => s.lang)
  const setCursor = useCursorStore(s => s.setState)
  useEffect(() => { document.title = `Contact — ${SITE.name}` }, [])

  return (
    <main style={{ background: '#0d0d0d', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ padding: 'clamp(7rem,14vw,10rem) clamp(1.5rem,6vw,5rem) clamp(2.5rem,5vw,4rem)', position: 'relative' }}>
        <div aria-hidden style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(8rem,25vw,22rem)',
          letterSpacing: '-0.06em', color: 'rgba(255,255,255,0.018)', userSelect: 'none',
          pointerEvents: 'none', whiteSpace: 'nowrap', lineHeight: 1,
        }}>
          {lang === 'en' ? 'TALK' : 'OLÁ'}
        </div>

        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: E }} style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.1rem' }}>
            <span style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontSize: '0.57rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
              {lang === 'en' ? 'Get in touch' : 'Entre em contato'}
            </span>
          </div>

          <h1 style={{ fontFamily: 'Syne', fontWeight: 900, fontSize: 'clamp(3rem,9vw,8.5rem)', letterSpacing: '-0.055em', lineHeight: 0.88, color: '#fff', margin: '0 0 1.75rem', paddingBottom: '0.3em' }}>
            {lang === 'en' ? "Let's" : 'Vamos'}
            <br />
            <span style={{ color: 'rgba(255,255,255,0.16)' }}>{lang === 'en' ? 'build.' : 'criar.'}</span>
          </h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: E }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.03)' }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e99', flexShrink: 0, animation: 'cpulse 2.4s ease-in-out infinite' }} />
            <span style={{ fontSize: '0.63rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
              {lang === 'en' ? 'Available · Reply in less than 24h' : 'Disponível · Resposta em menos de 24h'}
            </span>
          </motion.div>
        </motion.div>
      </section>

      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, ease: E, delay: 0.15 }}
        style={{ height: 1, background: 'rgba(255,255,255,0.06)', transformOrigin: 'left' }} />

      {/* ── BODY ── */}
      <section style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,6vw,5rem) clamp(5rem,10vw,8rem)' }}>
        <div className="contact-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 'clamp(2rem,5vw,6rem)', alignItems: 'start' }}>

          {/* ══ LEFT ══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Bento mini-grid: 2×2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>

              {/* Clock */}
              <BentoCard delay={0.25} accent="rgba(147,197,253,0.4)" style={{ gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(147,197,253,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock3 size={16} style={{ color: '#93c5fd' }} />
                  </div>
                  <span style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>São Paulo · UTC−3</span>
                </div>
                <div style={{ fontFamily: '"JetBrains Mono","Fira Code",monospace', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '0.02em' }}>
                  <LiveClock />
                </div>
                <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)', margin: '0.4rem 0 0', letterSpacing: '0.04em' }}>
                  {lang === 'en' ? 'Local time right now' : 'Horário local agora'}
                </p>
              </BentoCard>

              {/* Status */}
              <BentoCard delay={0.35} accent="rgba(74,222,128,0.4)">
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(74,222,128,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <CheckCircle2 size={16} style={{ color: '#4ade80' }} />
                </div>
                <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(74,222,128,0.6)', margin: '0 0 3px' }}>Status</p>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.2 }}>
                  {lang === 'en' ? 'Available' : 'Disponível'}
                </p>
                <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.22)', margin: '0.3rem 0 0' }}>
                  {lang === 'en' ? 'for projects' : 'para projetos'}
                </p>
              </BentoCard>

              {/* Response */}
              <BentoCard delay={0.4} accent="rgba(251,191,36,0.4)">
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(251,191,36,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <Zap size={16} style={{ color: '#fbbf24' }} />
                </div>
                <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(251,191,36,0.6)', margin: '0 0 3px' }}>
                  {lang === 'en' ? 'Response' : 'Resposta'}
                </p>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.2 }}>{'< 24h'}</p>
                <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.22)', margin: '0.3rem 0 0' }}>
                  {lang === 'en' ? 'on weekdays' : 'dias úteis'}
                </p>
              </BentoCard>

              {/* Location */}
              <BentoCard delay={0.45} accent="rgba(196,181,253,0.4)" style={{ gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(196,181,253,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={16} style={{ color: '#c4b5fd' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(196,181,253,0.6)', margin: '0 0 3px' }}>
                      {lang === 'en' ? 'Location' : 'Localização'}
                    </p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', margin: 0 }}>Campinas, SP · Brasil</p>
                    <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.22)', margin: '2px 0 0' }}>
                      {lang === 'en' ? 'Remote · Hybrid available' : 'Remoto · Híbrido disponível'}
                    </p>
                  </div>
                </div>
              </BentoCard>
            </div>

            {/* Social links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', margin: '0 0 0.25rem 0.25rem' }}>
                {lang === 'en' ? 'Links' : 'Links'}
              </p>
              <SocialRow href={`mailto:${SITE.email}`} icon={<Send size={16} />} label="Email" sub={SITE.email} delay={0.5} />
              <SocialRow href={`https://wa.me/${SITE.whatsapp.replace(/\D/g,'')}`} icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              } label="WhatsApp" sub={SITE.whatsapp} delay={0.55} />
              <SocialRow href={SITE.linkedin} icon={<Linkedin size={16} />} label="LinkedIn" sub="caiodinizdev" delay={0.6} />
              <SocialRow href={SITE.github} icon={<Github size={16} />} label="GitHub" sub="caiodiniz-dev" delay={0.65} />
            </div>
          </div>

          {/* ══ RIGHT: Form card ══ */}
          <BentoCard delay={0.3} accent="rgba(255,255,255,0.15)" style={{ padding: 'clamp(1.5rem,4vw,2.5rem)' }}>
            <div style={{ marginBottom: '1.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', margin: '0 0 0.5rem' }}>
                {lang === 'en' ? '// Start a project' : '// Iniciar um projeto'}
              </p>
              <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.1rem,2vw,1.45rem)', letterSpacing: '-0.025em', color: '#fff', margin: 0 }}>
                {lang === 'en' ? 'Tell me about your idea' : 'Me conta a sua ideia'}
              </p>
            </div>
            <ConversationalForm lang={lang} />
          </BentoCard>

        </div>
      </section>

      {/* ── Footer strip ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,6vw,5rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.18)', margin: 0 }}>
          {lang === 'en' ? 'Prefer a direct e-mail?' : 'Prefere um e-mail direto?'}
        </p>
        <a href={`mailto:${SITE.email}`}
          onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseOver={e => (e.currentTarget.style.color = '#fff')}
          onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
          {SITE.email} <ArrowUpRight size={13} />
        </a>
      </div>

      <style>{`
        @keyframes cpulse {
          0%,100% { opacity:1; box-shadow:0 0 0 0 rgba(34,197,94,0.45); }
          50%      { opacity:0.7; box-shadow:0 0 0 7px rgba(34,197,94,0); }
        }
        @media (max-width: 860px) {
          .contact-body { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
