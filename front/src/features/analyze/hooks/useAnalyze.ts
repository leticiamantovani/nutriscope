import {
  CancelledError,
  experimental_streamedQuery as streamedQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useCallback, useState } from 'react'

import { api, type AnalyzeStreamEvent, type Macros } from '@/shared/api/client'

/** Estado acumulado a partir dos eventos do stream (reducer do TanStack Query). */
interface AnalysisData {
  text: string
  macros: Macros | null
  phase: 'streaming' | 'done' | 'error'
  errorMessage?: string
}

const initialValue: AnalysisData = { text: '', macros: null, phase: 'streaming' }

function reduceEvent(acc: AnalysisData, event: AnalyzeStreamEvent): AnalysisData {
  switch (event.type) {
    case 'token':
      return { ...acc, text: acc.text + event.content }
    case 'macros':
      return { ...acc, macros: { calories: event.calories, protein: event.protein, carbs: event.carbs } }
    case 'done':
      return { ...acc, phase: 'done' }
    case 'error':
      return { ...acc, phase: 'error', errorMessage: event.message }
  }
}

/**
 * Estados visíveis pela UI. Todos precisam de tratamento:
 * - idle: nada enviado ainda
 * - connecting: aguardando o primeiro evento (skeleton)
 * - streaming: recebendo tokens
 * - done: stream finalizado com "done"
 * - interrupted: stream parou sem "done" (usuário cancelou ou conexão caiu)
 * - error: backend respondeu erro ou falha de rede
 */
export type AnalyzeStatus = 'idle' | 'connecting' | 'streaming' | 'done' | 'interrupted' | 'error'

const ANALYZE_KEY = 'analyze' as const
const analyzeKey = (query: string) => [ANALYZE_KEY, query] as const

export function useAnalyze() {
  const queryClient = useQueryClient()
  const [query, setQuery] = useState<string | null>(null)

  const result = useQuery({
    queryKey: analyzeKey(query ?? ''),
    enabled: query !== null,
    staleTime: Infinity,
    retry: false,
    queryFn: streamedQuery<AnalyzeStreamEvent, AnalysisData, ReturnType<typeof analyzeKey>>({
      // `ctx.signal` é consumido aqui para que cancelQueries aborte o stream.
      streamFn: (ctx) => api.analyze({ query: ctx.queryKey[1] }, ctx.signal),
      reducer: reduceEvent,
      initialValue,
      refetchMode: 'reset',
    }),
  })

  const { data, error, isError, isFetching, refetch } = result

  let status: AnalyzeStatus
  let errorMessage: string | undefined

  if (query === null) {
    status = 'idle'
  } else if (data?.phase === 'error') {
    status = 'error'
    errorMessage = data.errorMessage
  } else if (isError) {
    const cancelledByUser = error instanceof CancelledError || error.name === 'AbortError'
    status = cancelledByUser ? 'interrupted' : 'error'
    errorMessage = cancelledByUser ? undefined : error.message
  } else if (isFetching) {
    status = data ? 'streaming' : 'connecting'
  } else if (data?.phase === 'done') {
    status = 'done'
  } else if (data) {
    status = 'interrupted' // stream terminou sem "done"
  } else {
    status = 'connecting'
  }

  const cancelInFlight = useCallback(
    (revert: boolean) => queryClient.cancelQueries({ queryKey: [ANALYZE_KEY] }, { revert }),
    [queryClient],
  )

  /** Envia uma nova consulta. Re-enviar a mesma consulta força um novo stream. */
  const submit = useCallback(
    (text: string) => {
      const next = text.trim()
      if (!next) return
      if (next === query) {
        void refetch()
        return
      }
      void cancelInFlight(true)
      setQuery(next)
    },
    [cancelInFlight, query, refetch],
  )

  /** Interrompe o stream atual mantendo o conteúdo parcial na tela. */
  const stop = useCallback(() => {
    void cancelInFlight(false)
  }, [cancelInFlight])

  /** Refaz a consulta atual (após erro ou interrupção). */
  const retry = useCallback(() => {
    void refetch()
  }, [refetch])

  /** Volta ao estado inicial. */
  const reset = useCallback(() => {
    void cancelInFlight(true)
    setQuery(null)
  }, [cancelInFlight])

  return {
    query,
    status,
    text: data?.text ?? '',
    macros: data?.macros ?? null,
    errorMessage,
    isBusy: status === 'connecting' || status === 'streaming',
    submit,
    stop,
    retry,
    reset,
  }
}

export type UseAnalyzeReturn = ReturnType<typeof useAnalyze>
