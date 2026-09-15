import { Flame, Drumstick, Wheat } from 'lucide-react'

import type { Macros } from '@/shared/api/client'
import { MacroCard } from './MacroCard'

export interface MacroCardsProps {
  /** `null` enquanto os macros não chegaram. */
  macros: Macros | null
}

/** Trio de métricas: calorias, proteína e carboidratos. */
export function MacroCards({ macros }: MacroCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <MacroCard label="Calorias" unit="kcal" icon={Flame} tone="calories" value={macros?.calories ?? null} />
      <MacroCard label="Proteína" unit="g" icon={Drumstick} tone="protein" value={macros?.protein ?? null} />
      <MacroCard label="Carboidratos" unit="g" icon={Wheat} tone="carbs" value={macros?.carbs ?? null} />
    </div>
  )
}
