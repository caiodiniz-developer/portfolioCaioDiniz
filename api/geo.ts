export const config = { runtime: 'edge' }

/* Rough location for the live-cursor label ("someone in Recife").
   Vercel resolves it at the edge and passes it in as headers, so there is no
   lookup service and no IP ever reaches the browser — just a city name. */
export default function handler(req: Request): Response {
  const raw = req.headers.get('x-vercel-ip-city')
  let city: string | null = null
  try { city = raw ? decodeURIComponent(raw) : null } catch { city = raw }
  const country = req.headers.get('x-vercel-ip-country')

  return new Response(JSON.stringify({ city, country }), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'private, no-store',
    },
  })
}
