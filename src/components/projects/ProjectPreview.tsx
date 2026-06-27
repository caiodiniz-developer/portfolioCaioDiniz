import type { Project } from '@/data/projects'

interface ProjectPreviewProps {
  project: Project
}

export default function ProjectPreview({ project }: ProjectPreviewProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden aspect-video glass-card">
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" />
      <div className="absolute bottom-4 left-4">
        <p className="text-sm font-bold text-white">{project.title}</p>
        <p className="text-xs text-slate-text">{project.type}</p>
      </div>
    </div>
  )
}
