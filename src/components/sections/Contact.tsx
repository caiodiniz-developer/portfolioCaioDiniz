import { useRef, useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ArrowRight, RotateCcw } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { SITE } from '@/lib/constants'
import { useCursorStore } from '@/store/useCursorStore'

const socials = [
  { label: 'LinkedIn',  href: SITE.linkedin },
  { label: 'GitHub',    href: SITE.github   },
  { label: 'WhatsApp',  href: `https://wa.me/${SITE.whatsapp.replace(/\D/g, '')}` },
  { label: 'TikTok',    href: SITE.tiktok   },
]

/* ── Step definitions ── */
type StepId = 'name' | 'email' | 'type' | 'budget' | 'message'

interface Step {
  id:       StepId
  questionPt: string
  questionEn: string
  type:     'text' | 'email' | 'options' | 'textarea'
  options?: { label: string }[]
}

const STEPS: Step[] = [
  {
    id: 'name',
    questionPt: 'Qual é o seu nome?',
    questionEn: 'What is your name?',
    type: 'text',
  },
  {
    id: 'email',
    questionPt: 'Qual é o seu e-mail?',
    questionEn: 'What is your e-mail?',
    type: 'email',
  },
  {
    id: 'type',
    questionPt: 'Que tipo de projeto você precisa?',
    questionEn: 'What kind of project do you need?',
    type: 'options',
    options: [
      { label: 'Website' },
      { label: 'Landing Page' },
      { label: 'Web App' },
      { label: 'API / Backend' },
      { label: 'Outro / Other' },
    ],
  },
  {
    id: 'budget',
    questionPt: 'Qual é o seu orçamento aproximado?',
    questionEn: 'What is your approximate budget?',
    type: 'options',
    options: [
      { label: 'R$ 500'        },
      { label: ' R$ 1k'        },
      { label: ' R$ 2k'         },
      { label: 'R$ 2k – R$ 5k'  },
      { label: 'R$ 5k – R$ 15k' },
      { label: '> R$ 15k'        },
    ],
  },
  {
    id: 'message',
    questionPt: 'Me conte um pouco sobre o projeto.',
    questionEn: 'Tell me a bit about your project.',
    type: 'textarea',
  },
]

type FormValues = Record<StepId, string>

const EMPTY: FormValues = { name: '', email: '', type: '', budget: '', message: '' }

/* ── Slide variants ── */
const variants = {
  enter: { opacity: 0, y: 28 },
  center:{ opacity: 1, y:  0 },
  exit:  { opacity: 0, y: -20 },
}

export default function Contact() {
  const lang      = useLanguageStore((s) => s.lang)
  const setCursor = useCursorStore((s) => s.setState)

  const [step,   setStep]   = useState(0)
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [sent,   setSent]   = useState(false)
  const [dir,    setDir]    = useState(1)

  const inputRef    = useRef<HTMLInputElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  /* Focus input on step change */
  useEffect(() => {
    const id = setTimeout(() => {
      inputRef.current?.focus()
      textareaRef.current?.focus()
    }, 350)
    return () => clearTimeout(id)
  }, [step])

  const current = STEPS[step]
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
      type   ? `Projeto: ${type}`       : null,
      budget ? `Orçamento: ${budget}`   : null,
      ``,
      `Mensagem:`,
      message,
    ].filter(Boolean).join('\n')
    const url = `https://wa.me/${SITE.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(lines)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  function reset() {
    setDir(-1)
    setStep(0)
    setValues(EMPTY)
    setSent(false)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && current.type !== 'textarea') { e.preventDefault(); advance() }
  }

  const lineInput: React.CSSProperties = {
    background:    'transparent',
    border:        'none',
    borderBottom:  '1px solid rgba(255,255,255,0.15)',
    borderRadius:  0,
    padding:       '10px 0',
    color:         '#ffffff',
    fontSize:      '1rem',
    outline:       'none',
    width:         '100%',
    fontFamily:    'Inter, sans-serif',
    transition:    'border-color 0.25s',
    caretColor:    '#ffffff',
  }

  return (
    <section
      id="contact"
      style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(4rem,9vw,7rem) clamp(1.5rem,5vw,5rem)' }}
    >
      {/* Label */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.16,1,0.3,1] }} style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ display: 'inline-block', width: 18, height: 1, background: 'rgba(255,255,255,0.15)' }} />
          {lang === 'en' ? 'Contact' : 'Contato'}
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h2 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: [0.16,1,0.3,1], delay: 0.08 }} style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(2.8rem, 7vw, 7rem)', letterSpacing: '-0.055em', lineHeight: 0.88, color: '#ffffff', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
        {lang === 'en' ? "Let's talk." : 'Vamos conversar.'}
      </motion.h2>

      {/* Divider */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 'clamp(3rem, 6vw, 5rem)' }} />

      {/* 2-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(2.5rem, 6vw, 6rem)', alignItems: 'start' }}>

        {/* ── Left: contact info ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16,1,0.3,1], delay: 0.22 }} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Email */}
          <div>
            <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: '0.75rem' }}>Email</p>
            <a
              href={`mailto:${SITE.email}`}
              className="group"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
              onMouseEnter={() => setCursor('pointer')}
              onMouseLeave={() => setCursor('default')}
            >
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(0.9rem, 2vw, 1.3rem)', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.7)', transition: 'color 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}>
                {SITE.email}
              </span>
              <ArrowUpRight size={15} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </a>
          </div>

          {/* Social */}
          <div>
            <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: '0.5rem' }}>Social</p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {socials.map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}
                  onMouseEnter={() => setCursor('pointer')}
                  onMouseLeave={() => setCursor('default')}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', transition: 'color 0.3s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
                    {label}
                  </span>
                  <ArrowUpRight size={13} style={{ color: 'rgba(255,255,255,0.18)' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Location */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 4 }}>
                {lang === 'en' ? 'Location' : 'Localização'}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)' }}>São Paulo, Brasil</p>
            </div>
            <div>
              <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 4 }}>
                {lang === 'en' ? 'Response time' : 'Tempo de resposta'}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)' }}>
                {lang === 'en' ? 'Usually within 24h' : 'Geralmente em até 24h'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Right: one-by-one form ── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.16,1,0.3,1], delay: 0.32 }}>
          <AnimatePresence mode="wait">

            {/* ── SENT state ── */}
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingTop: '1rem' }}
              >
                {/* Success message */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>
                    {lang === 'en' ? 'Message sent' : 'Mensagem enviada'}
                  </p>
                  <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', letterSpacing: '-0.04em', lineHeight: 1, color: '#ffffff' }}>
                    {lang === 'en' ? 'While you wait...' : 'Enquanto aguarda...'}
                  </p>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.65 }}>
                    {lang === 'en'
                      ? 'Your WhatsApp should have opened. Caio usually responds in under 4 hours.'
                      : 'Seu WhatsApp deve ter aberto. Irei dar retorno em breve!'}
                  </p>
                </div>

                {/* Teaser links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {[
                    { label: lang === 'en' ? 'View projects' : 'Ver projetos', href: '/projects' },
                    { label: lang === 'en' ? 'GitHub profile' : 'Perfil no GitHub', href: SITE.github },
                    { label: lang === 'en' ? 'LinkedIn' : 'LinkedIn', href: SITE.linkedin },
                  ].map(({ label, href }) => (
                    <a key={label} href={href} target={href.startsWith('/') ? '_self' : '_blank'} rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', transition: 'color 0.25s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
                        {label}
                      </span>
                      <ArrowUpRight size={13} style={{ color: 'rgba(255,255,255,0.2)' }} />
                    </a>
                  ))}
                </div>

                {/* Reset */}
                <button onClick={reset} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.25s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.2)')}>
                  <RotateCcw size={11} />
                  {lang === 'en' ? 'Send another message' : 'Enviar outra mensagem'}
                </button>
              </motion.div>

            ) : (
              /* ── FORM state ── */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
              >
                {/* Progress bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
                      {lang === 'en' ? `Step ${step + 1} of ${STEPS.length}` : `Etapa ${step + 1} de ${STEPS.length}`}
                    </span>
                    {/* Step dots */}
                    <div style={{ display: 'flex', gap: 5 }}>
                      {STEPS.map((_, i) => (
                        <div key={i} style={{
                          width:        i === step ? 18 : 5,
                          height:       5,
                          borderRadius: 99,
                          background:   i < step ? 'rgba(255,255,255,0.55)' : i === step ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.12)',
                          transition:   'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                        }} />
                      ))}
                    </div>
                  </div>
                  {/* Track */}
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', borderRadius: 1, overflow: 'hidden' }}>
                    <motion.div
                      animate={{ width: `${progress + (100 / STEPS.length)}%` }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: '100%', background: 'rgba(255,255,255,0.45)', borderRadius: 1 }}
                    />
                  </div>
                </div>

                {/* Previous answer (faded) */}
                <AnimatePresence>
                  {step > 0 && (
                    <motion.div
                      key={`prev-${step}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                      <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
                        {lang === 'en' ? STEPS[step - 1].questionEn : STEPS[step - 1].questionPt}
                      </p>
                      <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.32)', fontStyle: 'italic' }}>
                        {values[STEPS[step - 1].id] || '—'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Current question + input */}
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={step}
                    custom={dir}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                  >
                    {/* Question */}
                    <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.3rem, 2.8vw, 2rem)', letterSpacing: '-0.035em', lineHeight: 1.1, color: '#ffffff' }}>
                      {lang === 'en' ? current.questionEn : current.questionPt}
                    </p>

                    {/* Text / email input */}
                    {(current.type === 'text' || current.type === 'email') && (
                      <input
                        ref={inputRef}
                        type={current.type}
                        value={values[current.id]}
                        onChange={e => setValues(v => ({ ...v, [current.id]: e.target.value }))}
                        onKeyDown={onKeyDown}
                        placeholder={lang === 'en' ? 'Type your answer...' : 'Digite sua resposta...'}
                        autoComplete="off"
                        style={lineInput}
                        onFocus={e  => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.5)')}
                        onBlur={e   => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.15)')}
                      />
                    )}

                    {/* Option buttons */}
                    {current.type === 'options' && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {current.options?.map(opt => {
                          const sel = values[current.id] === opt.label
                          return (
                            <button
                              key={opt.label}
                              onClick={() => {
                                setValues(v => ({ ...v, [current.id]: opt.label }))
                                setTimeout(() => { setDir(1); setStep(s => s + 1) }, 200)
                              }}
                              style={{
                                padding:       '0.55rem 1.1rem',
                                borderRadius:  999,
                                border:        `1px solid ${sel ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.12)'}`,
                                background:    sel ? 'rgba(255,255,255,0.12)' : 'transparent',
                                color:         sel ? '#fff' : 'rgba(255,255,255,0.45)',
                                fontSize:      '0.8rem',
                                fontWeight:    600,
                                cursor:        'pointer',
                                transition:    'all 0.2s',
                              }}
                              onMouseEnter={e => { if (!sel) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)' }}}
                              onMouseLeave={e => { if (!sel) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)' }}}
                            >
                              {opt.label}
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {/* Textarea */}
                    {current.type === 'textarea' && (
                      <textarea
                        ref={textareaRef}
                        value={values[current.id]}
                        onChange={e => setValues(v => ({ ...v, [current.id]: e.target.value }))}
                        rows={5}
                        placeholder={lang === 'en' ? 'Tell me about your project...' : 'Fale sobre o seu projeto...'}
                        style={{ ...lineInput, resize: 'none', paddingTop: 10 }}
                        onFocus={e  => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.5)')}
                        onBlur={e   => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.15)')}
                      />
                    )}

                    {/* Next / Submit button (not for options — those auto-advance) */}
                    {current.type !== 'options' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingTop: '0.25rem' }}>
                        <button
                          onClick={advance}
                          disabled={!values[current.id].trim()}
                          style={{
                            display:        'inline-flex',
                            alignItems:     'center',
                            gap:            8,
                            padding:        '0.75rem 1.6rem',
                            borderRadius:   999,
                            background:     values[current.id].trim() ? '#ffffff' : 'rgba(255,255,255,0.08)',
                            color:          values[current.id].trim() ? '#0d0d0d' : 'rgba(255,255,255,0.2)',
                            fontSize:       '0.72rem',
                            fontWeight:     700,
                            letterSpacing:  '0.08em',
                            textTransform:  'uppercase',
                            border:         'none',
                            cursor:         values[current.id].trim() ? 'pointer' : 'not-allowed',
                            transition:     'all 0.3s',
                          }}
                        >
                          {step < STEPS.length - 1
                            ? (lang === 'en' ? 'Continue' : 'Continuar')
                            : (lang === 'en' ? 'Send via WhatsApp' : 'Enviar pelo WhatsApp')}
                          <ArrowRight size={13} />
                        </button>
                        <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.18)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                          {lang === 'en' ? 'or press Enter ↩' : 'ou pressione Enter ↩'}
                        </span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Back button */}
                {step > 0 && (
                  <button
                    onClick={() => { setDir(-1); setStep(s => s - 1) }}
                    style={{ alignSelf: 'flex-start', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.25s' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.2)')}
                  >
                    ← {lang === 'en' ? 'Back' : 'Voltar'}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
