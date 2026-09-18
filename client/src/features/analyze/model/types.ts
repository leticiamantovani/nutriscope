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

export type AnalyzeStreamEvent =
  /** Explanation text, arrives incrementally. */
  | { type: "token"; content: string }
  /** Full ingredient list, arrives at once. */
  | { type: "ingredients"; items: FlaggedIngredient[] }
  | { type: "done" }
  | { type: "error"; message: string };
