/**
 * Career history — the single source of truth.
 *
 * Both the "Experience" section on the site and the generated CV read from
 * here, so the résumé cannot drift out of sync with the portfolio. Adding a
 * role in one place updates both.
 */

export interface ExperienceEntry {
  /** Fake commit hash — the site renders this history as a git log. */
  hash: string
  year: string
  msgEn: string
  msgPt: string
  titleEn: string
  titlePt: string
  descEn: string
  descPt: string
  tags: string[]
}

export const experience: ExperienceEntry[] = [
  {
    hash:    'a3f7c91',
    year:    '2026',
    msgEn:   'feat: Full Stack Developer — present',
    msgPt:   'feat: Desenvolvedor Full Stack — atual',
    titleEn: 'Full Stack Developer',
    titlePt: 'Desenvolvedor Full Stack',
    descEn:  'Developing scalable, high-performance web applications with modern technologies, focusing on clean architecture, intuitive user experiences, and robust back-end solutions.',
    descPt:  'Desenvolvendo aplicações web escaláveis e de alta performance, utilizando tecnologias modernas, com foco em arquitetura limpa, experiência do usuário e soluções robustas de back-end.',
    tags:    ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
  },
  {
    hash:    'e8b2d14',
    year:    '2025',
    msgEn:   'feat: Full Stack Developer — Freelance',
    msgPt:   'feat: Desenvolvedor Full Stack — Freelance',
    titleEn: 'Full Stack Developer — Freelance',
    titlePt: 'Desenvolvedor Full Stack — Freelance',
    descEn:  'Building premium websites, web apps and digital products for clients. Focus on React, Node.js, and TypeScript.',
    descPt:  'Construindo sites premium, aplicações web e produtos digitais para clientes. Foco em React, Node.js e TypeScript.',
    tags:    ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
  },
  {
    hash:    '72ca5f3',
    year:    '2024',
    msgEn:   'feat: Backend API Development',
    msgPt:   'feat: Desenvolvimento de APIs Backend',
    titleEn: 'Backend API Development',
    titlePt: 'Desenvolvimento de APIs Backend',
    descEn:  'Developed secure RESTful APIs with Node.js and PostgreSQL. JWT authentication, file uploads and comprehensive validation.',
    descPt:  'Desenvolvi APIs RESTful seguras com Node.js e PostgreSQL. Autenticação JWT, upload de arquivos e validação abrangente.',
    tags:    ['Node.js', 'PostgreSQL', 'SQL', 'TypeScript'],
  },
  {
    hash:    '1d9e048',
    year:    '2023',
    msgEn:   'chore: Web Development — self-taught journey begins',
    msgPt:   'chore: Desenvolvimento Web — início da jornada',
    titleEn: 'Web Development — Self-taught Journey',
    titlePt: 'Desenvolvimento Web — Jornada Autodidata',
    descEn:  'Started the programming journey. Built first projects with HTML, CSS and JavaScript. Focus on front-end and UI design.',
    descPt:  'Iniciei a jornada de programação. Construí primeiros projetos com HTML, CSS e JavaScript. Foco em front-end e UI design.',
    tags:    ['HTML', 'CSS', 'JavaScript'],
  },
]
