import { useRef, useEffect, type ElementType, type ReactNode } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

interface RevealTextProps {
  text: string | ReactNode
  as?: ElementType
  delay?: number
  stagger?: number
  className?: string
  once?: boolean
}

export default function RevealText({
  text,
  as: Tag = 'p',
  delay = 0,
  stagger = 0.05,
  className,
  once = true,
}: RevealTextProps) {
  const containerRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const el = containerRef.current
    if (!el || prefersReducedMotion) return

    const words = el.querySelectorAll<HTMLSpanElement>('.split-word-inner')
    if (!words.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { y: '110%' },
        {
          y: '0%',
          duration: 0.8,
          ease: 'power3.out',
          stagger,
          delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once,
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [delay, stagger, once, prefersReducedMotion])

  const content = typeof text === 'string' ? (
    text.split(' ').map((word, i) => (
      <span key={i} className="split-word">
        <span className="split-word-inner">{word}</span>
        {i < text.split(' ').length - 1 ? ' ' : ''}
      </span>
    ))
  ) : text

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TagComponent = Tag as any
  return (
    <TagComponent ref={containerRef} className={cn('overflow-hidden', className)}>
      {content}
    </TagComponent>
  )
}
