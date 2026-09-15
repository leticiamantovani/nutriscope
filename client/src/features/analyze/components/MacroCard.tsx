import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { useEffect } from 'react'

import { Skeleton } from '@/shared/components/ui/skeleton'
import { formatInteger } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'

export type MacroTone = 'calories' | 'protein' | 'carbs'

const toneClasses: Record<MacroTone, { card: string; icon: string; value: string }> = {
  calories: {
    card: 'bg-macro-calories-soft',
    icon: 'bg-macro-calories text-cocoa-900',
    value: 'text-macro-calories-foreground',
  },
  protein: {
    card: 'bg-macro-protein-soft',
    icon: 'bg-macro-protein text-cream-50',
    value: 'text-macro-protein-foreground',
  },
  carbs: {
    card: 'bg-macro-carbs-soft',
    icon: 'bg-macro-carbs text-cream-50',
    value: 'text-macro-carbs-foreground',
  },
}

export interface MacroCardProps {
  label: string
  unit: string
  icon: LucideIcon
  tone: MacroTone
  /** `null` enquanto o valor ainda não chegou pelo stream (mostra skeleton). */
  value: number | null
}

/** Card de métrica com número animado (count-up). */
export function MacroCard({ label, unit, icon: Icon, tone, value }: MacroCardProps) {
  const classes = toneClasses[tone]

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-lg p-4 sm:flex-col sm:items-start sm:p-5',
        classes.card,
      )}
      role="group"
      aria-label={value === null ? `${label}: calculando` : `${label}: ${formatInteger(value)} ${unit}`}
    >
      <div className="flex items-center gap-2.5">
        <span className={cn('grid size-8 place-items-center rounded-sm', classes.icon)}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="font-medium text-caption text-foreground/80">{label}</span>
      </div>

      {value === null ? (
        <Skeleton className="h-8 w-20 bg-foreground/10 sm:h-10 sm:w-24" />
      ) : (
        <p className={cn('font-display text-display leading-none', classes.value)} aria-hidden="true">
          <AnimatedNumber value={value} />
          <span className="ml-1 font-sans text-caption font-medium text-foreground/60">{unit}</span>
        </p>
      )}
    </div>
  )
}

function AnimatedNumber({ value }: { value: number }) {
  const reduceMotion = useReducedMotion()
  const motionValue = useMotionValue(0)
  const formatted = useTransform(motionValue, (v) => formatInteger(v))

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: reduceMotion ? 0 : 0.9,
      ease: [0.16, 1, 0.3, 1],
    })
    return () => controls.stop()
  }, [value, motionValue, reduceMotion])

  return <motion.span className="tabular-nums">{formatted}</motion.span>
}
