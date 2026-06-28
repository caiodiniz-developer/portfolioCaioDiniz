import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePresentationStore } from '@/store/usePresentationStore'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function PresentationMode() {
  const { active, exit } = usePresentationStore()

  useEffect(() => {
    if (!active) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') exit() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [active, exit])

  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Cinematic dark overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9970,
              background: 'rgba(0,0,0,0.32)',
              pointerEvents: 'none',
            }}
          />

          {/* Vignette ring */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9971,
              background: 'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(0,0,0,0.55) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* ESC / exit pill */}
          <motion.button
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.4, delay: 0.12, ease: E }}
            onClick={exit}
            style={{
              position:       'fixed',
              top:            20,
              right:          20,
              zIndex:         9990,
              display:        'flex',
              alignItems:     'center',
              gap:            10,
              padding:        '0.5rem 1.1rem 0.5rem 0.75rem',
              background:     'rgba(8,8,10,0.94)',
              border:         '1px solid rgba(255,255,255,0.12)',
              borderRadius:   999,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color:          'rgba(255,255,255,0.5)',
              fontSize:       '0.6rem',
              fontWeight:     700,
              letterSpacing:  '0.1em',
              textTransform:  'uppercase',
              cursor:         'pointer',
              transition:     'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#fff'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.28)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'
            }}
          >
            <span style={{
              display:        'inline-flex',
              alignItems:     'center',
              justifyContent: 'center',
              width:          22,
              height:         17,
              borderRadius:   4,
              background:     'rgba(255,255,255,0.07)',
              border:         '1px solid rgba(255,255,255,0.14)',
              fontSize:       '0.52rem',
              letterSpacing:  '0.03em',
              flexShrink:     0,
            }}>
              ESC
            </span>
            Sair do modo apresentação
          </motion.button>

          {/* Mode indicator — bottom left, subtle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.2, ease: E }}
            style={{
              position:   'fixed',
              bottom:     20,
              left:       20,
              zIndex:     9990,
              display:    'flex',
              alignItems: 'center',
              gap:        7,
              fontSize:   '0.55rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color:      'rgba(255,255,255,0.2)',
              pointerEvents: 'none',
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
              animation: 'pmPulse 2s ease-in-out infinite',
            }} />
            Modo apresentação
          </motion.div>

          <style>{`
            @keyframes pmPulse {
              0%, 100% { opacity: 0.6; }
              50%       { opacity: 1; }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  )
}
