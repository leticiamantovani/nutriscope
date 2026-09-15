import type { HTMLAttributes } from 'react'

import { cn } from '@/shared/lib/utils'

/** Largura máxima e gutters laterais padronizados. */
export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-5xl px-5 sm:px-8', className)} {...props} />
}
