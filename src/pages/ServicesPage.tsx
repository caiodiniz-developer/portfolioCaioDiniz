import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Zap, Building2, Monitor, Server, Sparkles, Rocket,
  Check, MessageCircle
} from 'lucide-react'
import { useT } from '@/hooks/useTranslation'
import { useLanguageStore } from '@/store/useLanguageStore'
import { services } from '@/data/services'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Magnetic from '@/components/animations/Magnetic'
import CTASection from '@/components/sections/CTASection'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { SITE } from '@/lib/constants'
import { useCursorStore } from '@/store/useCursorStore'

const iconMap: Record<string, typeof Zap> = {
  Zap, Building2, Monitor, Server, Sparkles, Rocket,
}

const packages = [
  {
    nameEn: 'Starter Website',
    namePt: 'Site Básico',
    descEn: 'Clean, fast landing page or simple institutional website.',
    descPt: 'Landing page limpa e rápida ou site institucional simples.',
    price: 'R$ 500+',
    features: ['Up to 3 pages', 'Mobile responsive', 'Contact form', 'Basic SEO', 'Vercel deploy'],
    featuresPt: ['Até 3 páginas', 'Responsivo', 'Formulário de contato', 'SEO básico', 'Deploy na Vercel'],
    highlight: false,
  },
  {
    nameEn: 'Professional Website',
    namePt: 'Site Profissional',
    descEn: 'Premium website with animations, custom design and advanced features.',
    descPt: 'Site premium com animações, design personalizado e recursos avançados.',
    price: 'R$ 1.500+',
    features: ['Up to 6 pages', 'Custom animations', 'Premium UI design', 'Performance optimized', 'Analytics setup'],
    featuresPt: ['Até 6 páginas', 'Animações customizadas', 'Design premium', 'Performance otimizada', 'Configuração de Analytics'],
    highlight: true,
  },
  {
    nameEn: 'Web App / System',
    namePt: 'App Web / Sistema',
    descEn: 'Full-stack web application with backend, database and authentication.',
    descPt: 'Aplicação web completa com backend, banco de dados e autenticação.',
    price: 'R$ 3.000+',
    features: ['Custom features', 'Backend API', 'Database design', 'Authentication', 'Admin dashboard'],
    featuresPt: ['Funcionalidades customizadas', 'API Backend', 'Design de banco', 'Autenticação', 'Dashboard admin'],
    highlight: false,
  },
]

const faq = [
  {
    q: 'How long does a project take?',
    qPt: 'Quanto tempo leva um projeto?',
    a: 'Landing pages take 3-7 days. Business websites take 1-2 weeks. Web apps take 2-6 weeks depending on complexity.',
    aPt: 'Landing pages levam 3-7 dias. Sites institucionais levam 1-2 semanas. Apps web levam 2-6 semanas dependendo da complexidade.',
  },
  {
    q: 'Do you provide ongoing support after launch?',
    qPt: 'Você oferece suporte após o lançamento?',
    a: 'Yes! I offer 30 days of free support after every project launch for bug fixes and minor adjustments.',
    aPt: 'Sim! Ofereço 30 dias de suporte gratuito após o lançamento de cada projeto para correção de bugs e ajustes menores.',
  },
  {
    q: 'What technologies do you use?',
    qPt: 'Quais tecnologias você usa?',
    a: 'React, TypeScript, Node.js, Prisma, PostgreSQL, Tailwind CSS, GSAP and Vercel for deployment.',
    aPt: 'React, TypeScript, Node.js, Prisma, PostgreSQL, Tailwind CSS, GSAP e Vercel para deploy.',
  },
  {
    q: 'Can I see the source code?',
    qPt: 'Posso ver o código-fonte?',
    a: 'Absolutely. You own the code. I deliver everything organized, documented and on a private GitHub repo.',
    aPt: 'Com certeza. Você é dono do código. Entrego tudo organizado, documentado e em um repositório privado no GitHub.',
  },
]

export default function ServicesPage() {
  const t = useT()
  const lang = useLanguageStore((s) => s.lang)
  const setCursor = useCursorStore((s) => s.setState)

  useEffect(() => {
    document.title = `Services — ${SITE.name}`
  }, [])

  return (
    <main className="pt-28">
      {/* Hero */}
      <section className="section-padding hero-bg-gradient">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-8 max-w-3xl"
          >
            <motion.div variants={staggerItem}>
              <Badge variant="purple">{t.services.badge}</Badge>
            </motion.div>
            <motion.h1 variants={staggerItem} className="text-hero font-black text-white tracking-tight">
              {lang === 'en'
                ? 'Websites and digital products that make your business look professional.'
                : 'Sites e produtos digitais que fazem o seu negócio parecer profissional.'}
            </motion.h1>
            <motion.p variants={staggerItem} className="text-slate-text text-lg leading-relaxed">
              {lang === 'en'
                ? 'I help businesses, creators and professionals build a strong digital presence through professional websites, landing pages, web applications and custom systems.'
                : 'Ajudo empresas, criadores e profissionais a construir uma presença digital forte através de sites profissionais, landing pages, aplicações web e sistemas personalizados.'}
            </motion.p>
            <motion.div variants={staggerItem}>
              <Magnetic strength={0.25}>
                <a
                  href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" size="lg">
                    <MessageCircle size={16} />
                    {lang === 'en' ? 'Start via WhatsApp' : 'Iniciar pelo WhatsApp'}
                  </Button>
                </a>
              </Magnetic>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-navy-950">
        <div className="container-custom">
          <div className="flex flex-col gap-14">
            <div className="flex flex-col gap-4">
              <Badge variant="purple">{t.services.badge}</Badge>
              <h2 className="text-section font-black text-white">{t.services.headline}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service, i) => {
                const Icon = iconMap[service.icon] ?? Zap
                const title = lang === 'en' ? service.titleEn : service.titlePt
                const description = lang === 'en' ? service.descriptionEn : service.descriptionPt

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6, delay: i * 0.07 }}
                    className="glass-card rounded-2xl p-6 flex flex-col gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-purple/10 border border-purple/20 flex items-center justify-center">
                      <Icon size={20} className="text-purple-light" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-2">{title}</h3>
                      <p className="text-sm text-slate-text leading-relaxed">{description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col gap-14">
            <div className="text-center flex flex-col items-center gap-4">
              <Badge variant="purple">{lang === 'en' ? 'Packages' : 'Pacotes'}</Badge>
              <h2 className="text-section font-black text-white">
                {lang === 'en' ? 'Simple, transparent pricing' : 'Preços simples e transparentes'}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {packages.map((pkg, i) => (
                <motion.div
                  key={pkg.nameEn}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`rounded-2xl p-8 flex flex-col gap-6 ${
                    pkg.highlight
                      ? 'bg-purple/10 border border-purple/40 shadow-[0_0_60px_rgba(255,255,255,0.06)]'
                      : 'glass-card'
                  }`}
                >
                  {pkg.highlight && (
                    <span className="text-xs font-bold text-purple uppercase tracking-widest">
                      {lang === 'en' ? 'Most Popular' : 'Mais Popular'}
                    </span>
                  )}
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {lang === 'en' ? pkg.nameEn : pkg.namePt}
                    </h3>
                    <p className="text-sm text-slate-text mt-1">
                      {lang === 'en' ? pkg.descEn : pkg.descPt}
                    </p>
                  </div>
                  <div className="text-3xl font-black text-white">{pkg.price}</div>
                  <ul className="flex flex-col gap-2.5">
                    {(lang === 'en' ? pkg.features : pkg.featuresPt).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-text">
                        <Check size={14} className="text-green-accent flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setCursor('pointer')}
                    onMouseLeave={() => setCursor('default')}
                  >
                    <Button
                      variant={pkg.highlight ? 'primary' : 'secondary'}
                      size="md"
                      className="w-full"
                    >
                      {lang === 'en' ? 'Get Started' : 'Começar'}
                    </Button>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-navy-950">
        <div className="container-custom">
          <div className="flex flex-col gap-12 max-w-3xl mx-auto">
            <div className="text-center flex flex-col items-center gap-4">
              <Badge variant="purple">FAQ</Badge>
              <h2 className="text-section font-black text-white">
                {lang === 'en' ? 'Common questions' : 'Perguntas comuns'}
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {faq.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h3 className="font-bold text-white mb-2">
                    {lang === 'en' ? item.q : item.qPt}
                  </h3>
                  <p className="text-slate-text text-sm leading-relaxed">
                    {lang === 'en' ? item.a : item.aPt}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  )
}
