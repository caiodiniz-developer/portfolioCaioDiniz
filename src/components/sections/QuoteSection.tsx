import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function QuoteSection() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.q-label', { y: 16, opacity: 0 })
      gsap.set('.q-word',  { y: '105%' })
      gsap.set('.q-line',  { scaleX: 0, transformOrigin: 'left' })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current!, start: 'top 72%', once: true },
        defaults: { ease: 'power3.out' },
      })

      tl.to('.q-label', { y: 0, opacity: 1, duration: 0.55 }, 0)
      tl.to('.q-line',  { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0.1)
      tl.to('.q-word',  { y: '0%', duration: 0.85, stagger: { each: 0.06, from: 'start' } }, 0.25)
    }, ref)

    return () => ctx.revert()
  }, [])

  const quoteWords = ['Não', 'me', 'basta', 'funcionar.', 'Precisa', 'ser', 'impecável.']

  return (
    <section
      ref={ref}
      className="overflow-hidden"
      style={{
        background: '#0d0d0d',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: 'clamp(5rem, 12vw, 9rem) 0',
      }}
    >
      <div className="container-custom">
        <div
          className="q-line w-full mb-12"
          style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }}
        />

        <span className="q-label block text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/25 mb-10">
          Filosofia
        </span>

        <blockquote
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(2.2rem, 5.5vw, 5rem)',
            letterSpacing: '-0.04em',
            lineHeight: '1.05',
            fontWeight: 800,
          }}
        >
          {quoteWords.map((word, i) => (
            <span
              key={i}
              style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.28em' }}
            >
              <span
                className="q-word"
                style={{
                  display: 'inline-block',
                  color: i < 4 ? '#ffffff' : 'rgba(255,255,255,0.18)',
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </blockquote>
      </div>
    </section>
  )
}
