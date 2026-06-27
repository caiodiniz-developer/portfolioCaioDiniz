import { useEffect } from 'react'
import { SITE } from '@/lib/constants'
import Contact from '@/components/sections/Contact'

export default function ContactPage() {
  useEffect(() => {
    document.title = `Contact — ${SITE.name}`
  }, [])

  return (
    <main className="pt-24">
      <Contact />
    </main>
  )
}
