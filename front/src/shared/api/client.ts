/**
 * PONTO ÚNICO DE TROCA MOCK -> API REAL
 * -------------------------------------------------------------
 * Todo o app importa `api` daqui. A implementação é escolhida em
 * tempo de build pela variável `VITE_API_BASE_URL`:
 *
 *   - vazia/ausente  -> `mockApi`  (fixtures locais + streaming simulado)
 *   - definida       -> `httpApi`  (fetch + parser SSE, ver ./http)
 *
 * Para integrar o backend basta preencher a env var. Se o contrato do
 * endpoint for diferente do assumido, ajuste apenas `./http/httpApi.ts`.
 */
import { createHttpApi } from './http/httpApi'
import { mockApi } from './mock/mockApi'
import type { NutriLensApi } from './types'

const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

export const api: NutriLensApi = baseUrl ? createHttpApi({ baseUrl }) : mockApi

/** Útil para exibir um aviso de "modo demonstração" na UI. */
export const isMockApi = !baseUrl

export type { AnalyzeRequest, AnalyzeStreamEvent, Macros, NutriLensApi } from './types'
