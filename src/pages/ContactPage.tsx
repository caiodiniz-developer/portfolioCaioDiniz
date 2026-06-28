import { useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ArrowRight, RotateCcw, MessageCircle } from 'lucide-react'
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
  void tick // trigger re-render
  return (
    <span style={{ fontFamily: '"JetBrains Mono","Fira Code",monospace', letterSpacing: '0.05em' }}>
      {hh}<span style={{ opacity: sp.getSeconds() % 2 === 0 ? 1 : 0.3, transition: 'opacity 0.1s' }}>:</span>{mm}<span style={{ opacity: sp.getSeconds() % 2 === 0 ? 1 : 0.3, transition: 'opacity 0.1s' }}>:</span>{ss}
    </span>
  )
}

/* ── Multi-step form ── */
type StepId = 'name' | 'email' | 'type' | 'budget' | 'message'
interface Step { id: StepId; qPt: string; qEn: string; type: 'text' | 'email' | 'options' | 'textarea'; options?: string[] }

const STEPS: Step[] = [
  { id: 'name',    qPt: 'Qual é o seu nome?',                    qEn: 'What is your name?',               type: 'text'     },
  { id: 'email',   qPt: 'Qual é o seu e-mail?',                  qEn: 'What is your e-mail?',             type: 'email'    },
  { id: 'type',    qPt: 'Que tipo de projeto você precisa?',      qEn: 'What kind of project do you need?',type: 'options',
    options: ['Website', 'Landing Page', 'Web App', 'API / Backend', 'Outro / Other'] },
  { id: 'budget',  qPt: 'Qual é o seu orçamento aproximado?',    qEn: 'What is your approximate budget?', type: 'options',
    options: ['R$ 500', 'R$ 1k', 'R$ 2k', 'R$ 2k – R$ 5k', 'R$ 5k – R$ 15k', '> R$ 15k'] },
  { id: 'message', qPt: 'Me conte sobre o projeto.',             qEn: 'Tell me about your project.',      type: 'textarea' },
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
  const progress = ((step) / STEPS.length) * 100

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
      type    ? `Projeto: ${type}`     : null,
      budget  ? `Orçamento: ${budget}` : null,
      ``, `Mensagem:`, message,
    ].filter(Boolean).join('\n')
    window.open(`https://wa.me/${SITE.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(lines)}`, '_blank', 'noopener')
    setSent(true)
  }

  function reset() { setDir(-1); setStep(0); setValues(EMPTY); setSent(false) }

  const lineInput: React.CSSProperties = {
    background: 'transparent', border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.14)',
    padding: '10px 0', color: '#fff', fontSize: '1rem', outline: 'none',
    width: '100%', fontFamily: 'Inter,sans-serif', caretColor: '#fff', transition: 'border-color 0.2s',
  }

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        /* ── Success ── */
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: E }}
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>
              {lang === 'en' ? '// message sent' : '// mensagem enviada'}
            </span>
            <p style={{ fontFamily: 'Syne', fontWeight: 900, fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', letterSpacing: '-0.04em', lineHeight: 1, color: '#fff' }}>
              {lang === 'en' ? 'Talk soon.' : 'Até breve.'}
            </p>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.32)', lineHeight: 1.7, maxWidth: 380 }}>
              {lang === 'en'
                ? 'WhatsApp should have opened. I usually respond within a few hours.'
                : 'Seu WhatsApp deve ter aberto. Retorno em breve!'}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { label: lang === 'en' ? 'View projects' : 'Ver projetos', to: '/projects', external: false },
              { label: 'GitHub', to: SITE.github, external: true },
              { label: 'LinkedIn', to: SITE.linkedin, external: true },
            ].map(({ label, to, external }) => (
              external ? (
                <a key={label} href={to} target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.9rem 0', borderBottom:'1px solid rgba(255,255,255,0.06)', textDecoration:'none' }}>
                  <span style={{ fontSize:'0.8rem', fontWeight:600, color:'rgba(255,255,255,0.4)', transition:'color 0.2s' }}
                    onMouseEnter={e=>(e.currentTarget.style.color='#fff')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.4)')}>{label}</span>
                  <ArrowUpRight size={13} style={{ color:'rgba(255,255,255,0.18)' }} />
                </a>
              ) : (
                <Link key={label} to={to}
                  style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.9rem 0', borderBottom:'1px solid rgba(255,255,255,0.06)', textDecoration:'none' }}>
                  <span style={{ fontSize:'0.8rem', fontWeight:600, color:'rgba(255,255,255,0.4)', transition:'color 0.2s' }}
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
            {lang === 'en' ? 'Send another message' : 'Enviar outra mensagem'}
          </button>
        </motion.div>

      ) : (
        /* ── Form ── */
        <motion.div key="form" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>

          {/* Progress */}
          <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:'0.56rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.2)' }}>
                {lang === 'en' ? `Step ${step+1} of ${STEPS.length}` : `Etapa ${step+1} de ${STEPS.length}`}
              </span>
              <div style={{ display:'flex', gap:4 }}>
                {STEPS.map((_,i) => (
                  <div key={i} style={{ width: i===step?18:5, height:5, borderRadius:99, background: i<step?'rgba(255,255,255,0.5)':i===step?'#fff':'rgba(255,255,255,0.1)', transition:'all 0.4s cubic-bezier(0.16,1,0.3,1)' }} />
                ))}
              </div>
            </div>
            <div style={{ height:1, background:'rgba(255,255,255,0.07)', borderRadius:1, overflow:'hidden' }}>
              <motion.div animate={{ width:`${progress+(100/STEPS.length)}%` }} transition={{ duration:0.5, ease:E }}
                style={{ height:'100%', background:'rgba(255,255,255,0.4)', borderRadius:1 }} />
            </div>
          </div>

          {/* Previous answer ghost */}
          <AnimatePresence>
            {step > 0 && (
              <motion.div key={`prev-${step}`} initial={{ opacity:0 }} animate={{ opacity:1 }}
                style={{ display:'flex', flexDirection:'column', gap:2 }}>
                <p style={{ fontSize:'0.56rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.15)' }}>
                  {lang==='en' ? STEPS[step-1].qEn : STEPS[step-1].qPt}
                </p>
                <p style={{ fontSize:'0.88rem', color:'rgba(255,255,255,0.28)', fontStyle:'italic' }}>
                  {values[STEPS[step-1].id] || '—'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current step */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              initial={{ opacity:0, y:24 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-16 }}
              transition={{ duration:0.3, ease:E }}
              style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}
            >
              <p style={{ fontFamily:'Syne', fontWeight:800, fontSize:'clamp(1.25rem,2.8vw,1.9rem)', letterSpacing:'-0.03em', lineHeight:1.15, color:'#fff', margin:0 }}>
                {lang==='en' ? current.qEn : current.qPt}
              </p>

              {/* Text / email */}
              {(current.type === 'text' || current.type === 'email') && (
                <input ref={inputRef} type={current.type}
                  value={values[current.id]}
                  onChange={e => setValues(v => ({...v,[current.id]:e.target.value}))}
                  onKeyDown={e => { if(e.key==='Enter'){e.preventDefault();advance()} }}
                  placeholder={lang==='en' ? 'Type your answer…' : 'Digite sua resposta…'}
                  autoComplete="off"
                  style={lineInput}
                  onFocus={e=>(e.currentTarget.style.borderBottomColor='rgba(255,255,255,0.45)')}
                  onBlur={e=>(e.currentTarget.style.borderBottomColor='rgba(255,255,255,0.14)')}
                />
              )}

              {/* Options */}
              {current.type === 'options' && (
                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                  {current.options?.map(opt => {
                    const sel = values[current.id] === opt
                    return (
                      <button key={opt}
                        onClick={() => { setValues(v=>({...v,[current.id]:opt})); setTimeout(()=>{setDir(1);setStep(s=>s+1)},200) }}
                        onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}
                        style={{ padding:'0.5rem 1.1rem', borderRadius:999,
                          border:`1px solid ${sel?'rgba(255,255,255,0.55)':'rgba(255,255,255,0.12)'}`,
                          background: sel?'rgba(255,255,255,0.1)':'transparent',
                          color: sel?'#fff':'rgba(255,255,255,0.42)',
                          fontSize:'0.78rem', fontWeight:600, cursor:'pointer', transition:'all 0.18s',
                        }}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Textarea */}
              {current.type === 'textarea' && (
                <textarea ref={textareaRef}
                  value={values[current.id]}
                  onChange={e=>setValues(v=>({...v,[current.id]:e.target.value}))}
                  rows={4}
                  placeholder={lang==='en' ? 'Tell me about your project…' : 'Fale sobre o seu projeto…'}
                  style={{...lineInput, resize:'none', paddingTop:10}}
                  onFocus={e=>(e.currentTarget.style.borderBottomColor='rgba(255,255,255,0.45)')}
                  onBlur={e=>(e.currentTarget.style.borderBottomColor='rgba(255,255,255,0.14)')}
                />
              )}

              {/* Next / Submit */}
              {current.type !== 'options' && (
                <div style={{ display:'flex', alignItems:'center', gap:'1.25rem', paddingTop:'0.25rem' }}>
                  <button onClick={advance}
                    disabled={!values[current.id].trim()}
                    onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}
                    style={{
                      display:'inline-flex', alignItems:'center', gap:8, padding:'0.75rem 1.6rem', borderRadius:999,
                      background: values[current.id].trim() ? '#fff' : 'rgba(255,255,255,0.07)',
                      color: values[current.id].trim() ? '#0d0d0d' : 'rgba(255,255,255,0.2)',
                      fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase',
                      border:'none', cursor: values[current.id].trim() ? 'pointer' : 'not-allowed', transition:'all 0.25s',
                    }}>
                    {step < STEPS.length - 1
                      ? (lang==='en' ? 'Continue' : 'Continuar')
                      : (lang==='en' ? 'Send via WhatsApp' : 'Enviar pelo WhatsApp')}
                    {step < STEPS.length - 1 ? <ArrowRight size={13}/> : <MessageCircle size={13}/>}
                  </button>
                  <span style={{ fontSize:'0.56rem', color:'rgba(255,255,255,0.16)', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                    {lang==='en' ? 'or Enter ↩' : 'ou Enter ↩'}
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Back */}
          {step > 0 && (
            <button onClick={() => {setDir(-1);setStep(s=>s-1)}}
              style={{ alignSelf:'flex-start', fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.18)', background:'none', border:'none', cursor:'pointer', padding:0, transition:'color 0.2s' }}
              onMouseEnter={e=>((e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.5)')}
              onMouseLeave={e=>((e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.18)')}>
              ← {lang==='en' ? 'Back' : 'Voltar'}
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
    { label: 'Email',     href: `mailto:${SITE.email}`,                                      sub: SITE.email          },
    { label: 'WhatsApp',  href: `https://wa.me/${SITE.whatsapp.replace(/\D/g,'')}`,          sub: SITE.whatsapp       },
    { label: 'LinkedIn',  href: SITE.linkedin,                                                sub: 'caiodinizdev'      },
    { label: 'GitHub',    href: SITE.github,                                                  sub: 'caiodiniz-dev'     },
  ]

  return (
    <main style={{ paddingTop: '6rem', background: '#0d0d0d', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── Big headline ── */}
      <section style={{ padding: 'clamp(2.5rem,6vw,5rem) clamp(1.5rem,5vw,5rem) 0' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: E }}
        >
          <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.1rem' }}>
            <span style={{ display: 'inline-block', width: 18, height: 1, background: 'rgba(255,255,255,0.15)' }} />
            {lang === 'en' ? 'Get in touch' : 'Entre em contato'}
          </span>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 900, fontSize: 'clamp(2.4rem,9vw,8.5rem)', letterSpacing: '-0.055em', lineHeight: 0.88, color: '#fff', margin: 0, paddingBottom: '0.3em' }}>
            {lang === 'en' ? "Let's" : 'Vamos'}
            <br />
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>{lang === 'en' ? 'talk.' : 'conversar.'}</span>
          </h1>
        </motion.div>
      </section>

      {/* ── Animated divider ── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: E, delay: 0.18 }}
        style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: 'clamp(2rem,5vw,4rem) 0', transformOrigin: 'left' }}
      />

      {/* ── Two-column body ── */}
      <section style={{ padding: '0 clamp(1.5rem,5vw,5rem) clamp(5rem,10vw,8rem)' }}>
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem,7vw,7rem)', alignItems: 'start' }}>

          {/* ── LEFT: Terminal status card + links ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: E, delay: 0.28 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
          >
            {/* Terminal card */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, overflow: 'hidden',
              fontFamily: '"JetBrains Mono","Fira Code",monospace',
            }}>
              {/* macOS-style top bar */}
              <div style={{ padding: '0.65rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {['rgba(255,97,86,0.7)', 'rgba(255,189,68,0.5)', 'rgba(40,200,64,0.6)'].map((c, i) => (
                    <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <span style={{ fontSize: '0.56rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.08em', marginLeft: 'auto' }}>
                  status.json
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: '1.25rem 1.25rem 1.5rem' }}>
                {/* Live time */}
                <div style={{ marginBottom: '1.4rem' }}>
                  <div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em', marginBottom: 6 }}>
                    {'// São Paulo — UTC−3'}
                  </div>
                  <div style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 700, color: 'rgba(255,255,255,0.88)', letterSpacing: '0.04em', lineHeight: 1 }}>
                    <LiveClock />
                  </div>
                </div>

                {/* Key-value lines */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.7rem' }}>
                  {([
                    { k: 'status',   v: lang === 'en' ? '"Available for projects"' : '"Disponível para projetos"', c: 'rgba(80,210,120,0.85)' },
                    { k: 'location', v: '"São Paulo, Brasil"',                                                      c: 'rgba(130,180,255,0.7)' },
                    { k: 'response', v: lang === 'en' ? '"Usually < 24h"' : '"Geralmente < 24h"',                  c: 'rgba(200,160,100,0.8)' },
                    { k: 'mode',     v: lang === 'en' ? '"Remote / Hybrid"' : '"Remoto / Híbrido"',                c: 'rgba(200,150,255,0.7)' },
                  ] as {k:string;v:string;c:string}[]).map(({ k, v, c }) => (
                    <div key={k} style={{ display: 'flex', gap: '0.6rem', lineHeight: 1.5, minWidth: 0 }}>
                      <span style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>{k}:</span>
                      <span style={{ color: c, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Availability pulse */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'cpulse 2.2s ease-in-out infinite', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em', fontFamily: '"JetBrains Mono",monospace', wordBreak: 'break-all' }}>
                    {lang === 'en' ? 'open_to_new_projects: true' : 'aberto_a_projetos: true'}
                  </span>
                </div>
              </div>
            </div>

            {/* Social / contact links */}
            <div>
              <p style={{ fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', marginBottom: '0.6rem' }}>
                {lang === 'en' ? 'Links' : 'Links'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {LINKS.map(({ label, href, sub }) => (
                  <a key={label} href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', gap: '0.5rem' }}
                    onMouseEnter={() => setCursor('pointer')}
                    onMouseLeave={() => setCursor('default')}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.55)', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                        {label}
                      </span>
                      <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.18)', fontFamily: '"JetBrains Mono",monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '22ch' }}>
                        {sub}
                      </span>
                    </div>
                    <ArrowUpRight size={13} style={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Conversational form ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: E, delay: 0.38 }}
          >
            <ConversationalForm lang={lang} />
          </motion.div>
        </div>
      </section>

      <style>{`
        @keyframes cpulse {
          0%,100% { opacity:1; box-shadow:0 0 0 0 rgba(34,197,94,0.5); }
          50%      { opacity:0.7; box-shadow:0 0 0 5px rgba(34,197,94,0); }
        }
        @media (max-width: 860px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
