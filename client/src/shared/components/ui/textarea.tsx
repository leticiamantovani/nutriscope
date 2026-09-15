import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/utils'

export type TextareaProps = ComponentProps<'textarea'>

const Textarea = ({ className, ...props }: TextareaProps) => (
  <textarea
    data-slot="textarea"
    className={cn(
      'w-full resize-none bg-transparent text-body text-foreground placeholder:text-cocoa-400',
      'focus:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-60',
      className,
    )}
    {...props}
  />
)

export { Textarea }
