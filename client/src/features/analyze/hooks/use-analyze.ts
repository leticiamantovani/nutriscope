"use client";

import {
  experimental_streamedQuery as streamedQuery,
  useQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { analyzeClient } from "../api";
import {
  EMPTY_ANALYSIS,
  derivePhase,
  hasPartialData,
  reduceAnalysis,
  type Analysis,
  type AnalysisPhase,
  type AnalyzeFailure,
} from "../model/analysis";
import type { AnalyzeStreamEvent } from "../model/types";

export interface UseAnalyzeResult {
  phase: AnalysisPhase;
  analysis: Analysis | undefined;
  failure: AnalyzeFailure | null;
  /** True while events are still arriving. */
  isStreaming: boolean;
  /** Re-runs the same query from scratch. */
  retry: () => void;
}

export const analyzeQueryKey = (query: string) => ["analyze", query] as const;

/**
 * Streams an analysis for `query` through TanStack Query.
 * Each event is folded into an `Analysis` as it arrives, so components
 * re-render progressively. Results are cached per query, so repeating a
 * search shows the previous result instantly.
 */
export function useAnalyze(query: string | null): UseAnalyzeResult {
  const enabled = Boolean(query);

  const result = useQuery({
    queryKey: analyzeQueryKey(query ?? ""),
    queryFn: streamedQuery<
      AnalyzeStreamEvent,
      Analysis,
      ReturnType<typeof analyzeQueryKey>
    >({
      streamFn: ({ signal }) =>
        analyzeClient.stream({ query: query ?? "" }, { signal }),
      reducer: reduceAnalysis,
      initialValue: EMPTY_ANALYSIS,
    }),
    enabled,
    gcTime: 5 * 60_000,
  });

  const { data, error, isFetching, refetch } = result;

  const failure = useMemo<AnalyzeFailure | null>(() => {
    if (data?.failure) return data.failure;
    if (!error) return null;
    return hasPartialData(data)
      ? { kind: "interrupted", message: error.message }
      : { kind: "network", message: error.message };
  }, [data, error]);

  const phase = derivePhase({
    enabled,
    fetching: isFetching,
    analysis: data,
    failure,
  });

  return {
    phase,
    analysis: data,
    failure,
    isStreaming: isFetching,
    retry: () => void refetch(),
  };
}
