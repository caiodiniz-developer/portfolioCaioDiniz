import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import { projects } from './src/data/projects'
import { SITE } from './src/lib/constants'

/* Link previews (WhatsApp, LinkedIn, X, Slack) fetch the raw HTML and never run
   JavaScript, so a SPA shows the same generic card for every URL. After the
   build this writes a copy of index.html per case study with that project's
   title, description and image baked into the <head>, plus sitemap.xml.

   Vercel serves a real file before applying the SPA rewrite, so
   /projects/<slug> gets its own HTML and the app boots from it as usual. */

const STATIC_ROUTES = ['', '/about', '/projects', '/services', '/contact', '/lab', '/cv']

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function withMeta(html: string, meta: { title: string; description: string; url: string; image: string }) {
  const set = (re: RegExp, value: string) => {
    if (!re.test(html)) throw new Error(`seo plugin: index.html is missing ${re}`)
    html = html.replace(re, (_m, pre: string) => `${pre}${esc(value)}"`)
  }
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`)
  set(/(<meta name="description" content=")[^"]*"/, meta.description)
  set(/(<meta property="og:title" content=")[^"]*"/, meta.title)
  set(/(<meta property="og:description" content=")[^"]*"/, meta.description)
  set(/(<meta property="og:url" content=")[^"]*"/, meta.url)
  set(/(<meta property="og:image" content=")[^"]*"/, meta.image)
  set(/(<meta name="twitter:title" content=")[^"]*"/, meta.title)
  set(/(<meta name="twitter:description" content=")[^"]*"/, meta.description)
  set(/(<meta name="twitter:image" content=")[^"]*"/, meta.image)
  return html
}

export function seoPlugin(): Plugin {
  let outDir = 'dist'
  let publicDir = 'public'
  return {
    name: 'portfolio-seo',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
      publicDir = config.publicDir
    },
    closeBundle() {
      const shell = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')

      for (const p of projects) {
        // Per-project card from `npm run og`; falls back to the site card so
        // a newly added project never ships with a broken image.
        const og = `/og/${p.slug}.jpg`
        const image = fs.existsSync(path.join(publicDir, og)) ? og : '/og-image.jpg'
        const html = withMeta(shell, {
          title:       `${p.title} — ${SITE.name}`,
          description: p.description,
          url:         `${SITE.url}/projects/${p.slug}`,
          image:       `${SITE.url}${image}`,
        })
        const dir = path.join(outDir, 'projects', p.slug)
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(path.join(dir, 'index.html'), html)
      }

      const today = new Date().toISOString().slice(0, 10)
      const urls = [...STATIC_ROUTES, ...projects.map(p => `/projects/${p.slug}`)]
      const sitemap =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls.map(u => `  <url><loc>${SITE.url}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
        `\n</urlset>\n`
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap)
    },
  }
}
