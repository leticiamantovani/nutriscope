import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

export interface SuggestionChipsProps {
  suggestions: readonly string[]
  onPick: (suggestion: string) => void
  disabled?: boolean
  className?: string
}

/** Atalhos de um clique para o primeiro resultado. */
export function SuggestionChips({ suggestions, onPick, disabled, className }: SuggestionChipsProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)} aria-label="Sugestões de pratos">
      <span className="text-caption text-muted-foreground">Experimente:</span>
      {suggestions.map((s) => (
        <Button
          key={s}
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onPick(s)}
          className="font-normal"
        >
          {s}
        </Button>
      ))}
    </div>
  )
}
