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
    title: "FinixApp",
    category: "Full Stack",
    type: "Finance Platform",
    year: "2026",
    description:
      "Plataforma financeira completa com autenticação, dashboard interativo, integração de pagamentos e visualização de dados em tempo real.",
    longDescription:
      "O FinixApp é uma plataforma de gestão financeira projetada para dar ao usuário controle total sobre seus dados financeiros. Construída com foco em segurança, performance e experiência do usuário — com autenticação JWT, pagamentos via Stripe, gráficos interativos e painel administrativo com atualizações em tempo real.",
    stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "JWT", "Stripe"],
    image: "/assets/finixApp-projeto1.png",
    gallery: ["/assets/finixApp-projeto1.png"],
    liveUrl: "https://finixapp.com.br",
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
    slug: "nexus",
    title: "Nexus",
    category: "Full Stack",
    type: "Sistema de Gestão",
    year: "2024",
    description:
      "Sistema de gerenciamento empresarial completo com módulos de controle de estoque, financeiro e relatórios.",
    longDescription:
      "O Nexus é um sistema de gerenciamento empresarial desenvolvido para centralizar operações de negócio. Conta com módulos integrados de estoque, financeiro, cadastro de clientes e geração de relatórios — tudo em uma interface limpa e eficiente.",
    stack: ["Node.js", "TypeScript", "PostgreSQL", "Prisma", "Zod"],
    image: "/assets/nexux-projeto2.png",
    gallery: ["/assets/nexux-projeto2.png"],
    liveUrl: "https://github.com/caiodiniz-developer/SistemaDeGerenciamentoEmpresarial",
    githubUrl: "https://github.com/caiodiniz-developer/SistemaDeGerenciamentoEmpresarial",
    role: "Full Stack Developer",
    problem:
      "A empresa precisava de um sistema centralizado para gerenciar operações internas, eliminar planilhas manuais e ter visibilidade em tempo real do negócio.",
    solution:
      "Projetei e implementei um sistema modular com Node.js, Prisma ORM, autenticação JWT e dashboards de KPIs — com validação robusta via Zod em todas as entradas.",
    features: [
      "Gestão de estoque em tempo real",
      "Módulo financeiro completo",
      "Cadastro e CRM de clientes",
      "Relatórios exportáveis",
      "Auth JWT com permissões por perfil",
      "Rate limiting e logs de auditoria",
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
    slug: "shopsphere",
    title: "ShopSphere",
    category: "Full Stack",
    type: "E-commerce",
    year: "2024",
    description:
      "Loja virtual completa com catálogo de produtos, carrinho, checkout e painel administrativo.",
    longDescription:
      "O ShopSphere é uma plataforma de e-commerce construída do zero com experiência de compra fluida, gerenciamento de produtos e integração de pagamentos. Design focado em conversão com UX intuitiva e performance otimizada.",
    stack: ["React", "TypeScript", "Node.js", "Tailwind CSS"],
    image: "/assets/shopsphere-projeto3.png",
    gallery: ["/assets/shopsphere-projeto3.png"],
    liveUrl: "https://loja-virtual-jade.vercel.app",
    githubUrl: "",
    role: "Full Stack Developer",
    problem:
      "O cliente precisava de uma loja virtual própria com controle total sobre produtos, pedidos e clientes, sem depender de plataformas genéricas com altas taxas.",
    solution:
      "Desenvolvi uma plataforma de e-commerce customizada com React, painel admin, catálogo dinâmico e checkout integrado — focado em velocidade e conversão.",
    features: [
      "Catálogo de produtos com filtros",
      "Carrinho e checkout fluido",
      "Painel administrativo",
      "Gestão de pedidos",
      "SEO otimizado",
      "Design responsivo mobile-first",
      "Integração de pagamentos",
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
    slug: "forja",
    title: "Forja",
    category: "Websites",
    type: "Site Institucional",
    year: "2024",
    description:
      "Site institucional moderno com identidade visual forte, animações premium e foco em conversão.",
    longDescription:
      "A Forja é um projeto web com posicionamento premium — identidade visual marcante, animações suaves e uma estrutura focada em captar leads e transmitir credibilidade. Desenvolvido com atenção aos detalhes de UX e performance.",
    stack: ["React", "TypeScript", "GSAP", "Tailwind CSS"],
    image: "/assets/forja-projeto4.png",
    gallery: ["/assets/forja-projeto4.png"],
    liveUrl: "https://forja-sable.vercel.app",
    githubUrl: "",
    role: "Front-end Developer & UI Designer",
    problem:
      "O cliente não tinha presença digital compatível com o nível dos seus serviços, perdendo clientes para concorrentes com sites mais modernos.",
    solution:
      "Desenvolvi um site com design contemporâneo, animações GSAP, seções bem estruturadas e CTAs estratégicos para captação de leads.",
    features: [
      "Design institucional premium",
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
    slug: "cubo3d",
    title: "Cubo3D",
    category: "Creative",
    type: "Experiência 3D",
    year: "2025",
    description:
      "Cubo mágico 3D interativo no browser com rotação via drag, animações fluidas e resolução automática.",
    longDescription:
      "O Cubo3D é uma implementação interativa do cubo mágico direto no browser. O usuário pode girar as faces via drag, visualizar o estado atual em 3D e ver animações fluidas a cada movimento — tudo construído com Three.js e lógica de estado customizada.",
    stack: ["Three.js", "JavaScript", "HTML", "CSS"],
    image: "/assets/cubo3D-projeto5.png",
    gallery: ["/assets/cubo3D-projeto5.png"],
    liveUrl: "https://cubomagico3d.vercel.app/",
    githubUrl: "",
    role: "Front-end Developer",
    problem:
      "Projeto pessoal para explorar Three.js, lógica de rotação 3D e manipulação de estado complexo no browser sem depender de game engines.",
    solution:
      "Implementei o cubo mágico com Three.js puro, lógica de rotação matricial customizada e interação via drag com raycasting para detecção de face.",
    features: [
      "Rotação interativa via drag",
      "Renderização 3D com Three.js",
      "Animações fluidas de rotação",
      "Detecção de face por raycasting",
      "Estado do cubo em tempo real",
      "Interface intuitiva e responsiva",
    ],
    results: [
      "Projeto publicado e funcional",
      "Código limpo e organizado",
      "UX intuitivo e imersivo",
      "100% vanilla Three.js",
    ],
    featured: true,
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
    liveUrl: "https://caiodiniz.dev", // mude o link aqui
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
    liveUrl: "https://caiodiniz.dev", // mude o link aqui
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
    liveUrl: "https://caiodiniz.dev", // mude o link aqui
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
