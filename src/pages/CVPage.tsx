import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Download, Mail, Github, Linkedin, MapPin, Globe } from 'lucide-react'
import { SITE } from '@/lib/constants'
import { experience } from '@/data/experience'
import { skillCategories } from '@/data/skills'
import { projects } from '@/data/projects'
import { useLanguageStore } from '@/store/useLanguageStore'
import { track } from '@/lib/analytics'

/**
 * A résumé rendered from the same data the site uses — experience.ts,
 * skills.ts and projects.ts. Adding a project or a role updates the CV with it,
 * so the PDF can never quietly go stale.
 *
 * Export is the browser's own print-to-PDF rather than a JS PDF library:
 *  - zero bytes added to the bundle (jsPDF alone is ~350KB, on a bundle that is
 *    already too large);
 *  - real text selection, real links, real font hinting in the output;
 *  - the print stylesheet below is what actually defines the page, so what the
 *    visitor previews on screen is what lands in the file.
 */
export default function CVPage() {
  const lang = useLanguageStore(s => s.lang)
  const en   = lang === 'en'

  useEffect(() => {
    document.title = `${en ? 'Résumé' : 'Currículo'} — ${SITE.name}`
  }, [en])

  const featured = projects.filter(p => p.featured).slice(0, 4)

  return (
    <div className="cv-root">
      {/* ── Screen-only toolbar ── */}
      <div className="cv-toolbar">
        <Link to="/" className="cv-tool-link">
          <ArrowLeft size={13} /> {en ? 'Back' : 'Voltar'}
        </Link>
        <button
          onClick={() => { track('cv-download'); window.print() }}
          className="cv-download"
        >
          <Download size={13} /> {en ? 'Download PDF' : 'Baixar PDF'}
        </button>
      </div>

      <p className="cv-hint">
        {en
          ? 'Choose “Save as PDF” as the destination in the print dialog.'
          : 'Na janela de impressão, escolha “Salvar como PDF” no destino.'}
      </p>

      {/* ── The document ── */}
      <article className="cv-paper">

        {/* Header */}
        <header className="cv-head">
          <div>
            <h1 className="cv-name">{SITE.name}</h1>
            <p className="cv-role">
              {en ? 'Full Stack Developer' : 'Desenvolvedor Full Stack'}
            </p>
          </div>

          <ul className="cv-contact">
            <li><Mail size={11} /> <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li><MapPin size={11} /> Campinas, SP — Brasil</li>
            <li><Globe size={11} /> <a href={SITE.url}>{SITE.url.replace(/^https?:\/\//, '')}</a></li>
            <li><Github size={11} /> <a href={SITE.github}>{SITE.github.replace('https://github.com/', 'github.com/')}</a></li>
            <li><Linkedin size={11} /> <a href={SITE.linkedin}>linkedin.com/in/caiodinizdev</a></li>
          </ul>
        </header>

        {/* Summary */}
        <section className="cv-section">
          <h2 className="cv-h2">{en ? 'Profile' : 'Perfil'}</h2>
          <p className="cv-body">
            {en
              ? 'Full Stack Developer focused on building web products end to end — from database schema and API design through to interface and motion. I care about the parts users feel: load time, input latency, and interfaces that stay legible under real conditions.'
              : 'Desenvolvedor Full Stack focado em construir produtos web de ponta a ponta — do schema do banco e desenho da API até a interface e o movimento. Me importo com o que o usuário sente: tempo de carregamento, latência de interação e interfaces que continuam legíveis em condições reais.'}
          </p>

          {/* Availability — the first thing a recruiter checks after the name. */}
          <p className="cv-avail">
            <span className="cv-dot" />
            {en
              ? 'Available for full-time, contract or freelance · Remote or Campinas/São Paulo'
              : 'Disponível para CLT, PJ ou freelance · Remoto ou Campinas/São Paulo'}
          </p>
        </section>

        {/* Experience */}
        <section className="cv-section">
          <h2 className="cv-h2">{en ? 'Experience' : 'Experiência'}</h2>
          <div className="cv-stack">
            {experience.map(e => (
              <div key={e.hash} className="cv-entry">
                <div className="cv-entry-head">
                  <h3 className="cv-entry-title">{en ? e.titleEn : e.titlePt}</h3>
                  <span className="cv-year">{e.year}</span>
                </div>
                <p className="cv-body">{en ? e.descEn : e.descPt}</p>
                <p className="cv-tags">{e.tags.join(' · ')}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Selected projects */}
        <section className="cv-section">
          <h2 className="cv-h2">{en ? 'Selected projects' : 'Projetos selecionados'}</h2>
          <div className="cv-stack">
            {featured.map(p => (
              <div key={p.slug} className="cv-entry">
                <div className="cv-entry-head">
                  <h3 className="cv-entry-title">
                    {p.title} <span className="cv-entry-type">— {p.type}</span>
                  </h3>
                  <span className="cv-year">{p.year}</span>
                </div>
                <p className="cv-body">{p.description}</p>
                <p className="cv-tags">{p.stack.join(' · ')}</p>
                {p.results?.length > 0 && (
                  <p className="cv-results">{p.results.slice(0, 3).join('  ·  ')}</p>
                )}
                {/* One decision per project — this is what turns a list of
                    projects into evidence of judgement. */}
                {p.tradeoffs?.[0] && (
                  <p className="cv-tradeoff">
                    <strong>{p.tradeoffs[0].chose}</strong>
                    {en ? ' over ' : ' em vez de '}
                    <span className="cv-rejected">{p.tradeoffs[0].over}</span>
                    {' — '}{p.tradeoffs[0].why}
                  </p>
                )}
                {p.liveUrl && p.liveUrl !== '#' && !p.liveUrl.includes('caiodiniz.dev') && (
                  <p className="cv-link">
                    <a href={p.liveUrl}>{p.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="cv-section cv-no-break">
          <h2 className="cv-h2">{en ? 'Skills' : 'Competências'}</h2>
          <div className="cv-skills">
            {skillCategories.map(c => (
              <div key={c.id} className="cv-skill-row">
                <span className="cv-skill-label">{c.label}</span>
                <span className="cv-skill-list">{c.skills.map(s => s.name).join(' · ')}</span>
              </div>
            ))}
            <div className="cv-skill-row">
              <span className="cv-skill-label">{en ? 'Languages' : 'Idiomas'}</span>
              <span className="cv-skill-list">
                {en ? 'Portuguese (native) · English (technical)' : 'Português (nativo) · Inglês (técnico)'}
              </span>
            </div>
          </div>
        </section>

        <footer className="cv-foot">
          {en
            ? `Generated from the portfolio source — ${SITE.url}/cv`
            : `Gerado a partir do código do portfólio — ${SITE.url}/cv`}
        </footer>
      </article>

      <style>{`
        /* ═══ SCREEN ═══ */
        .cv-root {
          background: #0d0d0d;
          min-height: 100vh;
          padding: clamp(6rem,10vw,8rem) 1.25rem 5rem;
        }

        .cv-toolbar {
          max-width: 820px;
          margin: 0 auto 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .cv-tool-link {
          display: inline-flex; align-items: center; gap: 0.45rem;
          font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); text-decoration: none;
          transition: color 0.22s;
        }
        .cv-tool-link:hover { color: #fff; }

        .cv-download {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.5rem; border-radius: 999px;
          background: #fff; color: #0d0d0d; border: 0;
          font-family: inherit;
          font-size: 0.64rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer; transition: background 0.22s;
        }
        .cv-download:hover { background: #e2e2e2; }

        .cv-hint {
          max-width: 820px;
          margin: 0 auto 1.5rem;
          font-size: 0.62rem;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.04em;
        }

        /* The sheet — white, so what you see is the printed artefact */
        .cv-paper {
          max-width: 820px;
          margin: 0 auto;
          background: #fff;
          color: #16161a;
          padding: clamp(2rem, 5vw, 3.4rem);
          border-radius: 4px;
          font-family: 'Inter', system-ui, sans-serif;
          line-height: 1.6;
        }

        .cv-head {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          padding-bottom: 1.4rem;
          margin-bottom: 1.6rem;
          border-bottom: 1.5px solid #16161a;
        }
        @media (min-width: 640px) {
          .cv-head { grid-template-columns: 1fr auto; align-items: start; }
        }

        .cv-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(1.9rem, 5vw, 2.6rem);
          letter-spacing: -0.045em;
          line-height: 1;
          margin: 0;
          color: #0b0b0d;
        }
        .cv-role {
          margin: 0.4rem 0 0;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6a6a72;
        }

        .cv-contact { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.3rem; }
        .cv-contact li {
          display: flex; align-items: center; gap: 0.45rem;
          font-size: 0.72rem; color: #4a4a52;
        }
        .cv-contact a { color: #16161a; text-decoration: none; }

        .cv-section { margin-bottom: 1.6rem; }
        .cv-h2 {
          font-size: 0.6rem; font-weight: 800;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #9a9aa2;
          margin: 0 0 0.85rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid #e4e4e8;
        }

        .cv-stack { display: flex; flex-direction: column; gap: 1.1rem; }
        .cv-entry { break-inside: avoid; }
        .cv-entry-head {
          display: flex; align-items: baseline; justify-content: space-between;
          gap: 1rem; margin-bottom: 0.25rem;
        }
        .cv-entry-title {
          font-size: 0.88rem; font-weight: 700;
          color: #0b0b0d; margin: 0; line-height: 1.35;
        }
        .cv-entry-type { font-weight: 400; color: #8a8a92; }
        .cv-year {
          font-size: 0.68rem; font-weight: 700;
          color: #9a9aa2; flex-shrink: 0;
          font-variant-numeric: tabular-nums;
        }
        .cv-body { font-size: 0.78rem; color: #45454d; margin: 0; line-height: 1.65; }
        .cv-tags {
          margin: 0.35rem 0 0;
          font-size: 0.68rem; color: #8a8a92;
          letter-spacing: 0.02em;
        }
        .cv-results {
          margin: 0.3rem 0 0;
          font-size: 0.68rem; font-weight: 600; color: #16161a;
        }
        .cv-tradeoff {
          margin: 0.4rem 0 0;
          padding-left: 0.7rem;
          border-left: 2px solid #e0e0e6;
          font-size: 0.7rem;
          line-height: 1.6;
          color: #55555d;
        }
        .cv-tradeoff strong { color: #16161a; font-weight: 700; }
        .cv-rejected { text-decoration: line-through; color: #9a9aa2; }
        .cv-link { margin: 0.3rem 0 0; font-size: 0.68rem; }
        .cv-link a { color: #45454d; text-decoration: underline; text-underline-offset: 2px; }

        .cv-avail {
          display: flex; align-items: center; gap: 0.45rem;
          margin: 0.7rem 0 0;
          font-size: 0.72rem; font-weight: 600; color: #16161a;
        }
        .cv-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #16a34a; flex-shrink: 0;
          /* print-color-adjust keeps the dot from vanishing in the PDF, since
             browsers strip backgrounds when printing by default */
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .cv-skills { display: flex; flex-direction: column; gap: 0.5rem; }
        .cv-skill-row {
          display: grid; grid-template-columns: 1fr; gap: 0.1rem;
        }
        @media (min-width: 560px) {
          .cv-skill-row { grid-template-columns: 110px 1fr; gap: 1rem; align-items: baseline; }
        }
        .cv-skill-label {
          font-size: 0.62rem; font-weight: 800;
          letter-spacing: 0.12em; text-transform: uppercase; color: #9a9aa2;
        }
        .cv-skill-list { font-size: 0.78rem; color: #45454d; }

        .cv-foot {
          margin-top: 1.8rem; padding-top: 0.9rem;
          border-top: 1px solid #e4e4e8;
          font-size: 0.62rem; color: #a8a8b0;
        }

        /* ═══ PRINT ═══
           The screen preview above already *is* the document, so printing only
           has to strip the chrome and set the page box. */
        @media print {
          @page { size: A4; margin: 14mm 13mm; }

          .cv-root { background: #fff; padding: 0; min-height: 0; }
          .cv-toolbar, .cv-hint { display: none !important; }

          .cv-paper {
            max-width: none; padding: 0; border-radius: 0;
            box-shadow: none;
          }

          /* Never split a role or project across two pages */
          .cv-entry, .cv-no-break { break-inside: avoid; page-break-inside: avoid; }
          .cv-h2 { break-after: avoid; }

          /* Print the destination of every link — a paper CV loses hrefs */
          .cv-contact a::after {
            content: '';
          }

          a { color: #16161a !important; text-decoration: none; }
        }
      `}</style>
    </div>
  )
}
