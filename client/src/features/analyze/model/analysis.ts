import {
  CLASSIFY_NODES,
  GENERATE_ANSWER,
  NODE_PHASE,
} from "./graph";
import type {
  AnalyzeStreamEvent,
  FlaggedIngredient,
  StreamPhase,
} from "./types";

/**
 * Why a run stopped without a complete result.
 * - `not_found`: backend could not identify the product (specific UX).
 * - `interrupted`: the stream broke after partial data arrived.
 * - `network`: the request never produced data.
 * - `unknown`: anything else the backend reports.
 */
export type AnalyzeFailureKind =
  | "not_found"
  | "interrupted"
  | "network"
  | "unknown";

export interface AnalyzeFailure {
  kind: AnalyzeFailureKind;
  message: string;
}

/** Accumulated result of a streaming run, rebuilt from events. */
export interface Analysis {
  ingredients: FlaggedIngredient[] | null;
  explanation: string;
  done: boolean;
  /** Set when the backend emits an `error` event. */
  failure: AnalyzeFailure | null;
  /** Last graph-node phase from the stream, if the backend sent one. */
  streamPhase: StreamPhase | null;
}

export const EMPTY_ANALYSIS: Analysis = {
  ingredients: null,
  explanation: "",
  done: false,
  failure: null,
  streamPhase: null,
};

/**
 * Pure reducer applied to every stream event.
 * Backend "error" events are data, not exceptions: they end the run
 * with a typed failure so the UI can show a specific message.
 */
export function reduceAnalysis(
  state: Analysis,
  event: AnalyzeStreamEvent,
): Analysis {
  switch (event.type) {
    case "on_chain_start": {
      const phase = event.name ? NODE_PHASE[event.name] : undefined;
      return phase ? { ...state, streamPhase: phase } : state;
    }
    case "on_chain_end": {
      const classify =
        CLASSIFY_NODES.has(event.name ?? "") ||
        CLASSIFY_NODES.has(event.node ?? "");
      if (classify && event.items?.length) {
        return { ...state, ingredients: event.items };
      }
      return state;
    }
    case "on_chat_model_stream": {
      if (event.node === GENERATE_ANSWER && event.content) {
        return { ...state, explanation: state.explanation + event.content };
      }
      return state;
    }
    case "done":
      return { ...state, done: true };
    case "error":
      return {
        ...state,
        failure: classifyErrorMessage(event.message ?? ""),
      };
    default:
      return state;
  }
}

/**
 * Convention with the backend: an `error` event whose message starts with
 * `NOT_FOUND` (optionally followed by `:` and a human message) means the
 * product could not be identified. Everything else is a generic failure.
 */
export function classifyErrorMessage(message: string): AnalyzeFailure {
  const notFound = /^NOT_FOUND(?::\s*(.*))?$/i.exec(message.trim());
  if (notFound) {
    return { kind: "not_found", message: notFound[1] ?? "" };
  }
  return { kind: "unknown", message };
}

/** UI phase derived from data — works the same for mock and real streams. */
export type AnalysisPhase =
  | "idle"
  | "reading"
  | "classifying"
  | "explaining"
  | "done"
  | "failed";

export function derivePhase(input: {
  enabled: boolean;
  fetching: boolean;
  analysis: Analysis | undefined;
  failure: AnalyzeFailure | null;
}): AnalysisPhase {
  const { enabled, fetching, analysis, failure } = input;
  if (!enabled) return "idle";
  if (failure) return "failed";
  if (analysis?.done) return "done";
  if (!fetching) return analysis ? "done" : "idle";
  if (analysis?.streamPhase) return analysis.streamPhase;
  if (!analysis?.ingredients) return "reading";
  if (analysis.explanation.length === 0) return "classifying";
  return "explaining";
}

export function hasPartialData(analysis: Analysis | undefined): boolean {
  return Boolean(
    analysis && (analysis.ingredients || analysis.explanation.length > 0),
  );
}
