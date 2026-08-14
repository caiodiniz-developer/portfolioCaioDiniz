import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BatteryLow, X } from 'lucide-react'
import { useBatterySaver } from '@/hooks/useBatterySaver'
import { useLanguageStore } from '@/store/useLanguageStore'

/**
 * When the device is low on battery and unplugged, tone the site down and say
 * so. The heavy lifting is a single attribute on <html> — CSS in globals.css
 * shortens transitions and stops decorative loops from that one hook, so no
 * component needs to know this exists.
 *
 * The notice is dismissible and only ever shown once per session: telling
 * someone their battery is low is useful the first time and nagging after that.
 */
export default function BatterySaver() {
  const { saving, level } = useBatterySaver()
  const lang = useLanguageStore(s => s.lang)
  const en = lang === 'en'
  const [dismissed, setDismissed] = useState(false)
  const [announced, setAnnounced] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (saving) {
      root.setAttribute('data-battery-saver', '')
      if (!announced) setAnnounced(true)
    } else {
      root.removeAttribute('data-battery-saver')
    }
    return () => root.removeAttribute('data-battery-saver')
  }, [saving, announced])

  const show = saving && !dismissed
  const pct = level != null ? Math.round(level * 100) : null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          className="bs-toast"
        >
          <BatteryLow size={13} style={{ flexShrink: 0, color: '#fbbf24' }} />
          <span className="bs-text">
            {en
              ? `Battery at ${pct}% — I toned the animations down.`
              : `Bateria em ${pct}% — suavizei as animações.`}
          </span>
          <button
            onClick={() => setDismissed(true)}
            aria-label={en ? 'Dismiss' : 'Fechar'}
            className="bs-close"
          >
            <X size={11} />
          </button>

          <style>{`
            .bs-toast {
              position: fixed;
              left: 50%;
              bottom: 1.25rem;
              transform: translateX(-50%);
              z-index: 400;
              display: flex;
              align-items: center;
              gap: 0.6rem;
              padding: 0.6rem 0.75rem 0.6rem 1rem;
              border-radius: 999px;
              border: 1px solid rgba(255,255,255,0.12);
              background: rgba(15,15,15,0.92);
              backdrop-filter: blur(12px);
              box-shadow: 0 12px 40px rgba(0,0,0,0.5);
              max-width: calc(100vw - 2rem);
            }
            .bs-text {
              font-size: 0.66rem;
              font-weight: 600;
              letter-spacing: 0.02em;
              color: rgba(255,255,255,0.62);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .bs-close {
              width: 20px; height: 20px;
              display: flex; align-items: center; justify-content: center;
              border-radius: 50%;
              border: 0;
              background: transparent;
              color: rgba(255,255,255,0.3);
              cursor: pointer;
              flex-shrink: 0;
              padding: 0;
              transition: color 0.2s;
            }
            .bs-close:hover { color: #fff; }

            /* On phones the terminal button and clock already own the corners,
               so sit just above them. */
            @media (max-width: 720px) {
              .bs-toast { bottom: 5rem; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
