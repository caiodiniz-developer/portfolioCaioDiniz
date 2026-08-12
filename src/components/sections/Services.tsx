import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useT } from '@/hooks/useTranslation'
import { useLanguageStore } from '@/store/useLanguageStore'
import { services } from '@/data/services'
import { useCursorStore } from '@/store/useCursorStore'
import { CubertoBtn } from './Hero'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

const categoryLabel: Record<string, { en: string; pt: string }> = {
  uiux:     { en: 'Design',      pt: 'Design'         },
  dev:      { en: 'Development', pt: 'Desenvolvimento' },
  branding: { en: 'Branding',    pt: 'Branding'        },
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
    <motion.article
      className="svc-card group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.75, delay: index * 0.1, ease: E }}
    >
      <Link
        to="/services"
        className="block"
        onMouseEnter={() => { setCursor('view') }}
        onMouseLeave={() => { setCursor('default') }}
      >
        {/* Image with svc-wipe reveal — Framer Motion (always reliable) */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{ aspectRatio: '4/3', background: '#f0f0f0' }}
        >
          {/* Wipe overlay */}
          <motion.div
            className="absolute inset-0 z-10"
            style={{ background: '#ffffff', transformOrigin: 'bottom' }}
            initial={{ scaleY: 1 }}
            whileInView={{ scaleY: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1], delay: index * 0.1 }}
          />

          {/* Image with scale */}
          <motion.img
            src={service.image}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ willChange: 'transform' }}
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.2, ease: E, delay: index * 0.1 }}
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500 z-20 pointer-events-none" />

          {/* Category badge + index */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-none">
            <span
              className="inline-flex items-center px-2.5 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.1em] rounded-full"
              style={{ border: '1px solid rgba(0,0,0,0.15)', background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(8px)', color: '#0d0d0d' }}
            >
              {cat}
            </span>
            <span className="font-black tabular-nums" style={{ fontSize: '0.55rem', letterSpacing: '0.12em', color: 'rgba(0,0,0,0.3)' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Bottom gradient */}
          <div
            className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
            style={{ height: '45%', background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)' }}
          />

          <div className="absolute bottom-4 right-4 z-30 text-white/0 group-hover:text-white/80 transition-colors duration-300">
            <ArrowUpRight size={17} />
          </div>
        </div>

        {/* Text */}
        <motion.div
          className="mt-4 px-1 flex flex-col gap-1.5"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55, delay: 0.4 + index * 0.1, ease: E }}
        >
          <h3
            className="font-black text-black group-hover:text-black/60 transition-colors duration-300"
            style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1rem, 1.6vw, 1.25rem)', letterSpacing: '-0.025em', lineHeight: '1.1' }}
          >
            {title}
          </h3>
          <p className="text-[0.78rem] leading-relaxed line-clamp-2" style={{ color: 'rgba(0,0,0,0.4)' }}>
            {desc}
          </p>
        </motion.div>
      </Link>
    </motion.article>
  )
}

export default function Services() {
  const t         = useT()
  const lang      = useLanguageStore((s) => s.lang)
  const setCursor = useCursorStore((s) => s.setState)

  return (
    <section
      data-bg="light"
      className="section-padding"
      style={{ background: '#ffffff', borderTop: '1px solid rgba(0,0,0,0.06)' }}
    >
      <div className="container-custom">
        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: E }}
        >
          {/* Section marker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(0,0,0,0.3)' }}>02</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.1)' }} />
            <span style={{ fontFamily: 'monospace', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.25)' }}>{t.services.badge}</span>
          </div>

          <div className="flex items-end justify-between gap-8 mb-7">
            <h2
              className="font-black text-black"
              style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2.4rem, 5.5vw, 5rem)', letterSpacing: '-0.05em', lineHeight: '0.92' }}
            >
              {lang === 'en' ? 'How can I help you?' : 'Como posso te ajudar?'}
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
            className="leading-relaxed"
            style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)', color: 'rgba(0,0,0,0.5)', maxWidth: '44ch', fontWeight: 400 }}
          >
            {lang === 'en'
              ? 'From design to deployment — I build digital products that combine code, motion and strategy.'
              : 'Do design ao deploy — crio produtos digitais que combinam código, motion e estratégia.'}
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} lang={lang} />
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
