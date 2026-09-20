import type { StreamPhase } from "./types";

export const STRUCTURED_OUTPUT = "structured_output";
export const GET_INGREDIENTS_INFO = "get_ingredients_info";
export const CLASSIFY_INGREDIENTS = "classify_ingredients";
export const GENERATE_ANSWER = "generate_answer";

export const CLASSIFY_NODES = new Set([
  CLASSIFY_INGREDIENTS,
  "classify_ingredients_node",
]);

export const NODE_PHASE: Record<string, StreamPhase> = {
  [STRUCTURED_OUTPUT]: "reading",
  [GET_INGREDIENTS_INFO]: "reading",
  [CLASSIFY_INGREDIENTS]: "classifying",
  [GENERATE_ANSWER]: "explaining",
};
