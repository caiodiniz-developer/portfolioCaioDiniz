import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguageStore } from '@/store/useLanguageStore'

const COMMITS = [
  {
    hash:    'a3f7c91',
    year:    '2026',
    msgEn:   'feat: Full Stack Developer — present',
    msgPt:   'feat: Desenvolvedor Full Stack — atual',
    titleEn: 'Full Stack Developer',
    titlePt: 'Desenvolvedor Full Stack',
    descEn:  'Developing scalable, high-performance web applications with modern technologies, focusing on clean architecture, intuitive user experiences, and robust back-end solutions.',
    descPt:  'Desenvolvendo aplicações web escaláveis e de alta performance, utilizando tecnologias modernas, com foco em arquitetura limpa, experiência do usuário e soluções robustas de back-end.',
    tags:    ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
  },
  {
    hash:    'e8b2d14',
    year:    '2025',
    msgEn:   'feat: Full Stack Developer — Freelance',
    msgPt:   'feat: Desenvolvedor Full Stack — Freelance',
    titleEn: 'Full Stack Developer — Freelance',
    titlePt: 'Desenvolvedor Full Stack — Freelance',
    descEn:  'Building premium websites, web apps and digital products for clients. Focus on React, Node.js, and TypeScript.',
    descPt:  'Construindo sites premium, aplicações web e produtos digitais para clientes. Foco em React, Node.js e TypeScript.',
    tags:    ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
  },
  {
    hash:    '72ca5f3',
    year:    '2024',
    msgEn:   'feat: Backend API Development',
    msgPt:   'feat: Desenvolvimento de APIs Backend',
    titleEn: 'Backend API Development',
    titlePt: 'Desenvolvimento de APIs Backend',
    descEn:  'Developed secure RESTful APIs with Node.js and PostgreSQL. JWT authentication, file uploads and comprehensive validation.',
    descPt:  'Desenvolvi APIs RESTful seguras com Node.js e PostgreSQL. Autenticação JWT, upload de arquivos e validação abrangente.',
    tags:    ['Node.js', 'PostgreSQL', 'SQL', 'TypeScript'],
  },
  {
    hash:    '1d9e048',
    year:    '2023',
    msgEn:   'chore: Web Development — self-taught journey begins',
    msgPt:   'chore: Desenvolvimento Web — início da jornada',
    titleEn: 'Web Development — Self-taught Journey',
    titlePt: 'Desenvolvimento Web — Jornada Autodidata',
    descEn:  'Started the programming journey. Built first projects with HTML, CSS and JavaScript. Focus on front-end and UI design.',
    descPt:  'Iniciei a jornada de programação. Construí primeiros projetos com HTML, CSS e JavaScript. Foco em front-end e UI design.',
    tags:    ['HTML', 'CSS', 'JavaScript'],
  },
]

function hashColor(type: string): string {
  if (type.startsWith('feat'))  return '#f1fa8c'  // yellow
  if (type.startsWith('chore')) return '#8be9fd'  // cyan
  if (type.startsWith('fix'))   return '#ff5555'  // red
  return 'rgba(255,255,255,0.4)'
}

export default function Experience() {
  const lang = useLanguageStore((s) => s.lang)
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <section
      style={{ background: '#111111', borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,5vw,5rem)' }}
    >
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: 'clamp(2.5rem,5vw,3.5rem)' }}
        >
          <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-block', width: 18, height: 1, background: 'rgba(255,255,255,0.15)' }} />
            {lang === 'en' ? 'Career' : 'Trajetória'}
          </span>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3.5rem)', letterSpacing: '-0.04em', lineHeight: '0.95', color: '#fff', margin: 0 }}>
            {lang === 'en' ? 'Journey & Learning' : 'Trajetória & Aprendizado'}
          </h2>
        </motion.div>

        {/* Terminal header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px 10px 0 0',
            padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
          <span style={{
            marginLeft: 8,
            fontFamily: '"JetBrains Mono","Fira Code",monospace',
            fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em',
          }}>
            {lang === 'en' ? '$ git log --oneline --all' : '$ git log --oneline --all'}
          </span>
        </motion.div>

        {/* Commit list */}
        <div style={{
          background: 'rgba(8,8,10,0.7)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderTop: 'none',
          borderRadius: '0 0 10px 10px',
          overflow: 'hidden',
        }}>
          {COMMITS.map((commit, i) => {
            const msg   = lang === 'en' ? commit.msgEn : commit.msgPt
            const title = lang === 'en' ? commit.titleEn : commit.titlePt
            const desc  = lang === 'en' ? commit.descEn : commit.descPt
            const isOpen = expanded === i
            const typeKey = msg.split(':')[0]

            return (
              <motion.div
                key={commit.hash}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Commit row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    gap: 'clamp(10px,2vw,20px)',
                    padding: 'clamp(10px,1.5vw,14px) clamp(12px,2vw,20px)',
                    background: isOpen ? 'rgba(255,255,255,0.03)' : 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.22s',
                  }}
                  onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}
                  onMouseLeave={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  {/* Dot + line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: hashColor(typeKey), boxShadow: `0 0 6px ${hashColor(typeKey)}66` }} />
                  </div>

                  {/* Hash */}
                  <span style={{ fontFamily: '"JetBrains Mono","Fira Code",monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', flexShrink: 0, letterSpacing: '0.04em' }}>
                    {commit.hash}
                  </span>

                  {/* Message */}
                  <span style={{ fontFamily: '"JetBrains Mono","Fira Code",monospace', fontSize: 'clamp(0.62rem,1.2vw,0.75rem)', flex: 1, letterSpacing: '0.02em', minWidth: 0 }}>
                    <span style={{ color: hashColor(typeKey) }}>{typeKey}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>:</span>
                    <span style={{ color: 'rgba(255,255,255,0.55)' }}>{msg.slice(typeKey.length + 1)}</span>
                  </span>

                  {/* Year */}
                  <span style={{ fontFamily: '"JetBrains Mono","Fira Code",monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.18)', flexShrink: 0 }}>
                    {commit.year}
                  </span>

                  {/* Expand indicator */}
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', flexShrink: 0 }}>›</span>
                </button>

                {/* Expanded detail — git show */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: 'clamp(1rem,2vw,1.5rem) clamp(1rem,2vw,1.5rem) clamp(1rem,2vw,1.5rem) clamp(2rem,4vw,3.5rem)', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.015)' }}>
                        {/* git show header */}
                        <div style={{ fontFamily: '"JetBrains Mono","Fira Code",monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.18)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span><span style={{ color: 'rgba(255,255,255,0.12)' }}>commit </span>{commit.hash}f4a...</span>
                          <span><span style={{ color: 'rgba(255,255,255,0.12)' }}>Author: </span>Caio Diniz &lt;caio@dev.br&gt;</span>
                          <span><span style={{ color: 'rgba(255,255,255,0.12)' }}>Date:   </span>{commit.year}</span>
                        </div>

                        {/* Title */}
                        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(0.9rem,1.8vw,1.15rem)', color: '#fff', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                          {title}
                        </h3>

                        {/* Desc */}
                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.75, marginBottom: '1rem', maxWidth: 560 }}>
                          {desc}
                        </p>

                        {/* Tags as diff +++ lines */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {commit.tags.map(tag => (
                            <span key={tag} style={{ fontFamily: '"JetBrains Mono","Fira Code",monospace', fontSize: '0.58rem', padding: '2px 8px', borderRadius: 3, background: 'rgba(80,250,123,0.06)', border: '1px solid rgba(80,250,123,0.2)', color: '#50fa7b' }}>
                              + {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}

          {/* Bottom prompt */}
          <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: '"JetBrains Mono","Fira Code",monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.12)' }}>
              {lang === 'en' ? '(END) — 4 commits · click a commit to expand' : '(FIM) — 4 commits · clique para expandir'}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
