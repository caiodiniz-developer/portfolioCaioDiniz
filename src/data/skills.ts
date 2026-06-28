export interface Skill { name: string; level?: number }
export interface SkillCategory { id: string; label: string; skills: Skill[] }

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    label: 'Front-end',
    skills: [
      { name: 'HTML' },
      { name: 'CSS' },
      { name: 'JavaScript' },
      { name: 'TypeScript' },
      { name: 'React' },
    ],
  },
  {
    id: 'backend',
    label: 'Back-end',
    skills: [
      { name: 'Node.js' },
      { name: 'PostgreSQL' },
      { name: 'SQL' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    skills: [
      { name: 'Git' },
      { name: 'GitHub' },
    ],
  },
]
