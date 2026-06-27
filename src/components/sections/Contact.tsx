import { useRef, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Send } from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useLanguageStore } from '@/store/useLanguageStore'
import { SITE } from '@/lib/constants'
import { useCursorStore } from '@/store/useCursorStore'
import { CubertoBtn } from '@/components/sections/Hero'

gsap.registerPlugin(ScrollTrigger)

const schema = z.object({
  name:        z.string().min(1),
  email:       z.string().email(),
  projectType: z.string().optional(),
  budget:      z.string().optional(),
  message:     z.string().min(10),
})

type FormData = z.infer<typeof schema>

const socials = [
  { label: 'LinkedIn', href: SITE.linkedin },
  { label: 'GitHub',   href: SITE.github   },
  { label: 'TikTok',   href: SITE.tiktok   },
]

export default function Contact() {
  const lang      = useLanguageStore((s) => s.lang)
  const setCursor = useCursorStore((s) => s.setState)
  const ref       = useRef<HTMLElement>(null)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(['.ct-label', '.ct-headline', '.ct-divider'], { y: 30, opacity: 0 })
      gsap.set('.ct-info',  { y: 18, opacity: 0 })
      gsap.set('.ct-form',  { y: 22, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current!, start: 'top 72%', once: true },
      })
      tl.to('.ct-label',   { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' })
        .to('.ct-headline', { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' }, '-=0.35')
        .to('.ct-divider',  { y: 0, opacity: 1, duration: 0.5,  ease: 'power3.out' }, '-=0.45')
        .to('.ct-info',     { y: 0, opacity: 1, duration: 0.6,  ease: 'power3.out', stagger: 0.1 }, '-=0.3')
        .to('.ct-form',     { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }, '-=0.5')
    }, ref)
    return () => ctx.revert()
  }, [])

  function onSubmit(data: FormData) {
    const lines = [
      `Olá Caio! Me chamo *${data.name}*.`,
      ``,
      `📧 Email: ${data.email}`,
      data.projectType ? `Tipo de projeto: ${data.projectType}` : null,
      data.budget      ? ` Orçamento: ${data.budget}` : null,
      ``,
      `💬 Mensagem:`,
      data.message,
    ].filter((l) => l !== null).join('\n')

    const url = `https://wa.me/${SITE.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(lines)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setSent(true)
    reset()
  }

  const projectTypes = lang === 'en'
    ? ['Website', 'Web App', 'API / Backend', 'Landing Page', 'Other']
    : ['Website', 'Aplicação Web', 'API / Backend', 'Landing Page', 'Outro']

  const budgetRanges = ['< R$2k', 'R$2k – R$5k', 'R$5k – R$15k', '> R$15k']

  /* Line-style input — editorial premium look */
  const lineInput: React.CSSProperties = {
    background:      'transparent',
    border:          'none',
    borderBottom:    '1px solid rgba(255,255,255,0.12)',
    borderRadius:    0,
    padding:         '10px 0',
    color:           '#ffffff',
    fontSize:        '0.875rem',
    outline:         'none',
    width:           '100%',
    fontFamily:      'Inter, sans-serif',
    transition:      'border-color 0.25s',
  }

  return (
    <section
      ref={ref}
      id="contact"
      className="section-padding"
      style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="container-custom">
        {/* Label */}
        <div className="ct-label mb-5">
          <span className="inline-flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/30">
            <span className="w-5 h-px bg-white/15" />
            {lang === 'en' ? 'Contact' : 'Contato'}
          </span>
        </div>

        {/* Big headline */}
        <h2
          className="ct-headline font-black text-white"
          style={{
            fontFamily:    'Syne, sans-serif',
            fontSize:      'clamp(2.8rem, 7vw, 7rem)',
            letterSpacing: '-0.055em',
            lineHeight:    '0.88',
            marginBottom:  'clamp(2.5rem, 5vw, 4rem)',
          }}
        >
          {lang === 'en' ? "Let's talk." : 'Vamos conversar.'}
        </h2>

        {/* Divider */}
        <div
          className="ct-divider"
          style={{
            height:        '1px',
            background:    'rgba(255,255,255,0.07)',
            marginBottom:  'clamp(3rem, 6vw, 5rem)',
          }}
        />

        {/* 2-col grid */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* ── Left: info ── */}
          <div className="flex flex-col gap-10">

            {/* Email */}
            <div className="ct-info">
              <p
                className="mb-3"
                style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}
              >
                Email
              </p>
              <a
                href={`mailto:${SITE.email}`}
                className="group inline-flex items-center gap-2"
                onMouseEnter={() => setCursor('pointer')}
                onMouseLeave={() => setCursor('default')}
              >
                <span
                  style={{
                    fontFamily:    'Syne, sans-serif',
                    fontWeight:    700,
                    fontSize:      'clamp(0.9rem, 2vw, 1.35rem)',
                    letterSpacing: '-0.02em',
                    color:         'rgba(255,255,255,0.75)',
                    transition:    'color 0.3s',
                  }}
                  className="group-hover:!text-white"
                >
                  {SITE.email}
                </span>
                <ArrowUpRight size={16} className="text-white/20 group-hover:text-white/60 transition-colors" />
              </a>
            </div>

            {/* Social links — editorial list */}
            <div className="ct-info">
              <p
                className="mb-3"
                style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}
              >
                Social
              </p>
              <div className="flex flex-col">
                {socials.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-4"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                    onMouseEnter={() => setCursor('pointer')}
                    onMouseLeave={() => setCursor('default')}
                  >
                    <span
                      className="font-semibold text-white/45 group-hover:text-white transition-colors duration-300"
                      style={{ fontSize: '0.875rem', letterSpacing: '-0.01em' }}
                    >
                      {label}
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="text-white/18 group-hover:text-white/60 transition-colors duration-300"
                      style={{ transform: 'translateX(-4px)', transition: 'transform 0.3s, color 0.3s' }}
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Meta */}
            <div className="ct-info flex flex-col gap-4">
              <div>
                <p
                  style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 4 }}
                >
                  {lang === 'en' ? 'Location' : 'Localização'}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)' }}>São Paulo, Brasil</p>
              </div>
              <div>
                <p
                  style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 4 }}
                >
                  {lang === 'en' ? 'Response time' : 'Tempo de resposta'}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)' }}>
                  {lang === 'en' ? 'Usually within 24h' : 'Geralmente em até 24h'}
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: form ── */}
          <div className="ct-form">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-6 py-16"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    <Send size={20} className="text-white/50" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-lg mb-1.5">
                      {lang === 'en' ? 'Message sent!' : 'Mensagem enviada!'}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.35)' }}>
                      {lang === 'en' ? 'Your WhatsApp should have opened.' : 'Seu WhatsApp deve ter aberto.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setSent(false)}
                    className="text-xs uppercase tracking-[0.1em] hover:text-white/70 transition-colors w-fit"
                    style={{ color: 'rgba(255,255,255,0.28)' }}
                  >
                    {lang === 'en' ? 'Send another' : 'Enviar outro'}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-8"
                  noValidate
                >
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-1.5">
                      <label style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)' }}>
                        {lang === 'en' ? 'Name' : 'Nome'} *
                      </label>
                      <input
                        {...register('name')}
                        placeholder={lang === 'en' ? 'Your name' : 'Seu nome'}
                        style={lineInput}
                        onFocus={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.45)')}
                        onBlur={(e)  => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.12)')}
                      />
                      {errors.name && (
                        <span style={{ fontSize: '0.65rem', color: '#f87171', marginTop: 2 }}>
                          {lang === 'en' ? 'Required' : 'Obrigatório'}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)' }}>
                        Email *
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        placeholder={lang === 'en' ? 'your@email.com' : 'seu@email.com'}
                        style={lineInput}
                        onFocus={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.45)')}
                        onBlur={(e)  => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.12)')}
                      />
                      {errors.email && (
                        <span style={{ fontSize: '0.65rem', color: '#f87171', marginTop: 2 }}>
                          {lang === 'en' ? 'Invalid email' : 'Email inválido'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-1.5">
                      <label style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)' }}>
                        {lang === 'en' ? 'Project type' : 'Tipo de projeto'}
                      </label>
                      <select
                        {...register('projectType')}
                        style={{ ...lineInput, cursor: 'pointer', WebkitAppearance: 'none', appearance: 'none' } as React.CSSProperties}
                        onFocus={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.45)')}
                        onBlur={(e)  => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.12)')}
                      >
                        <option value="" style={{ background: '#0d0d0d' }}>—</option>
                        {projectTypes.map((t) => (
                          <option key={t} value={t} style={{ background: '#0d0d0d' }}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)' }}>
                        Budget
                      </label>
                      <select
                        {...register('budget')}
                        style={{ ...lineInput, cursor: 'pointer', WebkitAppearance: 'none', appearance: 'none' } as React.CSSProperties}
                        onFocus={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.45)')}
                        onBlur={(e)  => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.12)')}
                      >
                        <option value="" style={{ background: '#0d0d0d' }}>—</option>
                        {budgetRanges.map((b) => (
                          <option key={b} value={b} style={{ background: '#0d0d0d' }}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)' }}>
                      {lang === 'en' ? 'Message' : 'Mensagem'} *
                    </label>
                    <textarea
                      {...register('message')}
                      rows={5}
                      placeholder={lang === 'en' ? 'Tell me about your project...' : 'Fale sobre o seu projeto...'}
                      style={{ ...lineInput, resize: 'none', paddingTop: '10px' }}
                      onFocus={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.45)')}
                      onBlur={(e)  => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.12)')}
                    />
                    {errors.message && (
                      <span style={{ fontSize: '0.65rem', color: '#f87171', marginTop: 2 }}>
                        {lang === 'en' ? 'At least 10 characters' : 'Mínimo 10 caracteres'}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <CubertoBtn
                      type="submit"
                      theme="dark"
                      disabled={isSubmitting}
                      onMouseEnter={() => setCursor('pointer')}
                      onMouseLeave={() => setCursor('default')}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="rounded-full border-t-white border-white/25 animate-spin"
                            style={{ width: 12, height: 12, border: '1.5px solid', display: 'inline-block' }}
                          />
                          {lang === 'en' ? 'Sending…' : 'Enviando…'}
                        </>
                      ) : (
                        <>
                          {lang === 'en' ? 'Send via WhatsApp' : 'Enviar pelo WhatsApp'}
                          <ArrowUpRight size={12} />
                        </>
                      )}
                    </CubertoBtn>

                    <p style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
                      {lang === 'en' ? 'Opens WhatsApp with your message pre-filled' : 'Abre o WhatsApp com sua mensagem preenchida'}
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
