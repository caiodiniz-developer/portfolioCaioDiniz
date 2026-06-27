import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { getProjectBySlug, projects } from '@/data/projects'
import CaseStudyLayout from '@/components/projects/CaseStudyLayout'
import { SITE } from '@/lib/constants'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = getProjectBySlug(slug ?? '')

  const currentIndex = projects.findIndex((p) => p.slug === slug)
  const nextProject = projects[(currentIndex + 1) % projects.length]

  useEffect(() => {
    if (project) {
      document.title = `${project.title} — ${SITE.name}`
    }
  }, [project])

  if (!project) return <Navigate to="/projects" replace />

  return <CaseStudyLayout project={project} nextProject={nextProject} />
}
