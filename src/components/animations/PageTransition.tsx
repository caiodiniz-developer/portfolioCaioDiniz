import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { pageVariants } from '@/lib/animations'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
    >
      {children}
    </motion.div>
  )
}
