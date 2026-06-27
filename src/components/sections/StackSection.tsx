import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useCursorStore } from '@/store/useCursorStore'

gsap.registerPlugin(ScrollTrigger)

const STACK = [
  { name: 'HTML',        note: 'Estrutura web',     col: 0 },
  { name: 'CSS',         note: 'Estilização',        col: 0 },
  { name: 'JavaScript',  note: 'Linguagem base',     col: 0 },
  { name: 'TypeScript',  note: 'Tipagem estática',   col: 0 },
  { name: 'React',       note: 'UI framework',       col: 1 },
  { name: 'Node.js',     note: 'Runtime back-end',   col: 1 },
  { name: 'PostgreSQL',  note: 'Banco relacional',   col: 1 },
  { name: 'MySQL',       note: 'Banco relacional',   col: 1 },
  { name: 'Git',         note: 'Controle de versão', col: 2 },
  { name: 'GitHub',      note: 'Repositório remoto', col: 2 },
]

const COLS = ['Base', 'Framework & DB', 'Ferramentas']

export default function StackSection() {
  const ref       = useRef<HTMLElement>(null)
  const setCursor = useCursorStore((s) => s.setState)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.stk-label',    { y: 14, opacity: 0 })
      gsap.set('.stk-headline', { y: '105%' })
      gsap.set('.stk-sub',      { y: 16, opacity: 0 })

      const hTl = gsap.timeline({
        scrollTrigger: { trigger: ref.current!, start: 'top 78%', once: true },
        defaults: { ease: 'power3.out' },
      })
      hTl.to('.stk-label',    { y: 0, opacity: 1, duration: 0.55 }, 0)
      hTl.to('.stk-headline', { y: '0%', duration: 0.85 }, 0.12)
      hTl.to('.stk-sub',      { y: 0, opacity: 1, duration: 0.6 }, 0.3)

      const catLines = ref.current!.querySelectorAll<HTMLElement>('.stk-cat-line')
      catLines.forEach((line, i) => {
        gsap.set(line, { scaleX: 0, transformOrigin: 'left' })
        gsap.to(line, {
          scaleX: 1, duration: 0.7, ease: 'power2.inOut', delay: i * 0.12,
          scrollTrigger: { trigger: ref.current!, start: 'top 68%', once: true },
        })
      })

      gsap.set('.stk-cat-title', { y: 12, opacity: 0 })
      gsap.to('.stk-cat-title', {
        y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.12,
        scrollTrigger: { trigger: ref.current!, start: 'top 66%', once: true },
      })

      const cols = ref.current!.querySelectorAll<HTMLElement>('.stk-col')
      cols.forEach((col, ci) => {
        const items = col.querySelectorAll<HTMLElement>('.stk-item')
        gsap.set(items, { x: -16, opacity: 0 })
        gsap.to(items, {
          x: 0, opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.055, delay: ci * 0.1,
          scrollTrigger: { trigger: col, start: 'top 72%', once: true },
        })
        const itemLines = col.querySelectorAll<HTMLElement>('.stk-item-line')
        gsap.set(itemLines, { scaleX: 0, transformOrigin: 'left' })
        gsap.to(itemLines, {
          scaleX: 1, duration: 0.4, ease: 'power1.inOut', stagger: 0.04, delay: ci * 0.1 + 0.05,
          scrollTrigger: { trigger: col, start: 'top 72%', once: true },
        })
      })
    }, ref)

    return () => ctx.revert()
  }, [])

  const byCol = COLS.map((_, ci) => STACK.filter((t) => t.col === ci))

  return (
    <section
      ref={ref}
      className="section-padding"
      style={{ background: '#111111', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="container-custom">
        <div className="mb-20">
          <span className="stk-label inline-flex items-center gap-3 mb-5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/30">
            <span className="w-5 h-px bg-white/15" />
            Stack técnica
          </span>
          <div className="flex items-end justify-between gap-8">
            <div className="overflow-hidden">
              <h2
                className="stk-headline font-black text-white"
                style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.04em', lineHeight: '0.95' }}
              >
                As tecnologias que domino
              </h2>
            </div>
            <p className="stk-sub hidden md:block text-sm text-white/25 leading-relaxed max-w-xs text-right flex-shrink-0">
              Ferramentas escolhidas com cuidado para cada desafio.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {byCol.map((techs, colIdx) => (
            <div
              key={colIdx}
              className="stk-col"
              style={{
                borderRight:  colIdx < 2 ? '1px solid rgba(255,255,255,0.07)' : undefined,
                paddingRight: colIdx < 2 ? 'clamp(1.5rem, 4vw, 3rem)'          : undefined,
                paddingLeft:  colIdx > 0 ? 'clamp(1.5rem, 4vw, 3rem)'          : undefined,
              }}
            >
              <div className="mb-8 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="stk-cat-line w-full mb-4" style={{ height: '1px', background: 'rgba(255,255,255,0.18)' }} />
                <p className="stk-cat-title text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-white/30">
                  {COLS[colIdx]}
                </p>
              </div>
              <ul>
                {techs.map(({ name, note }) => (
                  <li
                    key={name}
                    className="stk-item group relative"
                    onMouseEnter={() => setCursor('pointer')}
                    onMouseLeave={() => setCursor('default')}
                  >
                    <div className="flex items-center justify-between py-3.5 gap-4">
                      <span
                        className="font-semibold text-white/50 group-hover:text-white transition-colors duration-300"
                        style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', letterSpacing: '-0.01em' }}
                      >
                        {name}
                      </span>
                      <span className="text-[0.6rem] font-medium uppercase tracking-[0.08em] text-white/15 group-hover:text-white/35 transition-colors duration-300 flex-shrink-0 hidden sm:block">
                        {note}
                      </span>
                    </div>
                    <div className="stk-item-line absolute bottom-0 left-0 w-full" style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />
                    <div className="absolute bottom-0 left-0 h-px bg-white/25 w-0 group-hover:w-full" style={{ transition: 'width 0.4s ease' }} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
