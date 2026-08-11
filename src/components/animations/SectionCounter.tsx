import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Fixed right-edge counter that shows which section is currently in view.
 * Very small, monospace, designed to be subtle — desktop only.
 */
export default function SectionCounter() {
  const [current, setCurrent] = useState(0)
  const [total,   setTotal]   = useState(0)
  const [visible, setVisible] = useState(false)
  const prevRef = useRef(0)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return

    // Wait one frame so all sections are mounted
    const frame = requestAnimationFrame(() => {
      const sections = Array.from(document.querySelectorAll('section'))
      if (!sections.length) return
      setTotal(sections.length)

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const idx = sections.indexOf(entry.target as HTMLElement)
              if (idx !== -1 && idx !== prevRef.current) {
                prevRef.current = idx
                setCurrent(idx + 1)
                setVisible(true)
              }
            }
          })
        },
        { threshold: 0.35 },
      )

      sections.forEach((s) => observer.observe(s))

      return () => observer.disconnect()
    })

    return () => cancelAnimationFrame(frame)
  }, [prefersReducedMotion])

  if (prefersReducedMotion) return null

  return (
    <div
      className="hidden lg:flex"
      style={{
        position:       'fixed',
        top:            '50%',
        right:          '1.25rem',
        transform:      'translateY(-50%)',
        zIndex:         40,
        flexDirection:  'column',
        alignItems:     'center',
        gap:            6,
        pointerEvents:  'none',
        opacity:        visible ? 1 : 0,
        transition:     'opacity 0.4s',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={current}
          initial={{ y: 6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -6, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily:    '"JetBrains Mono","Fira Code",monospace',
            fontSize:      '0.48rem',
            fontWeight:    700,
            letterSpacing: '0.14em',
            color:         'rgba(255,255,255,0.35)',
          }}
        >
          {String(current).padStart(2, '0')}
        </motion.span>
      </AnimatePresence>

      <div
        style={{
          width:      1,
          height:     24,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 1,
        }}
      />

      <span
        style={{
          fontFamily:    '"JetBrains Mono","Fira Code",monospace',
          fontSize:      '0.48rem',
          fontWeight:    700,
          letterSpacing: '0.14em',
          color:         'rgba(255,255,255,0.12)',
        }}
      >
        {String(total).padStart(2, '0')}
      </span>
    </div>
  )
}
