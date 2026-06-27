import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm font-medium text-slate-light">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-slate-text/60',
            'outline-none transition-all duration-300',
            'focus:border-purple/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-purple/20',
            'hover:border-white/15',
            error && 'border-red-500/50 focus:border-red-500/70',
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-400">{error}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
