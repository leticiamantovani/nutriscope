import type { HTMLAttributes } from 'react'

import { cn } from '@/shared/lib/utils'

/** Placeholder de carregamento. Use com dimensões próximas ao conteúdo real. */
function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-cream-300', className)}
      {...props}
    />
  )
}

export { Skeleton }
