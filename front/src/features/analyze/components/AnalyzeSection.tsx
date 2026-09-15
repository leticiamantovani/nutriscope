import { AnimatePresence, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef } from 'react'

import { useAnalyze } from '../hooks/useAnalyze'
import { AnalyzeForm } from './AnalyzeForm'
import { ResultPanel } from './ResultPanel'
import { SuggestionChips } from './SuggestionChips'

const SUGGESTIONS = [
  'Feijoada completa',
  'Salada Caesar com frango',
  '2 ovos, 1 pão francês e café com leite',
  'Açaí na tigela com granola',
] as const

export interface AnalyzeSectionProps {
  className?: string
}

/**
 * Fluxo completo de análise: input -> resultado em streaming.
 * É a única "tela" interativa do MVP e vive dentro da hero da landing.
 */
export function AnalyzeSection({ className }: AnalyzeSectionProps) {
  const analysis = useAnalyze()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const resultRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const { query, status, submit, reset } = analysis

  // Leva o resultado para a viewport quando uma nova consulta começa (mobile principalmente).
  useEffect(() => {
    if (query === null) return
    const id = window.requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' })
    })
    return () => window.cancelAnimationFrame(id)
  }, [query, reduceMotion])

  const handleReset = useCallback(() => {
    reset()
    inputRef.current?.focus()
  }, [reset])

  return (
    <div className={className}>
      <AnalyzeForm onSubmit={submit} inputRef={inputRef} />
      <SuggestionChips suggestions={SUGGESTIONS} onPick={submit} className="mt-4" />

      <AnimatePresence mode="wait">
        {status !== 'idle' && (
          <div key="result" className="mt-8">
            <ResultPanel ref={resultRef} {...analysis} reset={handleReset} />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
