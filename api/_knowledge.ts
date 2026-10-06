/* Everything the "Ask about Caio" assistant is allowed to know, built from the
 * same data files the site renders — so the answers can't drift from what the
 * portfolio shows. (Underscore prefix: Vercel doesn't deploy this as its own
 * function.) */
import { projects } from '../src/data/projects'
import { experience } from '../src/data/experience'
import { services } from '../src/data/services'
import { skillCategories } from '../src/data/skills'
import { experiments } from '../src/data/lab'
import { SITE } from '../src/lib/constants'

function projectBlock(p: (typeof projects)[number]): string {
  const lines = [
    `### ${p.title} — /projects/${p.slug}`,
    `Tipo: ${p.type} · ${p.category} · ${p.year} · Papel: ${p.role}`,
    `Stack: ${p.stack.join(', ')}`,
    `Resumo: ${p.longDescription}`,
    `Problema: ${p.problem}`,
    `Solução: ${p.solution}`,
    `Funcionalidades: ${p.features.join('; ')}`,
    `Resultados verificáveis: ${p.results.join('; ')}`,
    ...p.tradeoffs.map(t => `Decisão: escolheu ${t.chose} em vez de ${t.over} — ${t.why}`),
    p.liveUrl && !p.liveUrl.includes('github.com') ? `Site no ar: ${p.liveUrl}` : '',
    p.githubUrl ? `Código aberto: ${p.githubUrl}` : 'Código: privado',
  ]
  return lines.filter(Boolean).join('\n')
}

export const KNOWLEDGE = [
  `# Caio Diniz`,
  `Desenvolvedor Full Stack em Campinas, SP (Brasil). Site: ${SITE.url}`,
  `Contato: email ${SITE.email}, WhatsApp pela página /contact, GitHub ${SITE.github}, LinkedIn ${SITE.linkedin}. Currículo em /cv.`,
  ``,
  `## Experiência (mais recente primeiro)`,
  ...experience.map(e => `- ${e.year}: ${e.titlePt} — ${e.descPt} (${e.tags.join(', ')})`),
  ``,
  `## Habilidades`,
  ...skillCategories.map(c => `- ${c.label}: ${c.skills.map(s => s.name).join(', ')}`),
  ``,
  `## Serviços oferecidos`,
  ...services.map(s => `- ${s.titlePt}: ${s.descriptionPt} (${s.benefitsPt.join(', ')})`),
  ``,
  `## Lab (/lab) — experimentos interativos, cada um isolando uma técnica usada no site`,
  ...experiments.map(x => `- ${x.titlePt} (/lab#${x.id}) [${x.tags.join(', ')}]: ${x.notePt}`),
  ``,
  `## Projetos`,
  ...projects.map(projectBlock),
].join('\n')
