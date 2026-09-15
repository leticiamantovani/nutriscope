import type { AnalyzeRequest, AnalyzeStreamEvent, NutriLensApi } from '../types'
import { findFixture, normalize } from './fixtures'

/**
 * Mock de streaming que imita a cadência de um SSE real:
 * latência inicial -> macros -> tokens palavra a palavra -> done.
 *
 * Cenários de teste (a query contém a palavra):
 *   "erro"   -> backend responde com evento { type: "error" }
 *   "cortar" -> stream é encerrado no meio, sem "done" (conexão caída)
 *   "lento"  -> latência inicial alta (bom para ver o skeleton)
 */
const INITIAL_LATENCY_MS = 650
const SLOW_LATENCY_MS = 3500
const MACROS_DELAY_MS = 250
const TOKEN_MIN_MS = 18
const TOKEN_JITTER_MS = 40

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(abortError())
    const id = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    const onAbort = () => {
      clearTimeout(id)
      reject(abortError())
    }
    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

function abortError() {
  return new DOMException('The operation was aborted.', 'AbortError')
}

/** Divide o texto em tokens do tamanho de uma palavra, preservando espaços. */
function tokenize(text: string): string[] {
  return text.match(/\S+\s*/g) ?? []
}

async function* analyzeMock(
  request: AnalyzeRequest,
  signal?: AbortSignal,
): AsyncGenerator<AnalyzeStreamEvent> {
  const q = normalize(request.query)
  const fixture = findFixture(request.query)
  const tokens = tokenize(fixture.explanation)

  await sleep(q.includes('lento') ? SLOW_LATENCY_MS : INITIAL_LATENCY_MS, signal)

  if (q.includes('erro')) {
    yield {
      type: 'error',
      message: 'Não consegui analisar esse prato agora. Tente de novo em instantes.',
    }
    return
  }

  await sleep(MACROS_DELAY_MS, signal)
  yield { type: 'macros', ...fixture.macros }

  const cutAt = q.includes('cortar') ? Math.floor(tokens.length * 0.4) : Infinity

  for (let i = 0; i < tokens.length; i++) {
    if (i >= cutAt) return // simula conexão caída: sem "done"
    await sleep(TOKEN_MIN_MS + Math.random() * TOKEN_JITTER_MS, signal)
    yield { type: 'token', content: tokens[i] }
  }

  yield { type: 'done' }
}

export const mockApi: NutriLensApi = {
  analyze: analyzeMock,
}
