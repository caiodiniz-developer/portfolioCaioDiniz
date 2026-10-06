import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowUpRight, Check, Link2 } from 'lucide-react'
import { sourceUrl } from '@/data/lab'
import type { LabExperiment } from '@/data/lab'
import { useCursorStore } from '@/store/useCursorStore'

/* The shell every experiment sits in: number, title, the explanation on one
   side and the live "stage" on the other, with a hint and a link to the
   source underneath. Experiments only provide what goes on the stage. */
export default function ExperimentFrame({ experiment, index, en, children }: {
  experiment: LabExperiment
  index: number
  en: boolean
  children: ReactNode
}) {
  const setCursor = useCursorStore(s => s.setState)

  /* Only the experiments near the viewport are mounted. Each one owns a
     render loop — and one a WebGL context — so six running at once, five of
     them off screen, was wasted work the whole time the page was open. */
  const [copied, setCopied] = useState(false)
  function copyLink() {
    const url = `${location.origin}/lab#${experiment.id}`
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    }).catch(() => {})
  }

  const stageRef = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: '300px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <article id={experiment.id} className="lab-item">
      <div className="lab-copy">
        <span className="lab-num">{String(index + 1).padStart(2, '0')}</span>
        <h2 className="lab-title">{en ? experiment.titleEn : experiment.titlePt}</h2>
        <p className="lab-note">{en ? experiment.noteEn : experiment.notePt}</p>
        <ul className="lab-tags">
          {experiment.tags.map(tag => <li key={tag}>{tag}</li>)}
        </ul>
        <a
          href={sourceUrl(experiment)}
          target="_blank"
          rel="noopener noreferrer"
          className="lab-source"
          onMouseEnter={() => setCursor('pointer')}
          onMouseLeave={() => setCursor('default')}
        >
          {en ? 'View the code' : 'Ver o código'} <ArrowUpRight size={12} />
        </a>
        <button
          type="button"
          onClick={copyLink}
          className="lab-source lab-copy-link"
          onMouseEnter={() => setCursor('pointer')}
          onMouseLeave={() => setCursor('default')}
        >
          {copied ? <Check size={12} /> : <Link2 size={12} />}
          <span aria-live="polite">{copied ? (en ? 'Copied' : 'Copiado') : (en ? 'Copy link' : 'Copiar link')}</span>
        </button>
      </div>

      <div className="lab-stage-wrap">
        <div ref={stageRef} className="lab-stage">{near && children}</div>
        <p className="lab-hint">{en ? experiment.hintEn : experiment.hintPt}</p>
      </div>
    </article>
  )
}
