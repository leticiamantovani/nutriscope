import { cn } from '@/shared/lib/utils'

/**
 * Ilustração geométrica decorativa (prato, folha, formas).
 * Só aparece em telas largas para não competir com o input no mobile.
 */
export function HeroDecor({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 hidden lg:block', className)} aria-hidden="true">
      {/* Prato — esquerda */}
      <svg
        className="absolute -left-6 top-10 w-52 animate-float text-primary"
        viewBox="0 0 200 200"
        fill="none"
        style={{ animationDelay: '-2s' }}
      >
        <circle cx="100" cy="100" r="92" className="fill-orange-100" />
        <circle cx="100" cy="100" r="66" className="fill-cream-50" />
        <circle cx="100" cy="100" r="66" className="stroke-orange-200" strokeWidth="3" />
        <path d="M100 70a30 30 0 1 1-30 30" className="stroke-leaf-500" strokeWidth="10" strokeLinecap="round" />
        <path d="M70 100a30 30 0 0 1 30-30" className="stroke-mustard-500" strokeWidth="10" strokeLinecap="round" />
        <circle cx="100" cy="100" r="9" className="fill-coral-500" />
      </svg>

      {/* Folha + formas — direita */}
      <svg
        className="absolute -right-4 top-6 w-56 animate-float"
        viewBox="0 0 220 220"
        fill="none"
        style={{ animationDelay: '-5s' }}
      >
        <path
          d="M40 170C40 100 100 40 180 40c0 80-60 140-140 140"
          className="fill-leaf-100 stroke-leaf-500"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M60 160C90 120 130 85 168 55" className="stroke-leaf-500" strokeWidth="4" strokeLinecap="round" />
        <circle cx="180" cy="170" r="22" className="fill-coral-100 stroke-coral-500" strokeWidth="4" />
        <rect x="18" y="26" width="40" height="40" rx="12" className="fill-mustard-100 stroke-mustard-500" strokeWidth="4" />
      </svg>

      {/* Chip flutuante */}
      <div
        className="absolute right-12 bottom-14 flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-caption shadow-soft animate-float"
        style={{ animationDelay: '-3.5s' }}
      >
        <span className="size-2 rounded-full bg-accent" />
        <span className="font-medium">42 g proteína</span>
      </div>
    </div>
  )
}
