import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, MessageCircle, Calculator, ChevronRight, ArrowUpRight,
  ChevronLeft,
} from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCursorStore } from '@/store/useCursorStore'
import { SITE } from '@/lib/constants'
import type { CursorState } from '@/store/useCursorStore'

/* ── Data ── */
const SERVICES_DATA = [
  {
    titleEn: 'Landing Pages',       titlePt: 'Landing Pages',
    descEn:  'High-converting, fast landing pages designed to turn visitors into clients.',
    descPt:  'Landing pages rápidas e focadas em conversão, transformando visitantes em clientes.',
  },
  {
    titleEn: 'Business Websites',   titlePt: 'Sites Institucionais',
    descEn:  'Professional multi-page websites that communicate authority and trust.',
    descPt:  'Sites profissionais de múltiplas páginas que transmitem autoridade e confiança.',
  },
  {
    titleEn: 'Web Applications',    titlePt: 'Aplicações Web',
    descEn:  'Full-stack React + Node.js apps with auth, database and real-time features.',
    descPt:  'Apps full-stack com React + Node.js, autenticação, banco de dados e tempo real.',
  },
  {
    titleEn: 'APIs & Backends',     titlePt: 'APIs & Backends',
    descEn:  'REST APIs, database modeling, authentication systems and server architecture.',
    descPt:  'APIs REST, modelagem de banco, sistemas de autenticação e arquitetura de servidor.',
  },
  {
    titleEn: 'UI/UX & Animations',  titlePt: 'UI/UX & Animações',
    descEn:  'Motion design with GSAP and Framer Motion — interfaces that feel alive.',
    descPt:  'Motion design com GSAP e Framer Motion — interfaces que parecem vivas.',
  },
  {
    titleEn: 'Performance & SEO',   titlePt: 'Performance & SEO',
    descEn:  'Core Web Vitals optimization, Lighthouse 100, structured data and more.',
    descPt:  'Otimização de Core Web Vitals, Lighthouse 100, dados estruturados e mais.',
  },
]

const PACKAGES = [
  {
    nameEn: 'Starter',       namePt: 'Básico',
    descEn: 'Clean, fast landing page or simple institutional website.',
    descPt: 'Landing page limpa e rápida ou site institucional simples.',
    price: 'R$ 500+',
    featuresEn: ['Up to 3 pages', 'Mobile responsive', 'Contact form', 'Basic SEO', 'Vercel deploy'],
    featuresPt: ['Até 3 páginas',   'Responsivo',         'Formulário de contato', 'SEO básico', 'Deploy na Vercel'],
    highlight: false,
  },
  {
    nameEn: 'Professional',  namePt: 'Profissional',
    descEn: 'Premium website with animations, custom design and advanced features.',
    descPt: 'Site premium com animações, design personalizado e recursos avançados.',
    price: 'R$ 1.500+',
    featuresEn: ['Up to 6 pages', 'Custom animations', 'Premium UI design', 'Performance optimized', 'Analytics setup'],
    featuresPt: ['Até 6 páginas',  'Animações customizadas', 'Design premium', 'Performance otimizada', 'Analytics'],
    highlight: true,
  },
  {
    nameEn: 'Web App / System', namePt: 'App Web / Sistema',
    descEn: 'Full-stack web application with backend, database and authentication.',
    descPt: 'Aplicação web completa com backend, banco de dados e autenticação.',
    price: 'R$ 3.000+',
    featuresEn: ['Custom features', 'Backend API', 'Database design', 'Authentication', 'Admin dashboard'],
    featuresPt: ['Funcionalidades customizadas', 'API Backend', 'Design de banco', 'Autenticação', 'Dashboard admin'],
    highlight: false,
  },
]

const FAQ = [
  {
    qEn: 'How long does a project take?',
    qPt: 'Quanto tempo leva um projeto?',
    aEn: 'Landing pages take 3–7 days. Business websites take 1–2 weeks. Web apps take 2–6 weeks depending on complexity.',
    aPt: 'Landing pages levam 3–7 dias. Sites institucionais levam 1–2 semanas. Apps web levam 2–6 semanas.',
  },
  {
    qEn: 'Do you provide support after launch?',
    qPt: 'Você oferece suporte após o lançamento?',
    aEn: 'Yes — 30 days of free support after every project launch for bug fixes and minor adjustments.',
    aPt: 'Sim — 30 dias de suporte gratuito após o lançamento para correções e ajustes menores.',
  },
  {
    qEn: 'What technologies do you use?',
    qPt: 'Quais tecnologias você usa?',
    aEn: 'React, TypeScript, Node.js, Prisma, PostgreSQL, Tailwind CSS, GSAP and Vercel for deployment.',
    aPt: 'React, TypeScript, Node.js, Prisma, PostgreSQL, Tailwind CSS, GSAP e Vercel para deploy.',
  },
  {
    qEn: 'Do I own the source code?',
    qPt: 'Posso ver o código-fonte?',
    aEn: 'Absolutely. You own 100% of the code, delivered organized, documented on a private GitHub repo.',
    aPt: 'Com certeza. Você é dono do código, entregue organizado e documentado em repositório privado.',
  },
]

/* ── Budget Calculator ── */
const PROJECT_TYPES = [
  { id: 'landing', labelEn: 'Landing Page',   labelPt: 'Landing Page',   min: 500,  max: 1500, daysMin: 3,  daysMax: 7  },
  { id: 'website', labelEn: 'Website',         labelPt: 'Website',         min: 1500, max: 3500, daysMin: 7,  daysMax: 21 },
  { id: 'webapp',  labelEn: 'Web App',          labelPt: 'Web App',         min: 3000, max: 8000, daysMin: 14, daysMax: 42 },
  { id: 'api',     labelEn: 'API / Backend',    labelPt: 'API / Backend',   min: 2000, max: 5000, daysMin: 10, daysMax: 30 },
]
const FEATURES = [
  { id: 'animations', labelEn: 'Custom animations', labelPt: 'Animações customizadas', addMin: 400,  addMax: 800  },
  { id: 'cms',        labelEn: 'CMS / Blog',         labelPt: 'CMS / Blog',              addMin: 600,  addMax: 1000 },
  { id: 'auth',       labelEn: 'Authentication',      labelPt: 'Autenticação',            addMin: 500,  addMax: 900  },
  { id: 'ecommerce',  labelEn: 'E-commerce',          labelPt: 'E-commerce',              addMin: 1200, addMax: 2500 },
  { id: 'dashboard',  labelEn: 'Admin dashboard',     labelPt: 'Dashboard admin',         addMin: 900,  addMax: 1800 },
  { id: 'seo',        labelEn: 'Advanced SEO',        labelPt: 'SEO avançado',            addMin: 300,  addMax: 600  },
]
const TIMELINES = [
  { id: 'flexible', labelEn: 'Flexible', labelPt: 'Flexível', multiplier: 1    },
  { id: 'normal',   labelEn: 'Normal',   labelPt: 'Normal',   multiplier: 1    },
  { id: 'urgent',   labelEn: 'Rush',     labelPt: 'Urgente',  multiplier: 1.35 },
]

function fmt(n: number) { return 'R$ ' + Math.round(n / 100) * 100 + '+' }

function pill(selected: boolean): React.CSSProperties {
  return {
    padding: '0.5rem 1rem', borderRadius: 999,
    border: `1px solid ${selected ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
    background: selected ? 'rgba(255,255,255,0.1)' : 'transparent',
    color: selected ? '#fff' : 'rgba(255,255,255,0.38)',
    fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
  }
}

function BudgetCalculator({ lang, setCursor }: { lang: string; setCursor: (s: CursorState) => void }) {
  const [projectType,       setProjectType]       = useState('')
  const [selectedFeatures,  setSelectedFeatures]  = useState<Set<string>>(new Set())
  const [timeline,          setTimeline]          = useState('normal')

  function toggleFeature(id: string) {
    setSelectedFeatures(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  const estimate = useMemo(() => {
    if (!projectType) return null
    const base = PROJECT_TYPES.find(p => p.id === projectType)!
    const tl   = TIMELINES.find(t => t.id === timeline)!
    let addMin = 0, addMax = 0, addDays = 0
    for (const fid of selectedFeatures) {
      const f = FEATURES.find(f => f.id === fid)!
      addMin += f.addMin; addMax += f.addMax; addDays += 3
    }
    return {
      priceMin: Math.round((base.min + addMin) * tl.multiplier),
      priceMax: Math.round((base.max + addMax) * tl.multiplier),
      dMin: base.daysMin + addDays,
      dMax: base.daysMax + addDays,
    }
  }, [projectType, selectedFeatures, timeline])

  return (
    <section style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,5vw,5rem)' }}>
      <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}
        style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Calculator size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
            <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
              {lang === 'en' ? 'Budget calculator' : 'Calculadora de orçamento'}
            </span>
          </div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.05em', lineHeight: 1, color: '#fff', margin: 0 }}>
            {lang === 'en' ? 'Estimate your project.' : 'Estime seu projeto.'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}>
            {lang === 'en' ? 'Select type, features and timeline for a real-time price estimate.' : 'Selecione o tipo, recursos e prazo para uma estimativa de preço em tempo real.'}
          </p>
        </div>

        {[
          { label: lang === 'en' ? '01 — Project type' : '01 — Tipo de projeto', items: PROJECT_TYPES.map(p => ({ id: p.id, label: lang === 'en' ? p.labelEn : p.labelPt, sel: projectType === p.id, onClick: () => setProjectType(p.id), extra: '' })) },
          { label: lang === 'en' ? '02 — Additional features' : '02 — Recursos adicionais', items: FEATURES.map(f => ({ id: f.id, label: lang === 'en' ? f.labelEn : f.labelPt, sel: selectedFeatures.has(f.id), onClick: () => toggleFeature(f.id), extra: '' })) },
          { label: lang === 'en' ? '03 — Timeline' : '03 — Prazo', items: TIMELINES.map(t => ({ id: t.id, label: lang === 'en' ? t.labelEn : t.labelPt, sel: timeline === t.id, onClick: () => setTimeline(t.id), extra: t.id === 'urgent' ? '+35%' : '' })) },
        ].map(group => (
          <div key={group.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>{group.label}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {group.items.map(item => (
                <button key={item.id} onClick={item.onClick} style={pill(item.sel)}
                  onMouseEnter={() => setCursor('pointer')} onMouseLeave={() => setCursor('default')}>
                  {item.label}{item.extra && <span style={{ marginLeft: 5, fontSize: '0.62rem', opacity: 0.55 }}>{item.extra}</span>}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

        <AnimatePresence mode="wait">
          {estimate ? (
            <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px,100%),1fr))', gap: '1.5rem' }}>
                {[
                  { label: lang === 'en' ? 'Estimated price' : 'Estimativa de preço', main: fmt(estimate.priceMin), sub: `– ${fmt(estimate.priceMax)}` },
                  { label: lang === 'en' ? 'Delivery time' : 'Tempo de entrega', main: `${estimate.dMin}`, sub: `–${estimate.dMax} ${lang === 'en' ? 'days' : 'dias'}` },
                ].map(card => (
                  <div key={card.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <p style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>{card.label}</p>
                    <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>
                      {card.main}<span style={{ fontSize: '0.52em', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}> {card.sub}</span>
                    </p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', lineHeight: 1.6 }}>
                {lang === 'en' ? 'Rough estimate. Send a message for a tailored proposal.' : 'Estimativa aproximada. Envie uma mensagem para uma proposta detalhada.'}
              </p>
              <a href={`https://wa.me/${SITE.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(lang === 'en' ? 'Hi Caio! I used the budget calculator and would like a detailed proposal.' : 'Oi Caio! Usei a calculadora de orçamento e gostaria de uma proposta detalhada.')}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.75rem 1.6rem', borderRadius: 999, background: '#ffffff', color: '#0d0d0d', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', textDecoration: 'none', width: 'fit-content', transition: 'opacity 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.82'; setCursor('pointer') }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; setCursor('default') }}>
                {lang === 'en' ? 'Request a proposal' : 'Solicitar proposta'} <ChevronRight size={13} />
              </a>
            </motion.div>
          ) : (
            <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.15)', fontStyle: 'italic' }}>
              {lang === 'en' ? 'Select a project type above to see the estimate.' : 'Selecione o tipo de projeto acima para ver a estimativa.'}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

/* ── ServiceSketch: SVG drawing animation per service ── */
function ServiceSketch({ idx }: { idx: number }) {
  const W = '#ffffff'
  const A = 'rgba(99,102,241,0.85)'
  const G = 'rgba(74,222,128,0.85)'
  const B = 'rgba(96,165,250,0.85)'
  const D = 'rgba(255,255,255,0.22)'

  const d = (delay: number, dur = 0.65) => ({
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: dur, delay, ease: 'easeOut' as const },
  })

  const svgProps = {
    viewBox: '0 0 240 160',
    width: '100%',
    height: '100%',
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  if (idx === 0) {
    // Landing Page — laptop + browser chrome + hero + headline + CTA + cards
    return (
      <svg {...svgProps}>
        {/* Laptop body */}
        <motion.rect x="30" y="20" width="180" height="110" rx="6" stroke={D} strokeWidth="1.5" {...d(0, 0.5)} />
        {/* Keyboard base */}
        <motion.rect x="10" y="130" width="220" height="12" rx="3" stroke={D} strokeWidth="1.2" {...d(0.4)} />
        {/* URL bar */}
        <motion.rect x="50" y="28" width="140" height="9" rx="2" stroke={D} strokeWidth="1" {...d(0.9)} />
        {/* Traffic lights */}
        <motion.circle cx="40" cy="32" r="3" stroke="rgba(255,95,87,0.7)" strokeWidth="1" {...d(0.8)} />
        <motion.circle cx="50" cy="32" r="3" stroke="rgba(255,189,46,0.7)" strokeWidth="1" {...d(0.85)} />
        <motion.circle cx="60" cy="32" r="3" stroke="rgba(40,202,65,0.7)" strokeWidth="1" {...d(0.9)} />
        {/* Hero block */}
        <motion.rect x="40" y="44" width="160" height="44" rx="3" stroke={A} strokeWidth="1.5" {...d(1.2)} />
        {/* Headline line 1 */}
        <motion.line x1="50" y1="55" x2="150" y2="55" stroke={W} strokeWidth="3" strokeOpacity="0.7" {...d(1.6)} />
        {/* Headline line 2 */}
        <motion.line x1="50" y1="63" x2="120" y2="63" stroke={W} strokeWidth="2" strokeOpacity="0.35" {...d(1.8)} />
        {/* CTA button */}
        <motion.rect x="50" y="72" width="50" height="11" rx="5.5" stroke={A} strokeWidth="1.5" {...d(2.0)} />
        {/* Feature card 1 */}
        <motion.rect x="40" y="96" width="48" height="30" rx="3" stroke={D} strokeWidth="1" {...d(2.3)} />
        {/* Feature card 2 */}
        <motion.rect x="96" y="96" width="48" height="30" rx="3" stroke={D} strokeWidth="1" {...d(2.5)} />
        {/* Feature card 3 */}
        <motion.rect x="152" y="96" width="48" height="30" rx="3" stroke={D} strokeWidth="1" {...d(2.7)} />
      </svg>
    )
  }

  if (idx === 1) {
    // Business Website — browser + nav + hero + 3 content columns
    return (
      <svg {...svgProps}>
        {/* Browser outline */}
        <motion.rect x="20" y="15" width="200" height="130" rx="6" stroke={D} strokeWidth="1.5" {...d(0, 0.5)} />
        {/* Nav bar area */}
        <motion.line x1="20" y1="38" x2="220" y2="38" stroke={D} strokeWidth="1" {...d(0.4)} />
        {/* Traffic lights */}
        <motion.circle cx="33" cy="26" r="3" stroke="rgba(255,95,87,0.7)" strokeWidth="1" {...d(0.3)} />
        <motion.circle cx="44" cy="26" r="3" stroke="rgba(255,189,46,0.7)" strokeWidth="1" {...d(0.38)} />
        <motion.circle cx="55" cy="26" r="3" stroke="rgba(40,202,65,0.7)" strokeWidth="1" {...d(0.45)} />
        {/* Nav links */}
        <motion.line x1="80" y1="26" x2="106" y2="26" stroke={D} strokeWidth="2" {...d(0.6)} />
        <motion.line x1="112" y1="26" x2="138" y2="26" stroke={D} strokeWidth="2" {...d(0.7)} />
        <motion.line x1="144" y1="26" x2="170" y2="26" stroke={D} strokeWidth="2" {...d(0.8)} />
        {/* Hero headline */}
        <motion.line x1="30" y1="54" x2="160" y2="54" stroke={W} strokeWidth="4" strokeOpacity="0.7" {...d(1.0)} />
        <motion.line x1="30" y1="64" x2="120" y2="64" stroke={W} strokeWidth="2.5" strokeOpacity="0.3" {...d(1.2)} />
        {/* Hero sub */}
        <motion.line x1="30" y1="74" x2="140" y2="74" stroke={D} strokeWidth="1.5" {...d(1.4)} />
        <motion.line x1="30" y1="81" x2="110" y2="81" stroke={D} strokeWidth="1.5" {...d(1.5)} />
        {/* Content columns */}
        <motion.rect x="30" y="96" width="54" height="40" rx="3" stroke={D} strokeWidth="1" {...d(1.8)} />
        <motion.rect x="93" y="96" width="54" height="40" rx="3" stroke={D} strokeWidth="1" {...d(2.0)} />
        <motion.rect x="156" y="96" width="54" height="40" rx="3" stroke={D} strokeWidth="1" {...d(2.2)} />
      </svg>
    )
  }

  if (idx === 2) {
    // Web App — frame + sidebar + metric cards + line chart + table rows
    return (
      <svg {...svgProps}>
        {/* App frame */}
        <motion.rect x="15" y="15" width="210" height="130" rx="6" stroke={D} strokeWidth="1.5" {...d(0, 0.5)} />
        {/* Sidebar */}
        <motion.rect x="15" y="15" width="42" height="130" rx="6" stroke={D} strokeWidth="1" {...d(0.4)} />
        {/* Sidebar items */}
        <motion.line x1="24" y1="34" x2="48" y2="34" stroke={D} strokeWidth="2" {...d(0.6)} />
        <motion.line x1="24" y1="46" x2="48" y2="46" stroke={D} strokeWidth="2" {...d(0.7)} />
        <motion.line x1="24" y1="58" x2="48" y2="58" stroke={D} strokeWidth="2" {...d(0.8)} />
        {/* Metric card 1 */}
        <motion.rect x="66" y="22" width="46" height="28" rx="3" stroke={B} strokeWidth="1.2" {...d(0.9)} />
        {/* Metric card 2 */}
        <motion.rect x="118" y="22" width="46" height="28" rx="3" stroke={G} strokeWidth="1.2" {...d(1.1)} />
        {/* Metric card 3 */}
        <motion.rect x="170" y="22" width="46" height="28" rx="3" stroke={A} strokeWidth="1.2" {...d(1.3)} />
        {/* Line chart frame */}
        <motion.rect x="66" y="58" width="150" height="50" rx="3" stroke={D} strokeWidth="1" {...d(1.5)} />
        {/* Chart polyline */}
        <motion.path d="M72 98 L95 82 L118 90 L141 72 L164 80 L187 65 L210 70" stroke={B} strokeWidth="1.8" {...d(1.7, 0.9)} />
        {/* Table rows */}
        <motion.line x1="66" y1="115" x2="216" y2="115" stroke={D} strokeWidth="1" {...d(2.0)} />
        <motion.line x1="66" y1="123" x2="216" y2="123" stroke={D} strokeWidth="1" {...d(2.1)} />
        <motion.line x1="66" y1="131" x2="216" y2="131" stroke={D} strokeWidth="1" {...d(2.2)} />
      </svg>
    )
  }

  if (idx === 3) {
    // API/Backend — terminal + JSON block + code lines + status dot + cursor
    return (
      <svg {...svgProps}>
        {/* Terminal window */}
        <motion.rect x="20" y="15" width="200" height="130" rx="6" stroke={D} strokeWidth="1.5" {...d(0, 0.5)} />
        {/* Title bar */}
        <motion.line x1="20" y1="34" x2="220" y2="34" stroke={D} strokeWidth="1" {...d(0.3)} />
        {/* Traffic lights */}
        <motion.circle cx="33" cy="24" r="3" stroke="rgba(255,95,87,0.7)" strokeWidth="1" {...d(0.4)} />
        <motion.circle cx="44" cy="24" r="3" stroke="rgba(255,189,46,0.7)" strokeWidth="1" {...d(0.45)} />
        <motion.circle cx="55" cy="24" r="3" stroke="rgba(40,202,65,0.7)" strokeWidth="1" {...d(0.5)} />
        {/* GET line */}
        <motion.line x1="30" y1="46" x2="130" y2="46" stroke={G} strokeWidth="2" {...d(0.7)} />
        {/* JSON block */}
        <motion.rect x="30" y="56" width="130" height="55" rx="3" stroke={D} strokeWidth="1" {...d(0.9)} />
        {/* JSON lines */}
        <motion.line x1="40" y1="68" x2="110" y2="68" stroke={B} strokeWidth="1.5" {...d(1.1)} />
        <motion.line x1="40" y1="78" x2="130" y2="78" stroke={A} strokeWidth="1.5" {...d(1.3)} />
        <motion.line x1="40" y1="88" x2="100" y2="88" stroke={B} strokeWidth="1.5" {...d(1.5)} />
        <motion.line x1="40" y1="98" x2="90" y2="98" stroke={D} strokeWidth="1" {...d(1.7)} />
        {/* Status dot */}
        <motion.circle cx="36" cy="120" r="4" stroke={G} strokeWidth="1.5" {...d(1.9)} />
        {/* Server running text line */}
        <motion.line x1="46" y1="120" x2="130" y2="120" stroke={G} strokeWidth="1.5" {...d(2.0)} />
        {/* Cursor blink */}
        <motion.rect
          x="132" y="115" width="8" height="10" rx="1"
          stroke={W} strokeWidth="1" strokeOpacity="0.7"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    )
  }

  if (idx === 4) {
    // UI/UX — design tool + tools panel + swatches + typography + component card + easing curve
    return (
      <svg {...svgProps}>
        {/* Design tool frame */}
        <motion.rect x="15" y="15" width="210" height="130" rx="6" stroke={D} strokeWidth="1.5" {...d(0, 0.5)} />
        {/* Top bar */}
        <motion.line x1="15" y1="34" x2="225" y2="34" stroke={D} strokeWidth="1" {...d(0.3)} />
        {/* Left tools panel */}
        <motion.rect x="15" y="34" width="28" height="111" rx="0" stroke={D} strokeWidth="1" {...d(0.5)} />
        {/* Tool icons (simple lines) */}
        <motion.line x1="22" y1="45" x2="36" y2="45" stroke={D} strokeWidth="2" {...d(0.65)} />
        <motion.line x1="22" y1="55" x2="36" y2="55" stroke={D} strokeWidth="2" {...d(0.72)} />
        <motion.line x1="22" y1="65" x2="36" y2="65" stroke={D} strokeWidth="2" {...d(0.79)} />
        {/* Color swatches */}
        <motion.rect x="52" y="42" width="14" height="14" rx="2" stroke="rgba(168,85,247,0.85)" strokeWidth="1.5" {...d(0.9)} />
        <motion.rect x="72" y="42" width="14" height="14" rx="2" stroke="rgba(236,72,153,0.85)" strokeWidth="1.5" {...d(1.0)} />
        <motion.rect x="92" y="42" width="14" height="14" rx="2" stroke={A} strokeWidth="1.5" {...d(1.1)} />
        <motion.rect x="112" y="42" width="14" height="14" rx="2" stroke={G} strokeWidth="1.5" {...d(1.2)} />
        <motion.rect x="132" y="42" width="14" height="14" rx="2" stroke={B} strokeWidth="1.5" {...d(1.3)} />
        {/* Typography specimen */}
        <motion.line x1="52" y1="68" x2="170" y2="68" stroke={W} strokeWidth="4" strokeOpacity="0.6" {...d(1.5)} />
        <motion.line x1="52" y1="78" x2="130" y2="78" stroke={W} strokeWidth="2" strokeOpacity="0.25" {...d(1.65)} />
        {/* Component card */}
        <motion.rect x="52" y="90" width="90" height="45" rx="4" stroke={D} strokeWidth="1.2" {...d(1.8)} />
        <motion.line x1="62" y1="103" x2="112" y2="103" stroke={D} strokeWidth="2" {...d(1.95)} />
        <motion.line x1="62" y1="113" x2="100" y2="113" stroke={D} strokeWidth="1.5" {...d(2.05)} />
        {/* Easing curve */}
        <motion.path d="M158 128 C168 128 172 92 188 90" stroke={A} strokeWidth="1.8" {...d(2.2, 0.7)} />
        <motion.circle cx="158" cy="128" r="3" stroke={A} strokeWidth="1.2" {...d(2.2)} />
        <motion.circle cx="188" cy="90" r="3" stroke={A} strokeWidth="1.2" {...d(2.5)} />
      </svg>
    )
  }

  // idx === 5: SEO/Performance — browser + speedometer arc + metric bars + checkmarks
  return (
    <svg {...svgProps}>
      {/* Browser */}
      <motion.rect x="15" y="15" width="210" height="130" rx="6" stroke={D} strokeWidth="1.5" {...d(0, 0.5)} />
      <motion.line x1="15" y1="34" x2="225" y2="34" stroke={D} strokeWidth="1" {...d(0.3)} />
      <motion.circle cx="28" cy="24" r="3" stroke="rgba(255,95,87,0.7)" strokeWidth="1" {...d(0.4)} />
      <motion.circle cx="38" cy="24" r="3" stroke="rgba(255,189,46,0.7)" strokeWidth="1" {...d(0.45)} />
      <motion.circle cx="48" cy="24" r="3" stroke="rgba(40,202,65,0.7)" strokeWidth="1" {...d(0.5)} />
      {/* Speedometer background arc */}
      <motion.path d="M 80 110 A 40 40 0 0 1 160 110" stroke={D} strokeWidth="6" strokeLinecap="round" {...d(0.7, 0.6)} />
      {/* Speedometer fill arc (score ~97) */}
      <motion.path d="M 80 110 A 40 40 0 0 1 159 111" stroke={G} strokeWidth="6" strokeLinecap="round" {...d(0.9, 0.8)} />
      {/* Score text line */}
      <motion.line x1="106" y1="102" x2="134" y2="102" stroke={G} strokeWidth="3" {...d(1.5)} />
      <motion.line x1="112" y1="109" x2="128" y2="109" stroke={D} strokeWidth="1.5" {...d(1.6)} />
      {/* Metric bars */}
      <motion.line x1="176" y1="50" x2="210" y2="50" stroke={D} strokeWidth="1" {...d(1.0)} />
      <motion.line x1="176" y1="50" x2="208" y2="50" stroke={G} strokeWidth="2.5" {...d(1.1, 0.5)} />
      <motion.line x1="176" y1="62" x2="210" y2="62" stroke={D} strokeWidth="1" {...d(1.2)} />
      <motion.line x1="176" y1="62" x2="205" y2="62" stroke={G} strokeWidth="2.5" {...d(1.3, 0.5)} />
      <motion.line x1="176" y1="74" x2="210" y2="74" stroke={D} strokeWidth="1" {...d(1.4)} />
      <motion.line x1="176" y1="74" x2="210" y2="74" stroke={G} strokeWidth="2.5" {...d(1.5, 0.5)} />
      {/* Checkmarks */}
      <motion.path d="M 26 55 L 30 60 L 38 50" stroke={G} strokeWidth="1.8" {...d(1.7)} />
      <motion.path d="M 26 72 L 30 77 L 38 67" stroke={G} strokeWidth="1.8" {...d(1.9)} />
      <motion.path d="M 26 89 L 30 94 L 38 84" stroke={G} strokeWidth="1.8" {...d(2.1)} />
      {/* Check labels */}
      <motion.line x1="44" y1="55" x2="90" y2="55" stroke={D} strokeWidth="1.5" {...d(1.8)} />
      <motion.line x1="44" y1="72" x2="90" y2="72" stroke={D} strokeWidth="1.5" {...d(2.0)} />
      <motion.line x1="44" y1="89" x2="90" y2="89" stroke={D} strokeWidth="1.5" {...d(2.2)} />
    </svg>
  )
}

/* ── Services Section ── */
function ServicesSection({ lang, setCursor }: { lang: string; setCursor: (s: CursorState) => void }) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [openMobile,  setOpenMobile]  = useState<number | null>(null)
  const pt  = lang === 'pt'
  const E   = [0.22, 1, 0.36, 1] as const

  const svc = SERVICES_DATA[selectedIdx]

  return (
    <section style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,5vw,5rem)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease: E }}
          style={{ marginBottom: 'clamp(2.5rem,5vw,4rem)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}
        >
          <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 18, height: 1, background: 'rgba(255,255,255,0.12)', display: 'inline-block' }} />
            {pt ? 'O que faço' : 'What I do'}
          </span>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,4.5vw,3.5rem)', letterSpacing: '-0.048em', lineHeight: 0.95, color: '#fff', margin: 0 }}>
            {pt ? 'Serviços.' : 'Services.'}
          </h2>
        </motion.div>

        {/* ── Desktop: split list + detail panel ── */}
        <div className="svc-split-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', alignItems: 'stretch' }}>

          {/* Left — list */}
          <div style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }}>
            {SERVICES_DATA.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: i * 0.07, duration: 0.55, ease: E }}
                onClick={() => { setSelectedIdx(i); setCursor('default') }}
                onMouseEnter={() => setCursor('pointer')}
                onMouseLeave={() => setCursor('default')}
                style={{
                  position: 'relative',
                  display: 'flex', alignItems: 'center', gap: '1.5rem',
                  padding: 'clamp(1.2rem,2.5vw,1.8rem) clamp(1.5rem,3vw,2.5rem)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  opacity: selectedIdx === i ? 1 : 0.28,
                  transition: 'opacity 0.35s ease',
                }}
              >
                {/* Active left bar */}
                <motion.div
                  animate={{ scaleY: selectedIdx === i ? 1 : 0 }}
                  transition={{ duration: 0.32, ease: E }}
                  style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: '#fff', transformOrigin: 'top', borderRadius: 1 }}
                />

                {/* Number */}
                <span style={{
                  fontFamily: '"JetBrains Mono","Fira Code",monospace',
                  fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.12em',
                  color: selectedIdx === i ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.18)',
                  transition: 'color 0.25s', flexShrink: 0, minWidth: '2rem',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Title */}
                <span style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 900,
                  fontSize: 'clamp(1.1rem,1.9vw,1.55rem)', letterSpacing: '-0.035em',
                  color: selectedIdx === i ? '#fff' : 'rgba(255,255,255,0.52)',
                  transition: 'color 0.25s, transform 0.35s cubic-bezier(0.22,1,0.36,1)',
                  transform: selectedIdx === i ? 'translateX(6px)' : 'translateX(0)',
                }}>
                  {pt ? s.titlePt : s.titleEn}
                </span>

                {/* Arrow */}
                <span style={{
                  marginLeft: 'auto', fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.25)',
                  transform: selectedIdx === i ? 'translate(4px,0)' : 'translate(0,0)',
                  opacity: selectedIdx === i ? 1 : 0,
                  transition: 'opacity 0.25s, transform 0.35s cubic-bezier(0.22,1,0.36,1)',
                }}>→</span>
              </motion.div>
            ))}

            {/* Hint text */}
            <p style={{ padding: 'clamp(0.8rem,1.5vw,1rem) clamp(1.5rem,3vw,2.5rem)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.18)', fontStyle: 'italic', margin: 0 }}>
              {pt ? '↙ clique para ver' : '↙ click to explore'}
            </p>
          </div>

          {/* Right — detail panel with SVG sketch */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: 'clamp(2rem,4vw,3.5rem) clamp(2rem,4vw,3rem)', gap: '1.5rem' }}>
            {/* SVG sketch panel */}
            <div
              key={selectedIdx}
              style={{ height: 220, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: '#0a0a0a', flexShrink: 0 }}
            >
              <ServiceSketch idx={selectedIdx} />
            </div>

            {/* Text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIdx}
                initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: E }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(4rem,9vw,7rem)', letterSpacing: '-0.07em', lineHeight: 0.82, color: 'rgba(255,255,255,0.04)', margin: 0, userSelect: 'none' as const, pointerEvents: 'none' as const }}>
                  {String(selectedIdx + 1).padStart(2, '0')}
                </p>
                <div style={{ marginTop: '-0.8rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(1.4rem,2.4vw,2.1rem)', letterSpacing: '-0.044em', lineHeight: 1.1, color: '#fff', margin: 0 }}>
                    {pt ? svc.titlePt : svc.titleEn}
                  </h3>
                  <p style={{ fontSize: 'clamp(0.78rem,1.1vw,0.88rem)', color: 'rgba(255,255,255,0.34)', lineHeight: 1.82, margin: 0 }}>
                    {pt ? svc.descPt : svc.descEn}
                  </p>
                  {/* Progress dots */}
                  <div style={{ display: 'flex', gap: 6, marginTop: '0.25rem' }}>
                    {SERVICES_DATA.map((_, di) => (
                      <motion.div
                        key={di}
                        animate={{ background: di === selectedIdx ? '#fff' : 'rgba(255,255,255,0.15)', width: di === selectedIdx ? 20 : 6 }}
                        transition={{ duration: 0.35, ease: E }}
                        style={{ height: 2, borderRadius: 999 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Mobile: tap accordion ── */}
        <div className="svc-mobile-list">
          {SERVICES_DATA.map((s, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <button
                onClick={() => setOpenMobile(openMobile === i ? null : i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}
              >
                <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', minWidth: '2rem' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: '1.15rem', letterSpacing: '-0.035em', color: '#fff', flex: 1 }}>
                  {pt ? s.titlePt : s.titleEn}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1rem', transform: openMobile === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s ease' }}>+</span>
              </button>
              <AnimatePresence>
                {openMobile === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: E }} style={{ overflow: 'hidden' }}>
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.32)', lineHeight: 1.78, margin: 0, paddingBottom: '1.25rem', paddingLeft: '3rem' }}>
                      {pt ? s.descPt : s.descEn}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .svc-mobile-list { display: none; }
        @media (max-width: 720px) {
          .svc-split-grid  { display: none !important; }
          .svc-mobile-list { display: block; }
        }
      `}</style>
    </section>
  )
}

/* ── Main Page ── */
export default function ServicesPage() {
  const lang      = useLanguageStore((s) => s.lang)
  const setCursor = useCursorStore((s) => s.setState)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => { document.title = `Services — ${SITE.name}` }, [])

  const waUrl = `https://wa.me/${SITE.whatsapp.replace(/\D/g, '')}`

  return (
    <main style={{ paddingTop: '7rem', background: '#0d0d0d', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ padding: 'clamp(3rem,7vw,6rem) clamp(1.5rem,5vw,5rem) clamp(2.5rem,5vw,4rem)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 46%', gap: 'clamp(2rem,4vw,3.5rem)', alignItems: 'stretch' }}
          className="svc-hero-grid">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'inline-block', width: 18, height: 1, background: 'rgba(255,255,255,0.15)' }} />
              <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
                {lang === 'en' ? 'Services' : 'Serviços'}
              </span>
            </div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(2.8rem,5.5vw,5.5rem)', letterSpacing: '-0.055em', lineHeight: '0.9', color: '#fff', margin: 0, paddingBottom: '0.15em' }}>
              {lang === 'en'
                ? (<>Websites &amp;<br /><span style={{ color: 'rgba(255,255,255,0.22)' }}>digital products.</span></>)
                : (<>Sites e<br /><span style={{ color: 'rgba(255,255,255,0.22)' }}>produtos digitais.</span></>)}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.32)', lineHeight: 1.75, maxWidth: 480 }}>
              {lang === 'en'
                ? 'I help businesses, creators and professionals build a strong digital presence through professional websites, landing pages and custom web applications.'
                : 'Ajudo empresas, criadores e profissionais a construir uma presença digital forte através de sites profissionais, landing pages e aplicações web.'}
            </p>
            <div>
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.8rem 1.8rem', borderRadius: 999, background: '#fff', color: '#0d0d0d', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'opacity 0.25s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.82'; setCursor('pointer') }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; setCursor('default') }}>
                <MessageCircle size={14} />
                {lang === 'en' ? 'Start via WhatsApp' : 'Iniciar pelo WhatsApp'}
              </a>
            </div>
          </motion.div>

          {/* Right: video — matches text column height via grid stretch */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, ease: [0.16,1,0.3,1], delay: 0.15 }}
            style={{ borderRadius: 'clamp(12px,2vw,20px)', overflow: 'hidden', position: 'relative', background: '#111', minHeight: 200 }}>
            <video
              src="/video-service.mp4"
              autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,13,13,0.1) 0%, rgba(13,13,13,0.35) 100%)', pointerEvents: 'none' }} />
          </motion.div>
        </div>

        <style>{`@media (max-width: 860px) { .svc-hero-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      <ServicesSection lang={lang} setCursor={setCursor} />

      {/* ── Packages ── */}
      <section style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,5vw,5rem)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'center', alignItems: 'center' }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 18, height: 1, background: 'rgba(255,255,255,0.15)' }} />
              {lang === 'en' ? 'Pricing' : 'Preços'}
              <span style={{ display: 'inline-block', width: 18, height: 1, background: 'rgba(255,255,255,0.15)' }} />
            </span>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,4.5vw,3.5rem)', letterSpacing: '-0.045em', lineHeight: 0.95, color: '#fff', margin: 0 }}>
              {lang === 'en' ? 'Simple, transparent pricing.' : 'Preços simples e transparentes.'}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px,100%), 1fr))', gap: '1.25rem' }}>
            {PACKAGES.map((pkg, i) => (
              <motion.div key={pkg.nameEn} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16,1,0.3,1] }}
                style={{
                  padding: '2rem', borderRadius: '1.25rem',
                  background: pkg.highlight ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${pkg.highlight ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'}`,
                  display: 'flex', flexDirection: 'column', gap: '1.5rem',
                  boxShadow: pkg.highlight ? '0 0 60px rgba(255,255,255,0.04)' : 'none',
                }}>
                {pkg.highlight && (
                  <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
                    {lang === 'en' ? 'Most Popular' : 'Mais Popular'}
                  </span>
                )}
                <div>
                  <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem' }}>
                    {lang === 'en' ? pkg.nameEn : pkg.namePt}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.32)', lineHeight: 1.6 }}>{lang === 'en' ? pkg.descEn : pkg.descPt}</p>
                </div>
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: '2.2rem', letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>{pkg.price}</p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {(lang === 'en' ? pkg.featuresEn : pkg.featuresPt).map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                      <Check size={13} style={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '0.7rem 0', borderRadius: 999,
                    background: pkg.highlight ? '#fff' : 'transparent',
                    border: pkg.highlight ? 'none' : '1px solid rgba(255,255,255,0.14)',
                    color: pkg.highlight ? '#0d0d0d' : 'rgba(255,255,255,0.5)',
                    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                    textDecoration: 'none', transition: 'all 0.25s', marginTop: 'auto',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; setCursor('pointer') }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; setCursor('default') }}>
                  {lang === 'en' ? 'Get started' : 'Começar'} <ArrowUpRight size={12} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Budget Calculator ── */}
      <BudgetCalculator lang={lang} setCursor={setCursor} />

      {/* ── FAQ ── */}
      <section style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,5vw,5rem)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 18, height: 1, background: 'rgba(255,255,255,0.15)' }} />
              FAQ
            </span>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,4.5vw,3rem)', letterSpacing: '-0.045em', lineHeight: 0.95, color: '#fff', margin: 0 }}>
              {lang === 'en' ? 'Common questions.' : 'Perguntas comuns.'}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {FAQ.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16,1,0.3,1] }}
                style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.4rem 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '1rem' }}
                  onMouseEnter={() => setCursor('pointer')}
                  onMouseLeave={() => setCursor('default')}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>
                    {lang === 'en' ? item.qEn : item.qPt}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.1rem', flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', lineHeight: 1 }}>+</span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }} style={{ overflow: 'hidden' }}>
                      <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.75, paddingBottom: '1.4rem' }}>
                        {lang === 'en' ? item.aEn : item.aPt}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.5rem,5vw,5rem)', borderTop: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}
          style={{ maxWidth: 1100, margin: '0 auto' }}
        >
          <div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2.4rem,6vw,5rem)', letterSpacing: '-0.055em', lineHeight: 0.9, color: '#fff', margin: 0, whiteSpace: 'pre-line' }}>
              {lang === 'en' ? "Let's build\nsomething great." : 'Vamos construir\nalgo incrível.'}
            </h2>
            <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.28)', lineHeight: 1.75, maxWidth: '42ch' }}>
              {lang === 'en' ? "Send a message and let's talk about your project — I reply within 24h." : 'Envie uma mensagem e vamos conversar sobre o seu projeto — respondo em até 24h.'}
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '1rem 2rem', borderRadius: 999, background: '#fff', color: '#0d0d0d', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'opacity 0.25s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.82'; setCursor('pointer') }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; setCursor('default') }}
            >
              <MessageCircle size={14} />
              {lang === 'en' ? 'Start a project' : 'Iniciar um projeto'}
            </a>
          </div>
        </motion.div>
      </section>

    </main>
  )
}
