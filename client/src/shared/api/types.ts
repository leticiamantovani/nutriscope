/**
 * Contrato de dados compartilhado entre frontend e backend.
 * Qualquer mudança aqui deve ser espelhada na API real.
 */

export interface AnalyzeRequest {
  /** Nome do prato ou lista de ingredientes. */
  query: string
}

export interface Macros {
  calories: number
  protein: number
  carbs: number
}

export type AnalyzeStreamEvent =
  | { type: 'token'; content: string }
  | { type: 'macros'; calories: number; protein: number; carbs: number }
  | { type: 'done' }
  | { type: 'error'; message: string }

/**
 * Interface que toda implementação da API (mock ou HTTP) precisa cumprir.
 * Features consomem somente esta interface — nunca a implementação.
 */
export interface NutriLensApi {
  /**
   * Analisa um prato e devolve os eventos em streaming.
   * Deve respeitar `signal` para cancelamento (usuário parou, nova busca, unmount).
   */
  analyze(request: AnalyzeRequest, signal?: AbortSignal): AsyncIterable<AnalyzeStreamEvent>
}
