import { useEffect, useState, useRef, useCallback } from 'react'
import type { ReactElement } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, X, Radio, Send } from 'lucide-react'
import gsap from 'gsap'
import SplitType from 'split-type'
import { SITE } from '@/lib/constants'
import { useT } from '@/hooks/useTranslation'
import { useLanguageStore } from '@/store/useLanguageStore'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/* ── Supabase ── */
const SB_URL     = import.meta.env.VITE_SUPABASE_URL  as string | undefined
const SB_KEY     = import.meta.env.VITE_SUPABASE_ANON as string | undefined
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS    as string | undefined
const TABLE      = 'guestbook'
const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface Entry { id: string; name: string; message: string; created_at: string }

function sbFetch(path: string, opts?: RequestInit) {
  const headers: Record<string, string> = {
    apikey:         SB_KEY ?? '',
    Authorization:  `Bearer ${SB_KEY ?? ''}`,
    'Content-Type': 'application/json',
    ...((opts?.headers as Record<string, string>) ?? {}),
  }
  if (opts?.method === 'POST') headers.Prefer = 'return=representation'
  return fetch(`${SB_URL}/rest/v1/${path}`, { ...opts, headers })
}

const CONFIGURED = !!(SB_URL && SB_KEY)

/* ── Helpers ── */
const PALETTE = ['#4ade80', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa', '#fb923c', '#34d399', '#e879f9', '#38bdf8', '#f87171']

function accentColor(name: string) {
  let sum = 0; for (const ch of name) sum += ch.charCodeAt(0)
  return PALETTE[sum % PALETTE.length]
}

function initials(name: string) {
  return name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function timeAgo(iso: string, lang: 'en' | 'pt') {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (lang === 'en') {
    if (diff < 60)    return 'just now'
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
  }
  if (diff < 60)    return 'agora'
  if (diff < 3600)  return `${Math.floor(diff / 60)}m atrás`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

/* ── Custom sticker drawings ── */
type StickerKey = 'cat' | 'heart' | 'smile' | 'star' | 'zap'

// React 19 removed the global `JSX` namespace — use the React type directly.
const STICKER_SVGS: Record<StickerKey, ReactElement> = {
  cat: (
    <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
      <ellipse cx="16" cy="18" rx="10" ry="9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 13 L4 7 L10 11" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M25 13 L28 7 L22 11" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="12" cy="18" r="1.2" fill="currentColor" />
      <circle cx="20" cy="18" r="1.2" fill="currentColor" />
      <path d="M14 21 Q16 23 18 21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="16" y1="21" x2="16" y2="23.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
      <path d="M16 26 C16 26 5 19 5 12 C5 8.5 8 6 11 6 C13 6 15 7.5 16 9 C17 7.5 19 6 21 6 C24 6 27 8.5 27 12 C27 19 16 26 16 26Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <circle cx="11" cy="10" r="1" fill="currentColor" opacity="0.5" />
    </svg>
  ),
  smile: (
    <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="13" r="1.3" fill="currentColor" />
      <circle cx="20" cy="13" r="1.3" fill="currentColor" />
      <path d="M11 19 Q16 24 21 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
      <path d="M16 4 L18.5 12 L27 12 L20.5 17.5 L23 25.5 L16 21 L9 25.5 L11.5 17.5 L5 12 L13.5 12 Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  zap: (
    <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
      <path d="M19 4 L10 18 L16 18 L13 28 L23 14 L17 14 Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  ),
}

const STICKER_LABELS: Record<StickerKey, { en: string; pt: string }> = {
  cat:   { en: 'Cat',       pt: 'Gato'      },
  heart: { en: 'Heart',     pt: 'Coração'   },
  smile: { en: 'Happy',     pt: 'Feliz'     },
  star:  { en: 'Star',      pt: 'Estrela'   },
  zap:   { en: 'Energy',    pt: 'Energia'   },
}

const STICKER_COLORS: Record<StickerKey, string> = {
  cat:   '#60a5fa',
  heart: '#f472b6',
  smile: '#fbbf24',
  star:  '#a78bfa',
  zap:   '#4ade80',
}

const STICKER_KEYS = Object.keys(STICKER_SVGS) as StickerKey[]

function parseSticker(msg: string): { sticker: StickerKey | null; text: string } {
  const m = msg.match(/^\[(cat|heart|smile|star|zap)\] ([\s\S]+)/)
  if (m) return { sticker: m[1] as StickerKey, text: m[2] }
  return { sticker: null, text: msg }
}

/* ── AnimatedStickerIcon: draw-on effect for selected sticker ── */
function AnimatedStickerIcon({ stickerKey, color, size }: { stickerKey: StickerKey; color: string; size: number }) {
  const dn = (delay: number, dur = 0.5) => ({
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: dur, delay, ease: 'easeOut' as const },
  })

  const svgProps = {
    viewBox: '0 0 32 32',
    width: size,
    height: size,
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  if (stickerKey === 'cat') {
    return (
      <svg {...svgProps}>
        <motion.ellipse cx="16" cy="18" rx="10" ry="9" stroke={color} strokeWidth="1.5" {...dn(0)} />
        <motion.path d="M7 13 L4 7 L10 11" stroke={color} strokeWidth="1.5" {...dn(0.5)} />
        <motion.path d="M25 13 L28 7 L22 11" stroke={color} strokeWidth="1.5" {...dn(0.5)} />
        <motion.circle cx="12" cy="18" r="1.2"
          stroke={color} strokeWidth="0.8"
          initial={{ pathLength: 0, fill: 'transparent' }}
          animate={{ pathLength: 1, fill: color }}
          transition={{ duration: 0.3, delay: 0.7, ease: 'easeOut' }}
        />
        <motion.circle cx="20" cy="18" r="1.2"
          stroke={color} strokeWidth="0.8"
          initial={{ pathLength: 0, fill: 'transparent' }}
          animate={{ pathLength: 1, fill: color }}
          transition={{ duration: 0.3, delay: 0.7, ease: 'easeOut' }}
        />
        <motion.path d="M14 21 Q16 23 18 21" stroke={color} strokeWidth="1.2" {...dn(0.9)} />
        <motion.line x1="16" y1="21" x2="16" y2="23.5" stroke={color} strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 1.1, ease: 'easeOut' }}
        />
      </svg>
    )
  }

  if (stickerKey === 'heart') {
    return (
      <svg {...svgProps}>
        <motion.path
          d="M16 26 C16 26 5 19 5 12 C5 8.5 8 6 11 6 C13 6 15 7.5 16 9 C17 7.5 19 6 21 6 C24 6 27 8.5 27 12 C27 19 16 26 16 26Z"
          stroke={color} strokeWidth="1.5"
          {...dn(0, 0.8)}
        />
      </svg>
    )
  }

  if (stickerKey === 'smile') {
    return (
      <svg {...svgProps}>
        <motion.circle cx="16" cy="16" r="11" stroke={color} strokeWidth="1.5" {...dn(0, 0.6)} />
        <motion.circle cx="12" cy="13" r="1.3"
          stroke={color} strokeWidth="0.8"
          initial={{ pathLength: 0, fill: 'transparent' }}
          animate={{ pathLength: 1, fill: color }}
          transition={{ duration: 0.25, delay: 0.5, ease: 'easeOut' }}
        />
        <motion.circle cx="20" cy="13" r="1.3"
          stroke={color} strokeWidth="0.8"
          initial={{ pathLength: 0, fill: 'transparent' }}
          animate={{ pathLength: 1, fill: color }}
          transition={{ duration: 0.25, delay: 0.6, ease: 'easeOut' }}
        />
        <motion.path d="M11 19 Q16 24 21 19" stroke={color} strokeWidth="1.5" {...dn(0.7)} />
      </svg>
    )
  }

  if (stickerKey === 'star') {
    return (
      <svg {...svgProps}>
        <motion.path
          d="M16 4 L18.5 12 L27 12 L20.5 17.5 L23 25.5 L16 21 L9 25.5 L11.5 17.5 L5 12 L13.5 12 Z"
          stroke={color} strokeWidth="1.5"
          {...dn(0, 0.9)}
        />
      </svg>
    )
  }

  // zap
  return (
    <svg {...svgProps}>
      <motion.path
        d="M19 4 L10 18 L16 18 L13 28 L23 14 L17 14 Z"
        stroke={color} strokeWidth="1.5"
        {...dn(0, 0.7)}
      />
    </svg>
  )
}

/* ── Waveform: unique SVG per entry ── */
function Waveform({ seed, color }: { seed: string; color: string }) {
  const hash = seed.split('').reduce((a, c, i) => a + c.charCodeAt(0) * (i + 1), 7)
  const W = 200, H = 40
  const pts = Array.from({ length: 28 }, (_, i) => {
    const x = (i / 27) * W
    const amp = 9 + (hash % 9)
    const phase = (hash * 0.037) + i * 0.72
    const y = H / 2
      + Math.sin(phase) * amp * (0.5 + 0.5 * Math.sin(i * 0.4 + hash * 0.01))
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height: 32, display: 'block' }}
      aria-hidden
    >
      <polyline
        points={pts}
        stroke={color}
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  )
}

/* ── Signal card ── */
function SignalCard({
  entry, index, isAdmin, onDelete, onExpand,
}: {
  entry: Entry; index: number; isAdmin: boolean
  onDelete: (id: string) => void
  onExpand: (e: Entry) => void
}) {
  const lang  = useLanguageStore(s => s.lang)
  const color = accentColor(entry.name)
  const ini   = initials(entry.name)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1,  y: 0  }}
      exit={{   opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.38, delay: Math.min(index * 0.035, 0.7), ease: E }}
      style={{ breakInside: 'avoid', marginBottom: '1rem' }}
    >
      <button
        onClick={() => onExpand(entry)}
        style={{
          display:        'block',
          width:          '100%',
          textAlign:      'left',
          borderRadius:   14,
          border:         '1px solid rgba(255,255,255,0.07)',
          background:     'rgba(255,255,255,0.025)',
          overflow:       'hidden',
          cursor:         'pointer',
          transition:     'border-color 0.22s, transform 0.22s, background 0.22s',
          outline:        'none',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.borderColor = `${color}44`
          el.style.background  = 'rgba(255,255,255,0.045)'
          el.style.transform   = 'translateY(-3px)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(255,255,255,0.07)'
          el.style.background  = 'rgba(255,255,255,0.025)'
          el.style.transform   = 'translateY(0)'
        }}
      >
        {/* Accent bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${color}, ${color}55)` }} />

        {/* Waveform area */}
        <div style={{ padding: '0.7rem 1rem 0.2rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <Waveform seed={entry.name} color={color} />
        </div>

        {/* Body */}
        <div style={{ padding: '0.75rem 1rem 0.9rem' }}>
          {/* Name + avatar + time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.55rem' }}>
            <div style={{
              flexShrink:     0,
              width:          26,
              height:         26,
              borderRadius:   '50%',
              background:     `${color}18`,
              border:         `1.5px solid ${color}55`,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              fontSize:       '0.52rem',
              fontWeight:     800,
              color,
              letterSpacing:  '0.04em',
            }}>
              {ini}
            </div>
            <span style={{ flex: 1, fontSize: '0.78rem', fontWeight: 700, color: '#fff', letterSpacing: '0.01em' }}>
              {entry.name}
            </span>
            <span style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.05em', flexShrink: 0 }}>
              {timeAgo(entry.created_at, lang)}
            </span>
          </div>

          {/* Message (with optional sticker) */}
          {(() => {
            const { sticker, text } = parseSticker(entry.message)
            const sColor = sticker ? STICKER_COLORS[sticker] : color
            return (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                {sticker && (
                  <span style={{ color: sColor, flexShrink: 0, marginTop: 2, opacity: 0.9 }}>
                    {STICKER_SVGS[sticker]}
                  </span>
                )}
                <p style={{
                  margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.42)',
                  lineHeight: 1.65, display: '-webkit-box',
                  WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                  overflow: 'hidden', wordBreak: 'break-word', flex: 1,
                }}>
                  {text}
                </p>
              </div>
            )
          })()}

          {isAdmin && (
            <button
              onClick={e => { e.stopPropagation(); onDelete(entry.id) }}
              style={{
                marginTop:    8,
                display:      'inline-flex',
                alignItems:   'center',
                gap:          4,
                padding:      '2px 8px',
                borderRadius: 5,
                border:       '1px solid rgba(248,113,113,0.2)',
                background:   'rgba(248,113,113,0.05)',
                color:        '#f87171',
                fontSize:     '0.58rem',
                cursor:       'pointer',
              }}
            >
              <Trash2 size={9} /> del
            </button>
          )}
        </div>
      </button>
    </motion.div>
  )
}

/* ── Headline with GSAP char reveal ── */
function Headline({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!ref.current || prefersReducedMotion) return
    /* 'words, chars' — NOT 'chars' alone. Splitting only into characters gives
       the browser a break opportunity between every letter, which is why
       "marca" was wrapping as "mar / ca". The word wrappers keep each word
       atomic while the chars still animate individually. */
    const split = new SplitType(ref.current, { types: 'words,chars' })
    gsap.set(split.chars!, { yPercent: 110, opacity: 0 })
    gsap.to(split.chars!, {
      yPercent: 0, opacity: 1,
      duration: 0.65, ease: 'power3.out', stagger: 0.022, delay: 0.12,
    })
    return () => split.revert()
  }, [text, prefersReducedMotion])

  return (
    <h1
      ref={ref}
      style={{
        fontFamily:    'Syne, sans-serif',
        fontWeight:    800,
        fontSize:      'clamp(2.6rem,6.5vw,5rem)',
        letterSpacing: '-0.05em',
        lineHeight:    0.95,
        color:         '#fff',
        margin:        0,
        /* The per-word wrappers need their own overflow clipping; a single
           clip on the outer block cut the descenders of the lower line. */
        overflow:      'hidden',
      }}
    >
      {text}
    </h1>
  )
}

/* ── Field ── */
function Field({
  tag = 'input', value, onChange, placeholder, maxLength, required, rows,
}: {
  tag?: 'input' | 'textarea'
  value: string; onChange: (v: string) => void
  placeholder: string; maxLength: number
  required?: boolean; rows?: number
}) {
  const [focused, setFocused] = useState(false)
  const shared: React.CSSProperties = {
    width:         '100%',
    background:    focused ? 'rgba(255,255,255,0.04)' : 'transparent',
    border:        `1px solid ${focused ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius:  8,
    color:         '#fff',
    fontSize:      '0.88rem',
    fontFamily:    'inherit',
    padding:       '0.7rem 0.9rem',
    outline:       'none',
    resize:        tag === 'textarea' ? 'none' : undefined,
    transition:    'border-color 0.2s, background 0.2s',
    letterSpacing: '0.01em',
    lineHeight:    1.6,
    boxSizing:     'border-box',
  }

  return (
    <div style={{ position: 'relative' }}>
      {tag === 'textarea'
        ? <textarea
            value={value}
            onChange={e => onChange(e.target.value.slice(0, maxLength))}
            placeholder={placeholder}
            required={required}
            rows={rows ?? 4}
            style={shared}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        : <input
            value={value}
            onChange={e => onChange(e.target.value.slice(0, maxLength))}
            placeholder={placeholder}
            required={required}
            style={shared}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
      }
      <span style={{
        position: 'absolute', right: 10, bottom: 8,
        fontSize: '0.52rem', letterSpacing: '0.04em',
        color: value.length > maxLength * 0.88
          ? 'rgba(251,191,36,0.6)'
          : 'rgba(255,255,255,0.15)',
      }}>
        {value.length}/{maxLength}
      </span>
    </div>
  )
}

/* ── Page ── */
export default function GuestbookPage() {
  const t    = useT()
  const gb   = t.guestbook
  const lang = useLanguageStore(s => s.lang)

  const [entries,    setEntries]    = useState<Entry[]>([])
  const [loading,    setLoading]    = useState(CONFIGURED)
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [name,       setName]       = useState('')
  const [message,    setMessage]    = useState('')
  const [sticker,    setSticker]    = useState<StickerKey | null>(null)
  const [error,      setError]      = useState('')
  const [isAdmin,    setIsAdmin]    = useState(() =>
    typeof sessionStorage !== 'undefined' && sessionStorage.getItem('gb_admin') === '1'
  )
  const [active, setActive] = useState<Entry | null>(null)

  useEffect(() => { document.title = `${lang === 'en' ? 'Guestbook' : 'Livro de Visitas'} — ${SITE.name}` }, [lang])

  useEffect(() => {
    if (!CONFIGURED) return
    sbFetch(`${TABLE}?select=*&order=created_at.desc&limit=200`)
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then((data: Entry[]) => setEntries(Array.isArray(data) ? data : []))
      .catch(() => setError(gb.errorLoad))
      .finally(() => setLoading(false))
  }, [gb.errorLoad])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim() || !CONFIGURED) return
    setSubmitting(true); setError('')
    try {
      const finalMessage = sticker
        ? `[${sticker}] ${message.trim()}`
        : message.trim()
      const res = await sbFetch(TABLE, {
        method: 'POST',
        body:   JSON.stringify({ name: name.trim(), message: finalMessage }),
      })
      if (!res.ok) throw new Error()
      const [created]: Entry[] = await res.json()
      setEntries(prev => [created, ...prev])
      setName(''); setMessage(''); setSticker(null)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch { setError(gb.errorSend) }
    finally   { setSubmitting(false) }
  }

  function activateAdmin() {
    if (isAdmin) { sessionStorage.removeItem('gb_admin'); setIsAdmin(false); return }
    const pass = prompt(gb.adminPrompt)
    if (!pass || !ADMIN_PASS || pass !== ADMIN_PASS) return
    sessionStorage.setItem('gb_admin', '1'); setIsAdmin(true)
  }

  async function deleteEntry(id: string) {
    if (!confirm(gb.deleteConfirm)) return
    try {
      await sbFetch(`${TABLE}?id=eq.${id}`, { method: 'DELETE' })
      setEntries(prev => prev.filter(e => e.id !== id))
      setActive(null)
    } catch { alert(gb.errorDelete) }
  }

  const handleExpand = useCallback((entry: Entry) => setActive(entry), [])

  const countLabel = entries.length === 0
    ? gb.empty
    : `${entries.length} ${entries.length !== 1 ? gb.countPlural : gb.countSingular}`

  return (
    <main style={{ minHeight: '100svh', background: '#080808', position: 'relative' }}>

      {/* Noise texture overlay */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.4'/></svg>")`,
        opacity: 0.06,
      }} />

      {/* Grid lines */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div style={{ position: 'relative', zIndex: 1, paddingTop: 'clamp(6rem,10vw,8rem)', paddingBottom: 'clamp(2.5rem,5vw,4rem)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(1.25rem,4vw,3rem)' }}>

          {/* ── HERO ── */}
          <div style={{ marginBottom: 'clamp(2rem,4vw,3rem)' }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1,  y: 0  }}
              transition={{ duration: 0.5, ease: E }}
              style={{
                display:     'inline-flex',
                alignItems:  'center',
                gap:         8,
                marginBottom: '1.5rem',
                fontSize:    '0.6rem',
                fontWeight:  700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color:       'rgba(255,255,255,0.25)',
              }}
            >
              <Radio size={11} style={{ opacity: 0.5 }} />
              {lang === 'en' ? 'Signal received' : 'Sinal recebido'}
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#4ade80', animation: 'gb-blink 1.4s ease-in-out infinite' }} />
            </motion.div>

            <Headline text={lang === 'en' ? 'Leave your mark.' : 'Deixe sua marca.'} />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.5, ease: E }}
              style={{
                marginTop:  '1rem',
                fontSize:   'clamp(0.78rem,1.4vw,0.88rem)',
                color:      'rgba(255,255,255,0.28)',
                lineHeight: 1.7,
                maxWidth:   400,
              }}
            >
              {gb.subtitle}
            </motion.p>
          </div>

          {/* ── FORM ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1,  y: 0  }}
            transition={{ duration: 0.55, delay: 0.25, ease: E }}
            style={{
              borderRadius:   16,
              border:         '1px solid rgba(255,255,255,0.09)',
              background:     'rgba(255,255,255,0.02)',
              padding:        'clamp(1.25rem,3vw,2rem)',
              marginBottom:   'clamp(2rem,4vw,3rem)',
            }}
          >
            {/* Form header */}
            <div style={{
              display:       'flex',
              alignItems:    'center',
              gap:           10,
              marginBottom:  '1.5rem',
              paddingBottom: '1.25rem',
              borderBottom:  '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'rgba(74,222,128,0.08)',
                border: '1px solid rgba(74,222,128,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Radio size={13} style={{ color: '#4ade80', opacity: 0.8 }} />
              </div>
              <span style={{
                fontSize: '0.65rem', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
              }}>
                {lang === 'en' ? 'Broadcast a signal' : 'Transmitir um sinal'}
              </span>
            </div>

            {!CONFIGURED ? (
              <div style={{ padding: '1rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.3)' }}>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
                  Configure <code style={{ color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>.env.local</code>
                </p>
                <pre style={{ marginTop: '0.5rem', padding: '0.85rem 1rem', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.68rem', color: '#4ade80', fontFamily: 'monospace', lineHeight: 1.8, overflowX: 'auto' }}>
{`CREATE TABLE guestbook (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL, message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_all"   ON guestbook FOR SELECT USING (true);
CREATE POLICY "insert_all" ON guestbook FOR INSERT WITH CHECK (true);
CREATE POLICY "delete_all" ON guestbook FOR DELETE USING (true);`}
                </pre>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: '0.85rem', alignItems: 'start' }}>
                  <Field
                    value={name} onChange={setName}
                    placeholder={gb.namePlaceholder}
                    maxLength={32} required
                  />
                  <Field
                    tag="textarea" value={message} onChange={setMessage}
                    placeholder={gb.messagePlaceholder}
                    maxLength={280} required rows={3}
                  />
                </div>

                {/* Sticker picker */}
                <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>
                    {lang === 'en' ? 'Add a sticker' : 'Adicionar adesivo'}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {STICKER_KEYS.map((key) => {
                      const selected = sticker === key
                      const c = STICKER_COLORS[key]
                      return (
                        <button
                          key={key}
                          type="button"
                          title={lang === 'en' ? STICKER_LABELS[key].en : STICKER_LABELS[key].pt}
                          onClick={() => setSticker(selected ? null : key)}
                          style={{
                            width: 38, height: 38, borderRadius: 9, cursor: 'pointer',
                            background: selected ? `${c}18` : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${selected ? `${c}55` : 'rgba(255,255,255,0.08)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: selected ? c : 'rgba(255,255,255,0.35)',
                            transition: 'all 0.2s',
                            transform: selected ? 'scale(1.12)' : 'scale(1)',
                          }}
                        >
                          {selected
                            ? <AnimatedStickerIcon key={`anim-${key}`} stickerKey={key} color={c} size={24} />
                            : <span style={{ opacity: 0.4 }}>{STICKER_SVGS[key]}</span>
                          }
                        </button>
                      )
                    })}
                  </div>
                  {sticker && (
                    <button type="button" onClick={() => setSticker(null)}
                      style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.22)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                      {lang === 'en' ? 'clear' : 'limpar'}
                    </button>
                  )}
                </div>

                {error && (
                  <p style={{ margin: '0.65rem 0 0', fontSize: '0.72rem', color: '#f87171' }}>{error}</p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', gap: 12, flexWrap: 'wrap' }}>
                  <AnimatePresence>
                    {submitted && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                        {gb.sent}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <button
                    type="submit"
                    disabled={submitting || !name.trim() || !message.trim()}
                    style={{
                      marginLeft:     'auto',
                      display:        'inline-flex',
                      alignItems:     'center',
                      gap:            7,
                      padding:        '0.6rem 1.4rem',
                      borderRadius:   9,
                      border:         '1px solid rgba(255,255,255,0.14)',
                      background:     'rgba(255,255,255,0.06)',
                      color:          submitting || !name.trim() || !message.trim() ? 'rgba(255,255,255,0.2)' : '#fff',
                      fontSize:       '0.75rem',
                      fontWeight:     600,
                      letterSpacing:  '0.06em',
                      textTransform:  'uppercase',
                      cursor:         submitting || !name.trim() || !message.trim() ? 'default' : 'pointer',
                      transition:     'background 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={e => {
                      if (submitting || !name.trim() || !message.trim()) return
                      e.currentTarget.style.background    = 'rgba(255,255,255,0.11)'
                      e.currentTarget.style.borderColor   = 'rgba(255,255,255,0.25)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background  = 'rgba(255,255,255,0.06)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
                    }}
                  >
                    <Send size={13} />
                    {submitting ? gb.sending : gb.send}
                  </button>
                </div>
              </form>
            )}
          </motion.div>

          {/* ── ENTRIES ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', gap: 12 }}>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.4 }}
                style={{ margin: 0, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}
              >
                {loading ? gb.loading : countLabel}
              </motion.p>
              {isAdmin && (
                <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f87171', padding: '0.22rem 0.65rem', borderRadius: 999, border: '1px solid rgba(248,113,113,0.25)', background: 'rgba(248,113,113,0.06)' }}>
                  {gb.adminLabel}
                </span>
              )}
            </div>

            {/* Loading skeletons */}
            {loading && (
              <div style={{ columns: 'var(--col-w, 280px) 3', gap: '1rem' }}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    style={{ breakInside: 'avoid', marginBottom: '1rem', height: 140, borderRadius: 14, background: 'rgba(255,255,255,0.03)', animation: 'gb-pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            )}

            {/* Empty */}
            {!loading && entries.length === 0 && CONFIGURED && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.18)', fontSize: '0.82rem' }}
              >
                {gb.empty}
              </motion.div>
            )}

            {/* Signal grid */}
            {!loading && entries.length > 0 && (
              <div style={{ columns: 'var(--col-w, 280px) 3', gap: '1rem' }}>
                <AnimatePresence initial={false}>
                  {entries.map((entry, i) => (
                    <SignalCard
                      key={entry.id}
                      entry={entry}
                      index={i}
                      isAdmin={isAdmin}
                      onDelete={deleteEntry}
                      onExpand={handleExpand}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Admin toggle */}
          <div style={{ marginTop: '2.25rem', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={activateAdmin}
              title={isAdmin ? 'Exit admin' : 'Admin'}
              style={{ width: 6, height: 6, borderRadius: '50%', background: isAdmin ? '#f87171' : 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', padding: 0 }}
            />
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActive(null)}
              style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}
            >
              <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.9, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 24 }}
                transition={{ duration: 0.28, ease: E }}
                onClick={e => e.stopPropagation()}
                style={{
                  position: 'relative', width: '100%', maxWidth: 480,
                  maxHeight: '82svh', overflowY: 'auto',
                  borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)',
                  background: '#0e0e0e', boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
                  overflow: 'hidden',
                }}
              >
                {/* Accent top bar in modal */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${accentColor(active.name)}, ${accentColor(active.name)}44)` }} />

                <div style={{ padding: '1.5rem 1.75rem 1.75rem' }}>
                  {/* Close */}
                  <button
                    onClick={() => setActive(null)}
                    style={{ position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <X size={13} />
                  </button>

                  {/* Waveform in modal */}
                  <div style={{ marginBottom: '1.25rem', paddingRight: '2.5rem' }}>
                    <Waveform seed={active.name} color={accentColor(active.name)} />
                  </div>

                  {/* Name + time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: `${accentColor(active.name)}15`,
                      border: `1.5px solid ${accentColor(active.name)}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', fontWeight: 800, color: accentColor(active.name),
                    }}>
                      {initials(active.name)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{active.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.58rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.04em' }}>{timeAgo(active.created_at, lang)}</p>
                    </div>
                  </div>

                  <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: '1.25rem' }} />

                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                    {active.message}
                  </p>

                  {isAdmin && (
                    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => deleteEntry(active.id)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.45rem 1rem', borderRadius: 8, border: '1px solid rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.05)', color: '#f87171', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        <Trash2 size={11} /> Apagar
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes gb-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes gb-pulse { 0%,100%{opacity:.3} 50%{opacity:.6} }
        textarea::placeholder, input::placeholder { color: rgba(255,255,255,0.18); }
        ::-webkit-scrollbar { display: none; }
        @media (max-width: 640px) {
          [style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
