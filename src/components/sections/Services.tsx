import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useT } from '@/hooks/useTranslation'
import { useLanguageStore } from '@/store/useLanguageStore'
import { services } from '@/data/services'
import { useCursorStore } from '@/store/useCursorStore'
import { CubertoBtn } from './Hero'

gsap.registerPlugin(ScrollTrigger)

const categoryLabel: Record<string, { en: string; pt: string }> = {
  uiux:     { en: 'Design',     pt: 'Design'        },
  dev:      { en: 'Development',pt: 'Desenvolvimento'},
  branding: { en: 'Branding',   pt: 'Branding'      },
}

function ServiceCard({
  service,
  index,
  lang,
}: {
  service: typeof services[0]
  index: number
  lang: 'en' | 'pt'
}) {
  const setCursor = useCursorStore((s) => s.setState)
  const title     = lang === 'en' ? service.titleEn       : service.titlePt
  const desc      = lang === 'en' ? service.descriptionEn : service.descriptionPt
  const cat       = categoryLabel[service.id]?.[lang] ?? ''

  return (
    <article className="svc-card group">
      <Link
        to="/services"
        className="block"
        onMouseEnter={() => { setCursor('view') }}
        onMouseLeave={() => { setCursor('default') }}
      >
        {/* Image — same structure as project cards */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{ aspectRatio: '4/3', background: '#f0f0f0' }}
        >
          {/* Entrance wipe overlay */}
          <div
            className="svc-wipe absolute inset-0 z-10"
            style={{ background: '#ffffff', transformOrigin: 'bottom' }}
          />

          <img
            src={service.image}
            alt={title}
            loading="lazy"
            className="svc-img absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            style={{ willChange: 'transform' }}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500 z-20 pointer-events-none" />

          {/* Top: category badge + index (same as project cards) */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30">
            <span
              className="inline-flex items-center px-2.5 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.1em] rounded-full"
              style={{ border: '1px solid rgba(0,0,0,0.15)', background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(8px)', color: '#0d0d0d' }}
            >
              {cat}
            </span>
            <span
              className="font-black tabular-nums"
              style={{ fontSize: '0.55rem', letterSpacing: '0.12em', color: 'rgba(0,0,0,0.3)' }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Bottom gradient */}
          <div
            className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
            style={{ height: '45%', background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)' }}
          />

          {/* Arrow (hover) */}
          <div className="absolute bottom-4 right-4 z-30 text-white/0 group-hover:text-white/80 transition-colors duration-300">
            <ArrowUpRight size={17} />
          </div>
        </div>

        {/* Text below — same structure as project cards */}
        <div className="mt-4 px-1 flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <h3
              className="font-black text-black group-hover:text-black/60 transition-colors duration-300"
              style={{
                fontFamily:    'Syne, sans-serif',
                fontSize:      'clamp(1rem, 1.6vw, 1.25rem)',
                letterSpacing: '-0.025em',
                lineHeight:    '1.1',
              }}
            >
              {title}
            </h3>
          </div>
          <p className="text-[0.78rem] leading-relaxed line-clamp-2" style={{ color: 'rgba(0,0,0,0.4)' }}>
            {desc}
          </p>
        </div>
      </Link>
    </article>
  )
}

export default function Services() {
  const t         = useT()
  const lang      = useLanguageStore((s) => s.lang)
  const setCursor = useCursorStore((s) => s.setState)
  const ref       = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(['.svc-label', '.svc-h2'], { y: 22, opacity: 0 })
      gsap.set('.svc-accent', { y: 18, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current!, start: 'top 78%', once: true },
        defaults: { ease: 'power3.out' },
      })
      tl.to('.svc-label',  { y: 0, opacity: 1, duration: 0.55 }, 0)
      tl.to('.svc-h2',     { y: 0, opacity: 1, duration: 0.7  }, 0.1)
      tl.to('.svc-accent', { y: 0, opacity: 1, duration: 0.65 }, 0.25)

      /* Card entrance: wipe + scale like FeaturedProjects */
      ref.current!.querySelectorAll<HTMLElement>('.svc-card').forEach((card) => {
        const wipe = card.querySelector<HTMLElement>('.svc-wipe')
        const img  = card.querySelector<HTMLElement>('.svc-img')
        const text = card.querySelector<HTMLElement>('.mt-4')

        if (wipe) gsap.set(wipe, { scaleY: 1 })
        if (img)  gsap.set(img,  { scale: 1.1 })
        if (text) gsap.set(text, { y: 14, opacity: 0 })

        const tl2 = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 86%', once: true },
          defaults: { ease: 'power4.inOut' },
        })
        if (wipe) tl2.to(wipe, { scaleY: 0, duration: 0.95 }, 0)
        if (img)  tl2.to(img,  { scale: 1, duration: 1.2, ease: 'power3.out' }, 0)
        if (text) tl2.to(text, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.5)
      })
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={ref}
      data-bg="light"
      className="section-padding"
      style={{ background: '#ffffff', borderTop: '1px solid rgba(0,0,0,0.06)' }}
    >
      <div className="container-custom">
        {/* Header */}
        <div className="mb-14">
          <span className="svc-label inline-flex items-center gap-3 mb-6 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-black/30">
            <span className="w-5 h-px bg-black/15" />
            {t.services.badge}
          </span>

          <div className="flex items-end justify-between gap-8 mb-7">
            <h2
              className="svc-h2 font-black text-black"
              style={{
                fontFamily:    'Syne, sans-serif',
                fontSize:      'clamp(2.4rem, 5.5vw, 5rem)',
                letterSpacing: '-0.05em',
                lineHeight:    '0.92',
              }}
            >
              {t.services.headline}
            </h2>
            <Link
              to="/services"
              className="hidden lg:block flex-shrink-0"
              onMouseEnter={() => setCursor('pointer')}
              onMouseLeave={() => setCursor('default')}
            >
              <CubertoBtn theme="light-outline">
                {t.services.cta} <ArrowUpRight size={12} />
              </CubertoBtn>
            </Link>
          </div>

          <p
            className="svc-accent leading-relaxed"
            style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)', color: '#0d0d0d', maxWidth: '44ch', fontWeight: 400 }}
          >
            {lang === 'en'
              ? 'From design to deployment — I build digital products that combine code, motion and strategy.'
              : 'Do design ao deploy — crio produtos digitais que combinam código, motion e estratégia.'}
          </p>
        </div>

        {/* 3-column grid — same as project masonry but simpler */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={i}
              lang={lang}
            />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="flex lg:hidden justify-center mt-12">
          <Link to="/services" onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}>
            <CubertoBtn theme="light-outline">
              {t.services.cta} <ArrowUpRight size={12} />
            </CubertoBtn>
          </Link>
        </div>
      </div>
    </section>
  )
}
