import type { Variants, Transition } from 'framer-motion'

export const TRANSITION_BASE: Transition = {
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1],
}

export const TRANSITION_SLOW: Transition = {
  duration: 0.9,
  ease: [0.16, 1, 0.3, 1],
}

export const TRANSITION_SPRING: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: TRANSITION_BASE,
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: TRANSITION_BASE,
  },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: TRANSITION_BASE,
  },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: TRANSITION_BASE,
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: TRANSITION_BASE,
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: TRANSITION_BASE,
  },
}

export const clipPathReveal: Variants = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  visible: {
    clipPath: 'inset(0% 0 0 0)',
    transition: TRANSITION_SLOW,
  },
}

export const maskRevealX: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    transition: TRANSITION_BASE,
  },
}

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  in: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  out: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: [0.87, 0, 0.13, 1] },
  },
}
