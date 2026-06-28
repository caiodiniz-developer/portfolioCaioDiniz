export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'POST, OPTIONS',
        'access-control-allow-headers': 'content-type',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }

  let idea = ''
  try {
    const body = await req.json() as { idea?: string }
    idea = (body.idea ?? '').trim()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  if (!idea) {
    return new Response('Missing idea field', { status: 400 })
  }

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      stream: true,
      system: `Você é Caio Diniz, desenvolvedor full-stack de Campinas/SP com 6 anos de experiência em React, Node.js, TypeScript e Python.
Quando um visitante descreve uma ideia de projeto, você responde como responderia a um cliente potencial: com entusiasmo técnico, de forma acessível e direta.
Estruture a resposta em 3 partes rápidas:
1. O que você construiria e por quê (2-3 frases)
2. Stack técnica e prazo estimado (2-3 frases)
3. Seu diferencial nesse projeto (1-2 frases) + call-to-action para /contact
Máximo 160 palavras. Tom: profissional mas pessoal. Sempre em português.`,
      messages: [{ role: 'user', content: `Ideia de projeto: ${idea}` }],
    }),
  })

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text()
    return new Response(err, { status: anthropicRes.status })
  }

  return new Response(anthropicRes.body, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      'access-control-allow-origin': '*',
    },
  })
}
