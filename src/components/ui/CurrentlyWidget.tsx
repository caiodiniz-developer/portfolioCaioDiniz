import { useEffect, useState } from 'react'

const GH_USER = 'caiodiniz-dev'
const SP_TZ   = 'America/Sao_Paulo'

function useSaoPauloTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    function tick() {
      setTime(new Date().toLocaleTimeString('pt-BR', { timeZone: SP_TZ, hour: '2-digit', minute: '2-digit' }))
    }
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])
  return time
}

function useGithubCommits() {
  const [count, setCount] = useState<number | null>(null)
  useEffect(() => {
    async function load() {
      try {
        const res    = await fetch(`https://api.github.com/users/${GH_USER}/events?per_page=100`)
        const events = await res.json()
        if (!Array.isArray(events)) return
        const today  = new Date().toISOString().slice(0, 10)
        let n = 0
        events.forEach((e: { type: string; created_at: string; payload?: { commits?: unknown[] } }) => {
          if (e.type === 'PushEvent' && e.created_at.startsWith(today)) {
            n += (e.payload?.commits?.length ?? 0)
          }
        })
        setCount(n)
      } catch { /* silent */ }
    }
    load()
    const id = setInterval(load, 10 * 60_000)
    return () => clearInterval(id)
  }, [])
  return count
}

export default function CurrentlyWidget() {
  const time    = useSaoPauloTime()
  const commits = useGithubCommits()
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 6,
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
      }}
    >
      {/* Expanded panel */}
      {expanded && (
        <div
          style={{
            background: 'rgba(10,10,12,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: '14px 18px',
            backdropFilter: 'blur(16px)',
            minWidth: 220,
            animation: 'currentlyExpand 0.22s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 12 }}>
            Currently
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Row icon="🌎" label="Location" value="São Paulo, BR" />
            <Row icon="🕐" label="Local time" value={time || '—'} />
            <Row
              icon="⚡"
              label="Commits hoje"
              value={commits === null ? 'carregando...' : commits === 0 ? 'dia de descanso' : `${commits} commit${commits > 1 ? 's' : ''}`}
              accent={!!commits}
            />
            <Row icon="🟢" label="Status" value="Disponível para projetos" accent />
          </div>
        </div>
      )}

      {/* Pill button */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 14px',
          background: 'rgba(10,10,12,0.92)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 999,
          backdropFilter: 'blur(16px)',
          cursor: 'pointer',
          transition: 'border-color 0.25s, background 0.25s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.22)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)' }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', flexShrink: 0, animation: 'statusPulse 2.4s ease-in-out infinite' }} />
        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em', fontFamily: 'Inter, sans-serif' }}>
          {time ? `${time} · São Paulo` : 'São Paulo'}
        </span>
      </button>

      <style>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(1.2); }
        }
        @keyframes currentlyExpand {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

function Row({ icon, label, value, accent = false }: { icon: string; label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 24, textAlign: 'center', fontSize: '0.8rem' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</p>
        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: accent ? '#22c55e' : 'rgba(255,255,255,0.7)', fontFamily: 'Inter, sans-serif' }}>{value}</p>
      </div>
    </div>
  )
}
