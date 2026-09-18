"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import type { AnalysisPhase } from "../model/analysis";

const STEPS: { phase: AnalysisPhase; label: string; live: string }[] = [
  { phase: "reading", label: "Reading ingredients", live: "Reading the product ingredients…" },
  { phase: "classifying", label: "Classifying", live: "Classifying each ingredient…" },
  { phase: "explaining", label: "Explaining", live: "Generating the explanation…" },
];

const ORDER: AnalysisPhase[] = ["reading", "classifying", "explaining", "done"];

export interface AnalysisProgressProps {
  phase: AnalysisPhase;
  className?: string;
}

/**
 * Three-step indicator that mirrors the stream: reading → classifying →
 * explaining. The active step pulses; completed steps show a check.
 * A visually hidden status line announces changes to screen readers.
 */
export function AnalysisProgress({ phase, className }: AnalysisProgressProps) {
  const current = ORDER.indexOf(phase);
  const liveText =
    phase === "done"
      ? "Analysis complete."
      : STEPS.find((step) => step.phase === phase)?.live ?? "";

  return (
    <div className={className}>
      <p role="status" className="sr-only">
        {liveText}
      </p>
      <ol className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-hidden="true">
        {STEPS.map((step, index) => {
          const state =
            index < current ? "done" : index === current ? "active" : "pending";
          return (
            <li
              key={step.phase}
              className={cn(
                "flex items-center gap-2 text-small font-medium transition-colors",
                state === "active" && "text-foreground",
                state === "done" && "text-brand-green-strong",
                state === "pending" && "text-muted-foreground/70",
              )}
            >
              <span className="relative flex size-5 items-center justify-center">
                {state === "done" ? (
                  <Check className="size-4" />
                ) : (
                  <>
                    <span
                      className={cn(
                        "size-2.5 rounded-full",
                        state === "active" ? "bg-primary" : "bg-border",
                      )}
                    />
                    {state === "active" ? (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-primary/30"
                        animate={{ scale: [0.6, 1.4], opacity: [0.7, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                      />
                    ) : null}
                  </>
                )}
              </span>
              {step.label}
              {state === "active" ? "…" : ""}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
