import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useT } from '@/hooks/useTranslation'
import Button from '@/components/ui/Button'
import Magnetic from '@/components/animations/Magnetic'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { SITE } from '@/lib/constants'

export default function NotFound() {
  const t = useT()

  useEffect(() => {
    document.title = `404 — ${SITE.name}`
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center hero-bg-gradient">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="container-custom flex flex-col items-center text-center gap-8"
      >
        <motion.div variants={staggerItem}>
          <span
            className="font-black text-white/[0.06] block select-none"
            style={{ fontSize: 'clamp(8rem, 25vw, 18rem)', lineHeight: 1 }}
          >
            404
          </span>
        </motion.div>
        <motion.div variants={staggerItem} className="flex flex-col gap-4 -mt-8">
          <h1 className="text-3xl font-black text-white">{t.common.notFound}</h1>
          <p className="text-slate-text text-base max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>
        <motion.div variants={staggerItem}>
          <Magnetic>
            <Link to="/">
              <Button variant="primary" size="lg">
                <ArrowLeft size={16} />
                {t.common.goHome}
              </Button>
            </Link>
          </Magnetic>
        </motion.div>
      </motion.div>
    </main>
  )
}
