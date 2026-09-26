import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight, Copy, Check, FileText, Github, Languages, Linkedin,
  MessageCircle, Search, CornerDownLeft, Sparkles, SunMoon,
} from 'lucide-react'
import AskPanel from '@/components/AskPanel'
import { getTheme, toggleTheme } from '@/lib/theme'
import { projects } from '@/data/projects'
import { SITE } from '@/lib/constants'
import { track } from '@/lib/analytics'
import { useLanguageStore } from '@/store/useLanguageStore'
import { usePaletteStore } from '@/store/usePaletteStore'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

export const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

interface Item {
  id: string
  group: string
  label: string
  hint?: string
  icon?: ReactNode
  keywords?: string
  run: () => void | 'keep-open'
}

// "Sérvicos" should match "servicos": compare without accents or case.
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function CommandPalette() {
  const open    = usePaletteStore(s => s.open)
  const setOpen = usePaletteStore(s => s.setOpen)
  const toggle  = usePaletteStore(s => s.toggle)
  const lang    = useLanguageStore(s => s.lang)
  const toggleLang = useLanguageStore(s => s.toggle)
  const navigate = useNavigate()
  const en = lang === 'en'

  const [query,  setQuery]  = useState('')
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)
  // A question handed to the AI assistant: the palette swaps to AskPanel.
  const [asking, setAsking] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); toggle() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle])

  useEffect(() => {
    if (!open) return
    setQuery(''); setActive(0); setCopied(false); setAsking(null)
    const t = setTimeout(() => inputRef.current?.focus(), 30)
    return () => clearTimeout(t)
  }, [open])

  const items = useMemo<Item[]>(() => {
    const go = (path: string) => () => navigate(path)
    const ext = (url: string) => () => { window.open(url, '_blank', 'noopener') }
    const P = en ? 'Projects' : 'Projetos'
    const N = en ? 'Pages' : 'Páginas'
    const A = en ? 'Actions' : 'Ações'
    return [
      ...projects.map(p => ({
        id: `p:${p.slug}`, group: P, label: p.title, hint: p.type,
        keywords: `${p.stack.join(' ')} ${p.category}`,
        run: go(`/projects/${p.slug}`),
      })),
      { id: 'n:home',      group: N, label: en ? 'Home' : 'Início',               run: go('/') },
      { id: 'n:about',     group: N, label: en ? 'About' : 'Sobre',               run: go('/about') },
      { id: 'n:projects',  group: N, label: en ? 'All projects' : 'Todos os projetos', run: go('/projects') },
      { id: 'n:services',  group: N, label: en ? 'Services' : 'Serviços',         run: go('/services') },
      { id: 'n:contact',   group: N, label: en ? 'Contact' : 'Contato',           run: go('/contact') },
      { id: 'n:guestbook', group: N, label: en ? 'Guestbook' : 'Livro de visitas', run: go('/guestbook') },
      {
        id: 'a:email', group: A, icon: <Copy size={14} />,
        label: en ? 'Copy email' : 'Copiar email', hint: SITE.email,
        run: () => {
          navigator.clipboard?.writeText(SITE.email).catch(() => {})
          setCopied(true)
          setTimeout(() => setOpen(false), 700)
          return 'keep-open'
        },
      },
      { id: 'a:whatsapp', group: A, icon: <MessageCircle size={14} />, label: en ? 'Message on WhatsApp' : 'Chamar no WhatsApp', run: ext(`https://wa.me/${SITE.whatsapp.replace(/\D/g, '')}`) },
      { id: 'a:cv',       group: A, icon: <FileText size={14} />,      label: en ? 'Résumé' : 'Currículo', keywords: 'cv resume', run: go('/cv') },
      { id: 'a:github',   group: A, icon: <Github size={14} />,        label: 'GitHub',   run: ext(SITE.github) },
      { id: 'a:linkedin', group: A, icon: <Linkedin size={14} />,      label: 'LinkedIn', run: ext(SITE.linkedin) },
      { id: 'a:theme', group: A, icon: <SunMoon size={14} />, label: getTheme() === 'light' ? (en ? 'Dark mode' : 'Modo escuro') : (en ? 'Light mode' : 'Modo claro'), keywords: 'tema theme claro escuro light dark', run: () => { setTimeout(() => toggleTheme(), 200) } },
      { id: 'a:lang',     group: A, icon: <Languages size={14} />,     label: en ? 'Mudar para português' : 'Switch to English', keywords: 'idioma language', run: () => { toggleLang() } },
    ]
    // `open` so the light/dark label is re-read each time the palette opens.
  }, [en, navigate, setOpen, toggleLang, open])

  const filtered = useMemo(() => {
    const AI = en ? 'Ask about Caio' : 'Pergunte sobre o Caio'
    const askItem = (question: string, id: string, label = question): Item => ({
      id, group: AI, label, icon: <Sparkles size={14} style={{ color: '#4ade80' }} />,
      run: () => { setAsking(question); return 'keep-open' },
    })
    const raw = query.trim()
    const q = norm(raw)
    // Empty: two example questions, so the assistant is discoverable.
    if (!q) return [
      askItem(en ? 'Which project best shows back-end work?' : 'Qual projeto mostra melhor o back-end?', 'ai:s1'),
      askItem(en ? 'Has he worked with payments?' : 'Ele já trabalhou com pagamentos?', 'ai:s2'),
      ...items,
    ]
    const matches = items.filter(i => norm(`${i.label} ${i.hint ?? ''} ${i.keywords ?? ''} ${i.group}`).includes(q))
    // Anything longer than a word or two reads as a question: offer it first.
    const asQuestion = raw.length >= 3 ? [askItem(raw, 'ai:q', `${en ? 'Ask' : 'Perguntar'}: “${raw}”`)] : []
    return raw.includes(' ') || matches.length === 0 ? [...asQuestion, ...matches] : [...matches, ...asQuestion]
  }, [items, query, en])

  useEffect(() => { setActive(0) }, [query])

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  function runItem(item: Item | undefined) {
    if (!item) return
    track('command', { id: item.id })
    if (item.run() !== 'keep-open') setOpen(false)
  }

  function onKeyDown(e: ReactKeyboardEvent) {
    if (asking) return // AskPanel owns the keyboard while answering
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); runItem(filtered[active]) }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false) }
  }

  let lastGroup = ''

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="palette"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false) }}
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(5,5,5,0.62)', backdropFilter: 'blur(6px)',
            display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
            paddingTop: 'min(18vh, 9rem)', paddingInline: 16,
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={en ? 'Command menu' : 'Menu de comandos'}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.985 }}
            transition={{ duration: 0.28, ease: E }}
            onKeyDown={onKeyDown}
            style={{
              width: '100%', maxWidth: 560,
              background: '#111', borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
              overflow: 'hidden',
            }}
          >
            {asking ? (
              <AskPanel
                first={asking}
                en={en}
                onBack={() => { setAsking(null); setTimeout(() => inputRef.current?.focus(), 30) }}
                onClose={() => setOpen(false)}
              />
            ) : (<>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <Search size={15} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={en ? 'Search, or ask anything about Caio…' : 'Busque ou pergunte qualquer coisa sobre o Caio…'}
                aria-label={en ? 'Search' : 'Buscar'}
                style={{
                  flex: 1, height: 56, background: 'transparent', border: 'none', outline: 'none',
                  color: '#fff', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif',
                }}
              />
              <kbd style={kbd}>esc</kbd>
            </div>

            <div ref={listRef} data-lenis-prevent style={{ maxHeight: 'min(56vh, 420px)', overflowY: 'auto', padding: 8 }}>
              {filtered.length === 0 && (
                <p style={{ padding: '28px 12px', textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                  {en ? 'Nothing found.' : 'Nada encontrado.'}
                </p>
              )}
              {filtered.map((item, i) => {
                const header = item.group !== lastGroup ? item.group : null
                lastGroup = item.group
                const on = i === active
                const done = item.id === 'a:email' && copied
                return (
                  <div key={item.id}>
                    {header && (
                      <p style={{ margin: 0, padding: '12px 12px 6px', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
                        {header}
                      </p>
                    )}
                    <button
                      data-idx={i}
                      onMouseMove={() => { if (!on) setActive(i) }}
                      onClick={() => runItem(item)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                        background: on ? 'rgba(255,255,255,0.07)' : 'transparent',
                        color: on ? '#fff' : 'rgba(255,255,255,0.62)',
                        textAlign: 'left', fontFamily: 'Inter, sans-serif', fontSize: '0.86rem',
                        transition: 'background 0.12s, color 0.12s',
                      }}
                    >
                      <span style={{ width: 16, display: 'inline-flex', justifyContent: 'center', color: done ? '#4ade80' : 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
                        {done ? <Check size={14} /> : item.icon ?? <ArrowUpRight size={14} />}
                      </span>
                      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {done ? (en ? 'Copied!' : 'Copiado!') : item.label}
                      </span>
                      {item.hint && !done && (
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.28)', flexShrink: 0 }}>{item.hint}</span>
                      )}
                      {on && <CornerDownLeft size={12} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />}
                    </button>
                  </div>
                )
              })}
            </div>
            </>)}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const kbd: CSSProperties = {
  fontFamily: 'Inter, sans-serif', fontSize: '0.6rem', fontWeight: 600,
  padding: '3px 7px', borderRadius: 6,
  border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.35)',
}
