import { useState, useRef, useEffect } from 'react'
import { ExternalLink, Play, Maximize2, RotateCw } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { track } from '@/lib/analytics'

/**
 * Embeds the real, running product in an iframe so a visitor can use it
 * without leaving the case study.
 *
 * Deliberately click-to-load:
 *  - an eagerly mounted iframe would download an entire second app on every
 *    case-study visit, for a demo most readers never touch;
 *  - cross-origin framing failures (X-Frame-Options / frame-ancestors) are NOT
 *    detectable from script, so an auto-loaded iframe can only fail silently as
 *    a blank rectangle. Making the load explicit means the visitor is watching
 *    when it happens, and the "open in a new tab" escape hatch is right there.
 */
export default function LiveDemo({
  embedUrl,
  posterSrc,
  title,
  liveUrl,
}: {
  embedUrl: string
  posterSrc: string
  title: string
  liveUrl: string
}) {
  const lang = useLanguageStore(s => s.lang)
  const en   = lang === 'en'

  const [loaded,  setLoaded]  = useState(false)   // user asked for the demo
  const [ready,   setReady]   = useState(false)   // iframe fired onLoad
  const [slow,    setSlow]    = useState(false)   // taking suspiciously long
  const [nonce,   setNonce]   = useState(0)       // bump to force a reload
  const frameRef = useRef<HTMLIFrameElement>(null)

  /* If the frame hasn't reported back in 6s it is probably blocked by the
     target's frame-ancestors policy. We can't read the failure, so we surface
     a way out instead of leaving a blank box. */
  useEffect(() => {
    if (!loaded || ready) return
    const t = setTimeout(() => setSlow(true), 6000)
    return () => clearTimeout(t)
  }, [loaded, ready, nonce])

  function reload() {
    setReady(false)
    setSlow(false)
    setNonce(n => n + 1)
  }

  function openFullscreen() {
    frameRef.current?.requestFullscreen?.()
  }

  return (
    <div style={{ marginBottom: 'clamp(2.5rem,5vw,4rem)' }}>
      {/* ── Browser chrome ── */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.6rem 0.9rem',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderBottom: 'none',
          borderRadius: 'clamp(12px,2vw,16px) clamp(12px,2vw,16px) 0 0',
        }}
      >
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map(c => (
            <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
          ))}
        </div>

        {/* URL bar */}
        <div
          style={{
            flex: 1, minWidth: 0,
            padding: '0.28rem 0.7rem',
            borderRadius: 999,
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.06)',
            fontFamily: '"JetBrains Mono","Fira Code",monospace',
            fontSize: '0.62rem',
            color: 'rgba(255,255,255,0.35)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}
        >
          {embedUrl.replace(/^https?:\/\//, '')}
        </div>

        {/* Controls — only useful once something is in the frame */}
        {loaded && (
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            <button onClick={reload} aria-label={en ? 'Reload demo' : 'Recarregar demo'} style={chromeBtn}>
              <RotateCw size={12} />
            </button>
            <button onClick={openFullscreen} aria-label={en ? 'Fullscreen' : 'Tela cheia'} style={chromeBtn}>
              <Maximize2 size={12} />
            </button>
          </div>
        )}

        <a
          href={liveUrl} target="_blank" rel="noopener noreferrer"
          aria-label={en ? 'Open in a new tab' : 'Abrir em nova aba'}
          style={{ ...chromeBtn, display: 'inline-flex', textDecoration: 'none', flexShrink: 0 }}
        >
          <ExternalLink size={12} />
        </a>
      </div>

      {/* ── Viewport ── */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '16/9',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '0 0 clamp(12px,2vw,16px) clamp(12px,2vw,16px)',
          background: '#0b0b0b',
        }}
      >
        {loaded ? (
          <>
            <iframe
              key={nonce}
              ref={frameRef}
              src={embedUrl}
              title={`${title} — ${en ? 'live demo' : 'demo ao vivo'}`}
              onLoad={() => setReady(true)}
              loading="lazy"
              /* Least privilege: enough to run a SPA, not enough to navigate
                 the parent page or auto-download anything. */
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              referrerPolicy="no-referrer"
              style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
            />

            {!ready && (
              <div style={overlayCenter}>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                  {en ? 'Loading…' : 'Carregando…'}
                </span>
              </div>
            )}

            {slow && !ready && (
              <div style={{ ...overlayCenter, gap: '0.9rem', background: 'rgba(10,10,10,0.92)' }}>
                <p style={{ maxWidth: '34ch', textAlign: 'center', fontSize: '0.78rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.42)', margin: 0 }}>
                  {en
                    ? 'This site refuses to be embedded. Open it in a new tab instead.'
                    : 'Este site não permite ser incorporado. Abra em uma nova aba.'}
                </p>
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" style={primaryBtn}>
                  {en ? 'Open the site' : 'Abrir o site'} <ExternalLink size={11} />
                </a>
              </div>
            )}
          </>
        ) : (
          /* ── Poster: screenshot + explicit load action ── */
          <button
            onClick={() => { setLoaded(true); track('demo-loaded', { project: title }) }}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              padding: 0, border: 0, cursor: 'pointer', background: 'transparent',
              display: 'block',
            }}
            aria-label={en ? `Load the live ${title} demo` : `Carregar a demo ao vivo do ${title}`}
          >
            <img
              src={posterSrc}
              alt=""
              loading="eager"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.42 }}
            />
            <span
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '0.85rem',
                background: 'linear-gradient(180deg, rgba(10,10,10,0.35), rgba(10,10,10,0.7))',
              }}
            >
              <span
                style={{
                  width: 54, height: 54, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#fff', color: '#0d0d0d', flexShrink: 0,
                }}
              >
                <Play size={18} fill="currentColor" style={{ marginLeft: 3 }} />
              </span>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff' }}>
                {en ? 'Try it live' : 'Testar ao vivo'}
              </span>
              <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>
                {en ? 'The real product, running here' : 'O produto real, rodando aqui'}
              </span>
            </span>
          </button>
        )}
      </div>

      {/* Caption */}
      <p
        style={{
          marginTop: '0.7rem',
          fontSize: '0.6rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.16)',
        }}
      >
        {en
          ? 'Live instance — not a mockup'
          : 'Instância ao vivo — não é mockup'}
      </p>
    </div>
  )
}

/* ── styles ── */
const chromeBtn: React.CSSProperties = {
  width: 24, height: 24,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 6,
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'transparent',
  color: 'rgba(255,255,255,0.35)',
  cursor: 'pointer',
  padding: 0,
}

const overlayCenter: React.CSSProperties = {
  position: 'absolute', inset: 0,
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center',
  background: 'rgba(11,11,11,0.85)',
}

const primaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '0.7rem 1.4rem', borderRadius: 999,
  background: '#fff', color: '#0d0d0d',
  fontSize: '0.65rem', fontWeight: 700,
  letterSpacing: '0.1em', textTransform: 'uppercase',
  textDecoration: 'none',
}
