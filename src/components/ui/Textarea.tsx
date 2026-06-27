import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm font-medium text-slate-light">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-slate-text/60',
            'outline-none transition-all duration-300 resize-none',
            'focus:border-purple/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-purple/20',
            'hover:border-white/15',
            error && 'border-red-500/50',
            className
          )}
          rows={5}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-400">{error}</span>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
