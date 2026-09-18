"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { Analysis, AnalysisPhase, AnalyzeFailure } from "../model/analysis";
import { ErrorState, InterruptedBanner, NotFoundState } from "./analysis-feedback";
import { AnalysisProgress } from "./analysis-progress";
import { ExplanationSkeleton, IngredientsSkeleton } from "./analysis-skeleton";
import { IngredientList } from "./ingredient-list";
import { StreamingText } from "./streaming-text";
import { VerdictLegend } from "./verdict-legend";

export interface AnalysisPanelProps {
  query: string;
  phase: AnalysisPhase;
  analysis: Analysis | undefined;
  failure: AnalyzeFailure | null;
  isStreaming: boolean;
  onRetry: () => void;
  onEdit: () => void;
}

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] as const },
};

/**
 * Result card for one query. Renders progressively: skeleton → chips →
 * streaming explanation, and swaps to a dedicated state for not-found,
 * transport errors and interrupted streams (which keep partial data).
 */
export function AnalysisPanel({
  query,
  phase,
  analysis,
  failure,
  isStreaming,
  onRetry,
  onEdit,
}: AnalysisPanelProps) {
  const isNotFound = failure?.kind === "not_found";
  const isHardError = failure && (failure.kind === "network" || failure.kind === "unknown");
  const isInterrupted = failure?.kind === "interrupted";

  return (
    <section
      aria-labelledby="analysis-title"
      className="rounded-3xl border bg-card p-5 shadow-sm sm:p-8"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isNotFound ? (
          <motion.div key="not-found" {...fade} className="py-6">
            <h2 id="analysis-title" className="sr-only">
              Product not found
            </h2>
            <NotFoundState query={query} onRetry={onRetry} onEdit={onEdit} />
          </motion.div>
        ) : isHardError ? (
          <motion.div key="error" {...fade} className="py-6">
            <h2 id="analysis-title" className="sr-only">
              Analysis error
            </h2>
            <ErrorState failure={failure} onRetry={onRetry} onEdit={onEdit} />
          </motion.div>
        ) : (
          <motion.div key="result" {...fade} className="space-y-6">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-1">
                <p className="text-small font-medium text-muted-foreground">
                  Result for
                </p>
                <h2 id="analysis-title" className="text-heading break-words">
                  “{query}”
                </h2>
              </div>
              {phase !== "failed" ? (
                <AnalysisProgress phase={phase} className="sm:pt-1" />
              ) : null}
            </header>

            {isInterrupted ? <InterruptedBanner onRetry={onRetry} /> : null}

            <div className="space-y-3">
              <h3 className="text-body font-bold">Ingredients</h3>
              {analysis?.ingredients ? (
                <IngredientList ingredients={analysis.ingredients} />
              ) : (
                <IngredientsSkeleton />
              )}
              <VerdictLegend className="border-t pt-3" />
            </div>

            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-body font-bold">
                <Sparkles className="size-4 text-primary" aria-hidden="true" />
                What to watch
              </h3>
              {analysis && analysis.explanation.length > 0 ? (
                <StreamingText
                  text={analysis.explanation}
                  isStreaming={isStreaming}
                />
              ) : isStreaming ? (
                <ExplanationSkeleton />
              ) : null}
              {phase === "done" ? (
                <p className="text-small text-muted-foreground">
                  Ingredient list from{" "}
                  <a
                    href="https://world.openfoodfacts.org/"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    Open Food Facts
                  </a>
                  . Classifications are informational and may differ from a
                  specific package.
                </p>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
