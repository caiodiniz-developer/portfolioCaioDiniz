import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'
import { SITE } from '@/lib/constants'
import Contact from '@/components/sections/Contact'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* ── Individual social row item ── */
function SocialItem({
  href, label, sublabel, delay,
  icon,
}: {
  href: string
  label: string
  sublabel: string
  delay: number
  icon: React.ReactNode
}) {
  const setCursor = useCursorStore(s => s.setState)
  const ref  = useRef<HTMLAnchorElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: E, delay }}
      onMouseEnter={() => setCursor('pointer')}
      onMouseLeave={() => setCursor('default')}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        className="social-row-item"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'clamp(1.2rem,2.5vw,1.8rem) 0',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          transition: 'all 0.35s ease',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.paddingLeft = '1rem'
          el.querySelector<HTMLElement>('.soc-arrow')!.style.transform = 'rotate(-45deg) scale(1.1)'
          el.querySelector<HTMLElement>('.soc-arrow')!.style.opacity = '1'
          el.querySelector<HTMLElement>('.soc-label')!.style.color = '#fff'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.paddingLeft = '0'
          el.querySelector<HTMLElement>('.soc-arrow')!.style.transform = 'rotate(0deg) scale(1)'
          el.querySelector<HTMLElement>('.soc-arrow')!.style.opacity = '0.3'
          el.querySelector<HTMLElement>('.soc-label')!.style.color = 'rgba(255,255,255,0.55)'
        }}
      >
        {/* Left: icon + text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem,2.5vw,1.75rem)' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.3s, border-color 0.3s',
          }}>
            {icon}
          </div>
          <div>
            <p className="soc-label" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.1rem,2.2vw,1.6rem)', letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.55)', margin: 0, transition: 'color 0.35s' }}>
              {label}
            </p>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', margin: '2px 0 0', textTransform: 'uppercase' }}>
              {sublabel}
            </p>
          </div>
        </div>

        {/* Arrow */}
        <svg className="soc-arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
          style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0, transition: 'transform 0.35s ease, opacity 0.35s' }}>
          <path d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </div>
    </motion.a>
  )
}

/* ══════════════════════════════════════════════════════ */
export default function ContactPage() {
  const lang = useLanguageStore(s => s.lang)
  const pt   = lang === 'pt'
  const heroRef  = useRef<HTMLDivElement>(null)
  const socialRef = useRef<HTMLDivElement>(null)
  const socialInView = useInView(socialRef, { once: true, margin: '-80px' })

  useEffect(() => { document.title = `Contato — ${SITE.name}` }, [])

  return (
    <main style={{ background: '#0d0d0d', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ════ HERO — vídeo de fundo ════ */}
      <section
        ref={heroRef}
        style={{ position: 'relative', minHeight: 'clamp(380px,55vh,600px)', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}
      >
        {/* Video background */}
        <video
          autoPlay muted loop playsInline
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            filter: 'brightness(0.22) saturate(0.6)',
            pointerEvents: 'none',
          }}
        >
          <source src="/video-service.mp4" type="video/mp4" />
        </video>

        {/* Gradient fade to bg */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, #0d0d0d 100%)', pointerEvents: 'none' }} />

        {/* Hero text */}
        <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,6vw,5rem)', width: '100%' }}>

          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: E, delay: 0.1 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.4rem 0.9rem', borderRadius: 999, border: '1px solid rgba(34,197,94,0.25)', background: 'rgba(34,197,94,0.07)', marginBottom: 'clamp(1rem,2vw,1.5rem)' }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e80', flexShrink: 0, animation: 'cpulse 2.2s ease-in-out infinite' }} />
            <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(74,222,128,0.85)' }}>
              {pt ? 'Disponível para projetos' : 'Available for projects'}
            </span>
          </motion.div>

          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              initial={{ y: '105%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, ease: E, delay: 0.2 }}
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(3rem,9vw,8rem)', letterSpacing: '-0.055em', lineHeight: 0.9, color: '#fff', margin: 0 }}
            >
              {pt ? 'Vamos conversar.' : "Let's talk."}
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: E, delay: 0.55 }}
            style={{ fontSize: 'clamp(0.8rem,1.5vw,1rem)', color: 'rgba(255,255,255,0.32)', margin: 'clamp(0.75rem,1.5vw,1.2rem) 0 0', maxWidth: 480, lineHeight: 1.65 }}
          >
            {pt
              ? 'Preencha o formulário abaixo ou entre em contato direto. Retorno em menos de 24h.'
              : 'Fill the form below or reach out directly. Reply within 24h.'}
          </motion.p>
        </div>
      </section>

      {/* ════ FORM (componente existente) ════ */}
      <Contact />

      {/* ════ SOCIAL LINKS ════ */}
      <section
        ref={socialRef}
        style={{ padding: 'clamp(3rem,7vw,6rem) clamp(1.5rem,6vw,5rem) clamp(5rem,10vw,8rem)' }}
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={socialInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: E }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: 'clamp(1.5rem,3vw,2.5rem)' }}
        >
          <span style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-block', width: 20, height: 1, background: 'rgba(255,255,255,0.15)' }} />
            {pt ? 'Redes sociais' : 'Social links'}
          </span>
          <span style={{ fontSize: '0.6rem', fontWeight: 600, color: 'rgba(255,255,255,0.14)', letterSpacing: '0.05em' }}>
            {pt ? '↓ clique para abrir' : '↓ click to open'}
          </span>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={socialInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, ease: E }}
          style={{ height: 1, background: 'rgba(255,255,255,0.07)', transformOrigin: 'left', marginBottom: 0 }}
        />

        {/* Social rows */}
        <SocialItem
          href={SITE.github}
          label="GitHub"
          sublabel={pt ? 'Código aberto · portfólio' : 'Open source · portfolio'}
          delay={0.05}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
          }
        />

        <SocialItem
          href={SITE.linkedin}
          label="LinkedIn"
          sublabel={pt ? 'Conexões profissionais' : 'Professional network'}
          delay={0.12}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          }
        />

        <SocialItem
          href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, '')}`}
          label="WhatsApp"
          sublabel={pt ? 'Mensagem direta · resposta rápida' : 'Direct message · quick reply'}
          delay={0.19}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          }
        />

        <SocialItem
          href={SITE.tiktok}
          label="TikTok"
          sublabel={pt ? 'Conteúdo de dev · bastidores' : 'Dev content · behind the scenes'}
          delay={0.26}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.16 8.16 0 004.77 1.52V6.76a4.86 4.86 0 01-1-.07z"/>
            </svg>
          }
        />

        {/* Bottom email strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={socialInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: E, delay: 0.38 }}
          style={{ marginTop: 'clamp(2.5rem,5vw,4rem)', paddingTop: 'clamp(2rem,4vw,3rem)', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <p style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', margin: '0 0 6px' }}>E-mail</p>
            <a href={`mailto:${SITE.email}`}
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(1rem,2.5vw,1.5rem)', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.3s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)')}>
              {SITE.email}
            </a>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)', margin: 0 }}>
            Campinas, SP · UTC−3
          </p>
        </motion.div>
      </section>

      <style>{`
        @keyframes cpulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          50%      { box-shadow: 0 0 0 7px rgba(34,197,94,0); }
        }
      `}</style>
    </main>
  )
}
