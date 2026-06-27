export interface ProcessStep {
  id: number
  icon: string
  titleEn: string
  titlePt: string
  descriptionEn: string
  descriptionPt: string
  duration: string
}

export const processSteps: ProcessStep[] = [
  {
    id: 1,
    icon: 'Search',
    titleEn: 'Discovery',
    titlePt: 'Descoberta',
    descriptionEn:
      'I deep-dive into your business, goals and audience to understand what success looks like for you.',
    descriptionPt:
      'Me aprofundo no seu negócio, objetivos e público para entender como é o sucesso para você.',
    duration: '1-2 days',
  },
  {
    id: 2,
    icon: 'LayoutTemplate',
    titleEn: 'Strategy',
    titlePt: 'Estratégia',
    descriptionEn:
      'Defining the sitemap, user flows, technical architecture and project scope before any design or code.',
    descriptionPt:
      'Definindo o mapa do site, fluxos de usuário, arquitetura técnica e escopo antes de qualquer design ou código.',
    duration: '1-2 days',
  },
  {
    id: 3,
    icon: 'Palette',
    titleEn: 'Design',
    titlePt: 'Design',
    descriptionEn:
      'Creating wireframes, visual identity, UI components and interaction specs in Figma with your feedback.',
    descriptionPt:
      'Criando wireframes, identidade visual, componentes de UI e especificações de interação no Figma com seu feedback.',
    duration: '3-5 days',
  },
  {
    id: 4,
    icon: 'Code2',
    titleEn: 'Development',
    titlePt: 'Desenvolvimento',
    descriptionEn:
      'Building with clean, typed, maintainable code using modern frameworks and best practices.',
    descriptionPt:
      'Construindo com código limpo, tipado e manutenível usando frameworks modernos e boas práticas.',
    duration: '5-15 days',
  },
  {
    id: 5,
    icon: 'Sparkles',
    titleEn: 'Motion',
    titlePt: 'Motion',
    descriptionEn:
      'Adding smooth animations, page transitions, micro-interactions and polish that elevates the experience.',
    descriptionPt:
      'Adicionando animações suaves, transições de página, micro-interações e polimento que elevam a experiência.',
    duration: '2-4 days',
  },
  {
    id: 6,
    icon: 'Rocket',
    titleEn: 'Launch',
    titlePt: 'Lançamento',
    descriptionEn:
      'Deploying to production with performance optimization, SEO setup, analytics and post-launch support.',
    descriptionPt:
      'Fazendo deploy em produção com otimização de performance, configuração de SEO, analytics e suporte pós-lançamento.',
    duration: '1-2 days',
  },
]
