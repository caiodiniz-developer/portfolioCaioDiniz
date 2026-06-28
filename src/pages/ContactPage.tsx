import { useEffect } from 'react'
import { SITE } from '@/lib/constants'
import Contact from '@/components/sections/Contact'

export default function ContactPage() {
  useEffect(() => { document.title = `Contato — ${SITE.name}` }, [])
  return (
    <main style={{ background: '#0d0d0d', minHeight: '100vh', paddingTop: '5rem' }}>
      <Contact />
    </main>
  )
}
