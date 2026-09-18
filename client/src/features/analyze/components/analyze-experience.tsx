"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { useAnalyze } from "../hooks/use-analyze";
import { useQueryParam } from "../hooks/use-query-param";
import { AnalysisPanel } from "./analysis-panel";
import { AnalyzeForm } from "./analyze-form";

const EXAMPLES = ["sandwich cookie", "instant noodles", "cola soda", "corn chips"];

export interface AnalyzeExperienceProps {
  /** Hero copy shown while no query is active (eyebrow, title, lead). */
  hero: ReactNode;
  /** Compact heading shown once a result is on screen. */
  compactTitle: ReactNode;
  /** Decorative illustration, hidden after the first query. */
  aside?: ReactNode;
}

/**
 * Owns the whole linear flow: input → streaming result, on one screen.
 * The hero collapses when a query is active so results stay in view.
 */
export function AnalyzeExperience({ hero, compactTitle, aside }: AnalyzeExperienceProps) {
  const [query, setQuery] = useQueryParam("q");
  const { phase, analysis, failure, isStreaming, retry } = useAnalyze(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const hasQuery = Boolean(query);

  // Bring input + result into view once per query, without stealing focus.
  // Targets the block root (its top never moves when the hero collapses).
  useEffect(() => {
    if (!query) return;
    const id = window.setTimeout(() => {
      rootRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 80);
    return () => window.clearTimeout(id);
  }, [query]);

  function focusInput() {
    inputRef.current?.focus();
    inputRef.current?.select();
  }

  return (
    <div ref={rootRef} className="scroll-mt-20 space-y-8">
      <div
        className={cn(
          "grid items-center gap-8",
          !hasQuery && aside && "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]",
        )}
      >
        <motion.div layout="position" className="space-y-6">
          <AnimatePresence mode="wait" initial={false}>
            {hasQuery ? (
              <motion.div
                key="compact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {compactTitle}
              </motion.div>
            ) : (
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {hero}
              </motion.div>
            )}
          </AnimatePresence>

          <AnalyzeForm
            key={query ?? ""}
            defaultValue={query ?? ""}
            isBusy={isStreaming}
            onSubmit={setQuery}
            examples={EXAMPLES}
            inputRef={inputRef}
          />
        </motion.div>

        <AnimatePresence initial={false}>
          {!hasQuery && aside ? (
            <motion.div
              key="aside"
              className="hidden lg:block"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              {aside}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div>
        <AnimatePresence initial={false}>
          {query ? (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <AnalysisPanel
                query={query}
                phase={phase}
                analysis={analysis}
                failure={failure}
                isStreaming={isStreaming}
                onRetry={retry}
                onEdit={focusInput}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
