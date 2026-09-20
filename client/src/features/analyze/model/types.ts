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

/**
 * Wire event. `type` is the LangChain `astream_events` name
 * (`on_chain_start`, `on_chat_model_stream`, …) or app-level `done` / `error`.
 */
export interface AnalyzeStreamEvent {
  type: string;
  name?: string | null;
  node?: string | null;
  content?: string;
  items?: FlaggedIngredient[];
  message?: string;
}
