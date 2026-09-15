import type { HTMLAttributes } from 'react'

import { cn } from '@/shared/lib/utils'

export type CardProps = HTMLAttributes<HTMLDivElement>

function Card({ className, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        'rounded-xl border border-border bg-card text-card-foreground shadow-soft',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: CardProps) {
  return <div data-slot="card-header" className={cn('flex flex-col gap-1 p-5', className)} {...props} />
}

function CardContent({ className, ...props }: CardProps) {
  return <div data-slot="card-content" className={cn('p-5 pt-0', className)} {...props} />
}

function CardFooter({ className, ...props }: CardProps) {
  return <div data-slot="card-footer" className={cn('flex items-center p-5 pt-0', className)} {...props} />
}

export { Card, CardContent, CardFooter, CardHeader }
