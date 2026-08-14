/**
 * /uses — the uses.tech convention: what a developer actually works with.
 *
 * Kept as data so the page stays a rendering concern. Everything here is
 * inferred from this repository (package.json, the stack carousel, the editor
 * the preloader imitates) — CHECK IT AND CORRECT ANYTHING THAT IS WRONG before
 * publishing, since a /uses page that lies is worse than none.
 */

export interface UsesItem {
  name: string
  /** One line on why this and not the alternative. */
  notePt: string
  noteEn: string
  url?: string
  /** Marks the one thing in the group worth noticing. */
  highlight?: boolean
}

export interface UsesGroup {
  id: string
  titlePt: string
  titleEn: string
  items: UsesItem[]
}

export const usesGroups: UsesGroup[] = [
  {
    id: 'editor',
    titlePt: 'Editor e terminal',
    titleEn: 'Editor & terminal',
    items: [
      {
        name: 'VS Code',
        notePt: 'Tema Dark+ padrão. É o editor que o preloader deste site imita, letra por letra.',
        noteEn: 'Stock Dark+ theme. It is the editor this site’s preloader imitates, character by character.',
        url: 'https://code.visualstudio.com',
        highlight: true,
      },
      {
        name: 'JetBrains Mono',
        notePt: 'Fonte do editor e de todo texto monoespaçado do site. Ligaduras ligadas.',
        noteEn: 'Editor font, and every monospaced string on this site. Ligatures on.',
        url: 'https://www.jetbrains.com/lp/mono/',
      },
      {
        name: 'Git + GitHub',
        notePt: 'Commits pequenos e frequentes — a seção de atividade da home lê deles em tempo real.',
        noteEn: 'Small, frequent commits — the activity section on the home page reads them live.',
        url: 'https://github.com/caiodiniz-developer',
      },
    ],
  },
  {
    id: 'stack',
    titlePt: 'Stack do dia a dia',
    titleEn: 'Daily stack',
    items: [
      {
        name: 'React 19 + TypeScript',
        notePt: 'TypeScript em modo strict. Tipo que não existe em runtime não protege nada — por isso valido a entrada com Zod.',
        noteEn: 'TypeScript in strict mode. A type that vanishes at runtime protects nothing, which is why input gets validated with Zod.',
      },
      {
        name: 'Vite',
        notePt: 'Escolhido pelo tempo de rebuild. Este site sobe em menos de um segundo.',
        noteEn: 'Chosen for rebuild time. This site boots in under a second.',
        url: 'https://vite.dev',
        highlight: true,
      },
      {
        name: 'Node.js + PostgreSQL',
        notePt: 'Postgres por padrão. Só saio dele quando o dado realmente não é relacional.',
        noteEn: 'Postgres by default. I only leave it when the data genuinely is not relational.',
      },
      {
        name: 'Prisma',
        notePt: 'Para o CRUD previsível. Nos relatórios pesados eu desço para SQL e leio o plano de execução.',
        noteEn: 'For predictable CRUD. On heavy reports I drop to raw SQL and read the query plan.',
        url: 'https://www.prisma.io',
      },
    ],
  },
  {
    id: 'motion',
    titlePt: 'Interface e movimento',
    titleEn: 'Interface & motion',
    items: [
      {
        name: 'GSAP + ScrollTrigger',
        notePt: 'Para tudo que depende da posição do scroll. Nunca uso gsap.from() com ScrollTrigger — ele reverte no refresh e some com o elemento.',
        noteEn: 'For anything tied to scroll position. Never gsap.from() with ScrollTrigger — a refresh reverts it and the element disappears.',
        url: 'https://gsap.com',
        highlight: true,
      },
      {
        name: 'Lenis',
        notePt: 'Scroll suave por interpolação, num único loop de RAF junto com o GSAP. Dois loops competindo geram tremor.',
        noteEn: 'Lerp-based smooth scroll, sharing one RAF loop with GSAP. Two competing loops produce stutter.',
        url: 'https://lenis.darkroom.engineering',
      },
      {
        name: 'Framer Motion',
        notePt: 'Só para ciclo de vida de componente — entrada, saída, troca de rota. O resto é GSAP.',
        noteEn: 'Component lifecycle only — enter, exit, route change. Everything else is GSAP.',
      },
      {
        name: 'Tailwind + CSS-in-JS',
        notePt: 'Tokens em variáveis CSS. Trocar a identidade visual é editar um arquivo, não caçar hex em 40 componentes.',
        noteEn: 'Tokens as CSS variables. Changing the visual identity is one file, not hunting hex codes across 40 components.',
      },
    ],
  },
  {
    id: 'principles',
    titlePt: 'Como eu trabalho',
    titleEn: 'How I work',
    items: [
      {
        name: 'Medir antes de otimizar',
        notePt: 'Quase toda travada que resolvi neste site era leitura de layout dentro de um loop — não configuração de biblioteca.',
        noteEn: 'Nearly every stall I fixed on this site was a layout read inside a loop — not library configuration.',
        highlight: true,
      },
      {
        name: 'Abrir o site e olhar',
        notePt: 'Typecheck passando não significa que está certo. Já tive texto invisível com build 100% verde.',
        noteEn: 'A passing typecheck does not mean it is right. I have shipped invisible text with a fully green build.',
      },
      {
        name: 'Acessibilidade como padrão',
        notePt: 'prefers-reduced-motion respeitado, e as animações também baixam sozinhas quando a bateria está acabando.',
        noteEn: 'prefers-reduced-motion honoured — and animations also tone themselves down when the battery runs low.',
      },
    ],
  },
]

/** Hardware — separate because it changes on a different clock than software. */
export const hardware: UsesItem[] = [
  {
    name: 'Notebook',
    notePt: 'Máquina principal de desenvolvimento.',
    noteEn: 'Primary development machine.',
  },
  {
    name: 'Monitor externo',
    notePt: 'Editor de um lado, browser com devtools aberto do outro.',
    noteEn: 'Editor on one side, browser with devtools open on the other.',
  },
  {
    name: 'Fone com cancelamento',
    notePt: 'O bloco de trabalho começa quando ele entra.',
    noteEn: 'The deep-work block starts when it goes on.',
  },
]
