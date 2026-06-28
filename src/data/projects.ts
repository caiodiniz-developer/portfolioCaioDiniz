export interface Project {
  id: number;
  slug: string;
  title: string;
  category: "Full Stack" | "Front-end" | "Back-end" | "Websites" | "Creative";
  type: string;
  year: string;
  description: string;
  longDescription: string;
  stack: string[];
  image: string;
  gallery: string[];
  liveUrl: string;
  githubUrl: string;
  role: string;
  problem: string;
  solution: string;
  features: string[];
  results: string[];
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: 1,
    slug: "finix-app",
    title: "Finix App",
    category: "Full Stack",
    type: "Finance Platform",
    year: "2026",
    description:
      "Plataforma financeira completa com autenticação, dashboard interativo, integração de pagamentos e visualização de dados em tempo real.",
    longDescription:
      "O Finix App é uma plataforma de gestão financeira projetada para dar ao usuário controle total sobre seus dados financeiros. Construída com foco em segurança, performance e experiência do usuário — com autenticação JWT, pagamentos via Stripe, gráficos interativos e painel administrativo com atualizações em tempo real.",
    stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "JWT", "Stripe"],
    image: "/assets/projeto-FinixApp.png",
    gallery: [
      "/assets/foto-finix-1.jpeg",
      "/assets/foto-finix-2.jpeg",
      "/assets/foto-finix-3.jpeg",
      "/assets/foto-finix-1.jpeg",
    ],
    liveUrl: "",
    githubUrl: "",
    role: "Full Stack Developer",
    problem:
      "Os usuários precisavam de uma plataforma centralizada para gerenciar finanças com dados em tempo real e pagamentos seguros. As soluções existentes eram complexas demais ou careciam de segurança adequada.",
    solution:
      "Desenvolvi uma aplicação full-stack com autenticação JWT, integração Stripe, dashboard em tempo real via WebSockets e banco de dados PostgreSQL com Prisma ORM para queries type-safe.",
    features: [
      "Autenticação JWT com refresh tokens",
      "Integração Stripe para pagamentos",
      "Dashboard em tempo real",
      "Visualização de dados interativa",
      "Design responsivo",
      "Exportação de relatórios em PDF",
      "Controle de acesso por perfil",
      "Histórico de transações",
    ],
    results: [
      "50+ usuários ativos",
      "99,9% de uptime",
      "< 200ms de resposta da API",
      "Rating de segurança A+",
    ],
    featured: true,
  },
  {
    id: 2,
    slug: "refund-api",
    title: "Refund API",
    category: "Full Stack",
    type: "REST API",
    year: "2024",
    description:
      "API backend segura para gestão de reembolsos com autenticação, validação robusta e upload de arquivos.",
    longDescription:
      "Uma API RESTful pronta para produção para processar solicitações de reembolso com autenticação completa, uploads de arquivos, controle de acesso por função e validação abrangente. Construída para alta throughput com rate limiting, logs de auditoria e tratamento de erros.",
    stack: ["Node.js", "TypeScript", "PostgreSQL", "Prisma", "Zod"],
    image: "/assets/projeto-Refoud.png",
    gallery: [
      "/assets/foto-refound-1.jpeg",
      "/assets/foto-refound-2.jpeg",
      "/assets/foto-refound-3.jpeg",
    ],
    liveUrl: "",
    githubUrl: "",
    role: "Full Stack Developer",
    problem:
      "A empresa precisava de uma API segura e escalável para processar solicitações de reembolso com rastreabilidade total e trilha de auditoria para fins de conformidade.",
    solution:
      "Projetei e implementei uma API RESTful com Node.js, Prisma ORM, autenticação JWT, esquemas de validação Zod e upload de arquivos com integração de armazenamento em nuvem.",
    features: [
      "Auth JWT com refresh tokens",
      "Controle de acesso por função",
      "Upload com armazenamento em nuvem",
      "Validação de requests com Zod",
      "Logs de auditoria completos",
      "Rate limiting",
      "Documentação Swagger",
      "Testes automatizados",
    ],
    results: [
      "100% de cobertura de testes",
      "Latência p95 < 100ms",
      "Zero incidentes de segurança",
      "1000+ requests diários",
    ],
    featured: true,
  },
  {
    id: 3,
    slug: "santa-luzia",
    title: "Santa Luzia",
    category: "Websites",
    type: "Site Institucional",
    year: "2024",
    description:
      "Site institucional premium para empresa local focado em conversão, credibilidade e alta performance.",
    longDescription:
      "Site de alto impacto projetado para maximizar a credibilidade e gerar leads para um negócio de serviços. Focado em performance (score 100 no Lighthouse) e identidade visual forte que reflete o posicionamento premium da marca.",
    stack: ["React", "TypeScript", "GSAP", "Tailwind CSS"],
    image: "/assets/projeto-santaluzia.png",
    gallery: [
      "/assets/foto-santaluzia-1.jpeg",
      "/assets/foto-santaluzia-2.jpeg",
      "/assets/foto-santaluzia-3.jpeg",
    ],
    liveUrl: "",
    githubUrl: "",
    role: "Front-end Developer & UI Designer",
    problem:
      "O site desatualizado do cliente perdia potenciais clientes devido ao design fraco, carregamento lento e falta de otimização mobile.",
    solution:
      "Redesenhei e reconstruí o site do zero com identidade visual premium, animações GSAP suaves, scores perfeitos no Lighthouse e layout focado em conversão.",
    features: [
      "Score 100 no Lighthouse",
      "Animações GSAP customizadas",
      "Design responsivo mobile-first",
      "SEO otimizado",
      "CTA WhatsApp integrado",
      "Formulário de contato",
      "Google Analytics",
      "LCP < 1,2s",
    ],
    results: [
      "+180% no tráfego orgânico",
      "+240% na taxa de conversão",
      "Score 100 de performance",
      "LCP < 1,2s",
    ],
    featured: true,
  },
  {
    id: 4,
    slug: "matriz-tech",
    title: "Matriz Tech",
    category: "Websites",
    type: "Site Corporativo",
    year: "2024",
    description:
      "Site corporativo moderno para empresa de tecnologia com design arrojado e experiência de usuário imersiva.",
    longDescription:
      "Projeto web completo para a Matriz Tech — empresa de tecnologia com necessidade de presença digital forte e profissional. Desenvolvido com foco em conversão, performance e uma identidade visual que transmite inovação e confiança.",
    stack: ["React", "TypeScript", "GSAP", "CSS Modules"],
    image: "/assets/projeto-Matrix.png",
    gallery: [
      "/assets/foto-matrixtech-1.jpeg",
      "/assets/foto-matrixtech-2.jpeg",
      "/assets/foto-matrixtech-3.jpeg",
    ],
    liveUrl: "",
    githubUrl: "",
    role: "Front-end Developer & UI Designer",
    problem:
      "A Matriz Tech não tinha presença digital compatível com o nível dos seus serviços, perdendo clientes para concorrentes com sites mais modernos.",
    solution:
      "Desenvolvi um site corporativo com design contemporâneo, animações suaves com GSAP, seções bem estruturadas e CTAs estratégicos para captação de leads.",
    features: [
      "Design corporativo moderno",
      "Animações de entrada com GSAP",
      "Seção de serviços interativa",
      "Formulário de contato integrado",
      "SEO técnico avançado",
      "Performance otimizada",
      "Totalmente responsivo",
    ],
    results: [
      "+150% nas consultas online",
      "Score 98 de performance",
      "Redução do bounce rate em 35%",
      "Presença digital consolidada",
    ],
    featured: true,
  },
  {
    id: 5,
    slug: "ong-mpbia",
    title: "ONG MPBIA",
    category: "Websites",
    type: "Site para ONG",
    year: "2023",
    description:
      "Site institucional para ONG com foco em doações, transparência e engajamento da comunidade.",
    longDescription:
      "Projeto social desenvolvido para a ONG MPBIA — plataforma digital para divulgar causas, captar doadores e manter a comunidade engajada. Design acessível, emocional e funcional.",
    stack: ["HTML", "CSS", "JavaScript"],
    image: "/assets/projeto-OngMPBIA.png",
    gallery: [
      "/assets/foto-ongmpbia-1.jpeg",
      "/assets/foto-ongmpbia-2.jpeg",
      "/assets/foto-ongmpbia-3.jpeg",
    ],
    liveUrl: "",
    githubUrl: "",
    role: "Web Developer",
    problem:
      "A ONG não tinha presença digital e perdia oportunidades de captação de doadores e voluntários por não ter um canal de comunicação acessível e confiável.",
    solution:
      "Desenvolvi um site institucional com design acolhedor, integração de doações, galeria de projetos e formulário de voluntariado — tudo acessível e responsivo.",
    features: [
      "Página de causas e projetos",
      "Botão de doação integrado",
      "Galeria de fotos",
      "Formulário de voluntariado",
      "SEO para entidades sociais",
      "Totalmente acessível (WCAG)",
    ],
    results: [
      "+200% no engajamento online",
      "50+ novos voluntários",
      "Aumento nas doações mensais",
      "Alcance ampliado nas redes",
    ],
    featured: false,
  },
  {
    id: 6,
    slug: "jogo-adivinhacao",
    title: "Jogo de Adivinhação",
    category: "Creative",
    type: "Projeto Criativo",
    year: "2023",
    description:
      "Jogo interativo de adivinhação de números com interface animada, feedback dinâmico e lógica de tentativas.",
    longDescription:
      "Projeto criativo e interativo onde o usuário tenta adivinhar um número secreto gerado aleatoriamente. Interface com animações responsivas, dicas inteligentes e sistema de pontuação. Desenvolvido para praticar lógica de programação e UX interativo.",
    stack: ["JavaScript", "HTML", "CSS"],
    image: "/assets/projeto-jogoadivinhacao.png",
    gallery: [
      "/assets/projeto-jogoadivinhacao.png",
      "/assets/foto-jogodeadivinhar.jpeg",
    ],
    liveUrl: "",
    githubUrl: "",
    role: "Front-end Developer",
    problem:
      "Projeto pessoal para consolidar conceitos de lógica de programação, manipulação do DOM e feedback visual dinâmico para o usuário.",
    solution:
      "Criou um jogo funcional com geração aleatória de números, sistema de dicas (maior/menor), contador de tentativas e feedback visual animado.",
    features: [
      "Geração de números aleatórios",
      "Sistema de dicas dinâmicas",
      "Contador de tentativas",
      "Feedback visual animado",
      "Reset e nova partida",
      "Interface intuitiva e responsiva",
    ],
    results: [
      "Projeto aprovado na formação",
      "Código limpo e organizado",
      "UX intuitivo e divertido",
      "100% vanilla JS",
    ],
    featured: false,
  },
  {
    id: 7,
    slug: "prime-app",
    title: "Prime Footeboll",
    category: "Front-end",
    type: "Aplicação Web",
    year: "2026",
    description:
      "Aplicação web moderna com UI premium, filtros avançados e experiência de usuário fluida.",
    longDescription:
      "O Prime App é uma aplicação web com foco em experiência do usuário e design visual premium. Conta com filtros avançados, animações suaves e uma interface limpa que prioriza a usabilidade.",
    stack: ["React", "TypeScript", "Framer Motion", "Tailwind CSS"],
    image: "/assets/projeto-prime.png",
    gallery: [
      "/assets/foto-prime-1.jpeg",
      "/assets/foto-prime-2.jpeg",
      "/assets/foto-prime-3.jpeg",
    ],
    liveUrl: "",
    githubUrl: "",
    role: "Front-end Developer",
    problem:
      "O cliente precisava de uma aplicação web moderna com UX premium para substituir uma interface desatualizada que prejudicava a retenção de usuários.",
    solution:
      "Redesenhei e reconstruí o front-end com React, TypeScript e animações Framer Motion, priorizando performance e qualidade visual.",
    features: [
      "Sistema de filtros avançados",
      "Transições de página suaves",
      "Busca em tempo real",
      "Design responsivo",
      "Modo escuro",
      "Performance otimizada",
    ],
    results: [
      "+60% de retenção de usuários",
      "-40% na taxa de rejeição",
      "Score 98 de performance",
      "Feedback positivo de UX",
    ],
    featured: false,
  },
  {
    id: 8,
    slug: "easyton-platform",
    title: "Easyton Platform",
    category: "Full Stack",
    type: "Plataforma de Serviços",
    year: "2023",
    description:
      "Plataforma de gestão de serviços conectando clientes e prestadores com sistema de agendamento e pagamentos.",
    longDescription:
      "O Easyton conecta clientes a prestadores de serviços locais. Conta com busca de serviços, sistema de agendamento, pagamentos seguros e painel do prestador para gestão de agendas e ganhos.",
    stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "SQL"],
    image: "/assets/projetoeasyton.png",
    gallery: [
      "/assets/projetoeasyton.png",
    ],
    liveUrl: "",
    githubUrl: "",
    role: "Full Stack Developer",
    problem:
      "Prestadores de serviços locais não tinham uma forma eficiente de gerenciar agendamentos e pagamentos digitalmente. Clientes tinham dificuldade em encontrar serviços confiáveis.",
    solution:
      "Construí um marketplace de dois lados com painéis para prestador e cliente, sistema de agendamento, mensagens in-app e processamento de pagamentos.",
    features: [
      "Painéis para prestador e cliente",
      "Sistema de agendamento",
      "Integração de pagamentos",
      "Busca de serviços",
      "Notificações in-app",
      "Avaliações e comentários",
    ],
    results: [
      "20+ prestadores cadastrados",
      "100+ agendamentos no beta",
      "Feedback positivo dos usuários",
      "Design responsivo completo",
    ],
    featured: false,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProjectsByCategory(category: string): Project[] {
  if (category === "All") return projects;
  return projects.filter((p) => p.category === category);
}
