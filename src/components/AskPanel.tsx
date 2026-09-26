import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CornerDownLeft, Sparkles } from 'lucide-react'
import { track } from '@/lib/analytics'

export interface ChatTurn { role: 'user' | 'assistant'; content: string }

/* Just enough markdown for the assistant's replies: paragraphs, "- " lists,
   **bold** and [links](…). Internal links route in-app. */
function inline(text: string, onLink: (href: string) => void): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g
  let last = 0
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1]) out.push(<strong key={m.index} style={{ color: '#fff', fontWeight: 600 }}>{m[1]}</strong>)
    else {
      const href = m[3]
      const internal = href.startsWith('/')
      out.push(
        <a
          key={m.index}
          href={href}
          target={internal ? undefined : '_blank'}
          rel={internal ? undefined : 'noopener noreferrer'}
          onClick={e => { if (internal) { e.preventDefault(); onLink(href) } }}
          style={{ color: '#4ade80', textDecoration: 'underline', textUnderlineOffset: 3 }}
        >
          {m[2]}
        </a>,
      )
    }
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function Markdown({ text, onLink }: { text: string; onLink: (href: string) => void }) {
  const blocks = text.trim().split(/\n{2,}/)
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split('\n')
        if (lines.every(l => /^\s*[-*] /.test(l))) {
          return (
            <ul key={i} style={{ margin: '0 0 0.7rem', paddingLeft: '1.1rem', listStyle: 'disc' }}>
              {lines.map((l, j) => <li key={j} style={{ marginBottom: 4 }}>{inline(l.replace(/^\s*[-*] /, ''), onLink)}</li>)}
            </ul>
          )
        }
        return <p key={i} style={{ margin: '0 0 0.7rem' }}>{inline(block, onLink)}</p>
      })}
    </>
  )
}

const ERRORS: Record<number, { pt: string; en: string }> = {
  429: { pt: 'Muitas perguntas seguidas — espere um pouco e tente de novo.', en: 'Too many questions in a row — wait a moment and try again.' },
  503: { pt: 'O assistente ainda não está ligado neste site.', en: "The assistant isn't switched on for this site yet." },
}

export default function AskPanel({ first, en, onBack, onClose }: {
  first: string
  en: boolean
  onBack: () => void
  onClose: () => void
}) {
  const navigate = useNavigate()
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [streaming, setStreaming] = useState(false)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  async function ask(question: string, history: ChatTurn[]) {
    const q = question.trim()
    if (!q || streaming) return
    const convo: ChatTurn[] = [...history, { role: 'user', content: q }]
    setTurns([...convo, { role: 'assistant', content: '' }])
    setStreaming(true)
    track('ask', { length: q.length, turn: convo.length })

    const ctrl = new AbortController()
    abortRef.current = ctrl
    const write = (text: string) => setTurns([...convo, { role: 'assistant', content: text }])
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: convo }),
        signal: ctrl.signal,
      })
      if (!res.ok || !res.body) {
        const e = ERRORS[res.status]
        write(e ? (en ? e.en : e.pt) : (en ? 'Something went wrong. Try again?' : 'Algo deu errado. Tentar de novo?'))
        return
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let text = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        write(text)
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') write(en ? 'Connection lost. Try again?' : 'A conexão caiu. Tentar de novo?')
    } finally {
      setStreaming(false)
      abortRef.current = null
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  // Deferred a tick so StrictMode's mount → unmount → mount in dev cancels
  // the first schedule instead of aborting an in-flight request.
  useEffect(() => {
    const t = setTimeout(() => ask(first, []), 0)
    return () => { clearTimeout(t); abortRef.current?.abort() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [turns])

  function followLink(href: string) {
    navigate(href)
    onClose()
  }

  function onKeyDown(e: ReactKeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); const q = input; setInput(''); ask(q, turns) }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); abortRef.current?.abort(); onBack() }
  }

  const waiting = streaming && turns[turns.length - 1]?.content === ''

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <button
          onClick={() => { abortRef.current?.abort(); onBack() }}
          aria-label={en ? 'Back to search' : 'Voltar para a busca'}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex' }}
        >
          <ArrowLeft size={15} />
        </button>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value.slice(0, 600))}
          onKeyDown={onKeyDown}
          disabled={streaming}
          placeholder={streaming ? (en ? 'Answering…' : 'Respondendo…') : (en ? 'Ask a follow-up…' : 'Pergunte mais…')}
          aria-label={en ? 'Follow-up question' : 'Pergunta seguinte'}
          style={{
            flex: 1, height: 56, background: 'transparent', border: 'none', outline: 'none',
            color: '#fff', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif',
          }}
        />
        <CornerDownLeft size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
      </div>

      <div ref={listRef} data-lenis-prevent aria-live="polite" style={{ maxHeight: 'min(56vh, 440px)', overflowY: 'auto', padding: '16px 20px 8px' }}>
        {turns.map((t, i) => t.role === 'user' ? (
          <p key={i} style={{ margin: i ? '0.9rem 0 0.6rem' : '0 0 0.6rem', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
            {t.content}
          </p>
        ) : (
          <div key={i} style={{ display: 'flex', gap: 12, fontSize: '0.9rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.82)', fontFamily: 'Inter, sans-serif' }}>
            <Sparkles size={14} style={{ color: '#4ade80', flexShrink: 0, marginTop: 5 }} />
            <div style={{ minWidth: 0 }}>
              {t.content
                ? <Markdown text={t.content} onLink={followLink} />
                : waiting && i === turns.length - 1 && (
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)' }} className="ask-thinking">
                    {en ? 'Thinking' : 'Pensando'}<span>.</span><span>.</span><span>.</span>
                  </p>
                )}
            </div>
          </div>
        ))}
      </div>

      <p style={{ margin: 0, padding: '10px 20px 14px', fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {en
          ? 'AI answers from the portfolio’s own content — confirm anything important with Caio.'
          : 'IA respondendo a partir do conteúdo do portfólio — confirme o que for importante com o Caio.'}
      </p>

      <style>{`
        .ask-thinking span { animation: ask-dot 1.2s infinite; opacity: 0; }
        .ask-thinking span:nth-child(2) { animation-delay: 0.2s; }
        .ask-thinking span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes ask-dot { 0%, 20% { opacity: 0 } 50% { opacity: 1 } 100% { opacity: 0 } }
      `}</style>
    </>
  )
}
