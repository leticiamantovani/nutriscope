import type { AnalyzeRequest, AnalyzeStreamEvent, NutriLensApi } from '../types'
import { parseSse } from './sse'

/**
 * Implementação HTTP real. Contrato assumido (ajuste aqui se o backend divergir):
 *
 *   POST {baseUrl}/analyze
 *   Content-Type: application/json   { "query": "..." }
 *   Resposta: text/event-stream, cada mensagem `data: <AnalyzeStreamEvent em JSON>`
 */
export interface HttpApiOptions {
  baseUrl: string
  fetchFn?: typeof fetch
}

export function createHttpApi({ baseUrl, fetchFn = fetch }: HttpApiOptions): NutriLensApi {
  const endpoint = `${baseUrl.replace(/\/$/, '')}/analyze`

  async function* analyze(
    request: AnalyzeRequest,
    signal?: AbortSignal,
  ): AsyncGenerator<AnalyzeStreamEvent> {
    const response = await fetchFn(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify(request),
      signal,
    })

    if (!response.ok) {
      throw new Error(`A API respondeu com status ${response.status}.`)
    }
    if (!response.body) {
      throw new Error('A API não retornou um corpo de resposta em streaming.')
    }

    for await (const message of parseSse(response.body, signal)) {
      const event = safeParse(message.data)
      if (event) yield event
    }
  }

  return { analyze }
}

function safeParse(data: string): AnalyzeStreamEvent | null {
  try {
    const parsed = JSON.parse(data) as Partial<AnalyzeStreamEvent>
    return typeof parsed === 'object' && parsed && 'type' in parsed
      ? (parsed as AnalyzeStreamEvent)
      : null
  } catch {
    return null
  }
}
