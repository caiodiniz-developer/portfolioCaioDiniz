/**
 * Shared tech icon registry.
 *
 * The stack carousel on the home page and the case-study pages must show the
 * same mark for the same technology — keeping the mapping in one place is what
 * makes that true. Keys are matched case-insensitively against the strings in
 * `projects.ts → stack`, so adding a technology there is enough.
 */

const DEV = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

export interface TechIcon {
  name: string
  /** Undefined when devicon has no mark — the UI falls back to a lettered badge. */
  icon?: string
  color: string
  /** Dark marks need inverting to stay visible on the site's black background. */
  invert?: boolean
}

export const TECH: Record<string, TechIcon> = {
  react:          { name: 'React',        icon: `${DEV}/react/react-original.svg`,            color: '#61DAFB' },
  typescript:     { name: 'TypeScript',   icon: `${DEV}/typescript/typescript-original.svg`,  color: '#3178C6' },
  javascript:     { name: 'JavaScript',   icon: `${DEV}/javascript/javascript-original.svg`,  color: '#F7DF1E' },
  'node.js':      { name: 'Node.js',      icon: `${DEV}/nodejs/nodejs-original.svg`,          color: '#339933' },
  nodejs:         { name: 'Node.js',      icon: `${DEV}/nodejs/nodejs-original.svg`,          color: '#339933' },
  html:           { name: 'HTML5',        icon: `${DEV}/html5/html5-original.svg`,            color: '#E34F26' },
  html5:          { name: 'HTML5',        icon: `${DEV}/html5/html5-original.svg`,            color: '#E34F26' },
  css:            { name: 'CSS3',         icon: `${DEV}/css3/css3-original.svg`,              color: '#1572B6' },
  css3:           { name: 'CSS3',         icon: `${DEV}/css3/css3-original.svg`,              color: '#1572B6' },
  'tailwind css': { name: 'Tailwind',     icon: `${DEV}/tailwindcss/tailwindcss-original.svg`,color: '#06B6D4' },
  tailwind:       { name: 'Tailwind',     icon: `${DEV}/tailwindcss/tailwindcss-original.svg`,color: '#06B6D4' },
  postgresql:     { name: 'PostgreSQL',   icon: `${DEV}/postgresql/postgresql-original.svg`,  color: '#4169E1' },
  mysql:          { name: 'MySQL',        icon: `${DEV}/mysql/mysql-original.svg`,            color: '#4479A1' },
  sql:            { name: 'SQL',          icon: `${DEV}/azuresqldatabase/azuresqldatabase-original.svg`, color: '#4479A1' },
  prisma:         { name: 'Prisma',       icon: `${DEV}/prisma/prisma-original.svg`,          color: '#5A67D8', invert: true },
  git:            { name: 'Git',          icon: `${DEV}/git/git-original.svg`,                color: '#F05032' },
  figma:          { name: 'Figma',        icon: `${DEV}/figma/figma-original.svg`,            color: '#F24E1E' },
  vite:           { name: 'Vite',         icon: `${DEV}/vitejs/vitejs-original.svg`,          color: '#646CFF' },
  docker:         { name: 'Docker',       icon: `${DEV}/docker/docker-original.svg`,          color: '#2496ED' },
  'three.js':     { name: 'Three.js',     icon: `${DEV}/threejs/threejs-original.svg`,        color: '#ffffff', invert: true },
  threejs:        { name: 'Three.js',     icon: `${DEV}/threejs/threejs-original.svg`,        color: '#ffffff', invert: true },
  'framer motion':{ name: 'Framer Motion',icon: `${DEV}/framermotion/framermotion-original.svg`, color: '#E24AFF', invert: true },

  /* No devicon mark exists for these — rendered as a lettered badge. */
  jwt:            { name: 'JWT',          color: '#D63AFF' },
  stripe:         { name: 'Stripe',       color: '#635BFF' },
  zod:            { name: 'Zod',          color: '#3E67B1' },
  gsap:           { name: 'GSAP',         color: '#88CE02' },
  lenis:          { name: 'Lenis',        color: '#F5C518' },
}

/** Resolve a stack string from projects.ts to an icon definition. */
export function resolveTech(raw: string): TechIcon {
  return (
    TECH[raw.toLowerCase()] ?? {
      name: raw,
      color: 'rgba(255,255,255,0.6)',
    }
  )
}
