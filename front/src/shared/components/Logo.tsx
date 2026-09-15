import { Salad } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

export interface LogoProps {
  /** Esconde o nome, deixando só a marca. */
  iconOnly?: boolean
  className?: string
}

export function Logo({ iconOnly = false, className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground shadow-soft">
        <Salad className="size-5" aria-hidden="true" />
      </span>
      {!iconOnly && (
        <span className="font-display text-title font-semibold tracking-tight text-foreground">
          NutriLens
        </span>
      )}
    </span>
  )
}
