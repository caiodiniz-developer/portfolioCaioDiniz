/** A technical decision, the alternative that lost, and the reason.
 *  This is the part of a case study that separates "I built it" from
 *  "I understood the tradeoff" — recruiters read `why` first. */
export interface Tradeoff {
  /** What was chosen. e.g. "PostgreSQL + Prisma" */
  chose: string;
  /** The credible alternative that was rejected. e.g. "MongoDB" */
  over: string;
  /** Why. One or two sentences, concrete, no marketing. */
  why: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  category: "Full Stack" | "Front-end" | "Back-end";
  type: string;
  year: string;
  description: string;
  longDescription: string;
  stack: string[];
  image: string;
  gallery: string[];
  liveUrl: string;
  githubUrl: string;
  /** When set, the case study embeds the live product in an iframe instead of
   *  showing a static screenshot. Leave undefined for sites that block framing
   *  (X-Frame-Options / frame-ancestors) — the gallery is used as fallback. */
  embedUrl?: string;
  role: string;
  problem: string;
  solution: string;
  features: string[];
  results: string[];
  tradeoffs: Tradeoff[];
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
    embedUrl: "https://finixapp.com.br",
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
    tradeoffs: [
      {
        chose: "PostgreSQL + Prisma",
        over: "MongoDB",
        why: "Dado financeiro é relacional por natureza: uma transação toca conta, categoria e usuário ao mesmo tempo. Precisava de constraints de integridade e transações ACID reais — em MongoDB eu teria que garantir isso na aplicação, que é onde bugs de saldo nascem.",
      },
      {
        chose: "JWT com refresh token curto",
        over: "Sessão em servidor",
        why: "A API precisa escalar horizontal sem estado compartilhado. O custo é não conseguir revogar um token na hora — mitiguei com access token de 15min e uma blacklist de refresh tokens no Redis.",
      },
      {
        chose: "Stripe",
        over: "Integração direta com adquirente",
        why: "Processar cartão direto exigiria conformidade PCI-DSS completa. Para o volume do projeto, a taxa do Stripe custa muito menos que auditoria e responsabilidade sobre dados de cartão.",
      },
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
    tradeoffs: [
      {
        chose: "Zod validando na borda da API",
        over: "Confiar nos tipos do TypeScript",
        why: "TypeScript some em runtime. Todo dado que entra por HTTP é desconhecido até ser validado — o Zod gera o tipo e a validação da mesma definição, então não existe divergência entre o que o compilador acha e o que chega de verdade.",
      },
      {
        chose: "Monólito modular",
        over: "Microserviços",
        why: "São módulos de um mesmo negócio, com um time de uma pessoa. Microserviço aqui só adicionaria latência de rede e complexidade de deploy sem resolver nenhum problema real de escala que o projeto tenha.",
      },
      {
        chose: "Prisma",
        over: "SQL puro",
        why: "As queries do sistema são majoritariamente CRUD com joins previsíveis. Abri exceção nos relatórios, onde o SQL gerado ficava ineficiente — ali usei query raw e medi o plano de execução.",
      },
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
    embedUrl: "https://loja-virtual-jade.vercel.app",
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
    tradeoffs: [
      {
        chose: "Loja própria",
        over: "Shopify / Nuvemshop",
        why: "A taxa por venda de uma plataforma pronta vira o maior custo fixo do negócio conforme ele cresce. Construir custou mais na largada, mas o cliente para de pagar percentual sobre cada pedido — o ponto de equilíbrio chegou em menos de um ano.",
      },
      {
        chose: "Renderização no servidor do catálogo",
        over: "SPA pura",
        why: "Página de produto que não indexa não vende. O catálogo precisa vir pronto no HTML para o Google — o carrinho e o checkout, que ninguém pesquisa, ficaram client-side.",
      },
      {
        chose: "Imagens em WebP com srcset",
        over: "PNG único",
        why: "Catálogo é imagem em cima de imagem, e a maior parte do tráfego é 4G no celular. Foi o que segurou o LCP abaixo de 1,2s sem perda visível de qualidade.",
      },
    ],
    featured: true,
  },
  {
    id: 4,
    slug: "forja",
    title: "Forja",
    category: "Full Stack",
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
    embedUrl: "https://forja-sable.vercel.app",
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
    tradeoffs: [
      {
        chose: "GSAP",
        over: "Animação só com CSS",
        why: "As animações dependem de posição de scroll e de sequência entre elementos. Daria para forjar isso com CSS e IntersectionObserver, mas o ScrollTrigger resolve pin e scrub sem eu manter uma máquina de estados frágil na mão.",
      },
      {
        chose: "Animações que respeitam prefers-reduced-motion",
        over: "Animar sempre",
        why: "Movimento intenso causa desconforto real em quem tem sensibilidade vestibular. É uma linha de media query que não custa nada e evita que o site passe mal para uma parcela dos visitantes.",
      },
      {
        chose: "Formulário com backend próprio",
        over: "Formspree / Typeform",
        why: "Lead é o ativo do cliente. Serviço de terceiro significa dado de contato saindo do controle dele e um ponto de falha que eu não consigo depurar.",
      },
    ],
    featured: true,
  },
  {
    id: 5,
    slug: "cubo3d",
    title: "Cubo3D",
    category: "Front-end",
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
    embedUrl: "https://cubomagico3d.vercel.app/",
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
    tradeoffs: [
      {
        chose: "Three.js puro",
        over: "React Three Fiber",
        why: "O cubo é uma máquina de estados que muda 27 peças por rotação. Reconciliar isso pelo React seria trabalho a mais para um resultado igual — aqui o loop imperativo é mais simples que o declarativo.",
      },
      {
        chose: "Rotação matricial em grupo temporário",
        over: "Recalcular a posição de cada peça",
        why: "Rotacionar uma face significa mover 9 cubos juntos. Agrupá-los num objeto temporário, girar o grupo e depois reatribuir evita acumular erro de ponto flutuante a cada movimento — sem isso o cubo desalinha depois de umas 50 rotações.",
      },
      {
        chose: "Raycasting para detectar a face",
        over: "Mapear coordenadas de tela na mão",
        why: "O cubo gira livremente, então não existe mapa fixo de pixel para face. Raycast resolve isso na perspectiva atual, seja qual for a orientação.",
      },
    ],
    featured: true,
  },
  {
    id: 6,
    slug: "spylt",
    title: "SPYLT",
    category: "Front-end",
    type: "Aplicação Web",
    year: "2026",
    description:
      "Aplicação web com design arrojado, identidade visual forte e experiência de usuário premium.",
    longDescription:
      "SPYLT é uma aplicação web com foco em design e experiência do usuário. Interface limpa, animações suaves e uma identidade visual marcante que se destaca da concorrência.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    image: "/assets/spylt-projeto6.png",
    gallery: ["/assets/spylt-projeto6.png"],
    liveUrl: "https://spylt-blue.vercel.app/",
    githubUrl: "",
    embedUrl: "https://spylt-blue.vercel.app/",
    role: "Front-end Developer & UI Designer",
    problem:
      "O cliente precisava de uma aplicação com identidade visual única e experiência premium para se destacar no mercado.",
    solution:
      "Desenvolvi uma interface moderna com design system consistente, animações de entrada e transições suaves que transmitem qualidade e atenção aos detalhes.",
    features: [
      "Design system customizado",
      "Animações de interface premium",
      "Layout responsivo mobile-first",
      "Performance otimizada",
      "Identidade visual forte",
      "UX focado em conversão",
    ],
    results: [
      "Feedback positivo dos usuários",
      "Score 98 de performance",
      "Design diferenciado no mercado",
      "Taxa de engajamento elevada",
    ],
    tradeoffs: [
      {
        chose: "Framer Motion",
        over: "GSAP",
        why: "As animações aqui seguem o ciclo de vida de componentes React — entrar, sair, mudar de estado. O AnimatePresence resolve saída de elemento desmontado, que em GSAP exigiria segurar o nó no DOM na mão.",
      },
      {
        chose: "Design system com tokens",
        over: "Classes utilitárias soltas",
        why: "Cor e espaçamento definidos como variáveis significam que trocar a identidade visual é editar um arquivo, não caçar hex code em 40 componentes.",
      },
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
    tradeoffs: [
      {
        chose: "Reescrever só o front-end",
        over: "Refazer o sistema inteiro",
        why: "O back-end funcionava e não era o motivo da evasão — a interface era. Trocar as duas pontas de uma vez dobraria o risco e o prazo para resolver um problema que estava só na camada visual.",
      },
      {
        chose: "Filtro no cliente",
        over: "Filtro no servidor",
        why: "O conjunto de dados cabe em memória e a resposta vira instantânea, sem ida e volta de rede a cada tecla. Se a base crescer uma ordem de grandeza, essa decisão precisa ser revisitada.",
      },
    ],
    featured: false,
  },
  {
    id: 8,
    slug: "fruity",
    title: "FRUITY",
    category: "Front-end",
    type: "Experiência Web",
    year: "2026",
    description:
      "Experiência web interativa com design vibrante, animações expressivas e identidade visual única.",
    longDescription:
      "FRUITY é um projeto criativo que explora os limites do design web — cores vivas, animações expressivas e uma experiência de usuário que surpreende e encanta. Desenvolvido com foco em criatividade e impacto visual.",
    stack: ["React", "TypeScript", "GSAP", "Framer Motion", "Tailwind CSS"],
    image: "/assets/fruity-projeto6.png",
    gallery: ["/assets/fruity-projeto6.png"],
    liveUrl: "https://fruity-xi.vercel.app/",
    githubUrl: "",
    embedUrl: "https://fruity-xi.vercel.app/",
    role: "Front-end Developer & Creative Developer",
    problem:
      "Criar uma experiência web que vai além do convencional, explorando cores, formas e animações de forma criativa e memorável.",
    solution:
      "Desenvolvi um projeto com identidade visual própria, explorando animações GSAP e Framer Motion para criar uma experiência imersiva e diferenciada.",
    features: [
      "Design vibrante e expressivo",
      "Animações GSAP customizadas",
      "Interações criativas",
      "Paleta de cores única",
      "Layout não-convencional",
      "Experiência memorável",
    ],
    results: [
      "Projeto publicado e funcional",
      "Experiência visual marcante",
      "Código limpo e performático",
      "Design award-worthy",
    ],
    tradeoffs: [
      {
        chose: "GSAP e Framer Motion juntos",
        over: "Só uma das duas",
        why: "Cada uma ganha em um terreno: GSAP para timeline atrelada ao scroll, Framer Motion para entrada e saída de componente. O custo é carregar duas libs — assumi porque o projeto é vitrine de animação, onde isso é o produto.",
      },
      {
        chose: "Layout não-convencional",
        over: "Grid previsível",
        why: "O objetivo era ser memorável, não familiar. Em um site de e-commerce essa escolha seria errada — aqui a métrica é impressão, não taxa de conversão.",
      },
    ],
    featured: false,
  },
  {
    id: 9,
    slug: "aerivo",
    title: "AERIVO",
    category: "Front-end",
    type: "Experiência Imersiva",
    year: "2026",
    description:
      "Experiência cinematográfica de viagem conduzida pelo scroll — do horizonte distante até a cabine, com narrativa contínua e tipografia editorial.",
    longDescription:
      "A AERIVO é uma experiência web sobre voar. Em vez de apresentar destinos numa grade, o site conduz o visitante por uma narrativa contínua controlada pelo scroll: começa no horizonte distante e vai se aproximando até a cabine. Cada seção é um momento da jornada, com tipografia editorial em Playfair Display e movimento sincronizado ao scroll via GSAP e Lenis.",
    stack: ["React", "TypeScript", "GSAP", "Lenis", "Vite", "Tailwind CSS"],
    image: "/assets/aerivo-projeto8.png",
    gallery: ["/assets/aerivo-projeto8.png"],
    liveUrl: "https://aerivo.vercel.app/",
    githubUrl: "",
    embedUrl: "https://aerivo.vercel.app/",
    role: "Front-end Developer & Creative Developer",
    problem:
      "Sites de viagem se parecem: uma grade de cards com foto e preço. O desafio era vender a sensação de viajar, não o catálogo — provocar desejo antes de informar.",
    solution:
      "Construí uma narrativa linear em que o scroll é o único controle. A página inteira é uma timeline: cada rolagem aproxima o visitante do destino, com o texto e a imagem se revelando no ritmo do movimento em vez de aparecerem de uma vez.",
    features: [
      "Narrativa contínua guiada pelo scroll",
      "Timeline GSAP sincronizada com Lenis",
      "Tipografia editorial com Playfair Display",
      "Revelação progressiva por seção",
      "Transições encadeadas entre destinos",
      "Layout responsivo mobile-first",
    ],
    results: [
      "Projeto publicado e funcional",
      "Narrativa que sustenta a rolagem inteira",
      "Bundle de ~255KB",
      "Identidade visual própria",
    ],
    tradeoffs: [
      {
        chose: "Narrativa linear conduzida pelo scroll",
        over: "Grade de destinos navegável",
        why: "Uma grade deixa o visitante escolher, mas não constrói expectativa. Aqui a métrica é desejo, não eficiência — e desejo precisa de ordem e ritmo. O custo é que quem já sabe o que quer não consegue pular direto pra lá.",
      },
      {
        chose: "GSAP + Lenis compartilhando um único loop",
        over: "Animação por IntersectionObserver",
        why: "IntersectionObserver dispara em limiares — ou entrou, ou não entrou. Uma narrativa que se desenrola com a rolagem precisa de progresso contínuo, e é isso que o scrub do ScrollTrigger dá. Lenis entra para o scroll interpolar em vez de saltar.",
      },
      {
        chose: "Playfair Display no título",
        over: "Uma sans-serif geométrica",
        why: "O produto vende sofisticação, e serifa carrega essa leitura de imediato. Escolhi um peso alto de propósito: nos pesos leves a Playfair fica delicada demais e some contra imagem de fundo.",
      },
    ],
    featured: true,
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
