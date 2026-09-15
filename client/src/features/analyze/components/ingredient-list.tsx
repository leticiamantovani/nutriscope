"use client";

import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import type { FlaggedIngredient, Verdict } from "../model/types";
import { VERDICTS_BY_SEVERITY, VERDICT_META } from "../model/verdict";
import { IngredientChip } from "./ingredient-chip";

export interface IngredientListProps {
  ingredients: FlaggedIngredient[];
  className?: string;
}

/**
 * Chips in label order (first = largest quantity), preceded by a
 * per-verdict tally so the worst findings are visible at a glance.
 */
export function IngredientList({ ingredients, className }: IngredientListProps) {
  const counts = countByVerdict(ingredients);

  return (
    <div className={cn("space-y-4", className)}>
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-small">
        {VERDICTS_BY_SEVERITY.filter((v) => counts[v] > 0).map((verdict) => {
          const meta = VERDICT_META[verdict];
          const Icon = meta.icon;
          return (
            <span
              key={verdict}
              className={cn("inline-flex items-center gap-1.5 font-semibold", meta.classes.ink)}
            >
              <Icon className="size-4" aria-hidden="true" />
              {counts[verdict]} {pluralize(verdict, counts[verdict])}
            </span>
          );
        })}
      </p>

      <motion.ul
        aria-label="Ingredientes classificados"
        className="flex flex-wrap items-center gap-2"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.035 } },
        }}
      >
        {ingredients.map((ingredient, index) => (
          <IngredientChip
            key={`${ingredient.name}-${index}`}
            ingredient={ingredient}
          />
        ))}
      </motion.ul>
    </div>
  );
}

function countByVerdict(items: FlaggedIngredient[]): Record<Verdict, number> {
  const counts: Record<Verdict, number> = {
    adequado: 0,
    moderado: 0,
    evitar: 0,
    cancerigeno: 0,
  };
  for (const item of items) counts[item.verdict] += 1;
  return counts;
}

function pluralize(verdict: Verdict, count: number): string {
  const label = VERDICT_META[verdict].label.toLowerCase();
  if (count === 1) return label;
  return verdict === "evitar" ? "para evitar" : `${label}s`;
}
