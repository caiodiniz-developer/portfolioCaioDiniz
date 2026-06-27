import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

interface RevealImageProps {
  src: string
  alt: string
  className?: string
  containerClassName?: string
  delay?: number
  parallax?: boolean
}

export default function RevealImage({
  src,
  alt,
  className,
  containerClassName,
  delay = 0,
  parallax = false,
}: RevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const el = containerRef.current
    const img = imgRef.current
    if (!el || !img || prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.0,
          ease: 'power3.out',
          delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        }
      )

      if (parallax) {
        gsap.fromTo(
          img,
          { scale: 1.15, y: 20 },
          {
            scale: 1,
            y: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          }
        )
      }
    })

    return () => ctx.revert()
  }, [delay, parallax, prefersReducedMotion])

  return (
    <div
      ref={containerRef}
      className={cn('overflow-hidden', containerClassName)}
      style={{ clipPath: 'inset(100% 0 0 0)' }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn('w-full h-full object-cover', className)}
      />
    </div>
  )
}
