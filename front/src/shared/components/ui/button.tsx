import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap',
    'rounded-full font-medium text-body transition-[background-color,color,box-shadow,transform] duration-200',
    'focus-visible:ring-4 focus-visible:ring-ring/25 focus-visible:outline-none',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground shadow-soft hover:bg-primary-hover hover:shadow-lift',
        secondary: 'bg-primary-soft text-orange-700 hover:bg-orange-200',
        outline: 'border border-border bg-card text-foreground hover:border-cocoa-400 hover:bg-cream-200',
        ghost: 'text-foreground hover:bg-cream-200',
      },
      size: {
        sm: 'h-9 px-4 text-caption',
        md: 'h-11 px-5',
        lg: 'h-12 px-6',
        icon: 'size-11',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  /** Renderiza o filho como elemento raiz (ex.: `<a>`), herdando estilo. */
  asChild?: boolean
}

function Button({ className, variant, size, asChild = false, type = 'button', ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      data-slot="button"
      type={asChild ? undefined : type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
