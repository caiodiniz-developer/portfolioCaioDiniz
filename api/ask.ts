import Anthropic from '@anthropic-ai/sdk'
import { KNOWLEDGE } from './_knowledge'

export const config = { runtime: 'edge' }

/* "Ask about Caio": answers a visitor's question from the portfolio's own
 * data (./_knowledge). Streams plain text back to the command palette.
 *
 * Cost control lives in three places: the input caps below, a best-effort
 * per-IP limit, and — the one that actually holds — the monthly spend limit
 * set on the API key in the Anthropic Console. */

const MAX_TURNS = 6
const MAX_CHARS = 600
const WINDOW_MS = 10 * 60_000
const MAX_PER_WINDOW = 15

const INSTRUCTIONS = `Você é o assistente do portfólio de Caio Diniz, respondendo visitantes do site (recrutadores, clientes, outros devs).

Regras:
- Fale sobre o Caio na terceira pessoa. Você não é o Caio.
- Use apenas os fatos abaixo. Se algo não estiver aqui (salário, disponibilidade exata, opinião pessoal, experiência não listada), diga que não sabe e sugira falar direto com ele em /contact.
- Nunca invente números, clientes, anos de experiência ou resultados.
- Ao citar um projeto, linke o case study em markdown: [Nome](/projects/slug). Links externos só se estiverem nos fatos.
- Responda no idioma em que o visitante escreveu.
- Seja direto: até 120 palavras, parágrafos curtos ou uma lista curta. Sem títulos.
- Perguntas fora do assunto (código genérico, outros temas): responda em uma frase que você só fala sobre o trabalho do Caio.

Fatos:
${KNOWLEDGE}`

// Per-isolate and therefore approximate — enough to blunt a loop hammering
// the endpoint, not a real quota (see the spend limit note above).
const hits = new Map<string, { count: number; resetAt: number }>()
function limited(ip: string): boolean {
  const now = Date.now()
  const e = hits.get(ip)
  if (!e || e.resetAt < now) { hits.set(ip, { count: 1, resetAt: now + WINDOW_MS }); return false }
  e.count += 1
  return e.count > MAX_PER_WINDOW
}

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
}

function parseMessages(body: unknown): Anthropic.Beta.BetaMessageParam[] | null {
  const raw = (body as { messages?: unknown })?.messages
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_TURNS * 2) return null
  const out: Anthropic.Beta.BetaMessageParam[] = []
  for (const m of raw.slice(-MAX_TURNS * 2)) {
    const role = (m as { role?: unknown }).role
    const content = (m as { content?: unknown }).content
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null
    const text = content.trim().slice(0, role === 'user' ? MAX_CHARS : 2000)
    if (!text) return null
    out.push({ role, content: text })
  }
  // The API needs the conversation to open and close on the visitor's turn.
  if (out[0].role !== 'user' || out[out.length - 1].role !== 'user') return null
  return out
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json(405, { error: 'method' })
  if (!process.env.ANTHROPIC_API_KEY) return json(503, { error: 'unconfigured' })

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (limited(ip)) return json(429, { error: 'rate' })

  let messages: Anthropic.Beta.BetaMessageParam[] | null = null
  try { messages = parseMessages(await req.json()) } catch { /* fall through */ }
  if (!messages) return json(400, { error: 'input' })

  const client = new Anthropic()
  const stream = client.beta.messages.stream({
    model: 'claude-opus-5',
    max_tokens: 4000,
    // Chat over a fixed fact sheet: low effort answers well and fast.
    output_config: { effort: 'low' },
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: [{ type: 'text', text: INSTRUCTIONS, cache_control: { type: 'ephemeral' } }],
    messages,
  })

  const encoder = new TextEncoder()
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
        const final = await stream.finalMessage()
        if (final.stop_reason === 'refusal') {
          controller.enqueue(encoder.encode('\n\nNão consigo responder isso. Fale direto com o Caio em [/contact](/contact).'))
        }
      } catch (err) {
        const msg = err instanceof Anthropic.RateLimitError
          ? 'Muita gente perguntando agora — tente de novo em instantes.'
          : 'Não consegui responder agora. Tente de novo ou fale com o Caio em [/contact](/contact).'
        controller.enqueue(encoder.encode(msg))
      } finally {
        controller.close()
      }
    },
    cancel() { stream.abort() },
  })

  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
  })
}
