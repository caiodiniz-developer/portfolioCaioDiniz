const CACHE = 'caiodiniz-v3'
const OFFLINE_URL = '/offline.html'
const PRECACHE = ['/', OFFLINE_URL, '/icon-192.png', '/icon-512.png', '/manifest.json']

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      // Individually, so one missing asset can't reject the whole install and
      // leave the site with no service worker at all.
      Promise.all(PRECACHE.map(u => c.add(u).catch(() => {})))
    )
  )
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  const url = new URL(request.url)

  if (request.method !== 'GET' || url.origin !== location.origin) return

  /* Navigation: network first, then the cached app shell, and only if BOTH are
     unavailable the dedicated offline page. The previous version fell back to
     `caches.match('/')` alone — when the shell was not cached yet the visitor
     got the browser's default error screen instead of anything of ours. */
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then(res => {
          // Keep the shell fresh for the next offline visit.
          const copy = res.clone()
          caches.open(CACHE).then(c => c.put('/', copy)).catch(() => {})
          return res
        })
        .catch(async () => {
          const shell = await caches.match('/')
          if (shell) return shell
          const offline = await caches.match(OFFLINE_URL)
          if (offline) return offline
          return new Response(
            '<h1>Sem conexão</h1>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 503 }
          )
        })
    )
    return
  }

  /* Assets: stale-while-revalidate. */
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(request).then(cached => {
        const fresh = fetch(request)
          .then(response => {
            if (response.ok) cache.put(request, response.clone())
            return response
          })
          .catch(() => cached)   // offline and uncached: fail quietly
        return cached || fresh
      })
    )
  )
})
