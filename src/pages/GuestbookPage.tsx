import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, X } from 'lucide-react'
import gsap from 'gsap'
import SplitType from 'split-type'
import { SITE } from '@/lib/constants'
import { useT } from '@/hooks/useTranslation'
import { useLanguageStore } from '@/store/useLanguageStore'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { LiquidMetalButton } from '@/components/ui/LiquidMetalButton'

/* ─────────────────────────────────────────────────────── */
/* Supabase config — untouched                            */
/* ─────────────────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────────────── */
/* Helpers                                                */
/* ─────────────────────────────────────────────────────── */

function avatarColor(name: string) {
  const palette = ['#4ade80', '#60a5fa', '#f87171', '#fbbf24', '#a78bfa', '#fb923c', '#34d399', '#e879f9']
  let sum = 0; for (const ch of name) sum += ch.charCodeAt(0)
  return palette[sum % palette.length]
}

function initials(name: string) {
  return name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function timeAgo(iso: string, lang: 'en' | 'pt') {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (lang === 'en') {
    if (diff < 60)    return 'just now'
    if (diff < 3600)  return `${Math.floor(diff / 60)}min ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
  }
  if (diff < 60)    return 'agora mesmo'
  if (diff < 3600)  return `${Math.floor(diff / 60)}min atrás`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

/** Stable pseudo-random position based on entry id + index */
function cardPosition(id: string, i: number) {
  const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const col   = i % 3                              // 0..2 horizontal thirds
  const baseX = col * 33 + 2                       // 2%, 35%, 68%
  const jitterX = ((hash * 137 + i * 61) % 18) - 9 // ±9%
  const baseY   = Math.floor(i / 3) % 3 * 30 + 5  // row-based 5/35/65%
  const jitterY = ((hash * 239 + i * 97) % 20) - 10 // ±10%
  const floatDuration = 7 + (hash % 6)             // 7–12 s
  const floatDelay    = (hash % 10) * 0.3          // 0–3 s
  const rotateInit    = ((hash % 10) - 5) * 0.6    // ±3°
  return {
    x: Math.min(Math.max(baseX + jitterX, 2), 68), // clamp 2–68%
    y: Math.min(Math.max(baseY + jitterY, 2), 75), // clamp 2–75%
    floatDuration,
    floatDelay,
    rotateInit,
  }
}

/* ─────────────────────────────────────────────────────── */
/* Floating glass card                                    */
/* ─────────────────────────────────────────────────────── */

function FloatingCard({
  entry,
  index,
  onClick,
  isAdmin,
  onDelete,
}: {
  entry:    Entry
  index:    number
  onClick:  () => void
  isAdmin:  boolean
  onDelete: (id: string) => void
}) {
  const { x, y, floatDuration, floatDelay, rotateInit } = cardPosition(entry.id, index)
  const color = avatarColor(entry.name)
  const ini   = initials(entry.name)
  const lang  = useLanguageStore((s) => s.lang)
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={{ opacity: 1, scale: 1,   y: 0  }}
      exit={{   opacity: 0, scale: 0.7,  y: 20 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.8), ease: E }}
      style={{
        position:  'absolute',
        left:      `${x}%`,
        top:       `${y}%`,
        /* CSS `translate` property composes with Framer Motion's `transform`
           so the float bob doesn't clobber the enter animation */
        animation: prefersReducedMotion
          ? 'none'
          : `gb-float ${floatDuration}s ${floatDelay}s ease-in-out infinite alternate`,
        rotate:   `${rotateInit}deg`,  // Framer Motion rotate property — composable
        zIndex:    index % 4 === 0 ? 3 : index % 3 === 0 ? 2 : 1,
        maxWidth:  220,
      }}
    >
      <button
        onClick={onClick}
        className="gb-glass-card group"
        style={{
          display:        'flex',
          flexDirection:  'column',
          gap:            8,
          padding:        '0.75rem 1rem',
          borderRadius:   14,
          border:         '1px solid rgba(255,255,255,0.1)',
          background:     'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          cursor:         'pointer',
          textAlign:      'left',
          width:          '100%',
          transition:     'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.25s, box-shadow 0.3s',
          outline:        'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform    = `rotate(${rotateInit * 0.5}deg) scale(1.05)`
          e.currentTarget.style.borderColor  = `${color}44`
          e.currentTarget.style.boxShadow    = `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${color}22`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform    = `rotate(${rotateInit * 0}deg) scale(1)`
          e.currentTarget.style.borderColor  = 'rgba(255,255,255,0.1)'
          e.currentTarget.style.boxShadow    = 'none'
        }}
      >
        {/* Avatar + name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              flexShrink:   0,
              width:        28,
              height:       28,
              borderRadius: '50%',
              background:   `${color}22`,
              border:       `1.5px solid ${color}66`,
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              fontSize:     '0.58rem',
              fontWeight:   800,
              color,
            }}
          >
            {ini}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 }}>
              {entry.name}
            </p>
            <p style={{ margin: 0, fontSize: '0.52rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.03em' }}>
              {timeAgo(entry.created_at, lang)}
            </p>
          </div>
        </div>

        {/* Message preview */}
        <p
          style={{
            margin:    0,
            fontSize:  '0.68rem',
            color:     'rgba(255,255,255,0.5)',
            lineHeight: 1.55,
            display:   '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow:  'hidden',
          }}
        >
          {entry.message}
        </p>

        {/* Admin delete */}
        {isAdmin && (
          <button
            onClick={e => { e.stopPropagation(); onDelete(entry.id) }}
            style={{
              alignSelf:    'flex-end',
              display:      'inline-flex',
              alignItems:   'center',
              gap:          4,
              padding:      '2px 7px',
              borderRadius: 5,
              border:       '1px solid rgba(248,113,113,0.25)',
              background:   'rgba(248,113,113,0.06)',
              color:        '#f87171',
              fontSize:     '0.58rem',
              cursor:       'pointer',
            }}
          >
            <Trash2 size={9} /> del
          </button>
        )}
      </button>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────── */
/* Mobile stacked card                                    */
/* ─────────────────────────────────────────────────────── */

function StackedCard({
  entry,
  index,
  onClick,
  isAdmin,
  onDelete,
}: {
  entry:    Entry
  index:    number
  onClick:  () => void
  isAdmin:  boolean
  onDelete: (id: string) => void
}) {
  const color = avatarColor(entry.name)
  const ini   = initials(entry.name)
  const lang  = useLanguageStore((s) => s.lang)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1,  y: 0  }}
      exit={{   opacity: 0,   y: 16 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.04, 0.6), ease: E }}
    >
      <button
        onClick={onClick}
        style={{
          display:        'flex',
          gap:            12,
          alignItems:     'flex-start',
          width:          '100%',
          padding:        '1rem',
          borderRadius:   14,
          border:         '1px solid rgba(255,255,255,0.07)',
          background:     'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(12px)',
          cursor:         'pointer',
          textAlign:      'left',
          transition:     'border-color 0.2s, background 0.2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}33`; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' }}
      >
        <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: `${color}22`, border: `1.5px solid ${color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color }}>
          {ini}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{entry.name}</p>
            <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.22)', whiteSpace: 'nowrap', flexShrink: 0 }}>{timeAgo(entry.created_at, lang)}</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {entry.message}
          </p>
          {isAdmin && (
            <button
              onClick={e => { e.stopPropagation(); onDelete(entry.id) }}
              style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 5, border: '1px solid rgba(248,113,113,0.25)', background: 'rgba(248,113,113,0.06)', color: '#f87171', fontSize: '0.6rem', cursor: 'pointer' }}
            >
              <Trash2 size={10} /> Apagar
            </button>
          )}
        </div>
      </button>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────── */
/* Headline char reveal (GSAP, on mount)                  */
/* ─────────────────────────────────────────────────────── */

function GuestbookHeadline({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!ref.current || prefersReducedMotion) return
    const split = new SplitType(ref.current, { types: 'chars' })
    gsap.from(split.chars!, {
      y:        '110%',
      opacity:  0,
      duration: 0.7,
      ease:     'power3.out',
      stagger:  0.028,
      delay:    0.15,
    })
  }, [text, prefersReducedMotion])

  return (
    <div style={{ overflow: 'hidden' }}>
      <h1
        ref={ref}
        style={{
          fontFamily:    'Syne, sans-serif',
          fontWeight:    900,
          fontSize:      'clamp(3.2rem,8vw,6.5rem)',
          letterSpacing: '-0.055em',
          lineHeight:    0.88,
          color:         '#fff',
          margin:        0,
          display:       'block',
        }}
      >
        {text}
      </h1>
    </div>
  )
}

/* ─────────────────────────────────────────────────────── */
/* Underline-only input                                   */
/* ─────────────────────────────────────────────────────── */

function UnderlineInput({
  value,
  onChange,
  placeholder,
  maxLength,
  required,
  inputRef,
}: {
  value:       string
  onChange:    (v: string) => void
  placeholder: string
  maxLength:   number
  required?:   boolean
  inputRef?:   React.Ref<HTMLInputElement>
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        value={value}
        onChange={e => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        required={required}
        style={{
          width:         '100%',
          background:    'transparent',
          border:        'none',
          borderBottom:  `1px solid ${focused ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)'}`,
          borderRadius:  0,
          color:         '#fff',
          fontSize:      '0.9rem',
          fontFamily:    'Inter, sans-serif',
          padding:       '0.65rem 0',
          outline:       'none',
          transition:    'border-color 0.25s',
          letterSpacing: '0.01em',
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <span
        style={{
          position:  'absolute',
          right:     0,
          bottom:    6,
          fontSize:  '0.55rem',
          color:     value.length > maxLength * 0.9
            ? 'rgba(251,191,36,0.6)'
            : 'rgba(255,255,255,0.18)',
          letterSpacing: '0.04em',
        }}
      >
        {value.length}/{maxLength}
      </span>
    </div>
  )
}

function UnderlineTextarea({
  value,
  onChange,
  placeholder,
  maxLength,
  required,
}: {
  value:       string
  onChange:    (v: string) => void
  placeholder: string
  maxLength:   number
  required?:   boolean
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        required={required}
        rows={3}
        style={{
          width:         '100%',
          background:    'transparent',
          border:        'none',
          borderBottom:  `1px solid ${focused ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)'}`,
          borderRadius:  0,
          color:         '#fff',
          fontSize:      '0.88rem',
          fontFamily:    'Inter, sans-serif',
          padding:       '0.65rem 0',
          outline:       'none',
          resize:        'none',
          lineHeight:    1.6,
          transition:    'border-color 0.25s',
          boxSizing:     'border-box',
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <span
        style={{
          position:  'absolute',
          right:     0,
          bottom:    6,
          fontSize:  '0.55rem',
          color:     value.length > maxLength * 0.9
            ? 'rgba(251,191,36,0.6)'
            : 'rgba(255,255,255,0.18)',
          letterSpacing: '0.04em',
        }}
      >
        {value.length}/{maxLength}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────── */
/* Page                                                   */
/* ─────────────────────────────────────────────────────── */

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
  const [error,      setError]      = useState('')
  const [isAdmin,    setIsAdmin]    = useState(() =>
    typeof sessionStorage !== 'undefined' && sessionStorage.getItem('gb_admin') === '1'
  )
  const [active, setActive] = useState<Entry | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => { document.title = `Guestbook — ${SITE.name}` }, [])

  useEffect(() => {
    if (!CONFIGURED) return
    setLoading(true)
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
      const res = await sbFetch(TABLE, {
        method: 'POST',
        body:   JSON.stringify({ name: name.trim(), message: message.trim() }),
      })
      if (!res.ok) throw new Error()
      const [created]: Entry[] = await res.json()
      setEntries(prev => [created, ...prev])
      setName(''); setMessage('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch { setError(gb.errorSend) }
    finally { setSubmitting(false) }
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

  const handleCardClick = useCallback((entry: Entry) => setActive(entry), [])

  const countLabel = `${entries.length} ${entries.length !== 1 ? gb.countPlural : gb.countSingular}`

  return (
    <main
      style={{
        position:   'relative',
        minHeight:  '100svh',
        background: '#0d0d0d',
        overflow:   'hidden',
      }}
    >
      {/* Background video */}
      <video
        autoPlay muted loop playsInline
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.14, zIndex: 0, pointerEvents: 'none' }}
      >
        <source src="/assets/bg-video.mp4" type="video/mp4" />
      </video>
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(to bottom, rgba(13,13,13,0.6) 0%, rgba(13,13,13,0.25) 40%, rgba(13,13,13,0.75) 100%)', zIndex: 1, pointerEvents: 'none' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, paddingTop: '7rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(2rem,5vw,4rem) clamp(1.25rem,4vw,2.5rem) 6rem' }}>

          {/* ── Hero headline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: 'clamp(2.5rem,5vw,4rem)' }}
          >
            <span style={{
              fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem',
            }}>
              <span style={{ display: 'inline-block', width: 18, height: 1, background: 'rgba(255,255,255,0.15)' }} />
              {gb.badge}
            </span>

            <GuestbookHeadline text={lang === 'en' ? 'Leave your mark.' : 'Deixe sua marca.'} />

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1,  y: 0  }}
              transition={{ duration: 0.6, delay: 0.55, ease: E }}
              style={{ marginTop: '1.1rem', fontSize: 'clamp(0.8rem,1.5vw,0.9rem)', color: 'rgba(255,255,255,0.32)', lineHeight: 1.65, maxWidth: 440 }}
            >
              {gb.subtitle}
            </motion.p>
          </motion.div>

          {/* ── Form */}
          {!CONFIGURED ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              style={{ padding: '1.5rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(13,13,13,0.55)', backdropFilter: 'blur(12px)' }}
            >
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
                Configure <code style={{ color: '#4ade80', background: 'rgba(74,222,128,0.08)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>.env.local</code> e rode no SQL Editor do Supabase:
              </p>
              <pre style={{ marginTop: '0.5rem', padding: '0.9rem 1rem', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', fontSize: '0.7rem', color: '#4ade80', fontFamily: 'monospace', lineHeight: 1.8, overflowX: 'auto' }}>
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
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1,  y: 0  }}
              transition={{ duration: 0.55, delay: 0.3, ease: E }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <UnderlineInput
                  inputRef={nameRef}
                  value={name}
                  onChange={setName}
                  placeholder={gb.namePlaceholder}
                  maxLength={32}
                  required
                />
                <UnderlineTextarea
                  value={message}
                  onChange={setMessage}
                  placeholder={gb.messagePlaceholder}
                  maxLength={280}
                  required
                />
              </div>

              {error && (
                <p style={{ margin: '0.75rem 0 0', fontSize: '0.72rem', color: '#f87171' }}>{error}</p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginTop: '1.5rem' }}>
                <AnimatePresence>
                  {submitted && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                      style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600 }}
                    >
                      {gb.sent}
                    </motion.span>
                  )}
                </AnimatePresence>
                <div style={{ marginLeft: 'auto' }}>
                  <LiquidMetalButton
                    type="submit"
                    disabled={submitting || !name.trim() || !message.trim()}
                  >
                    {submitting ? gb.sending : gb.send}
                  </LiquidMetalButton>
                </div>
              </div>
            </motion.form>
          )}

          {/* ── Entries section */}
          <div style={{ marginTop: 'clamp(3rem,6vw,5rem)' }}>
            {/* Count + admin badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'clamp(1.5rem,3vw,2.5rem)' }}>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1,  y: 0  }}
                transition={{ duration: 0.5, delay: 0.5, ease: E }}
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1rem,2.5vw,1.3rem)', letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.5)', margin: 0 }}
              >
                {loading ? gb.loading : countLabel}
              </motion.h2>
              {isAdmin && (
                <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f87171', padding: '0.25rem 0.6rem', borderRadius: 999, border: '1px solid rgba(248,113,113,0.25)', background: 'rgba(248,113,113,0.06)' }}>
                  {gb.adminLabel}
                </span>
              )}
            </div>

            {/* ── Loading skeletons */}
            {loading && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    style={{ width: 180, height: 80, borderRadius: 14, background: 'rgba(255,255,255,0.04)', animation: 'gb-pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.08}s` }}
                  />
                ))}
              </div>
            )}

            {/* ── Empty state */}
            {!loading && entries.length === 0 && CONFIGURED && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}
              >
                {gb.empty}
              </motion.div>
            )}

            {/* ── Desktop: floating card canvas */}
            {!loading && entries.length > 0 && (
              <>
                <div
                  className="gb-canvas"
                  style={{
                    position:    'relative',
                    minHeight:   600,
                    borderRadius: 20,
                    border:      '1px solid rgba(255,255,255,0.05)',
                    background:  'rgba(255,255,255,0.015)',
                    backdropFilter: 'blur(2px)',
                    overflow:    'hidden',
                  }}
                >
                  <AnimatePresence initial={false}>
                    {entries.map((entry, i) => (
                      <FloatingCard
                        key={entry.id}
                        entry={entry}
                        index={i}
                        onClick={() => handleCardClick(entry)}
                        isAdmin={isAdmin}
                        onDelete={deleteEntry}
                      />
                    ))}
                  </AnimatePresence>
                  {/* Subtle grid reference lines */}
                  <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>

                {/* Mobile: stacked list (shown on small screens only) */}
                <div
                  className="gb-stack"
                  style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: '1rem' }}
                >
                  <AnimatePresence initial={false}>
                    {entries.map((entry, i) => (
                      <StackedCard
                        key={entry.id}
                        entry={entry}
                        index={i}
                        onClick={() => handleCardClick(entry)}
                        isAdmin={isAdmin}
                        onDelete={deleteEntry}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Hidden admin toggle */}
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={activateAdmin}
              title={isAdmin ? 'Sair do admin' : 'Admin'}
              style={{ width: 6, height: 6, borderRadius: '50%', background: isAdmin ? '#f87171' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', padding: 0, transition: 'background 0.3s' }}
            />
          </div>
        </div>
      </div>

      {/* ── Message modal (restyled) */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setActive(null)}
              style={{
                position: 'fixed', inset: 0, zIndex: 100,
                background:     'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(8px)',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                padding:        '1.25rem',
              }}
            >
              <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.88, y: 20 }}
                animate={{ opacity: 1, scale: 1,    y: 0  }}
                exit={{   opacity: 0, scale: 0.88,  y: 20 }}
                transition={{ duration: 0.3, ease: E }}
                onClick={e => e.stopPropagation()}
                style={{
                  position:       'relative',
                  width:          '100%',
                  maxWidth:       500,
                  maxHeight:      '82svh',
                  overflowY:      'auto',
                  padding:        '1.75rem',
                  borderRadius:   22,
                  border:         '1px solid rgba(255,255,255,0.12)',
                  background:     'rgba(12,12,14,0.98)',
                  backdropFilter: 'blur(28px)',
                  boxShadow:      '0 40px 100px rgba(0,0,0,0.85)',
                }}
              >
                {/* Close */}
                <button
                  onClick={() => setActive(null)}
                  style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s' }}
                >
                  <X size={14} />
                </button>

                {/* Avatar + meta */}
                {(() => {
                  const color = avatarColor(active.name)
                  const ini   = initials(active.name)
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingRight: '2.5rem' }}>
                      <div style={{ flexShrink: 0, width: 52, height: 52, borderRadius: '50%', background: `${color}20`, border: `2px solid ${color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800, color }}>
                        {ini}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{active.name}</p>
                        <p style={{ margin: '3px 0 0', fontSize: '0.62rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.04em' }}>{timeAgo(active.created_at, lang)}</p>
                      </div>
                    </div>
                  )
                })()}

                {/* Divider */}
                <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: '1.25rem' }} />

                {/* Message */}
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.78, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                  {active.message}
                </p>

                {/* Admin delete */}
                {isAdmin && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => deleteEntry(active.id)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', borderRadius: 9, border: '1px solid rgba(248,113,113,0.25)', background: 'rgba(248,113,113,0.06)', color: '#f87171', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s' }}
                    >
                      <Trash2 size={12} /> Apagar
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes gb-float {
          0%   { translate: 0 0px; }
          100% { translate: 0 -14px; }
        }
        @keyframes gb-pulse {
          0%,100% { opacity: .35; }
          50%      { opacity: .75; }
        }
        textarea::placeholder, input::placeholder { color: rgba(255,255,255,0.2); }
        ::-webkit-scrollbar { display: none; }

        /* Desktop: show canvas, hide stack */
        @media (min-width: 640px) {
          .gb-canvas { display: block !important; }
          .gb-stack  { display: none !important;  }
        }
        /* Mobile: hide canvas, show stack */
        @media (max-width: 639px) {
          .gb-canvas { display: none !important; }
          .gb-stack  { display: flex !important; }
        }
      `}</style>
    </main>
  )
}
