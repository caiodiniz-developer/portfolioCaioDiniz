import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useT } from '@/hooks/useTranslation'
import { skillCategories } from '@/data/skills'
import SectionTitle from '@/components/ui/SectionTitle'
import { staggerContainer, staggerItem } from '@/lib/animations'

function SkillTag({ name, index }: { name: string; index: number }) {
  return (
    <motion.span
      variants={staggerItem}
      transition={{ delay: index * 0.03 }}
      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium glass-card border-white/10 text-slate-light hover:text-white hover:border-purple/30 hover:bg-purple/5 transition-all duration-300 cursor-default"
    >
      {name}
    </motion.span>
  )
}

export default function Skills() {
  const t = useT()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const categoryLabels: Record<string, string> = {
    frontend: t.skills.frontend,
    backend: t.skills.backend,
    tools: t.skills.tools,
    soft: t.skills.soft,
  }

  return (
    <section ref={ref} className="section-padding relative">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="flex flex-col gap-16"
        >
          <SectionTitle
            badge={t.skills.badge}
            headline={t.skills.headline}
          />

          <div className="grid md:grid-cols-2 gap-12">
            {skillCategories.map((cat) => (
              <div key={cat.id} className="flex flex-col gap-5">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                  {categoryLabels[cat.id] ?? cat.label}
                </h3>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  className="flex flex-wrap gap-2"
                >
                  {cat.skills.map((skill, i) => (
                    <SkillTag key={skill.name} name={skill.name} index={i} />
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
