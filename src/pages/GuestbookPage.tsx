import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Trash2, X } from 'lucide-react'
import { SITE } from '@/lib/constants'
import { useT } from '@/hooks/useTranslation'
import { useLanguageStore } from '@/store/useLanguageStore'

const SB_URL     = import.meta.env.VITE_SUPABASE_URL  as string | undefined
const SB_KEY     = import.meta.env.VITE_SUPABASE_ANON as string | undefined
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS    as string | undefined
const TABLE      = 'guestbook'
const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface Entry { id: string; name: string; message: string; created_at: string }

function sbFetch(path: string, opts?: RequestInit) {
  return fetch(`${SB_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey:        SB_KEY ?? '',
      Authorization: `Bearer ${SB_KEY ?? ''}`,
      'Content-Type': 'application/json',
      Prefer:        opts?.method === 'POST' ? 'return=representation' : '',
      ...(opts?.headers ?? {}),
    },
  })
}

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

const CONFIGURED = !!(SB_URL && SB_KEY)

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

  useEffect(() => { document.title = `Guestbook — ${SITE.name}` }, [])

  useEffect(() => {
    if (!CONFIGURED) return
    setLoading(true)
    sbFetch(`${TABLE}?select=*&order=created_at.desc&limit=200`)
      .then(r => r.json())
      .then((data: Entry[]) => setEntries(Array.isArray(data) ? data : []))
      .catch(() => setError(gb.errorLoad))
      .finally(() => setLoading(false))
  }, [gb.errorLoad])

  // close modal on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null) }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim() || !CONFIGURED) return
    setSubmitting(true); setError('')
    try {
      const res = await sbFetch(TABLE, {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
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

  const countLabel = `${entries.length} ${entries.length !== 1 ? gb.countPlural : gb.countSingular}`

  return (
    <main style={{ position: 'relative', minHeight: '100svh', background: '#0d0d0d', overflow: 'hidden' }}>

      {/* Background video */}
      <video autoPlay muted loop playsInline style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, zIndex: 0, pointerEvents: 'none' }}>
        <source src="/assets/bg-video.mp4" type="video/mp4" />
      </video>
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(to bottom, rgba(13,13,13,0.55) 0%, rgba(13,13,13,0.3) 40%, rgba(13,13,13,0.7) 100%)', zIndex: 1, pointerEvents: 'none' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, paddingTop: '7rem' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(2rem,5vw,4rem) clamp(1.25rem,4vw,2.5rem) 6rem' }}>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: E }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
              <span style={{ display: 'inline-block', width: 18, height: 1, background: 'rgba(255,255,255,0.15)' }} />
              {gb.badge}
            </span>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(2.8rem,7vw,5.5rem)', letterSpacing: '-0.055em', lineHeight: 0.9, color: '#fff', margin: 0, paddingBottom: '0.1em' }}>
              {gb.title}
            </h1>
            <p style={{ marginTop: '1rem', fontSize: 'clamp(0.8rem,1.5vw,0.95rem)', color: 'rgba(255,255,255,0.35)', lineHeight: 1.65, maxWidth: 480 }}>
              {gb.subtitle}
            </p>
          </motion.div>

          <div style={{ height: 'clamp(2rem,4vw,3rem)' }} />

          {/* Form */}
          {!CONFIGURED ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              style={{ padding: '1.5rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(13,13,13,0.55)', backdropFilter: 'blur(12px)' }}>
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
            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18, ease: E }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', padding: '1.5rem', borderRadius: 16, border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(13,13,13,0.6)', backdropFilter: 'blur(16px)' }}>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  ref={nameRef}
                  value={name}
                  onChange={e => setName(e.target.value.slice(0, 32))}
                  placeholder={gb.namePlaceholder}
                  required
                  style={{ flex: '1 1 160px', padding: '0.65rem 1rem', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.82rem', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)')}
                  onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <span style={{ alignSelf: 'center', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}>{name.length}/32</span>
              </div>
              <div>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value.slice(0, 280))}
                  placeholder={gb.messagePlaceholder}
                  required rows={3}
                  style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.82rem', outline: 'none', fontFamily: 'Inter, sans-serif', resize: 'vertical', lineHeight: 1.6, transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)')}
                  onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                  <span style={{ fontSize: '0.58rem', color: message.length > 250 ? 'rgba(251,191,36,0.6)' : 'rgba(255,255,255,0.18)' }}>{message.length}/280</span>
                </div>
              </div>
              {error && <p style={{ margin: 0, fontSize: '0.72rem', color: '#f87171' }}>{error}</p>}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <AnimatePresence>
                  {submitted && (
                    <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                      style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600 }}>{gb.sent}</motion.span>
                  )}
                </AnimatePresence>
                <button type="submit" disabled={submitting || !name.trim() || !message.trim()}
                  style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.62rem 1.25rem', borderRadius: 999, background: submitting ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)', border: 'none', color: '#0d0d0d', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: submitting ? 0.5 : 1 }}
                  onMouseEnter={e => { if (!submitting) (e.currentTarget as HTMLElement).style.background = '#fff' }}
                  onMouseLeave={e => { if (!submitting) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.9)' }}>
                  <Send size={12} />{submitting ? gb.sending : gb.send}
                </button>
              </div>
            </motion.form>
          )}

          <div style={{ height: 'clamp(2.5rem,5vw,4rem)' }} />

          {/* Entries header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1rem,2.5vw,1.3rem)', letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
              {loading ? gb.loading : countLabel}
            </h2>
            {isAdmin && (
              <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f87171', padding: '0.25rem 0.6rem', borderRadius: 999, border: '1px solid rgba(248,113,113,0.25)', background: 'rgba(248,113,113,0.06)' }}>
                {gb.adminLabel}
              </span>
            )}
          </div>

          {/* ── Avatar grid — fixed container, no page growth ── */}
          <div style={{
            minHeight: 160,
            maxHeight: 'clamp(220px, 38vh, 400px)',
            overflowY: 'auto',
            padding: '1.25rem',
            borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(13,13,13,0.5)',
            backdropFilter: 'blur(14px)',
            scrollbarWidth: 'none',
          }}>

            {loading && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.07}s` }} />
                ))}
              </div>
            )}

            {!loading && entries.length === 0 && CONFIGURED && (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.82rem' }}>
                {gb.empty}
              </div>
            )}

            {!loading && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <AnimatePresence initial={false}>
                  {entries.map((entry, i) => {
                    const color = avatarColor(entry.name)
                    const ini   = initials(entry.name)
                    return (
                      <motion.button
                        key={entry.id}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.28, delay: i < 20 ? i * 0.025 : 0, ease: E }}
                        onClick={() => setActive(entry)}
                        title={entry.name}
                        style={{
                          width: 48, height: 48, borderRadius: '50%',
                          background: `${color}22`,
                          border: `2px solid ${color}66`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.68rem', fontWeight: 800, color,
                          cursor: 'pointer', flexShrink: 0,
                          transition: 'transform 0.18s, border-color 0.18s, box-shadow 0.18s',
                          outline: 'none',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement
                          el.style.transform = 'scale(1.15)'
                          el.style.borderColor = color
                          el.style.boxShadow = `0 0 14px ${color}55`
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement
                          el.style.transform = 'scale(1)'
                          el.style.borderColor = `${color}66`
                          el.style.boxShadow = 'none'
                        }}
                      >
                        {ini}
                      </motion.button>
                    )
                  })}
                </AnimatePresence>
              </div>
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

      {/* ── Message modal ── */}
      <AnimatePresence>
        {active && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setActive(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 100, cursor: 'pointer' }}
            />

            {/* Card */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.88, y: 16  }}
              transition={{ duration: 0.3, ease: E }}
              style={{
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 101,
                width: 'min(480px, calc(100vw - 2.5rem))',
                padding: '1.75rem',
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(14,14,14,0.92)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
              }}
            >
              {/* Close */}
              <button
                onClick={() => setActive(null)}
                style={{ position: 'absolute', top: 14, right: 14, width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
              >
                <X size={14} />
              </button>

              {/* Avatar + meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                {(() => {
                  const color = avatarColor(active.name)
                  const ini   = initials(active.name)
                  return (
                    <div style={{ flexShrink: 0, width: 52, height: 52, borderRadius: '50%', background: `${color}22`, border: `2px solid ${color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800, color }}>
                      {ini}
                    </div>
                  )
                })()}
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{active.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.62rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.04em' }}>{timeAgo(active.created_at, lang)}</p>
                </div>
              </div>

              {/* Message */}
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, wordBreak: 'break-word' }}>
                {active.message}
              </p>

              {/* Admin delete */}
              {isAdmin && (
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => deleteEntry(active.id)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid rgba(248,113,113,0.25)', background: 'rgba(248,113,113,0.06)', color: '#f87171', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.18)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.06)' }}
                  >
                    <Trash2 size={12} /> Apagar
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.9} }
        textarea::placeholder, input::placeholder { color: rgba(255,255,255,0.2); }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  )
}
