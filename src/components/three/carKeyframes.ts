import * as THREE from 'three'

export type V3 = [number, number, number]

export interface ModelKF {
  t:     number
  pos:   V3
  rot:   V3
  scale: number
}

export interface CamKF {
  t:      number
  pos:    V3
  target: V3
}

/* ─── Model keyframes (progress 0→1) ─── */
export const MODEL_KF: ModelKF[] = [
  { t: 0,    pos: [ 1.4, -0.5, 0 ], rot: [0,     0.55,           0     ], scale: 1    }, // Hero: front 3/4
  { t: 0.22, pos: [-1.4, -0.5, 0 ], rot: [0,    -0.35,           0.02  ], scale: 0.9  }, // Ch1: other side
  { t: 0.45, pos: [ 0,   -0.35, 0], rot: [0.1,   Math.PI * 0.75, 0     ], scale: 0.85 }, // Ch2: elevated rear
  { t: 0.72, pos: [ 1.3, -0.5, 0 ], rot: [0,     Math.PI,       -0.02  ], scale: 0.9  }, // Ch3: full rear
  { t: 0.88, pos: [ 0,   -0.5, 0.8], rot: [0,    0,              0     ], scale: 1.1  }, // Ch4: dramatic front
  { t: 1.0,  pos: [ 0,   -5,   0 ], rot: [0.25,  0,              0     ], scale: 1.25 }, // Exit: drop down
]

/* ─── Camera keyframes ─── */
export const CAM_KF: CamKF[] = [
  { t: 0,    pos: [ 4,  1.5, 6  ], target: [0, 0.2, 0] },
  { t: 0.22, pos: [-5,  1.5, 5  ], target: [0, 0.2, 0] },
  { t: 0.45, pos: [ 2,  3,   5  ], target: [0, 0.5, 0] },
  { t: 0.72, pos: [-5,  1.5, 4  ], target: [0, 0.2, 0] },
  { t: 0.88, pos: [ 0,  1,   3.5], target: [0, 0.2, 0] },
  { t: 1.0,  pos: [ 0,  1.5, 3  ], target: [0, -1,  0] },
]

/* ─── Chapters (text shown per scroll range) ─── */
export const CHAPTERS = [
  {
    range:  [0, 0.25] as [number, number],
    label:  'Apresentação',
    lines:  ['Criando', 'produtos', 'digitais.'],
    colors: ['#ffffff', 'rgba(255,255,255,0.15)', '#ffffff'],
    sub:    'Desenvolvedor Full Stack especializado em experiências digitais de alta performance.',
    cta:    false,
  },
  {
    range:  [0.25, 0.5] as [number, number],
    label:  'Habilidades',
    lines:  ['Design', 'encontra', 'engenharia.'],
    colors: ['#ffffff', 'rgba(255,255,255,0.15)', '#ffffff'],
    sub:    'Código limpo, design preciso e motion como diferencial competitivo.',
    cta:    false,
  },
  {
    range:  [0.5, 0.75] as [number, number],
    label:  'Performance',
    lines:  ['Performance', 'sem', 'compromisso.'],
    colors: ['rgba(255,255,255,0.15)', '#ffffff', 'rgba(255,255,255,0.15)'],
    sub:    'Sites rápidos, escaláveis e otimizados para qualquer plataforma.',
    cta:    false,
  },
  {
    range:  [0.75, 1.0] as [number, number],
    label:  'Projetos',
    lines:  ['Pronto para', 'construir', 'algo real?'],
    colors: ['#ffffff', 'rgba(255,255,255,0.15)', '#ffffff'],
    sub:    null,
    cta:    true,
  },
]

/* ─── Interpolation utilities ─── */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function lerpV3(a: V3, b: V3, t: number): V3 {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]
}

export function interpModel(progress: number): { pos: V3; rot: V3; scale: number } {
  const t = THREE.MathUtils.clamp(progress, 0, 1)
  const kfs = MODEL_KF
  let lo = kfs[0], hi = kfs[kfs.length - 1]
  for (let i = 0; i < kfs.length - 1; i++) {
    if (t >= kfs[i].t && t <= kfs[i + 1].t) { lo = kfs[i]; hi = kfs[i + 1]; break }
  }
  const span  = hi.t - lo.t
  const raw   = span > 0 ? (t - lo.t) / span : 1
  const alpha = easeInOutCubic(Math.max(0, Math.min(1, raw)))
  return {
    pos:   lerpV3(lo.pos, hi.pos, alpha),
    rot:   lerpV3(lo.rot, hi.rot, alpha),
    scale: lo.scale + (hi.scale - lo.scale) * alpha,
  }
}

export function interpCam(progress: number): { pos: V3; target: V3 } {
  const t = THREE.MathUtils.clamp(progress, 0, 1)
  const kfs = CAM_KF
  let lo = kfs[0], hi = kfs[kfs.length - 1]
  for (let i = 0; i < kfs.length - 1; i++) {
    if (t >= kfs[i].t && t <= kfs[i + 1].t) { lo = kfs[i]; hi = kfs[i + 1]; break }
  }
  const span  = hi.t - lo.t
  const raw   = span > 0 ? (t - lo.t) / span : 1
  const alpha = easeInOutCubic(Math.max(0, Math.min(1, raw)))
  return {
    pos:    lerpV3(lo.pos, hi.pos, alpha),
    target: lerpV3(lo.target, hi.target, alpha),
  }
}
