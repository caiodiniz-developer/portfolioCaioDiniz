import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Code2, Zap, Palette, TrendingUp, Film, RefreshCw } from 'lucide-react'
import { useT } from '@/hooks/useTranslation'
import { useLanguageStore } from '@/store/useLanguageStore'
import About from '@/components/sections/About'
import Experience from '@/components/sections/Experience'
import Skills from '@/components/sections/Skills'
import CTASection from '@/components/sections/CTASection'
import { SITE } from '@/lib/constants'

const values = [
  {
    icon: Code2,
    titleEn: 'Clean Code',      titlePt: 'Código Limpo',
    descEn: 'Readable, maintainable and scalable code is not optional — it\'s the foundation.',
    descPt: 'Código legível, manutenível e escalável não é opcional — é a base de tudo.',
  },
  {
    icon: Zap,
    titleEn: 'Performance',     titlePt: 'Performance',
    descEn: 'Fast experiences convert better. I optimize for Core Web Vitals from day one.',
    descPt: 'Experiências rápidas convertem melhor. Otimizo para Core Web Vitals desde o início.',
  },
  {
    icon: Palette,
    titleEn: 'User Experience', titlePt: 'Experiência do Usuário',
    descEn: 'Every pixel, every interaction, every transition serves the user\'s journey.',
    descPt: 'Cada pixel, cada interação, cada transição serve à jornada do usuário.',
  },
  {
    icon: TrendingUp,
    titleEn: 'Business Value',  titlePt: 'Valor de Negócio',
    descEn: 'I build products that drive real results: more clients, more revenue, more trust.',
    descPt: 'Crio produtos que geram resultados reais: mais clientes, mais receita, mais confiança.',
  },
  {
    icon: Film,
    titleEn: 'Motion Design',   titlePt: 'Motion Design',
    descEn: 'Motion is not decoration. It\'s communication — guiding attention and feeling.',
    descPt: 'Motion não é decoração. É comunicação — guia a atenção e transmite sensação.',
  },
  {
    icon: RefreshCw,
    titleEn: 'Continuous Learning', titlePt: 'Aprendizado Contínuo',
    descEn: 'The web evolves fast. I stay ahead by learning every day, every project.',
    descPt: 'A web evolui rápido. Me mantenho à frente aprendendo todos os dias, em cada projeto.',
  },
]

export default function AboutPage() {
  const t    = useT()
  const lang = useLanguageStore((s) => s.lang)

  useEffect(() => {
    document.title = `${lang === 'en' ? 'About' : 'Sobre'} — ${SITE.name}`
  }, [lang])

  return (
    <main style={{ paddingTop: '5rem' }}>
      {/* Hero */}
      <section
        className="section-padding relative overflow-hidden"
        style={{ background: '#0d0d0d', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: 0.07, filter: 'blur(2px)', transform: 'scale(1.04)' }}
        >
          <source src="/assets/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6 max-w-3xl"
          >
            <span className="inline-flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/30">
              <span className="w-5 h-px bg-white/15" />
              {t.about.badge}
            </span>
            <h1
              className="font-black text-white"
              style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2.5rem, 7vw, 6rem)', letterSpacing: '-0.055em', lineHeight: '0.88' }}
            >
              {lang === 'en' ? (
                <>Developer,<br /><span style={{ color: 'rgba(255,255,255,0.22)' }}>creator &amp; builder.</span></>
              ) : (
                <>Desenvolvedor,<br /><span style={{ color: 'rgba(255,255,255,0.22)' }}>criador &amp; construtor.</span></>
              )}
            </h1>
            <p className="text-sm text-white/35 leading-relaxed max-w-xl">
              {t.about.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* About split section — foto-1 only, no hover */}
      <About />

      {/* Values — "How I think about work" */}
      <section
        className="section-padding"
        style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="container-custom">
          <div className="flex flex-col gap-14">
            <div className="flex flex-col gap-4">
              <span className="inline-flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/30">
                <span className="w-5 h-px bg-white/15" />
                {lang === 'en' ? 'What I believe' : 'O que acredito'}
              </span>
              <h2
                className="font-black text-white"
                style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.04em', lineHeight: '0.95' }}
              >
                {lang === 'en' ? 'How I think about work.' : 'Como penso sobre o trabalho.'}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {values.map(({ icon: Icon, titleEn, titlePt, descEn, descPt }, i) => (
                <motion.div
                  key={titleEn}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl p-6 flex flex-col gap-4"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <Icon size={18} style={{ color: 'rgba(255,255,255,0.6)' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1.5" style={{ fontSize: '0.95rem' }}>
                      {lang === 'en' ? titleEn : titlePt}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {lang === 'en' ? descEn : descPt}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Experience />
      <Skills />
      <CTASection />
    </main>
  )
}
