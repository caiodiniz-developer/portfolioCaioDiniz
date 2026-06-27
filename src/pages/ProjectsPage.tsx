import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useT } from '@/hooks/useTranslation'
import { projects, type Project } from '@/data/projects'
import ProjectCard from '@/components/projects/ProjectCard'
import Badge from '@/components/ui/Badge'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { SITE } from '@/lib/constants'

type Filter = 'All' | 'Front-end' | 'Back-end' | 'Full Stack' | 'Websites' | 'Creative'

const filters: Filter[] = ['All', 'Full Stack', 'Front-end', 'Back-end', 'Websites', 'Creative']

export default function ProjectsPage() {
  const t = useT()
  const [active, setActive] = useState<Filter>('All')

  useEffect(() => {
    document.title = `Projects — ${SITE.name}`
  }, [])

  const filtered: Project[] = active === 'All'
    ? projects
    : projects.filter((p) => p.category === active)

  const filterLabels: Record<Filter, string> = {
    All: t.projects.filterAll,
    'Front-end': t.projects.filterFrontend,
    'Back-end': t.projects.filterBackend,
    'Full Stack': t.projects.filterFullstack,
    Websites: t.projects.filterWebsites,
    Creative: t.projects.filterCreative,
  }

  return (
    <main className="pt-28 pb-24">
      {/* Hero */}
      <section className="hero-bg-gradient py-20">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-6 max-w-2xl"
          >
            <motion.div variants={staggerItem}>
              <Badge variant="purple">{t.projects.badge}</Badge>
            </motion.div>
            <motion.h1
              variants={staggerItem}
              className="text-hero font-black text-white tracking-tight"
            >
              {t.projects.headline}
            </motion.h1>
            <motion.p variants={staggerItem} className="text-slate-text text-lg leading-relaxed">
              {t.projects.sub}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="container-custom py-10 border-b border-white/[0.06]">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActive(filter)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                active === filter
                  ? 'bg-purple text-white'
                  : 'glass-card text-slate-text hover:text-white hover:border-purple/30'
              }`}
            >
              {filterLabels[filter]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="container-custom py-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
