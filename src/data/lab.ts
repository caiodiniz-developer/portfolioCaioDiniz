/* The Lab: small interactive pieces, each isolating one technique used
 * somewhere on this site. This file is only the catalogue — titles, the
 * one-paragraph explanation and where the code lives. The components
 * themselves are wired to these ids in src/pages/LabPage.tsx. */

export type LabTag = 'WebGL' | 'CSS' | 'Canvas' | 'View Transitions' | 'Scroll' | '3D' | 'Pointer'

export interface LabExperiment {
  /** Also the URL fragment: /lab#<id>. */
  id: string
  titlePt: string
  titleEn: string
  /** What the trick is, in two or three sentences. */
  notePt: string
  noteEn: string
  /** How to play with it — shown under the stage. */
  hintPt: string
  hintEn: string
  tags: LabTag[]
  /** Path of the source file inside the repo. */
  source: string
}

export const LAB_REPO = 'https://github.com/caiodiniz-developer/portfolioCaioDiniz/blob/main/'

export const experiments: LabExperiment[] = []

export function sourceUrl(e: LabExperiment): string {
  return LAB_REPO + e.source
}
