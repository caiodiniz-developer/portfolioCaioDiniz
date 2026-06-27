import type { ReactNode, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  glow?: boolean
}

export default function Card({ children, hover = true, glow = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-6 transition-all duration-500',
        hover && 'hover:bg-white/[0.06] hover:border-white/15 hover:-translate-y-1',
        glow && 'hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
