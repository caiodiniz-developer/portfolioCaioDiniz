import { useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ArrowRight, RotateCcw, MessageCircle, Mail, Github, Linkedin, Phone } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'
import { SITE } from '@/lib/constants'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* ── Live São Paulo clock ── */
function LiveClock() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const sp = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
  const hh = String(sp.getHours()).padStart(2, '0')
  const mm = String(sp.getMinutes()).padStart(2, '0')
  const ss = String(sp.getSeconds()).padStart(2, '0')
  void tick
  return (
    <span style={{ fontFamily: '"JetBrains Mono","Fira Code",monospace', letterSpacing: '0.05em' }}>
      {hh}<span style={{ opacity: sp.getSeconds() % 2 === 0 ? 1 : 0.25, transition: 'opacity 0.15s' }}>:</span>{mm}<span style={{ opacity: sp.getSeconds() % 2 === 0 ? 1 : 0.25, transition: 'opacity 0.15s' }}>:</span>{ss}
    </span>
  )
}

/* ── Multi-step form ── */
type StepId = 'name' | 'email' | 'type' | 'budget' | 'message'
interface Step { id: StepId; qPt: string; qEn: string; type: 'text' | 'email' | 'options' | 'textarea'; options?: string[] }

const STEPS: Step[] = [
  { id: 'name',    qPt: 'Qual é o seu nome?',                    qEn: 'What is your name?',                type: 'text'    },
  { id: 'email',   qPt: 'Qual é o seu e-mail?',                  qEn: 'What is your e-mail?',              type: 'email'   },
  { id: 'type',    qPt: 'Que tipo de projeto você precisa?',      qEn: 'What kind of project do you need?', type: 'options',
    options: ['Website', 'Landing Page', 'Web App', 'API / Backend', 'Outro / Other'] },
  { id: 'budget',  qPt: 'Qual é o seu orçamento aproximado?',    qEn: 'What is your approximate budget?',  type: 'options',
    options: ['R$ 500', 'R$ 1k – R$ 2k', 'R$ 2k – R$ 5k', 'R$ 5k – R$ 15k', '> R$ 15k'] },
  { id: 'message', qPt: 'Me conte sobre o projeto.',              qEn: 'Tell me about your project.',       type: 'textarea' },
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

  const current  = STEPS[step]

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
      ``, `Mensagem:`, message,
    ].filter(Boolean).join('\n')
    window.open(`https://wa.me/${SITE.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(lines)}`, '_blank', 'noopener')
    setSent(true)
  }

  function reset() { setDir(-1); setStep(0); setValues(EMPTY); setSent(false) }

  const lineInput: React.CSSProperties = {
    background: 'transparent', border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.12)',
    padding: '12px 0', color: '#fff', fontSize: '1rem', outline: 'none',
    width: '100%', fontFamily: 'Inter,sans-serif', caretColor: '#fff',
    transition: 'border-color 0.2s',
  }

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div key="sent"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: E }}
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          <div>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.4rem' }}>✓</span>
            </div>
            <p style={{ fontFamily: 'Syne', fontWeight: 900, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', letterSpacing: '-0.04em', lineHeight: 1, color: '#fff', margin: '0 0 0.75rem' }}>
              {lang === 'en' ? 'Talk soon.' : 'Até breve.'}
            </p>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.32)', lineHeight: 1.75, maxWidth: 380, margin: 0 }}>
              {lang === 'en'
                ? 'WhatsApp should have opened. I usually respond within a few hours.'
                : 'WhatsApp deve ter aberto. Retorno em poucas horas!'}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {[
              { label: lang === 'en' ? 'View projects' : 'Ver projetos', to: '/projects', external: false },
              { label: 'GitHub', to: SITE.github, external: true },
              { label: 'LinkedIn', to: SITE.linkedin, external: true },
            ].map(({ label, to, external }) => (
              external ? (
                <a key={label} href={to} target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.9rem 0', borderBottom:'1px solid rgba(255,255,255,0.07)', textDecoration:'none' }}>
                  <span style={{ fontSize:'0.82rem', fontWeight:600, color:'rgba(255,255,255,0.4)', transition:'color 0.2s' }}
                    onMouseEnter={e=>(e.currentTarget.style.color='#fff')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.4)')}>{label}</span>
                  <ArrowUpRight size={13} style={{ color:'rgba(255,255,255,0.18)' }} />
                </a>
              ) : (
                <Link key={label} to={to}
                  style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.9rem 0', borderBottom:'1px solid rgba(255,255,255,0.07)', textDecoration:'none' }}>
                  <span style={{ fontSize:'0.82rem', fontWeight:600, color:'rgba(255,255,255,0.4)', transition:'color 0.2s' }}
                    onMouseEnter={e=>(e.currentTarget.style.color='#fff')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.4)')}>{label}</span>
                  <ArrowUpRight size={13} style={{ color:'rgba(255,255,255,0.18)' }} />
                </Link>
              )
            ))}
          </div>
          <button onClick={reset}
            style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.2)', background:'none', border:'none', cursor:'pointer', padding:0, transition:'color 0.2s' }}
            onMouseEnter={e=>((e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.5)')}
            onMouseLeave={e=>((e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.2)')}>
            <RotateCcw size={11} />
            {lang === 'en' ? 'Send another' : 'Enviar outra mensagem'}
          </button>
        </motion.div>
      ) : (
        <motion.div key="form" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>

          {/* Step dots */}
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
            {STEPS.map((_,i) => (
              <div key={i} style={{
                height: 3, borderRadius: 99,
                width: i === step ? 24 : 8,
                background: i < step ? 'rgba(255,255,255,0.5)' : i === step ? '#fff' : 'rgba(255,255,255,0.1)',
                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
              }} />
            ))}
            <span style={{ marginLeft: 'auto', fontSize:'0.55rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.2)' }}>
              {step + 1}/{STEPS.length}
            </span>
          </div>

          {/* Previous answer ghost */}
          <AnimatePresence>
            {step > 0 && (
              <motion.div key={`prev-${step}`} initial={{ opacity:0 }} animate={{ opacity:1 }}
                style={{ display:'flex', flexDirection:'column', gap:3 }}>
                <p style={{ fontSize:'0.55rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.15)', margin:0 }}>
                  {lang==='en' ? STEPS[step-1].qEn : STEPS[step-1].qPt}
                </p>
                <p style={{ fontSize:'0.88rem', color:'rgba(255,255,255,0.28)', fontStyle:'italic', margin:0 }}>
                  {values[STEPS[step-1].id] || '—'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current step */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={step} custom={dir}
              initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }}
              transition={{ duration:0.3, ease:E }}
              style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}
            >
              <p style={{ fontFamily:'Syne', fontWeight:800, fontSize:'clamp(1.3rem,2.8vw,2rem)', letterSpacing:'-0.03em', lineHeight:1.15, color:'#fff', margin:0 }}>
                {lang==='en' ? current.qEn : current.qPt}
              </p>

              {(current.type === 'text' || current.type === 'email') && (
                <input ref={inputRef} type={current.type}
                  value={values[current.id]}
                  onChange={e => setValues(v => ({...v,[current.id]:e.target.value}))}
                  onKeyDown={e => { if(e.key==='Enter'){e.preventDefault();advance()} }}
                  placeholder={lang==='en' ? 'Type here…' : 'Digite aqui…'}
                  autoComplete="off"
                  style={lineInput}
                  onFocus={e=>(e.currentTarget.style.borderBottomColor='rgba(255,255,255,0.4)')}
                  onBlur={e=>(e.currentTarget.style.borderBottomColor='rgba(255,255,255,0.12)')}
                />
              )}

              {current.type === 'options' && (
                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                  {current.options?.map(opt => {
                    const sel = values[current.id] === opt
                    return (
                      <button key={opt}
                        onClick={() => { setValues(v=>({...v,[current.id]:opt})); setTimeout(()=>{setDir(1);setStep(s=>s+1)},200) }}
                        onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}
                        style={{
                          padding:'0.55rem 1.1rem', borderRadius:999,
                          border:`1px solid ${sel?'rgba(255,255,255,0.5)':'rgba(255,255,255,0.1)'}`,
                          background: sel?'rgba(255,255,255,0.08)':'transparent',
                          color: sel?'#fff':'rgba(255,255,255,0.4)',
                          fontSize:'0.78rem', fontWeight:600, cursor:'pointer', transition:'all 0.18s',
                        }}
                      >{opt}</button>
                    )
                  })}
                </div>
              )}

              {current.type === 'textarea' && (
                <textarea ref={textareaRef}
                  value={values[current.id]}
                  onChange={e=>setValues(v=>({...v,[current.id]:e.target.value}))}
                  rows={4}
                  placeholder={lang==='en' ? 'Tell me about the project…' : 'Fale sobre o projeto…'}
                  style={{...lineInput, resize:'none', paddingTop:12}}
                  onFocus={e=>(e.currentTarget.style.borderBottomColor='rgba(255,255,255,0.4)')}
                  onBlur={e=>(e.currentTarget.style.borderBottomColor='rgba(255,255,255,0.12)')}
                />
              )}

              {current.type !== 'options' && (
                <div style={{ display:'flex', alignItems:'center', gap:'1rem', paddingTop:'0.25rem', flexWrap:'wrap' }}>
                  <button onClick={advance}
                    disabled={!values[current.id].trim()}
                    onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}
                    style={{
                      display:'inline-flex', alignItems:'center', gap:8, padding:'0.8rem 1.6rem', borderRadius:999,
                      background: values[current.id].trim() ? '#fff' : 'rgba(255,255,255,0.06)',
                      color: values[current.id].trim() ? '#0d0d0d' : 'rgba(255,255,255,0.2)',
                      fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase',
                      border:'none', cursor: values[current.id].trim() ? 'pointer' : 'not-allowed', transition:'all 0.25s',
                    }}>
                    {step < STEPS.length - 1
                      ? (lang==='en' ? 'Continue' : 'Continuar')
                      : (lang==='en' ? 'Send via WhatsApp' : 'Enviar pelo WhatsApp')}
                    {step < STEPS.length - 1 ? <ArrowRight size={13}/> : <MessageCircle size={13}/>}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step > 0 && (
            <button onClick={() => {setDir(-1);setStep(s=>s-1)}}
              style={{ alignSelf:'flex-start', fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.18)', background:'none', border:'none', cursor:'pointer', padding:0, transition:'color 0.2s' }}
              onMouseEnter={e=>((e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.5)')}
              onMouseLeave={e=>((e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.18)')}>
              ← {lang === 'en' ? 'Back' : 'Voltar'}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── Contact Page ── */
export default function ContactPage() {
  const lang      = useLanguageStore(s => s.lang)
  const setCursor = useCursorStore(s => s.setState)

  useEffect(() => { document.title = `Contact — ${SITE.name}` }, [])

  const LINKS = [
    { label: 'Email',    icon: <Mail size={15}/>,     href: `mailto:${SITE.email}`,                               sub: SITE.email,         color: '#4ade80' },
    { label: 'WhatsApp', icon: <Phone size={15}/>,    href: `https://wa.me/${SITE.whatsapp.replace(/\D/g,'')}`,   sub: SITE.whatsapp,      color: '#4ade80' },
    { label: 'LinkedIn', icon: <Linkedin size={15}/>, href: SITE.linkedin,                                         sub: 'caiodinizdev',     color: '#60a5fa' },
    { label: 'GitHub',   icon: <Github size={15}/>,   href: SITE.github,                                           sub: 'caiodiniz-dev',    color: 'rgba(255,255,255,0.5)' },
  ]

  return (
    <main style={{ background: '#0d0d0d', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', paddingTop: 'clamp(7rem,14vw,11rem)', paddingBottom: 'clamp(3rem,6vw,5rem)', padding: 'clamp(7rem,14vw,11rem) clamp(1.5rem,6vw,5rem) clamp(3rem,6vw,5rem)' }}>
        {/* Big decorative text behind */}
        <div aria-hidden style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          fontFamily: 'Syne, sans-serif', fontWeight: 900,
          fontSize: 'clamp(6rem,22vw,20rem)',
          letterSpacing: '-0.06em', lineHeight: 1,
          color: 'rgba(255,255,255,0.02)',
          userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>
          {lang === 'en' ? 'TALK' : 'OLÁ'}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: E }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {/* Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'clamp(1rem,2vw,1.5rem)' }}>
            <span style={{ display: 'inline-block', width: 22, height: 1, background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
              {lang === 'en' ? 'Get in touch' : 'Entre em contato'}
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'Syne', fontWeight: 900,
            fontSize: 'clamp(3rem,9vw,8.5rem)',
            letterSpacing: '-0.055em', lineHeight: 0.88,
            color: '#fff', margin: '0 0 clamp(1.5rem,3vw,2.5rem)',
            paddingBottom: '0.3em',
          }}>
            {lang === 'en' ? "Let's" : 'Vamos'}
            <br />
            <span style={{ color: 'rgba(255,255,255,0.18)' }}>{lang === 'en' ? 'build.' : 'criar.'}</span>
          </h1>

          {/* Availability pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e88', animation: 'cpulse 2.4s ease-in-out infinite', flexShrink: 0 }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em' }}>
              {lang === 'en' ? 'Available for projects · Response < 24h' : 'Disponível · Resposta em menos de 24h'}
            </span>
          </div>
        </motion.div>
      </section>

      {/* ── DIVIDER ── */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: E, delay: 0.2 }}
        style={{ height: 1, background: 'rgba(255,255,255,0.07)', transformOrigin: 'left' }}
      />

      {/* ── BODY ── */}
      <section style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,6vw,5rem) clamp(5rem,10vw,8rem)' }}>
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 'clamp(3rem,7vw,8rem)', alignItems: 'start' }}>

          {/* ── LEFT ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: E, delay: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
          >
            {/* Clock card */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, overflow: 'hidden',
            }}>
              {/* macOS bar */}
              <div style={{ padding: '0.7rem 1.1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {['rgba(255,97,86,0.7)', 'rgba(255,189,68,0.5)', 'rgba(40,200,64,0.6)'].map((c, i) => (
                  <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
                ))}
                <span style={{ marginLeft: 'auto', fontSize: '0.52rem', color: 'rgba(255,255,255,0.15)', fontFamily: '"JetBrains Mono",monospace', letterSpacing: '0.08em' }}>
                  status.json
                </span>
              </div>

              <div style={{ padding: '1.5rem' }}>
                {/* Time */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6, fontFamily: '"JetBrains Mono",monospace' }}>
                    São Paulo · UTC−3
                  </div>
                  <div style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.02em', lineHeight: 1, fontFamily: '"JetBrains Mono",monospace' }}>
                    <LiveClock />
                  </div>
                </div>

                {/* Key-value */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.68rem', fontFamily: '"JetBrains Mono",monospace' }}>
                  {([
                    { k: 'status',   v: lang === 'en' ? '"Available"' : '"Disponível"',              c: 'rgba(74,222,128,0.9)' },
                    { k: 'location', v: '"Campinas, SP · Brasil"',                                    c: 'rgba(147,197,253,0.8)' },
                    { k: 'response', v: lang === 'en' ? '"< 24h"' : '"Menos de 24h"',                c: 'rgba(251,191,36,0.8)' },
                    { k: 'mode',     v: lang === 'en' ? '"Remote / Hybrid"' : '"Remoto / Híbrido"',  c: 'rgba(196,181,253,0.8)' },
                  ] as { k: string; v: string; c: string }[]).map(({ k, v, c }) => (
                    <div key={k} style={{ display: 'flex', gap: '0.75rem', lineHeight: 1.6, minWidth: 0 }}>
                      <span style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>{k}:</span>
                      <span style={{ color: c, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social links */}
            <div>
              <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', marginBottom: '0.75rem', margin: '0 0 0.75rem' }}>
                {lang === 'en' ? 'Links & Contacts' : 'Links e Contatos'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {LINKS.map(({ label, icon, href, sub, color }) => (
                  <a key={label} href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    onMouseEnter={() => setCursor('pointer')}
                    onMouseLeave={() => setCursor('default')}
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', transition: 'opacity 0.2s' }}
                    onMouseOver={e => (e.currentTarget.style.opacity = '0.7')}
                    onMouseOut={e => (e.currentTarget.style.opacity = '1')}
                  >
                    <span style={{ color, flexShrink: 0 }}>{icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>{label}</div>
                      <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.2)', fontFamily: '"JetBrains Mono",monospace', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</div>
                    </div>
                    <ArrowUpRight size={13} style={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quote */}
            <div style={{ borderLeft: '2px solid rgba(255,255,255,0.08)', paddingLeft: '1.25rem' }}>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.22)', lineHeight: 1.75, fontStyle: 'italic', margin: 0 }}>
                {lang === 'en'
                  ? '"I build not just websites, but experiences that convert visitors into clients."'
                  : '"Construo não apenas sites, mas experiências que transformam visitantes em clientes."'}
              </p>
            </div>
          </motion.div>

          {/* ── RIGHT: Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: E, delay: 0.45 }}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: 'clamp(1.5rem,4vw,2.5rem)',
            }}
          >
            {/* Form header */}
            <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', margin: '0 0 0.5rem' }}>
                {lang === 'en' ? '// Start a project' : '// Iniciar um projeto'}
              </p>
              <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.1rem,2vw,1.4rem)', letterSpacing: '-0.025em', color: '#fff', margin: 0 }}>
                {lang === 'en' ? 'Tell me about your idea' : 'Me conta sobre a sua ideia'}
              </p>
            </div>

            <ConversationalForm lang={lang} />
          </motion.div>

        </div>
      </section>

      {/* ── BOTTOM CTA STRIP ── */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(2rem,4vw,3rem) clamp(1.5rem,6vw,5rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.18)', margin: 0, letterSpacing: '0.04em' }}>
          {lang === 'en' ? 'Prefer a direct message?' : 'Prefere uma mensagem direta?'}
        </p>
        <a
          href={`mailto:${SITE.email}`}
          onMouseEnter={() => setCursor('pointer')}
          onMouseLeave={() => setCursor('default')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', fontWeight: 600, color: '#fff', textDecoration: 'none', letterSpacing: '0.02em', transition: 'opacity 0.2s' }}
          onMouseOver={e => (e.currentTarget.style.opacity = '0.6')}
          onMouseOut={e => (e.currentTarget.style.opacity = '1')}
        >
          {SITE.email} <ArrowUpRight size={14} />
        </a>
      </section>

      <style>{`
        @keyframes cpulse {
          0%,100% { opacity:1; box-shadow:0 0 0 0 rgba(34,197,94,0.5); }
          50%      { opacity:0.7; box-shadow:0 0 0 6px rgba(34,197,94,0); }
        }
        @media (max-width: 860px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
