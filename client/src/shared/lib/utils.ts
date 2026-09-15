import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge precisa conhecer os tamanhos de texto customizados
 * (definidos em design-system/tokens.css), senão trata `text-title`
 * como cor e o descarta ao conflitar com `text-primary`, por exemplo.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': ['text-display', 'text-title', 'text-body', 'text-caption'],
      shadow: ['shadow-soft', 'shadow-lift', 'shadow-focus'],
    },
  },
})

/** Junta classes Tailwind resolvendo conflitos (padrão shadcn/ui). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
