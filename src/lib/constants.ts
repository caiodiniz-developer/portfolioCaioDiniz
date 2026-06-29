export const SITE = {
  name: 'Caio Diniz',
  title: 'Caio Diniz — Full Stack Developer',
  description:
    'Portfolio of Caio Diniz, a Full Stack Developer building premium websites, web apps and digital experiences with React, TypeScript and Node.js.',
  url: 'https://caiodiniz.dev',
  email: 'cvdinizramos@gmail.com',
  whatsapp: '+5519994737425',
  github: 'https://github.com/caiodiniz-dev',
  linkedin: 'https://www.linkedin.com/in/caiodinizdev/',
  tiktok: 'https://www.tiktok.com/@caiodinizdev',
} as const

export const NAV_LINKS = [
  { label: 'home', path: '/' },
  { label: 'about', path: '/about' },
  { label: 'projects', path: '/projects' },
  { label: 'services', path: '/services' },
  { label: 'contact', path: '/contact' },
] as const

export const EASING = {
  outExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOutExpo: [0.87, 0, 0.13, 1] as [number, number, number, number],
  outQuart: [0.25, 1, 0.5, 1] as [number, number, number, number],
  outCubic: [0.33, 1, 0.68, 1] as [number, number, number, number],
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
} as const

export const DURATION = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.7,
  verySlow: 1.0,
} as const

export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const
