<div align="center">

<img src="public/og-image.jpg" alt="Caio Diniz — Full Stack Developer" width="100%" />

### [caiodiniz.dev.br](https://www.caiodiniz.dev.br)

Portfólio pessoal — React 19, TypeScript, GSAP, Three.js.

</div>

---

## Destaques

- **Vídeo no hover** — cada projeto toca alguns segundos do site real rodando. Gravados em headless direto das URLs de produção, 9 clipes somam 2,8 MB e só baixam no primeiro hover.
- **Avatar 3D** na página Sobre, com zonas de habilidade projetadas sobre o modelo.
- **Terminal secreto** — <kbd>Ctrl</kbd> + <kbd>`</kbd>. Tente `snake`.
- **[Lab](https://www.caiodiniz.dev.br/lab)** — seis experimentos, cada um isolando uma técnica do site: shader de metal líquido, campo magnético em canvas, revelação circular, cubo em CSS 3D, morph com View Transitions e vídeo controlado pelo scroll. Cada um linka o próprio código.
- **Ctrl K** — paleta de comandos com busca em projetos, páginas e experimentos, e um assistente que responde perguntas sobre o meu trabalho a partir dos dados do próprio site.
- **Modo claro** com revelação circular a partir do botão clicado.
- **Cursores ao vivo** de outros visitantes na mesma página, via Supabase Realtime.
- **Preview por projeto** — cada case study tem título e imagem próprios ao ser compartilhado no WhatsApp ou LinkedIn, gerados no build.

## Performance

| | Antes | Depois |
|---|---|---|
| JS inicial (gzip) | 583 KB | 250 KB |
| Imagens | 21 MB | 1,4 MB |
| Vídeos de fundo | 22,6 MB | 1,3 MB |
| Modelo 3D | 13,4 MB | 1,8 MB |

Rotas carregadas sob demanda, Three.js isolado na única página que usa, fontes servidas pelo próprio domínio, WebP e meshopt.

## Rodando

```bash
npm install --legacy-peer-deps
npm run dev        # localhost:5173
npm run typecheck  # checa os tipos de src/, api/ e da config do Vite
npm run build      # gera dist/ + páginas de preview + sitemap
npm run og         # regenera as imagens de compartilhamento
```

Variáveis opcionais em [`.env.example`](.env.example) — o site roda sem nenhuma delas.

## Stack

React 19 · TypeScript · Vite · Tailwind · GSAP + Lenis · Framer Motion · React Three Fiber · Zustand · Supabase · Vercel
