import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useT } from '@/hooks/useTranslation'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'
import Magnetic from '@/components/animations/Magnetic'
import PaintReveal from '@/components/animations/PaintReveal'

gsap.registerPlugin(ScrollTrigger)

/* ─── Char-by-char reveal ─── */
function CharReveal({ text, style }: { text: string; style?: React.CSSProperties }) {
  return (
    <span style={{ display: 'block', ...style }}>
      {text.split('').map((char, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', lineHeight: 'inherit' }}>
          <span className="h-char" style={{ display: 'inline-block' }}>
            {char === ' ' ? ' ' : char}
          </span>
        </span>
      ))}
    </span>
  )
}

/* ─── Hero ─── */
export default function Hero() {
  const t         = useT()
  const lang      = useLanguageStore((s) => s.lang)
  const setCursor = useCursorStore((s) => s.setState)
  const ref       = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.h-char',       { y: '115%' })
      gsap.set('.hero-badge',   { y: 14, opacity: 0 })
      gsap.set('.hero-sub',     { y: 24, opacity: 0 })
      gsap.set('.hero-btns',    { y: 20, opacity: 0 })
      gsap.set('.hero-scroll',  { opacity: 0, y: 10 })
      gsap.set('.hero-photo',   { clipPath: 'inset(100% 0 0 0)' })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to('.hero-badge',  { y: 0, opacity: 1, duration: 0.6 }, 0.1)
      tl.to('.h-char',      { y: '0%', duration: 0.9, stagger: { each: 0.018 } }, 0.22)
      tl.to('.hero-sub',    { y: 0, opacity: 1, duration: 0.65 }, 0.65)
      tl.to('.hero-btns',   { y: 0, opacity: 1, duration: 0.6 },  0.78)
      tl.to('.hero-photo',  { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power4.inOut' }, 0.3)
      tl.to('.hero-scroll', { opacity: 1, y: 0, duration: 0.5 }, 1.35)

      gsap.to('.hero-photo-inner', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current!,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.6,
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [lang])

  const HL: React.CSSProperties = {
    fontFamily:    'Syne, sans-serif',
    fontWeight:    900,
    letterSpacing: '-0.055em',
    lineHeight:    '0.88',
    fontSize:      'clamp(2.8rem, 7.5vw, 7rem)',
  }

  const w1 = lang === 'en' ? 'Building' : 'Criando'
  const w2 = lang === 'en' ? 'digital'  : 'produtos'
  const w3 = lang === 'en' ? 'products.': 'digitais.'

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ minHeight: '100svh', background: '#0d0d0d' }}
    >
      {/* Full-section video background */}
      <video
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.12, filter: 'blur(1px)', transform: 'scale(1.04)', zIndex: 0 }}
      >
        <source src="/assets/bg-video.mp4" type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 30%, rgba(13,13,13,0.6) 100%)',
        }}
      />

      {/* Two-column layout */}
      <div
        className="hero-grid relative"
        style={{
          zIndex:              2,
          minHeight:           '100svh',
          display:             'grid',
          gridTemplateColumns: '1fr 42%',
        }}
      >
        {/* Left: content */}
        <div
          className="flex flex-col justify-center"
          style={{
            padding: 'clamp(6rem, 11vw, 8.5rem) clamp(1.5rem, 5vw, 4.5rem) clamp(4rem, 6vw, 5rem)',
            gap:     'clamp(1.4rem, 2.2vw, 2rem)',
          }}
        >
          <div className="hero-badge flex items-center gap-3 w-fit">
            <span className="inline-block rounded-full" style={{ width: 6, height: 6, background: '#ffffff', opacity: 0.35 }} />
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/30">
              {lang === 'en' ? 'Full Stack Developer · Available' : 'Full Stack Developer · Disponível'}
            </span>
          </div>

          {/* Headline — key forces remount on lang change so chars re-animate */}
          <div key={lang} style={{ lineHeight: '1' }}>
            <CharReveal text={w1} style={{ ...HL, color: '#ffffff' }} />
            <CharReveal text={w2} style={{ ...HL, color: 'rgba(255,255,255,0.13)' }} />
            <CharReveal text={w3} style={{ ...HL, color: '#ffffff' }} />
          </div>

          <p className="hero-sub text-[0.85rem] text-white/30 leading-relaxed" style={{ maxWidth: 350 }}>
            {t.hero.sub}
          </p>

          <div className="hero-btns flex items-center gap-3 flex-wrap">
            <Magnetic strength={0.32}>
              <Link to="/projects">
                <CubertoBtn
                  theme="dark"
                  onMouseEnter={() => setCursor('pointer')}
                  onMouseLeave={() => setCursor('default')}
                >
                  {t.hero.ctaPrimary} <ArrowUpRight size={12} />
                </CubertoBtn>
              </Link>
            </Magnetic>
            <Magnetic strength={0.32}>
              <Link to="/contact">
                <CubertoBtn
                  theme="dark-outline"
                  onMouseEnter={() => setCursor('pointer')}
                  onMouseLeave={() => setCursor('default')}
                >
                  {t.hero.ctaSecondary}
                </CubertoBtn>
              </Link>
            </Magnetic>
          </div>

          <div className="hero-scroll flex items-center gap-2.5 mt-2">
            <div
              style={{
                width: 1, height: 46,
                background: 'rgba(255,255,255,0.16)',
                animation: 'heroScrollPulse 2.4s ease-in-out infinite',
                transformOrigin: 'top',
              }}
            />
            <span className="text-[0.5rem] font-semibold uppercase tracking-[0.22em] text-white/18">Scroll</span>
          </div>
        </div>

        {/* Right: photo with B&W paint reveal effect */}
        <div className="hero-photo-col relative overflow-hidden">
          <div
            className="hero-photo rounded-t-2xl overflow-hidden"
            style={{
              position: 'absolute',
              top:    'clamp(4.5rem, 7vw, 6rem)',
              right:  'clamp(2rem, 4vw, 3.5rem)',
              bottom: 0,
              left:   0,
            }}
          >
            <div className="hero-photo-inner absolute" style={{ top: 0, bottom: '-24%', left: 0, right: 0 }}>
              <PaintReveal
                src="/assets/minha-foto-1.png"
                alt="Caio Diniz"
                brushSize={110}
                style={{ width: '100%', height: '100%' }}
              />
              {/* Bottom gradient overlay */}
              <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{ height: '45%', background: 'linear-gradient(to top, rgba(13,13,13,0.65), transparent)', zIndex: 10 }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroScrollPulse {
          0%, 100% { opacity: 0.16; transform: scaleY(1); }
          50%       { opacity: 0.4;  transform: scaleY(1.15); }
        }
        @media (max-width: 860px) {
          .hero-grid        { grid-template-columns: 1fr !important; }
          .hero-photo-col   { display: none !important; }
        }
      `}</style>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   CubertoBtn — exported, used site-wide
   ───────────────────────────────────────────────────────────── */
type CubertoTheme = 'dark' | 'dark-outline' | 'light' | 'light-outline'

export function CubertoBtn({
  children,
  theme = 'dark',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { theme?: CubertoTheme }) {
  const map: Record<CubertoTheme, { base: string; fill: string; textHover: string }> = {
    'dark':         { base: 'bg-white text-[#0d0d0d] border border-transparent',    fill: 'bg-[#0d0d0d]', textHover: 'group-hover:!text-white'      },
    'dark-outline': { base: 'bg-transparent text-white border border-white/25',      fill: 'bg-white',     textHover: 'group-hover:!text-[#0d0d0d]' },
    'light':        { base: 'bg-[#0d0d0d] text-white border border-transparent',     fill: 'bg-white',     textHover: 'group-hover:!text-[#0d0d0d]' },
    'light-outline':{ base: 'bg-transparent text-[#0d0d0d] border border-black/18',  fill: 'bg-[#0d0d0d]', textHover: 'group-hover:!text-white'      },
  }

  const { base, fill, textHover } = map[theme]

  return (
    <button
      className={`group relative overflow-hidden rounded-full px-7 py-3.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] inline-flex items-center gap-2 cursor-pointer select-none ${base} ${className}`}
      {...props}
    >
      <span
        className={`absolute inset-0 -translate-x-full group-hover:translate-x-0 ${fill}`}
        style={{ transition: 'transform 0.42s cubic-bezier(0.76,0,0.24,1)' }}
        aria-hidden
      />
      <span
        className={`relative z-10 inline-flex items-center gap-2 ${textHover}`}
        style={{ transition: 'color 0.42s cubic-bezier(0.76,0,0.24,1)' }}
      >
        {children}
      </span>
    </button>
  )
}
