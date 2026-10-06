/* Generates the 1200x630 link-preview cards in public/og/ — one per project,
   plus the site-wide public/og-image.jpg. Run after adding a project:

     npm run og

   seo.plugin.ts picks these up at build time; a project without a card falls
   back to og-image.jpg. Needs Node 23.6+ (imports projects.ts directly). */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { projects } from '../src/data/projects.ts'

const PUBLIC = path.resolve(import.meta.dirname, '../public')
const W = 1200, H = 630
const FONT = 'Segoe UI, Helvetica, Arial, sans-serif'

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

function textLayer(eyebrow, title, subtitle) {
  const size = title.length > 16 ? 56 : 76
  return Buffer.from(`<svg width="${W}" height="${H}">
    <text x="72" y="250" font-family="${FONT}" font-size="30" fill="#8a8a8a" letter-spacing="6">${esc(eyebrow)}</text>
    <text x="72" y="330" font-family="${FONT}" font-weight="800" font-size="${size}" fill="#ffffff">${esc(title)}</text>
    <text x="72" y="390" font-family="${FONT}" font-size="30" fill="#bdbdbd">${esc(subtitle)}</text>
    <text x="72" y="560" font-family="${FONT}" font-size="24" fill="#4ade80">caiodiniz.dev.br</text>
  </svg>`)
}

async function siteCard() {
  const photo = await sharp(path.join(PUBLIC, 'assets/minha-foto-1.webp')).resize({ height: 600 }).toBuffer()
  await sharp({ create: { width: W, height: H, channels: 3, background: '#0d0d0d' } })
    .composite([
      { input: photo, top: 30, left: W - 620 },
      { input: textLayer('CAIO DINIZ', 'Full Stack Developer', 'React · TypeScript · Node.js') },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(PUBLIC, 'og-image.jpg'))
}

// Screenshots are portrait mockups; show the whole thing on the right rather
// than cropping to a strip, same layout as the site card.
async function projectCard(p) {
  const out = path.join(PUBLIC, 'og', `${p.slug}.jpg`)
  const shot = await sharp(path.join(PUBLIC, p.image))
    .resize({ height: H - 60, width: 560, fit: 'inside' })
    .toBuffer({ resolveWithObject: true })
  await sharp({ create: { width: W, height: H, channels: 3, background: '#0d0d0d' } })
    .composite([
      { input: shot.data, top: 30, left: W - 60 - shot.info.width },
      { input: textLayer('CASE STUDY', p.title, `${p.type} · ${p.year}`) },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out)
  return out
}

// The Lab card: the magnetic-field experiment drawn as a still — a dot grid
// leaning toward one point — instead of a screenshot.
async function labCard() {
  const gap = 34, cx = 860, cy = 300, reach = 230
  let dots = ''
  for (let y = 40; y < H; y += gap) for (let x = 560; x < W - 20; x += gap) {
    const dx = cx - x, dy = cy - y, d = Math.hypot(dx, dy)
    const pull = d < reach ? 1 - d / reach : 0
    dots += `<circle cx="${(x + dx * pull * 0.42).toFixed(1)}" cy="${(y + dy * pull * 0.42).toFixed(1)}" r="${(1.8 + pull * 4).toFixed(1)}" fill="#fff" fill-opacity="${(0.18 + pull * 0.82).toFixed(2)}"/>`
  }
  const field = Buffer.from(`<svg width="${W}" height="${H}">${dots}</svg>`)
  await sharp({ create: { width: W, height: H, channels: 3, background: '#0d0d0d' } })
    .composite([{ input: field }, { input: textLayer('CAIO DINIZ', 'Lab', 'Seis experimentos interativos') }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(PUBLIC, 'og', 'lab.jpg'))
}

fs.mkdirSync(path.join(PUBLIC, 'og'), { recursive: true })
await siteCard()
console.log('og-image.jpg')
await labCard()
console.log('og/lab.jpg')
for (const p of projects) {
  await projectCard(p)
  console.log(`og/${p.slug}.jpg`)
}
