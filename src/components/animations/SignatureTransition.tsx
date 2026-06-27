import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

/* Flowing calligraphic path that looks like a handwritten signature */
const SIGNATURE_PATH =
  'M 18,58 C 28,22 58,6 82,28 C 102,46 96,72 76,78 C 56,84 38,68 44,52 C 50,36 74,32 92,44 C 112,58 120,82 114,92 C 108,102 94,96 88,84 C 82,72 96,56 118,50 C 140,44 162,58 168,74 M 168,74 C 174,90 166,104 154,98'

export default function SignatureTransition() {
  const location = useLocation()
  const [show, setShow]   = useState(false)
  const prevPath = useRef(location.pathname)

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname
      setShow(true)
      const t = setTimeout(() => setShow(false), 900)
      return () => clearTimeout(t)
    }
  }, [location.pathname])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="sig"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 8000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          {/* Subtle dark overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />

          <svg
            viewBox="0 0 186 110"
            fill="none"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: 'clamp(160px, 20vw, 260px)', position: 'relative' }}
          >
            <motion.path
              d={SIGNATURE_PATH}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 1, opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Glow duplicate */}
            <motion.path
              d={SIGNATURE_PATH}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 1, opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
