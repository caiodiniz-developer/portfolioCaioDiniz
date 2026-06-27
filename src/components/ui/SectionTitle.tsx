import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionTitleProps {
  badge?: string
  headline: ReactNode
  sub?: string
  align?: 'left' | 'center'
  className?: string
}

export default function SectionTitle({ badge, headline, sub, align = 'left', className }: SectionTitleProps) {
  return (
    <div className={cn('flex flex-col gap-6', align === 'center' && 'items-center text-center', className)}>
      {badge && (
        <span className="inline-flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/35">
          <span className="w-5 h-px bg-white/20 flex-shrink-0" />
          {badge}
        </span>
      )}
      <h2
        className={cn(
          'text-section font-black text-white',
          align === 'center' && 'max-w-4xl'
        )}
      >
        {headline}
      </h2>
      {sub && (
        <p className={cn('text-base leading-relaxed text-white/40', align === 'center' ? 'max-w-2xl' : 'max-w-xl')}>
          {sub}
        </p>
      )}
    </div>
  )
}
