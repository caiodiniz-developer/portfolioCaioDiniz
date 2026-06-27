import { useState, useEffect } from 'react'
import { BREAKPOINTS } from '@/lib/constants'

interface WindowSize {
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < BREAKPOINTS.md : false,
    isTablet:
      typeof window !== 'undefined'
        ? window.innerWidth >= BREAKPOINTS.md && window.innerWidth < BREAKPOINTS.lg
        : false,
    isDesktop: typeof window !== 'undefined' ? window.innerWidth >= BREAKPOINTS.lg : true,
  })

  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth
      const h = window.innerHeight
      setSize({
        width: w,
        height: h,
        isMobile: w < BREAKPOINTS.md,
        isTablet: w >= BREAKPOINTS.md && w < BREAKPOINTS.lg,
        isDesktop: w >= BREAKPOINTS.lg,
      })
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}
