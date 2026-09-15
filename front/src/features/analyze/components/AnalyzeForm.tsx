import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import {
  useCallback,
  useId,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type RefObject,
} from 'react'

import { Button } from '@/shared/components/ui/button'
import { Textarea } from '@/shared/components/ui/textarea'
import { cn } from '@/shared/lib/utils'

const MAX_LENGTH = 300
const MAX_HEIGHT_PX = 128

export interface AnalyzeFormProps {
  onSubmit: (query: string) => void
  /** Ref do campo, para foco programático (ex.: após "Nova análise"). */
  inputRef?: RefObject<HTMLTextAreaElement | null>
  className?: string
}

/**
 * Campo principal de entrada. Enter envia, Shift+Enter quebra linha.
 * Envio vazio mostra orientação em vez de falhar silenciosamente.
 */
export function AnalyzeForm({ onSubmit, inputRef, className }: AnalyzeFormProps) {
  const [value, setValue] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const reduceMotion = useReducedMotion()
  const hintId = useId()

  const submit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed) {
      setShowHint(true)
      setShakeKey((k) => k + 1)
      inputRef?.current?.focus()
      return
    }
    setShowHint(false)
    onSubmit(trimmed)
  }, [value, onSubmit, inputRef])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    submit()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submit()
    }
  }

  const autoGrow = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`
  }

  const remaining = MAX_LENGTH - value.length

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)} noValidate>
      <label htmlFor="analyze-query" className="sr-only">
        Nome do prato ou lista de ingredientes
      </label>

      <motion.div
        key={shakeKey}
        animate={shakeKey && !reduceMotion ? { x: [0, -8, 8, -5, 5, 0] } : undefined}
        transition={{ duration: 0.4 }}
        className={cn(
          'flex items-end gap-2 rounded-xl border bg-card p-2 pl-4 shadow-soft transition-[box-shadow,border-color] duration-200',
          'focus-within:border-primary focus-within:shadow-lift',
          showHint ? 'border-destructive' : 'border-border',
        )}
      >
        <Textarea
          id="analyze-query"
          ref={inputRef}
          value={value}
          rows={1}
          maxLength={MAX_LENGTH}
          autoComplete="off"
          enterKeyHint="send"
          placeholder="Ex.: feijoada completa"
          aria-describedby={showHint ? hintId : undefined}
          aria-invalid={showHint || undefined}
          onChange={(e) => {
            setValue(e.target.value)
            if (showHint && e.target.value.trim()) setShowHint(false)
            autoGrow(e.target)
          }}
          onKeyDown={handleKeyDown}
          className="min-h-11 py-2.5 leading-normal"
        />
        <Button type="submit" size="md" aria-label="Analisar prato" className="mb-0.5">
          <Sparkles aria-hidden="true" />
          <span className="hidden sm:inline">Analisar</span>
        </Button>
      </motion.div>

      <div className="mt-2 flex min-h-5 items-start justify-between gap-3 px-1 text-caption">
        <p id={hintId} className={cn('text-destructive', !showHint && 'invisible')} aria-live="polite">
          Digite um prato ou alguns ingredientes para analisar.
        </p>
        {remaining <= 60 && (
          <span className="tabular-nums text-muted-foreground" aria-live="polite">
            {remaining} restantes
          </span>
        )}
      </div>
    </form>
  )
}
