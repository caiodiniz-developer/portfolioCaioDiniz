import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Snippet } from '@/data/snippets'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'

/* A tokenizer, not a parser: enough to colour four short TS/JS excerpts
   without shipping a highlighting library. Order matters — comments and
   strings are matched first so keywords inside them stay uncoloured. */
const TOKEN = new RegExp(
  [
    String.raw`(?<comment>\/\/.*|\/\*[\s\S]*?\*\/)`,
    String.raw`(?<string>"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|` + '`' + String.raw`(?:\\.|[^` + '`' + String.raw`\\])*` + '`)',
    String.raw`(?<keyword>\b(?:const|let|var|function|return|async|await|if|else|for|of|in|new|throw|export|import|from|as|null|true|false|undefined)\b)`,
    String.raw`(?<number>\b\d+(?:\.\d+)?\b)`,
    String.raw`(?<fn>\b[a-zA-Z_$][\w$]*(?=\())`,
    String.raw`(?<type>\b[A-Z][\w$]*\b)`,
  ].join('|'),
  'g',
)

const COLOR: Record<string, string> = {
  comment: 'rgba(255,255,255,0.3)',
  string:  '#96d0ff',
  keyword: '#f47067',
  number:  '#6cb6ff',
  fn:      '#dcbdfb',
  type:    '#f69d50',
}

function highlight(line: string) {
  const out: ReactNode[] = []
  let last = 0
  for (const m of line.matchAll(TOKEN)) {
    const kind = Object.entries(m.groups ?? {}).find(([, v]) => v !== undefined)?.[0]
    if (m.index > last) out.push(line.slice(last, m.index))
    out.push(<span key={m.index} style={{ color: kind ? COLOR[kind] : undefined }}>{m[0]}</span>)
    last = m.index + m[0].length
  }
  if (last < line.length) out.push(line.slice(last))
  return out
}

export default function CodeSnippet({ snippet }: { snippet: Snippet }) {
  const en = useLanguageStore(s => s.lang) === 'en'
  const setCursor = useCursorStore(s => s.setState)
  const lines = snippet.code.replace(/\n+$/, '').split('\n')

  return (
    <section className="cs-wrap">
      <h2 className="pd-label">{en ? 'Under the hood' : 'Por dentro'}</h2>

      <div className="cs-grid">
        <p className="cs-note">{en ? snippet.noteEn : snippet.notePt}</p>

        <figure className="cs-window" data-cursor="code">
          <figcaption className="cs-bar">
            <span className="cs-file">{snippet.file}</span>
            <a
              href={snippet.url}
              target="_blank"
              rel="noopener noreferrer"
              className="cs-link"
              onMouseEnter={() => setCursor('pointer')}
              onMouseLeave={() => setCursor('default')}
            >
              {en ? 'View on GitHub' : 'Ver no GitHub'} <ArrowUpRight size={11} />
            </a>
          </figcaption>
          <pre className="cs-pre" data-lenis-prevent>
            <code>
              {lines.map((line, i) => (
                <span key={i} className="cs-line">
                  <span className="cs-ln" aria-hidden>{i + 1}</span>
                  <span>{highlight(line)}{'\n'}</span>
                </span>
              ))}
            </code>
          </pre>
        </figure>
      </div>

      <style>{`
        .cs-wrap {
          padding-top: clamp(1.5rem,3vw,2.25rem);
          margin-bottom: clamp(2.5rem,5vw,4rem);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .cs-grid { display: grid; gap: 1.5rem; }
        @media (min-width: 900px) {
          .cs-grid { grid-template-columns: minmax(0,1fr) minmax(0,2.2fr); gap: 3rem; align-items: start; }
        }
        .cs-note {
          margin: 0;
          font-size: clamp(0.95rem,1.4vw,1.05rem);
          line-height: 1.75;
          color: rgba(255,255,255,0.55);
          max-width: 42ch;
        }
        .cs-window {
          margin: 0; min-width: 0;
          border-radius: 14px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background: #0a0a0a;
        }
        .cs-bar {
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding: 0.7rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.025);
        }
        .cs-file {
          font-family: "JetBrains Mono","Fira Code",ui-monospace,monospace;
          font-size: 0.66rem; color: rgba(255,255,255,0.4);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .cs-link {
          display: inline-flex; align-items: center; gap: 0.3rem; flex-shrink: 0;
          font-size: 0.58rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.45); text-decoration: none; transition: color 0.2s;
        }
        .cs-link:hover { color: #fff; }
        .cs-pre {
          margin: 0; padding: 1.1rem 0;
          overflow-x: auto;
          font-family: "JetBrains Mono","Fira Code",ui-monospace,monospace;
          font-size: clamp(0.7rem,1.05vw,0.8rem); line-height: 1.75;
          color: rgba(255,255,255,0.82);
          tab-size: 2;
        }
        .cs-line { display: flex; padding-right: 1.25rem; white-space: pre; }
        .cs-ln {
          width: 3rem; flex-shrink: 0; padding-right: 1rem; text-align: right;
          color: rgba(255,255,255,0.16); user-select: none;
        }
      `}</style>
    </section>
  )
}
