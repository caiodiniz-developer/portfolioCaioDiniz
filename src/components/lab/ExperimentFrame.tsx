import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
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
      </div>

      <div className="lab-stage-wrap">
        <div className="lab-stage">{children}</div>
        <p className="lab-hint">{en ? experiment.hintEn : experiment.hintPt}</p>
      </div>
    </article>
  )
}
