import { type ReactNode, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const ROUTE_NAMES: Record<string, string> = {
  '/':          'home.tsx',
  '/about':     'about.tsx',
  '/projects':  'projects.tsx',
  '/services':  'services.tsx',
  '/contact':   'contact.tsx',
}

function IdeTab({ pathname }: { pathname: string }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 750)
    return () => clearTimeout(t)
  }, [])

  const name = ROUTE_NAMES[pathname] ?? `${pathname.split('/').filter(Boolean).pop() ?? 'page'}.tsx`

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="ide-tab"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9998,
            pointerEvents: 'none',
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '0 clamp(1rem,3vw,2.5rem)',
            height: 32,
            background: 'rgba(8,8,10,0.96)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
          <span style={{
            fontFamily: '"JetBrains Mono","Fira Code",monospace',
            fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em',
          }}>
            {name}
          </span>
          <span style={{
            marginLeft: 'auto',
            fontFamily: '"JetBrains Mono","Fira Code",monospace',
            fontSize: '0.58rem', color: 'rgba(255,255,255,0.12)', letterSpacing: '0.04em',
          }}>
            TypeScript React
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  return (
    <>
      <IdeTab pathname={pathname} />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  )
}
