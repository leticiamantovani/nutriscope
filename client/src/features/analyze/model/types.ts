/**
 * Data contract shared with the backend.
 * Keep this file in sync with the API — it is the only place the wire
 * format is described on the frontend.
 */

export interface AnalyzeRequest {
  /** Name of the industrialised product typed by the user. */
  query: string;
}

export type Verdict = "adequate" | "moderate" | "avoid" | "carcinogenic";

export type IngredientSource = "database" | "estimated";

export interface FlaggedIngredient {
  name: string;
  verdict: Verdict;
  /** `database` = curated source; `estimated` = inferred by the AI. */
  source: IngredientSource;
}

export type StreamPhase = "reading" | "classifying" | "explaining";

/** Product fields exposed by the backend (trimmed Open Food Facts record). */
export interface ProductSummary {
  code: string;
  name: string;
  brands: string;
  url: string;
  nova_group: number | null;
  nutriscore_grade: string | null;
}

/**
 * Client view of the graph state. Partial when it is a node's delta:
 * only the keys the node returned are present.
 */
export interface GraphState {
  /** What the user typed. */
  question?: string;
  search_query?: string;
  product?: ProductSummary | null;
  ingredients?: FlaggedIngredient[];
  answer?: string;
}

/**
 * JSON-safe view of a LangChain `astream_events` event, plus the app-level
 * `done` and `error` events.
 *
 * Graph node events may carry a state projection:
 * - `on_chain_start`: `input`, the state the chain received.
 * - node `on_chain_end`: `update`, the state delta the node wrote.
 * - root `on_chain_end`: final `state`.
 */
export interface AnalyzeStreamEvent {
  type: string;
  name?: string | null;
  node?: string | null;
  content?: string;
  input?: GraphState;
  state?: GraphState;
  update?: GraphState;
  message?: string;
}
