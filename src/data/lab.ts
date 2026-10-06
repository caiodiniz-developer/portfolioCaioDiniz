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

export const experiments: LabExperiment[] = [
  {
    id: 'liquid-metal',
    titlePt: 'Metal líquido',
    titleEn: 'Liquid metal',
    notePt: 'O shader por trás dos botões do site, sozinho e com os controles expostos. É um único contexto WebGL: os sliders só trocam os uniforms do shader que já está rodando, sem recompilar nada.',
    noteEn: 'The shader behind the site’s buttons, on its own with the knobs exposed. One WebGL context: the sliders only swap uniforms on the shader that is already running, nothing is recompiled.',
    hintPt: 'Arraste os controles · troque a forma',
    hintEn: 'Drag the sliders · switch the shape',
    tags: ['WebGL'],
    source: 'src/components/lab/LiquidMetalLab.tsx',
  },
  {
    id: 'magnetic-field',
    titlePt: 'Campo magnético',
    titleEn: 'Magnetic field',
    notePt: 'Uma grade de pontos puxada pelo cursor, com a mesma curva dos elementos magnéticos do site: a força cai em linha reta até zero no limite do raio. Cada ponto persegue o alvo aos poucos em vez de saltar, e é isso que dá a inércia.',
    noteEn: 'A grid of dots pulled by the pointer, using the same falloff as the site’s magnetic elements: strength drops linearly to zero at the edge of a radius. Each dot eases toward its target instead of snapping — that is where the inertia comes from.',
    hintPt: 'Passe o cursor · no celular, arraste o dedo',
    hintEn: 'Move the pointer · on touch, drag a finger',
    tags: ['Canvas', 'Pointer'],
    source: 'src/components/lab/MagneticFieldLab.tsx',
  },
  {
    id: 'circle-reveal',
    titlePt: 'Revelação circular',
    titleEn: 'Circular reveal',
    notePt: 'A troca de tema deste site, numa caixa. Duas cópias do mesmo conteúdo ficam empilhadas; o clique põe o outro tema por cima, recortado num círculo de raio zero no ponto clicado, e esse círculo cresce até cobrir o canto mais distante. No site real as duas “cópias” são as capturas de antes e depois que o navegador tira com a View Transitions API.',
    noteEn: 'This site’s theme switch, in a box. Two copies of the same content are stacked; a click puts the other theme on top, clipped to a zero-radius circle at the click point, and the circle grows until it covers the farthest corner. On the real site the two “copies” are the before/after snapshots the browser takes with the View Transitions API.',
    hintPt: 'Clique em qualquer ponto · Enter também funciona',
    hintEn: 'Click anywhere · Enter works too',
    tags: ['CSS', 'View Transitions'],
    source: 'src/components/lab/CircleRevealLab.tsx',
  },
  {
    id: 'css-cube',
    titlePt: 'Cubo sem WebGL',
    titleEn: 'A cube without WebGL',
    notePt: 'Seis divs. Cada face é girada para o seu lado e empurrada para fora em meia aresta com translateZ, dentro de um pai com preserve-3d. Arrastar só muda dois números, os ângulos X e Y; ao soltar, a última velocidade continua girando o cubo e perde força a cada quadro. Isso é a inércia.',
    noteEn: 'Six divs. Each face is rotated onto its side and pushed out by half the edge with translateZ, inside a parent with preserve-3d. Dragging only changes two numbers, the X and Y angles; on release the last velocity keeps turning it and decays every frame. That is the inertia.',
    hintPt: 'Arraste para girar · setas do teclado também',
    hintEn: 'Drag to spin · arrow keys too',
    tags: ['CSS', '3D', 'Pointer'],
    source: 'src/components/lab/CubeLab.tsx',
  },
]

export function sourceUrl(e: LabExperiment): string {
  return LAB_REPO + e.source
}
