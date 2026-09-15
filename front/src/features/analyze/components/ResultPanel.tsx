import { motion, useReducedMotion } from 'framer-motion'
import { AlertTriangle, RotateCcw, Square, WifiOff, X } from 'lucide-react'
import type { Ref } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import type { UseAnalyzeReturn } from '../hooks/useAnalyze'
import { MacroCards } from './MacroCards'
import { StatusPill } from './StatusPill'
import { StreamingText } from './StreamingText'

export type ResultPanelProps = Pick<
  UseAnalyzeReturn,
  'query' | 'status' | 'text' | 'macros' | 'errorMessage' | 'stop' | 'retry' | 'reset'
> & {
  ref?: Ref<HTMLElement>
}

/**
 * Painel de resultado. Cobre todos os estados pós-envio:
 * connecting (skeleton) -> streaming (cursor) -> done | interrupted | error.
 */
export function ResultPanel({
  query,
  status,
  text,
  macros,
  errorMessage,
  stop,
  retry,
  reset,
  ref,
}: ResultPanelProps) {
  const reduceMotion = useReducedMotion()
  const isBusy = status === 'connecting' || status === 'streaming'
  const hasContent = Boolean(text) || macros !== null
  // Erro sem nenhum conteúdo parcial: só o alerta, sem cards vazios.
  const showBody = isBusy || hasContent

  return (
    <motion.section
      ref={ref}
      aria-labelledby="result-heading"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="scroll-mt-24"
    >
      <Card className="space-y-6 p-5 sm:p-7">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-caption text-muted-foreground">Resultado para</p>
            <h2 id="result-heading" className="truncate text-title" title={query ?? undefined}>
              {query}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill status={status} />
            {isBusy && (
              <Button variant="ghost" size="sm" onClick={stop}>
                <Square aria-hidden="true" className="fill-current" />
                Parar
              </Button>
            )}
          </div>
        </header>

        {showBody && (
          <>
            <MacroCards macros={macros} />

            <div className="space-y-2">
              <h3 className="font-sans text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                Explicação
              </h3>
              <StreamingText
                text={text}
                streaming={status === 'streaming'}
                connecting={status === 'connecting'}
              />
            </div>
          </>
        )}

        {status === 'interrupted' && (
          <Alert variant="warning">
            <WifiOff aria-hidden="true" />
            <AlertTitle>A análise foi interrompida antes de terminar</AlertTitle>
            <AlertDescription>
              {hasContent
                ? 'O que chegou até aqui está na tela, mas pode estar incompleto.'
                : 'Nenhum dado foi recebido.'}
            </AlertDescription>
            <div className="col-start-2 mt-2 flex flex-wrap gap-2">
              <Button size="sm" onClick={retry}>
                <RotateCcw aria-hidden="true" />
                Tentar novamente
              </Button>
              <Button size="sm" variant="ghost" onClick={reset}>
                <X aria-hidden="true" />
                Nova análise
              </Button>
            </div>
          </Alert>
        )}

        {status === 'error' && (
          <Alert variant="destructive">
            <AlertTriangle aria-hidden="true" />
            <AlertTitle>Não foi possível concluir a análise</AlertTitle>
            <AlertDescription>
              {errorMessage ?? 'Algo deu errado do nosso lado. Nenhuma ação sua causou isso.'}
            </AlertDescription>
            <div className="col-start-2 mt-2 flex flex-wrap gap-2">
              <Button size="sm" onClick={retry}>
                <RotateCcw aria-hidden="true" />
                Tentar novamente
              </Button>
              <Button size="sm" variant="ghost" onClick={reset}>
                <X aria-hidden="true" />
                Nova análise
              </Button>
            </div>
          </Alert>
        )}

        {status === 'done' && (
          <footer className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-caption text-muted-foreground text-pretty">
              Estimativa gerada por IA com base em porções típicas. Não substitui orientação de um
              profissional de nutrição.
            </p>
            <Button variant="secondary" size="sm" onClick={reset} className="shrink-0">
              Nova análise
            </Button>
          </footer>
        )}
      </Card>
    </motion.section>
  )
}
