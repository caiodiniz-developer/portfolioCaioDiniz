import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import { ArrowUpRight } from 'lucide-react'
import { useCursorStore } from '@/store/useCursorStore'
import { useT } from '@/hooks/useTranslation'
import { useLanguageStore } from '@/store/useLanguageStore'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { projects } from '@/data/projects'

gsap.registerPlugin(ScrollTrigger)

export default function HorizontalScrollProjects() {
  const ref       = useRef<HTMLDivElement>(null)
  const trackRef  = useRef<HTMLDivElement>(null)
  const setCursor = useCursorStore((s) => s.setState)
  const setLabel  = useCursorStore((s) => s.setLabel)
  const t         = useT()
  const lang      = useLanguageStore((s) => s.lang)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    // Desktop only — on mobile/tablet the section is hidden via CSS
    if (window.innerWidth < 1024 || prefersReducedMotion) return

    let split: SplitType | null = null

    const ctx = gsap.context(() => {
      const track = trackRef.current!
      // scrollWidth minus viewport = how far we need to travel horizontally
      const scrollAmount = track.scrollWidth - window.innerWidth

      // ── Pinned horizontal scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current!,
          start:   'top top',
          end:     `+=${scrollAmount + 400}px`,
          scrub:   true,
          pin:     true,
          anticipatePin: 1,
        },
      })

      tl.to(track, {
        x:    `-${scrollAmount}px`,
        ease: 'power1.inOut',
      })

      // ── Headline word reveal
      const headline = ref.current!.querySelector<HTMLElement>('.hsp-headline')
      if (headline) {
        split = new SplitType(headline, { types: 'words' })
        // set + to, never from(): a from() tween is reverted by every
        // ScrollTrigger.refresh() and stays reverted once `once: true` kills the trigger.
        gsap.set(split.words!, { y: '110%', opacity: 0 })
        gsap.to(split.words!, {
          y:       '0%',
          opacity: 1,
          duration: 0.7,
          ease:    'power3.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: ref.current!,
            start:   'top 80%',
            once:    true,
          },
        })
      }

      // ── Card parallax: each image drifts slightly as it scrolls past
      ref.current!.querySelectorAll<HTMLElement>('.hsp-img').forEach((img) => {
        gsap.to(img, {
          xPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger:        img.closest('.hsp-card')!,
            containerAnimation: tl,
            start:  'left right',
            end:    'right left',
            scrub:  true,
          },
        })
      })
    }, ref)

    // Refresh ScrollTrigger on resize so the pin + scroll distance stay accurate
    function onResize() { ScrollTrigger.refresh() }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      window.removeEventListener('resize', onResize)
      // Revert SplitType before GSAP context so original text nodes are restored first
      split?.revert()
      ctx.revert()
    }
  }, [prefersReducedMotion, lang])

  return (
    /* Hidden on mobile — mobile projects are shown in FeaturedProjects */
    <div
      ref={ref}
      className="hidden lg:block relative"
      style={{
        background: '#111111',
        borderTop:  '1px solid rgba(255,255,255,0.06)',
        overflow:   'hidden',
      }}
    >
      {/* ── Section header (fixed inside the pinned container) */}
      <div
        style={{
          padding: 'clamp(3.5rem,6vw,5rem) clamp(3rem,5vw,4.5rem) 2rem',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '2rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span
            style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           10,
              fontSize:      '0.6875rem',
              fontWeight:    600,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color:         'rgba(255,255,255,0.3)',
            }}
          >
            <span style={{ width: 18, height: 1, background: 'rgba(255,255,255,0.15)' }} />
            {t.projects.badge}
          </span>
          <div style={{ overflow: 'hidden' }}>
            <h2
              className="hsp-headline"
              style={{
                fontFamily:    'Syne, sans-serif',
                fontWeight:    900,
                fontSize:      'clamp(2.2rem, 4.5vw, 4rem)',
                letterSpacing: '-0.045em',
                lineHeight:    '0.92',
                color:         '#ffffff',
                display:       'block',
              }}
            >
              {lang === 'en' ? 'Selected work' : 'Trabalhos selecionados'}
            </h2>
          </div>
        </div>

        <span
          style={{
            fontFamily:    '"JetBrains Mono","Fira Code",monospace',
            fontSize:      '0.58rem',
            color:         'rgba(255,255,255,0.18)',
            letterSpacing: '0.08em',
            flexShrink:    0,
          }}
        >
          {lang === 'en' ? '← scroll →' : '← role →'}
        </span>
      </div>

      {/* ── Horizontal track */}
      <div
        ref={trackRef}
        style={{
          display:      'flex',
          gap:          'clamp(1.5rem, 2.5vw, 2.5rem)',
          paddingLeft:  'clamp(3rem,5vw,4.5rem)',
          paddingRight: 'clamp(3rem,5vw,4.5rem)',
          paddingBottom: 'clamp(3rem,5vw,5rem)',
          width:        'max-content',
        }}
      >
        {projects.map((project, i) => (
          <a
            key={project.id}
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hsp-card group block relative flex-shrink-0"
            style={{
              width: i === 0 || i === 3
                ? 'clamp(340px, 32vw, 460px)'   // wide cards: portrait-ish
                : 'clamp(280px, 26vw, 380px)',   // narrow cards
            }}
            onMouseEnter={() => { setCursor('view'); setLabel('Ver') }}
            onMouseLeave={() => { setCursor('default'); setLabel('') }}
          >
            {/* ── Card image */}
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                aspectRatio: i % 2 === 0 ? '3/4' : '4/5',
                background:  '#111',
              }}
            >
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="hsp-img absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                style={{ willChange: 'transform' }}
              />

              {/* Overlay on hover */}
              <div
                className="absolute inset-0 bg-black/0 group-hover:bg-black/22 transition-colors duration-500 pointer-events-none z-10"
              />

              {/* Category badge */}
              <div className="absolute top-4 left-4 z-20">
                <span
                  className="inline-flex items-center px-2.5 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-white/65 rounded-full"
                  style={{
                    border:          '1px solid rgba(255,255,255,0.15)',
                    background:      'rgba(0,0,0,0.45)',
                    backdropFilter:  'blur(8px)',
                  }}
                >
                  {project.category}
                </span>
              </div>

              {/* Index number */}
              <span
                className="absolute top-4 right-4 z-20 font-black tabular-nums text-white/22"
                style={{ fontSize: '0.55rem', letterSpacing: '0.12em' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Bottom gradient + title */}
              <div
                className="absolute bottom-0 left-0 right-0 z-20 p-5"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 100%)',
                }}
              >
                <h3
                  className="font-black text-white"
                  style={{
                    fontFamily:    'Syne, sans-serif',
                    fontSize:      'clamp(1.05rem, 1.8vw, 1.35rem)',
                    letterSpacing: '-0.03em',
                    lineHeight:    '1.1',
                  }}
                >
                  {project.title}
                </h3>
                <div
                  className="flex items-center gap-2 mt-1.5 text-white/0 group-hover:text-white/55 transition-colors duration-300"
                >
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.04em' }}>
                    {project.year}
                  </span>
                  <ArrowUpRight size={13} />
                </div>
              </div>
            </div>

            {/* Below-card text */}
            <div className="mt-4 px-1">
              <p
                className="text-[0.72rem] text-white/28 leading-relaxed line-clamp-2"
                style={{ maxWidth: 320 }}
              >
                {project.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
