/* One real excerpt per open-source project, shown on its case study.
 *
 * The code lives in ./snippets/*.txt, copied verbatim from the repo (only
 * trimmed, with cuts marked `// …`), and is imported as raw text. Kept out of
 * projects.ts on purpose: that file is also read by the Vite config and by
 * scripts/og.mjs, neither of which understands `?raw` imports. */
import finixApp from './snippets/finix-app.txt?raw'
import nexus from './snippets/nexus.txt?raw'
import shopsphere from './snippets/shopsphere.txt?raw'
import veigh from './snippets/veigh.txt?raw'

export interface Snippet {
  file: string
  /** Permalink to the exact lines on GitHub. */
  url: string
  code: string
  notePt: string
  noteEn: string
}

const GH = 'https://github.com/caiodiniz-developer'

export const snippets: Record<string, Snippet> = {
  'finix-app': {
    file: 'backend-ts/src/services/tokenService.ts',
    url: `${GH}/FinixApp/blob/main/backend-ts/src/services/tokenService.ts#L121-L167`,
    code: finixApp,
    notePt: 'O refresh token nunca é salvo no banco. Uma impressão SHA-256 indexada acha o registro numa busca só, e o bcrypt confirma que é o mesmo token.',
    noteEn: 'The refresh token is never stored. An indexed SHA-256 fingerprint finds the row in one lookup, and bcrypt confirms it is the same token.',
  },
  nexus: {
    file: 'server/middleware/rateLimit.js',
    url: `${GH}/SistemaDeGerenciamentoEmpresarial/blob/main/server/middleware/rateLimit.js#L4-L24`,
    code: nexus,
    notePt: 'Rate limit por IP + email no login: janela fixa num Map, sem infraestrutura extra. Resolve com uma instância; com várias, o contador iria para o Redis.',
    noteEn: 'Login rate limit keyed by IP + email: a fixed window in a Map, no extra infrastructure. Enough for one instance; with several, the counter would move to Redis.',
  },
  shopsphere: {
    file: 'server/src/modules/orders/order.service.ts',
    url: `${GH}/LojaVirtual/blob/main/server/src/modules/orders/order.service.ts#L76-L86`,
    code: shopsphere,
    notePt: 'Dois checkouts disputando a última unidade: o estoque só baixa se ainda houver quantidade, na mesma transação do pedido. Quem chega depois recebe erro, não um pedido fantasma.',
    noteEn: 'Two checkouts racing for the last unit: stock only drops if the quantity is still there, inside the order transaction. The loser gets an error, not a phantom order.',
  },
  veigh: {
    file: 'src/components/IntroSequence.jsx',
    url: `${GH}/Veigh/blob/main/src/components/IntroSequence.jsx#L225-L247`,
    code: veigh,
    notePt: 'O scroll é o cabeçote do vídeo. O tempo é arredondado para o quadro mais próximo e só é escrito quando o quadro muda — o scroll atualiza a 60Hz, o vídeo tem 30fps, e metade dos seeks seria decodificação jogada fora.',
    noteEn: 'Scroll is the video playhead. Time snaps to the nearest frame and is only written when the frame changes — scroll updates at 60Hz, the clip is 30fps, so half the seeks would be wasted decoding.',
  },
}
