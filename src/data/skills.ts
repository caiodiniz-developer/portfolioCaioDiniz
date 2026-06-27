export interface Skill {
  name: string
  level?: number
}

export interface SkillCategory {
  id: string
  label: string
  skills: Skill[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    label: 'Front-end',
    skills: [
      { name: 'React' },
      { name: 'TypeScript' },
      { name: 'Vite' },
      { name: 'Tailwind CSS' },
      { name: 'Framer Motion' },
      { name: 'GSAP' },
      { name: 'Lenis' },
      { name: 'Three.js' },
      { name: 'HTML5' },
      { name: 'CSS3' },
    ],
  },
  {
    id: 'backend',
    label: 'Back-end',
    skills: [
      { name: 'Node.js' },
      { name: 'Express' },
      { name: 'Prisma' },
      { name: 'PostgreSQL' },
      { name: 'SQLite' },
      { name: 'JWT' },
      { name: 'REST APIs' },
      { name: 'Zod' },
      { name: 'Python' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    skills: [
      { name: 'Git' },
      { name: 'GitHub' },
      { name: 'Vercel' },
      { name: 'Figma' },
      { name: 'Docker' },
      { name: 'VS Code' },
      { name: 'Linux' },
      { name: 'Postman' },
    ],
  },
  {
    id: 'soft',
    label: 'Soft Skills',
    skills: [
      { name: 'Problem solving' },
      { name: 'Communication' },
      { name: 'Fast learning' },
      { name: 'Attention to detail' },
      { name: 'Business thinking' },
      { name: 'Team collaboration' },
    ],
  },
]
