export interface Service {
  id: string
  icon: string
  titleEn: string
  titlePt: string
  descriptionEn: string
  descriptionPt: string
  image: string
  benefits: string[]
  benefitsPt: string[]
}

export const services: Service[] = [
  {
    id: 'uiux',
    icon: 'Palette',
    titleEn: 'UI/UX Design',
    titlePt: 'UI/UX Design',
    descriptionEn:
      'Interfaces designed with intention — clean, intuitive and aligned with your brand. From wireframes to polished high-fidelity screens.',
    descriptionPt:
      'Interfaces projetadas com intenção — limpas, intuitivas e alinhadas com sua marca. Do wireframe à tela polida em alta fidelidade.',
    image: '/assets/skill-1.png',
    benefits: ['High-fidelity prototypes', 'Design system', 'UX research', 'Responsive layouts'],
    benefitsPt: ['Protótipos em alta fidelidade', 'Design system', 'Pesquisa UX', 'Layouts responsivos'],
  },
  {
    id: 'dev',
    icon: 'Code2',
    titleEn: 'Developer',
    titlePt: 'Desenvolvedor',
    descriptionEn:
      'Full Stack development with React, Node.js and PostgreSQL. From MVP to production-ready applications with clean code and great performance.',
    descriptionPt:
      'Desenvolvimento Full Stack com React, Node.js e PostgreSQL. Do MVP à aplicação pronta para produção com código limpo e alta performance.',
    image: '/assets/skill-2.png',
    benefits: ['React & Node.js', 'REST APIs', 'PostgreSQL & MySQL', 'CI/CD & Deploy'],
    benefitsPt: ['React & Node.js', 'APIs REST', 'PostgreSQL & MySQL', 'CI/CD & Deploy'],
  },
  {
    id: 'branding',
    icon: 'Layers',
    titleEn: 'Branding Creator',
    titlePt: 'Criação de Marca',
    descriptionEn:
      'Visual identity that positions your brand with authority. Logo, typography, color palette and brand guidelines that make you unforgettable.',
    descriptionPt:
      'Identidade visual que posiciona sua marca com autoridade. Logo, tipografia, paleta de cores e guia de marca que te tornam inesquecível.',
    image: '/assets/skill-3.png',
    benefits: ['Logo design', 'Brand guidelines', 'Typography system', 'Color palette'],
    benefitsPt: ['Design de logo', 'Manual da marca', 'Sistema tipográfico', 'Paleta de cores'],
  },
]
