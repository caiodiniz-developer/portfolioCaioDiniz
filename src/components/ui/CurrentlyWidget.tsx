import { useEffect, useState } from 'react'
import { MapPin, Clock, GitCommit, CheckCircle2, Laptop } from 'lucide-react'
import { usePresentationStore } from '@/store/usePresentationStore'

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
  const time       = useSaoPauloTime()
  const commits    = useGithubCommits()
  const presenting = usePresentationStore((s) => s.active)
  const [visible,  setVisible]  = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  )

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!visible || presenting || isMobile) return null

  return (
    <div
      style={{
        position:       'fixed',
        bottom:         'clamp(12px, 3vw, 24px)',
        right:          'clamp(12px, 3vw, 24px)',
        zIndex:         200,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'flex-end',
        gap:            6,
        opacity:        visible ? 1 : 0,
        transform:      visible ? 'translateY(0)' : 'translateY(12px)',
        transition:     'all 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Expanded panel */}
      {expanded && (
        <div
          style={{
            background:     'rgba(10,10,12,0.96)',
            border:         '1px solid rgba(255,255,255,0.1)',
            borderRadius:   12,
            padding:        '14px 18px',
            backdropFilter: 'blur(20px)',
            minWidth:       'min(230px, calc(100vw - 48px))',
            animation:      'currentlyExpand 0.22s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 14 }}>
            Currently
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Row icon={<MapPin size={12} />}      label="Location"     value="Campinas, SP · Brasil" />
            <Row icon={<Clock size={12} />}        label="Horário local" value={time || '—'} />
            <Row icon={<Laptop size={12} />}       label="Projeto atual" value="Portfólio Premium v2" accent />
            <Row
              icon={<GitCommit size={12} />}
              label="Commits hoje"
              value={
                commits === null ? 'carregando...'
                : commits === 0  ? 'dia de descanso ☕'
                : `${commits} commit${commits > 1 ? 's' : ''}`
              }
              accent={!!commits}
            />
            <Row icon={<CheckCircle2 size={12} />} label="Status" value="Disponível para projetos" accent />
          </div>
        </div>
      )}

      {/* Pill */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          display:        'flex',
          alignItems:     'center',
          gap:            8,
          padding:        '8px 14px',
          background:     'rgba(10,10,12,0.92)',
          border:         '1px solid rgba(255,255,255,0.1)',
          borderRadius:   999,
          backdropFilter: 'blur(16px)',
          cursor:         'pointer',
          transition:     'border-color 0.25s, background 0.25s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.22)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)' }}
      >
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#22c55e', boxShadow: '0 0 6px #22c55e',
          flexShrink: 0, animation: 'statusPulse 2.4s ease-in-out infinite',
        }} />
        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em', fontFamily: 'Inter, sans-serif' }}>
          {time ? `${time} · São Paulo` : 'São Paulo'}
        </span>
      </button>

      <style>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 1;   transform: scale(1);   }
          50%       { opacity: 0.6; transform: scale(1.2); }
        }
        @keyframes currentlyExpand {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  )
}

function Row({ icon, label, value, accent = false }: {
  icon: React.ReactNode
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent ? '#22c55e' : 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
        {icon}
      </span>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: '0.58rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 1 }}>{label}</p>
        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: accent ? '#22c55e' : 'rgba(255,255,255,0.7)', fontFamily: 'Inter, sans-serif' }}>{value}</p>
      </div>
    </div>
  )
}
