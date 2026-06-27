import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 select-none outline-none disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]'

    const variants = {
      primary:
        'bg-white text-[#0d0d0d] hover:bg-white/88',
      secondary:
        'bg-transparent text-white border border-white/20 hover:border-white/50 hover:bg-white/[0.04]',
      ghost:
        'text-white/45 hover:text-white hover:bg-white/[0.04]',
      outline:
        'bg-transparent text-white border border-white/25 hover:border-white/60 hover:bg-white/[0.04]',
    }

    const sizes = {
      sm: 'px-5 py-2 text-xs tracking-[0.04em]',
      md: 'px-7 py-3 text-sm tracking-[0.02em]',
      lg: 'px-9 py-4 text-sm tracking-[0.02em]',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
