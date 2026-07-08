import { useRef } from 'react'
import { motion } from 'framer-motion'
import type { Project } from '@/data/projects'
import { useCursorStore } from '@/store/useCursorStore'
import { staggerItem } from '@/lib/animations'

interface ProjectCardProps {
  project: Project
  index?: number
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const setCursor = useCursorStore((s) => s.setState)
  const setLabel = useCursorStore((s) => s.setLabel)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    el.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(4px)`
    el.style.transition = 'transform 0.1s ease'
  }

  function handleMouseLeave() {
    const el = cardRef.current
    if (!el) return
    el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)'
    el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
    setCursor('default')
    setLabel('')
  }

  return (
    <motion.div
      variants={staggerItem}
      transition={{ delay: index * 0.08 }}
      ref={cardRef}
      className="group glass-card rounded-2xl overflow-hidden hover:border-white/20 hover:shadow-[0_20px_60px_rgba(255,255,255,0.05)] transition-colors duration-500"
      style={{ transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => {
        setCursor('view')
        setLabel('View')
      }}
    >
      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="absolute top-3 left-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/70 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-bold text-white group-hover:text-white/70 transition-colors duration-300">
              {project.title}
            </h3>
          </div>

          <p className="text-sm text-slate-text line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.stack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.07] text-slate-text/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </a>
    </motion.div>
  )
}
