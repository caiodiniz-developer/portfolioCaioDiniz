import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useLanguageStore } from '@/store/useLanguageStore'

gsap.registerPlugin(ScrollTrigger)

const items = [
  {
    year:   '2025',
    titleEn: 'Full Stack Developer — Freelance',
    titlePt: 'Desenvolvedor Full Stack — Freelance',
    descEn:  'Building premium websites, web apps and digital products for clients. Focus on React, Node.js, GSAP and TypeScript.',
    descPt:  'Construindo sites premium, aplicações web e produtos digitais para clientes. Foco em React, Node.js, GSAP e TypeScript.',
    tags:    ['React', 'TypeScript', 'GSAP', 'Node.js'],
  },
  {
    year:   '2024',
    titleEn: 'Backend API Development',
    titlePt: 'Desenvolvimento de APIs Backend',
    descEn:  'Developed secure RESTful APIs with Node.js, Prisma and PostgreSQL. JWT authentication, file uploads and comprehensive validation.',
    descPt:  'Desenvolvi APIs RESTful seguras com Node.js, Prisma e PostgreSQL. Autenticação JWT, upload de arquivos e validação abrangente.',
    tags:    ['Node.js', 'PostgreSQL', 'Prisma', 'JWT'],
  },
  {
    year:   '2023',
    titleEn: 'Web Development — Self-taught Journey',
    titlePt: 'Desenvolvimento Web — Jornada Autodidata',
    descEn:  'Started the programming journey. Built first projects with HTML, CSS, JavaScript and Python. Focus on front-end and UI design.',
    descPt:  'Iniciei a jornada de programação. Construí primeiros projetos com HTML, CSS, JavaScript e Python. Foco em front-end e UI design.',
    tags:    ['HTML', 'CSS', 'JavaScript', 'Python'],
  },
]

export default function Experience() {
  const lang = useLanguageStore((s) => s.lang)
  const ref  = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.exp-header', { y: 28, opacity: 0 })
      gsap.to('.exp-header', {
        y: 0, opacity: 1, duration: 0.75, ease: 'power3.out',
        scrollTrigger: { trigger: '.exp-header', start: 'top 82%', once: true },
      })

      ref.current!.querySelectorAll<HTMLElement>('.exp-row').forEach((row) => {
        const line    = row.querySelector('.exp-line')
        const year    = row.querySelector('.exp-year')
        const content = row.querySelector('.exp-content')

        gsap.set(line,    { scaleX: 0, transformOrigin: 'left' })
        gsap.set(year,    { x: -20, opacity: 0 })
        gsap.set(content, { x: 16, opacity: 0 })

        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: 'top 82%', once: true },
        })
        tl.to(line,    { scaleX: 1, duration: 0.55, ease: 'power2.inOut' })
          .to(year,    { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.3')
          .to(content, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.5')
      })
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={ref}
      className="section-padding"
      style={{ background: '#111111', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="container-custom">
        {/* Header */}
        <div className="exp-header flex flex-col gap-4 mb-16">
          <span className="inline-flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/30">
            <span className="w-5 h-px bg-white/15" />
            {lang === 'en' ? 'Career' : 'Trajetória'}
          </span>
          <h2
            className="font-black text-white"
            style={{
              fontFamily:    'Syne, sans-serif',
              fontSize:      'clamp(2rem, 4vw, 3.5rem)',
              letterSpacing: '-0.04em',
              lineHeight:    '0.95',
            }}
          >
            {lang === 'en' ? 'Journey & Learning' : 'Trajetória & Aprendizado'}
          </h2>
        </div>

        {/* Timeline */}
        <div>
          {items.map((item, i) => {
            const title = lang === 'en' ? item.titleEn : item.titlePt
            const desc  = lang === 'en' ? item.descEn  : item.descPt

            return (
              <div key={i} className="exp-row">
                <div
                  className="exp-line w-full"
                  style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}
                />

                <div
                  className="exp-grid pb-12"
                  style={{
                    display:               'grid',
                    gridTemplateColumns:   'clamp(5rem, 10vw, 8.5rem) 1fr',
                    gap:                   'clamp(1rem, 3vw, 2.5rem)',
                    alignItems:            'start',
                  }}
                >
                  {/* Year */}
                  <div className="exp-year">
                    <span
                      style={{
                        fontFamily:    'Syne, sans-serif',
                        fontWeight:    900,
                        fontSize:      'clamp(1.8rem, 3.5vw, 3rem)',
                        letterSpacing: '-0.05em',
                        lineHeight:    1,
                        color:         'rgba(255,255,255,0.10)',
                        display:       'block',
                        userSelect:    'none',
                      }}
                    >
                      {item.year}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="exp-content flex flex-col gap-3">
                    <h3
                      style={{
                        fontFamily:    'Syne, sans-serif',
                        fontWeight:    700,
                        fontSize:      'clamp(1rem, 1.8vw, 1.3rem)',
                        letterSpacing: '-0.02em',
                        lineHeight:    '1.15',
                        color:         '#ffffff',
                      }}
                    >
                      {title}
                    </h3>
                    <p
                      style={{
                        fontSize:   '0.82rem',
                        lineHeight: '1.72',
                        color:      'rgba(255,255,255,0.38)',
                        maxWidth:   560,
                      }}
                    >
                      {desc}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize:      '0.6rem',
                            fontWeight:    600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            padding:       '3px 10px',
                            borderRadius:  '2px',
                            border:        '1px solid rgba(255,255,255,0.10)',
                            color:         'rgba(255,255,255,0.30)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>
      </div>
    </section>
  )
}
