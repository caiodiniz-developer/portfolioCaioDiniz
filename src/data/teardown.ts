/**
 * The engineering log of this site.
 *
 * Every entry here is a bug that actually shipped and was actually fixed in
 * this repository — the commits are public. Keeping it as data (rather than
 * prose in a component) means the page stays a rendering concern and new
 * findings are a one-object append.
 */

export interface Finding {
  id: string
  /** What a visitor would have noticed. */
  symptom: string
  /** The real mechanism. This is the part worth reading. */
  cause: string
  /** What changed. */
  fix: string
  /** Where it lives now. */
  file: string
  /** Minimal before/after. Kept short on purpose — a diff, not a listing. */
  before: string
  after: string
  /** Why it was hard to spot. */
  lesson: string
}

export const findings: Finding[] = [
  {
    id: 'lenis-overflow',
    symptom:
      'O scroll suave simplesmente não existia. Nenhum erro no console, nenhuma exceção — a biblioteca inicializava, reportava estar ativa, e o scroll continuava sendo o nativo do navegador.',
    cause:
      'Havia um `overflow-x: hidden` no `body`. A especificação do CSS diz que, quando um eixo é definido como não-visível, o outro eixo é forçado para `auto`. Isso transformou o `body` em um contêiner de rolagem próprio. O Lenis intercepta o scroll da `window` — mas quem estava rolando era o `body`, então ele nunca via evento nenhum.',
    fix:
      'Mover a regra para o `html` usando `clip` em vez de `hidden`. `clip` corta o conteúdo sem criar contêiner de rolagem nem contexto de formatação de bloco, então a `window` continua sendo dona do scroll.',
    file: 'src/styles/globals.css',
    before: `body {
  overflow-x: hidden;   /* → força overflow-y: auto */
}`,
    after: `html {
  overflow-x: clip;     /* corta sem virar scroll container */
}`,
    lesson:
      'O bug mais caro de achar é o que não gera erro. Passei muito tempo ajustando parâmetros de easing e lerp achando que era calibragem, quando a biblioteca nunca esteve no caminho do scroll.',
  },
  {
    id: 'gsap-from-refresh',
    symptom:
      'Os títulos grandes do rodapé e da seção final desapareciam. Não sempre — só depois de rolar a página, redimensionar a janela, ou quando as fontes terminavam de carregar.',
    cause:
      '`gsap.from()` guarda `immediateRender: true`. A cada `ScrollTrigger.refresh()`, o GSAP reverte esses tweens ao estado inicial para poder medir o layout corretamente. Quando o gatilho já tinha sido destruído por `once: true`, não sobrava ninguém para desfazer a reversão — e o elemento ficava preso no estado inicial, que no caso era `yPercent: 106` dentro de uma máscara com `overflow: hidden`. Ou seja: invisível para sempre.',
    fix:
      'Trocar `from()` por `gsap.set()` para o estado inicial mais `gsap.to()` disparado por um `ScrollTrigger.create({ onEnter })`. Não existe semântica de render imediato, então refresh nenhum consegue reverter o resultado.',
    file: 'src/components/sections/CTASection.tsx',
    before: `gsap.from('.cta-word', {
  yPercent: 106,
  scrollTrigger: { once: true },
})`,
    after: `gsap.set(words, { yPercent: 106 })
ScrollTrigger.create({
  once: true,
  onEnter: () => gsap.to(words, { yPercent: 0 }),
})`,
    lesson:
      'Eu mesmo causei este. Adicionei três chamadas novas de `refresh()` para corrigir o scroll, e elas destruíram todas as animações de entrada. Correção de performance pode quebrar comportamento — e a única forma de eu ter descoberto foi abrindo o site e olhando.',
  },
  {
    id: 'cursor-thrash',
    symptom:
      'Rolagem com sensação de peso e travamento, principalmente em páginas com muitos links.',
    cause:
      'O cursor customizado rodava `document.querySelectorAll(\'button, a, [data-magnetic]\')` a cada evento de `mousemove`, e chamava `getBoundingClientRect()` em cada resultado. Em uma página com 50 links, isso são 50 reflows síncronos por evento — e `mousemove` dispara a até 120Hz. Pior: rolar com trackpad gera `mousemove`, então o custo caía exatamente durante o scroll.',
    fix:
      'Medir os alvos uma vez para um cache em coordenadas de documento (posição + scroll atual), atualizado só em resize e mudança de rota. O `mousemove` passou a apenas guardar coordenadas, e o cálculo magnético virou matemática pura, sem leitura de layout.',
    file: 'src/components/animations/CustomCursor.tsx',
    before: `function onMouseMove(e) {
  document.querySelectorAll('a, button')
    .forEach(el => el.getBoundingClientRect())
}`,
    after: `function onMouseMove(e) {
  mouseX = e.clientX   // só isso
  mouseY = e.clientY
}`,
    lesson:
      'Ler geometria do DOM força o navegador a recalcular o layout na hora. Fazer isso dentro de um handler de alta frequência é a forma mais rápida de matar o frame budget. O cursor acabou removido do site por decisão de design, mas o padrão vale para qualquer efeito que siga o mouse.',
  },
  {
    id: 'raf-scrollwidth',
    symptom:
      'Micro-travadas periódicas durante a rolagem, difíceis de reproduzir.',
    cause:
      'Dois carrosséis infinitos liam `el.scrollWidth` dentro do próprio loop de `requestAnimationFrame`, para saber onde reiniciar. `scrollWidth` é uma propriedade que força sincronização de layout: pedir esse valor obriga o navegador a recalcular tudo o que estava pendente, 60 vezes por segundo, em dois lugares ao mesmo tempo.',
    fix:
      'Medir uma vez fora do loop e observar mudanças reais de tamanho com `ResizeObserver`. O loop passou a ser só aritmética e uma escrita de `transform`.',
    file: 'src/components/sections/Marquee.tsx',
    before: `function tick() {
  const half = el.scrollWidth / 2   // reflow todo frame
  ...
}`,
    after: `let half = el.scrollWidth / 2      // uma vez
new ResizeObserver(() => {
  half = el.scrollWidth / 2
}).observe(el)`,
    lesson:
      'Nem toda leitura de propriedade é barata. `scrollWidth`, `offsetTop` e `getBoundingClientRect()` são pontos de sincronização — dentro de um RAF, viram gargalo.',
  },
  {
    id: 'font-synthesis',
    symptom:
      'Os títulos pareciam usar uma fonte diferente do resto do site — mais pesados e arredondados, como se fossem outra família tipográfica.',
    cause:
      'A fonte Syne é carregada com o eixo variável `400..800`, mas o código pedia `font-weight: 900` em 42 lugares. Como o peso 900 não existe nesse arquivo, o navegador *sintetizava* o negrito — engrossando os glifos artificialmente. O resultado não bate com o 800 real usado nos títulos padrão.',
    fix:
      'Uma linha de CSS: `font-synthesis-weight: none`. Isso proíbe a falsificação, e todo pedido de 900 passa a cair no 800 real mais próximo. Corrigiu os 42 casos de uma vez.',
    file: 'src/styles/globals.css',
    before: `/* Syne carrega 400..800 */
h2 { font-weight: 900; }   /* → negrito falso */`,
    after: `html {
  font-synthesis-weight: none;
}`,
    lesson:
      'Navegador não avisa quando finge um peso de fonte. Vale conferir se o peso que você pede existe de fato no arquivo carregado — a diferença é sutil o suficiente para passar meses despercebida, e óbvia demais quando alguém aponta.',
  },
  {
    id: 'glb-preload',
    symptom:
      'Carregamento inicial lento em toda página, inclusive nas que não têm nenhum elemento 3D.',
    cause:
      'Uma chamada `useGLTF.preload()` no nível do módulo, para um arquivo `.glb` de 13 MB. Como o projeto não tinha divisão de código, esse módulo era avaliado no boot da aplicação — então abrir a página de contato baixava um modelo 3D de corpo humano que nunca seria exibido ali.',
    fix:
      'Mover o preload para dentro do componente que realmente usa o modelo, e carregar a seção 3D sob demanda.',
    file: 'src/components/sections/DevAnatomy.tsx',
    before: `// topo do módulo — roda sempre
useGLTF.preload('/modelo.glb')  // 13 MB`,
    after: `// dentro do componente, quando ele monta
useEffect(() => {
  useGLTF.preload('/modelo.glb')
}, [])`,
    lesson:
      'Código no nível do módulo executa quando o módulo é importado, não quando o componente aparece. Sem divisão de código, "importado" quer dizer "sempre".',
  },
]

/** Stack, stated plainly. */
export const stack: { area: string; choice: string; note: string }[] = [
  { area: 'Framework',  choice: 'React 19 + Vite',      note: 'SPA com roteamento no cliente' },
  { area: 'Linguagem',  choice: 'TypeScript',           note: 'strict, sem `any` implícito' },
  { area: 'Scroll',     choice: 'Lenis',                note: 'interpolação por lerp, um único RAF' },
  { area: 'Animação',   choice: 'GSAP + Framer Motion', note: 'GSAP para scroll, FM para ciclo de vida' },
  { area: '3D',         choice: 'Three.js + R3F',       note: 'carregado sob demanda' },
  { area: 'Estilo',     choice: 'Tailwind + CSS-in-JS', note: 'tokens em variáveis CSS' },
  { area: 'Dados',      choice: 'Supabase',             note: 'apenas o livro de visitas' },
]
