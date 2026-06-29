import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Trash2 } from 'lucide-react'
import { SITE } from '@/lib/constants'

/* ── Supabase config (set in .env.local) ── */
const SB_URL     = import.meta.env.VITE_SUPABASE_URL  as string | undefined
const SB_KEY     = import.meta.env.VITE_SUPABASE_ANON as string | undefined
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS    as string | undefined
const TABLE      = 'guestbook'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface Entry {
  id:         string
  name:       string
  message:    string
  created_at: string
}

function sbFetch(path: string, opts?: RequestInit) {
  return fetch(`${SB_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      'apikey':        SB_KEY ?? '',
      'Authorization': `Bearer ${SB_KEY ?? ''}`,
      'Content-Type':  'application/json',
      'Prefer':        opts?.method === 'POST' ? 'return=representation' : '',
      ...(opts?.headers ?? {}),
    },
  })
}

function avatarColor(name: string) {
  const palette = ['#4ade80', '#60a5fa', '#f87171', '#fbbf24', '#a78bfa', '#fb923c', '#34d399', '#e879f9']
  let sum = 0
  for (const ch of name) sum += ch.charCodeAt(0)
  return palette[sum % palette.length]
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60)    return 'agora mesmo'
  if (diff < 3600)  return `${Math.floor(diff / 60)}min atrás`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const CONFIGURED = !!(SB_URL && SB_KEY)

export default function GuestbookPage() {
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
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => { document.title = `Livro de Visitas — ${SITE.name}` }, [])

  useEffect(() => {
    if (!CONFIGURED) return
    setLoading(true)
    sbFetch(`${TABLE}?select=*&order=created_at.desc&limit=80`)
      .then(r => r.json())
      .then((data: Entry[]) => setEntries(Array.isArray(data) ? data : []))
      .catch(() => setError('Não foi possível carregar as mensagens.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim() || !CONFIGURED) return
    setSubmitting(true)
    setError('')
    try {
      const res = await sbFetch(TABLE, {
        method: 'POST',
        body:   JSON.stringify({ name: name.trim(), message: message.trim() }),
      })
      if (!res.ok) throw new Error()
      const [created]: Entry[] = await res.json()
      setEntries(prev => [created, ...prev])
      setName('')
      setMessage('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch {
      setError('Erro ao enviar. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  function activateAdmin() {
    if (isAdmin) {
      sessionStorage.removeItem('gb_admin')
      setIsAdmin(false)
      return
    }
    const pass = prompt('Senha de admin:')
    if (!pass || !ADMIN_PASS || pass !== ADMIN_PASS) return
    sessionStorage.setItem('gb_admin', '1')
    setIsAdmin(true)
  }

  async function deleteEntry(id: string) {
    if (!confirm('Apagar este recado?')) return
    try {
      await sbFetch(`${TABLE}?id=eq.${id}`, { method: 'DELETE' })
      setEntries(prev => prev.filter(e => e.id !== id))
    } catch {
      alert('Erro ao apagar.')
    }
  }

  return (
    <main style={{ paddingTop: '7rem', minHeight: '100svh', background: '#0d0d0d' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(2rem,5vw,4rem) clamp(1.25rem,4vw,2.5rem) 6rem' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: E }}>
          <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
            <span style={{ display: 'inline-block', width: 18, height: 1, background: 'rgba(255,255,255,0.15)' }} />
            Livro de visitas
          </span>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(2.8rem,7vw,5.5rem)', letterSpacing: '-0.055em', lineHeight: 0.9, color: '#fff', margin: 0, paddingBottom: '0.1em' }}>
            Guestbook.
          </h1>
          <p style={{ marginTop: '1rem', fontSize: 'clamp(0.8rem,1.5vw,0.95rem)', color: 'rgba(255,255,255,0.35)', lineHeight: 1.65, maxWidth: 480 }}>
            Deixe um recado, uma opinião, um meme em texto — o que quiser. Eu leio tudo.
          </p>
        </motion.div>

        <div style={{ height: 'clamp(2rem,4vw,3rem)' }} />

        {/* Form */}
        {!CONFIGURED ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ padding: '1.5rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
              Para ativar o Guestbook, configure as variáveis de ambiente no <code style={{ color: '#4ade80', background: 'rgba(74,222,128,0.08)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>.env.local</code>:
            </p>
            <pre style={{ marginTop: '0.75rem', padding: '0.9rem 1rem', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', fontSize: '0.73rem', color: 'rgba(255,255,255,0.55)', fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.8, overflowX: 'auto' }}>
{`VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON=your-anon-key
VITE_ADMIN_PASS=sua-senha-secreta`}
            </pre>
            <p style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.28)', lineHeight: 1.65 }}>
              Crie uma conta gratuita em <strong style={{ color: 'rgba(255,255,255,0.5)' }}>supabase.com</strong> e execute no SQL Editor:
            </p>
            <pre style={{ marginTop: '0.5rem', padding: '0.9rem 1rem', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', fontSize: '0.7rem', color: '#4ade80', fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.8, overflowX: 'auto' }}>
{`CREATE TABLE guestbook (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  message    TEXT NOT NULL,
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
            style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', padding: '1.5rem', borderRadius: 16, border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                ref={nameRef}
                value={name}
                onChange={e => setName(e.target.value.slice(0, 32))}
                placeholder="Seu nome"
                required
                style={{ flex: '1 1 160px', padding: '0.65rem 1rem', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.82rem', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)')}
                onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <span style={{ alignSelf: 'center', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}>
                {name.length}/32
              </span>
            </div>
            <div>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value.slice(0, 280))}
                placeholder="Deixe um recado..."
                required
                rows={3}
                style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.82rem', outline: 'none', fontFamily: 'Inter, sans-serif', resize: 'vertical', lineHeight: 1.6, transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)')}
                onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                <span style={{ fontSize: '0.58rem', color: message.length > 250 ? 'rgba(251,191,36,0.6)' : 'rgba(255,255,255,0.18)' }}>
                  {message.length}/280
                </span>
              </div>
            </div>

            {error && <p style={{ margin: 0, fontSize: '0.72rem', color: '#f87171' }}>{error}</p>}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <AnimatePresence>
                {submitted && (
                  <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                    style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600 }}>
                    Recado enviado!
                  </motion.span>
                )}
              </AnimatePresence>
              <button
                type="submit"
                disabled={submitting || !name.trim() || !message.trim()}
                style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.62rem 1.25rem', borderRadius: 999, background: submitting ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)', border: 'none', color: '#0d0d0d', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: submitting ? 0.5 : 1 }}
                onMouseEnter={e => { if (!submitting) (e.currentTarget as HTMLElement).style.background = '#fff' }}
                onMouseLeave={e => { if (!submitting) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.9)' }}>
                <Send size={12} />
                {submitting ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </motion.form>
        )}

        <div style={{ height: 'clamp(2.5rem,5vw,4rem)' }} />

        {/* Entries header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1rem,2.5vw,1.4rem)', letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
            {loading ? 'Carregando...' : `${entries.length} recado${entries.length !== 1 ? 's' : ''}`}
          </h2>
          {isAdmin && (
            <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f87171', padding: '0.25rem 0.6rem', borderRadius: 999, border: '1px solid rgba(248,113,113,0.25)', background: 'rgba(248,113,113,0.06)' }}>
              Admin
            </span>
          )}
        </div>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 80, borderRadius: 14, background: 'rgba(255,255,255,0.03)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        )}

        {!loading && entries.length === 0 && CONFIGURED && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
            <p style={{ margin: 0 }}>Seja o primeiro a deixar um recado.</p>
          </motion.div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <AnimatePresence initial={false}>
            {entries.map((entry, i) => {
              const color    = avatarColor(entry.name)
              const initials = entry.name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, delay: i < 6 ? i * 0.04 : 0, ease: E }}
                  style={{ display: 'flex', gap: '0.9rem', padding: '1rem 1.2rem', borderRadius: 14, border: `1px solid ${isAdmin ? 'rgba(248,113,113,0.12)' : 'rgba(255,255,255,0.07)'}`, background: 'rgba(255,255,255,0.02)', transition: 'border-color 0.2s', alignItems: 'flex-start' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = isAdmin ? 'rgba(248,113,113,0.25)' : 'rgba(255,255,255,0.13)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = isAdmin ? 'rgba(248,113,113,0.12)' : 'rgba(255,255,255,0.07)')}
                >
                  {/* Avatar */}
                  <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: '50%', background: `${color}22`, border: `1.5px solid ${color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color, letterSpacing: '0.02em' }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#fff' }}>{entry.name}</span>
                      <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.04em' }}>{timeAgo(entry.created_at)}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, wordBreak: 'break-word' }}>
                      {entry.message}
                    </p>
                  </div>
                  {/* Delete button — admin only */}
                  {isAdmin && (
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      title="Apagar recado"
                      style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.06)', color: '#f87171', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.18)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(248,113,113,0.4)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(248,113,113,0.2)' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Hidden admin toggle — small dot at the bottom */}
        <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={activateAdmin}
            title={isAdmin ? 'Sair do modo admin' : 'Admin'}
            style={{ width: 6, height: 6, borderRadius: '50%', background: isAdmin ? '#f87171' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', padding: 0, transition: 'background 0.3s' }}
          />
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        textarea::placeholder,
        input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </main>
  )
}
