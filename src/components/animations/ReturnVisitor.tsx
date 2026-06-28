import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const KEY = 'caio_last_visit'

export default function ReturnVisitor() {
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    const last = localStorage.getItem(KEY)
    const now  = Date.now()

    if (last) {
      const days = Math.floor((now - Number(last)) / 86400000)
      if (days === 0) setMsg('Boa ver você por aqui de novo hoje 👋')
      else if (days === 1) setMsg('Bem-vindo de volta! Voltou ontem também 🙌')
      else setMsg(`Bem-vindo de volta! Última visita: há ${days} dia${days > 1 ? 's' : ''} ✨`)
    }

    localStorage.setItem(KEY, String(now))
  }, [])

  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={() => {
            setTimeout(() => setMsg(null), 4500)
          }}
          style={{
            position: 'fixed', bottom: '1.5rem', left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999, pointerEvents: 'auto',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.7rem 1.1rem 0.7rem 1rem',
            background: 'rgba(20,20,20,0.92)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 999,
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0, animation: 'rvpulse 2s ease-in-out infinite' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.82)', letterSpacing: '-0.01em' }}>
            {msg}
          </span>
          <button
            onClick={() => setMsg(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'rgba(255,255,255,0.3)', display: 'flex', flexShrink: 0, transition: 'color 0.15s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)')}
          >
            <X size={13} />
          </button>
        </motion.div>
      )}
      <style>{`@keyframes rvpulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(34,197,94,.45)}50%{opacity:.7;box-shadow:0 0 0 5px rgba(34,197,94,0)}}`}</style>
    </AnimatePresence>
  )
}
