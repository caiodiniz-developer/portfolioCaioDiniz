import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { RealtimeClient } from '@supabase/realtime-js'
import type { RealtimeChannel } from '@supabase/realtime-js'
import { useLanguageStore } from '@/store/useLanguageStore'

/* Other visitors' cursors, live, on the page you're both looking at.
 *
 * Supabase Realtime, no database: presence says who is on which page (and
 * from which city), broadcast carries cursor positions. Positions are only
 * sent while someone else is on the same page, so a lone visitor costs zero
 * messages. y is in document space (scroll included) so a cursor stays over
 * the same content even when the two of you are scrolled differently.
 *
 * Loaded lazily, desktop only — see router.tsx. */

const SB_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON as string | undefined
const LIVE_CURSORS_ENABLED = !!(SB_URL && SB_KEY)

const CHANNEL = 'portfolio-cursors'
const SEND_EVERY_MS = 60
const STALE_MS = 6000
const PALETTE = ['#4ade80', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa', '#fb923c', '#38bdf8', '#f87171']

interface Presence { path: string; city: string | null }
interface Cursor { x: number; y: number; path: string; at: number }

const me = Math.random().toString(36).slice(2, 10)
const colorOf = (id: string) => PALETTE[[...id].reduce((s, c) => s + c.charCodeAt(0), 0) % PALETTE.length]

let cityPromise: Promise<string | null> | null = null
function getCity() {
  cityPromise ??= fetch('/api/geo')
    .then(r => (r.ok ? r.json() : null))
    .then((d: { city?: string | null } | null) => d?.city ?? null)
    .catch(() => null)
  return cityPromise
}

export default function LiveCursors() {
  const { pathname } = useLocation()
  const en = useLanguageStore(s => s.lang) === 'en'
  const [peers, setPeers] = useState<Record<string, Presence>>({})
  const [cursors, setCursors] = useState<Record<string, Cursor>>({})
  const [, tick] = useState(0)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const pathRef = useRef(pathname)
  const peersHereRef = useRef(0)
  pathRef.current = pathname

  /* Connect once for the whole visit. */
  useEffect(() => {
    if (!LIVE_CURSORS_ENABLED) return
    const client = new RealtimeClient(`${SB_URL!.replace(/^http/, 'ws')}/realtime/v1`, {
      params: { apikey: SB_KEY!, eventsPerSecond: 20 },
    })
    const channel = client.channel(CHANNEL, {
      config: { broadcast: { self: false }, presence: { key: me } },
    })
    channelRef.current = channel

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState<Presence>()
      const next: Record<string, Presence> = {}
      for (const [key, metas] of Object.entries(state)) {
        if (key !== me && metas[0]) next[key] = { path: metas[0].path, city: metas[0].city }
      }
      setPeers(next)
      setCursors(prev => Object.fromEntries(Object.entries(prev).filter(([id]) => id in next)))
    })

    channel.on('broadcast', { event: 'c' }, ({ payload }) => {
      const p = payload as { id: string; x: number; y: number; path: string }
      setCursors(prev => ({ ...prev, [p.id]: { x: p.x, y: p.y, path: p.path, at: Date.now() } }))
    })

    channel.subscribe(async status => {
      // A nice-to-have: if the project is unreachable, give up quietly
      // instead of retrying (and logging) for the rest of the visit.
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') { client.disconnect(); return }
      if (status !== 'SUBSCRIBED') return
      await channel.track({ path: pathRef.current, city: await getCity() })
    })

    return () => {
      channelRef.current = null
      client.removeChannel(channel)
      client.disconnect()
    }
  }, [])

  /* Tell the others when we change page. */
  useEffect(() => {
    const ch = channelRef.current
    if (!ch) return
    getCity().then(city => ch.track({ path: pathname, city }))
  }, [pathname])

  const peersHere = Object.values(peers).filter(p => p.path === pathname).length
  peersHereRef.current = peersHere

  /* Send our position — throttled, and only when someone can see it. */
  useEffect(() => {
    let last = 0
    let lastX = -1, lastY = -1
    const send = (clientX: number, clientY: number) => {
      lastX = clientX; lastY = clientY
      const now = performance.now()
      if (!peersHereRef.current || now - last < SEND_EVERY_MS) return
      last = now
      channelRef.current?.send({
        type: 'broadcast', event: 'c',
        payload: { id: me, x: clientX / window.innerWidth, y: clientY + window.scrollY, path: pathRef.current },
      })
    }
    const onMove = (e: MouseEvent) => send(e.clientX, e.clientY)
    const onScroll = () => { if (lastX >= 0) send(lastX, lastY) }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  /* Re-render on scroll so cursors stay pinned to content, and every second
     so idle cursors fade out. */
  useEffect(() => {
    let raf = 0
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => tick(t => t + 1)) }
    window.addEventListener('scroll', onScroll, { passive: true })
    const id = setInterval(() => tick(t => t + 1), 1000)
    return () => { window.removeEventListener('scroll', onScroll); clearInterval(id); cancelAnimationFrame(raf) }
  }, [])

  if (!LIVE_CURSORS_ENABLED) return null
  const now = Date.now()

  return (
    <>
      {Object.entries(cursors).map(([id, c]) => {
        if (c.path !== pathname) return null
        const peer = peers[id]
        const idle = now - c.at > STALE_MS
        const color = colorOf(id)
        const label = peer?.city ?? (en ? 'Visitor' : 'Visitante')
        return (
          <div
            key={id}
            aria-hidden
            style={{
              position: 'fixed', left: 0, top: 0, zIndex: 9990, pointerEvents: 'none',
              transform: `translate(${c.x * window.innerWidth}px, ${c.y - window.scrollY}px)`,
              transition: 'transform 120ms linear, opacity 0.6s',
              opacity: idle ? 0 : 1,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" style={{ display: 'block' }}>
              <path d="M1 1 L13 6 L7.5 7.5 L6 13 Z" fill={color} stroke="#0d0d0d" strokeWidth="1" strokeLinejoin="round" />
            </svg>
            <span style={{
              display: 'inline-block', marginTop: 2, marginLeft: 10,
              padding: '2px 7px', borderRadius: 999,
              background: color, color: '#0d0d0d',
              fontFamily: 'Inter, sans-serif', fontSize: '0.6rem', fontWeight: 700,
              whiteSpace: 'nowrap',
            }}>
              {label}
            </span>
          </div>
        )
      })}

      {peersHere > 0 && (
        <div
          role="status"
          style={{
            position: 'fixed', right: 24, bottom: 24, zIndex: 400,
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '0.45rem 0.8rem', borderRadius: 999,
            background: 'rgba(13,13,13,0.85)', border: '1px solid rgba(255,255,255,0.1)',
            fontFamily: 'Inter, sans-serif', fontSize: '0.62rem', fontWeight: 600,
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
          {en
            ? `${peersHere} ${peersHere === 1 ? 'person' : 'people'} here with you`
            : `${peersHere} ${peersHere === 1 ? 'pessoa' : 'pessoas'} aqui com você`}
        </div>
      )}
    </>
  )
}
