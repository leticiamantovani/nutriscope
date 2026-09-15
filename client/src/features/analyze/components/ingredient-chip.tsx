"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import type { FlaggedIngredient } from "../model/types";
import { VERDICT_META, isEmphasized } from "../model/verdict";

export interface IngredientChipProps {
  ingredient: FlaggedIngredient;
  className?: string;
}

/**
 * Colored badge for one ingredient. The verdict is conveyed by color AND
 * icon AND an accessible label; "evitar"/"cancerígeno" render larger and
 * heavier so they dominate the list. Estimated items get a dashed border
 * plus a sparkle marker.
 */
export function IngredientChip({ ingredient, className }: IngredientChipProps) {
  const meta = VERDICT_META[ingredient.verdict];
  const Icon = meta.icon;
  const emphasized = isEmphasized(ingredient.verdict);
  const estimated = ingredient.source === "estimated";

  const sourceLabel = estimated
    ? "Estimado pela IA — não verificado em fonte curada"
    : "Fonte curada";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.li
          variants={{
            hidden: { opacity: 0, y: 6, scale: 0.96 },
            visible: { opacity: 1, y: 0, scale: 1 },
          }}
          tabIndex={0}
          className={cn(
            "inline-flex max-w-full cursor-default items-center gap-1.5 rounded-full border px-3 py-1.5 text-small font-medium outline-none transition-[box-shadow,transform] duration-(--duration-fast) focus-visible:ring-3 focus-visible:ring-ring/50",
            meta.classes.chip,
            emphasized && "border-2 px-3.5 py-2 text-body font-semibold shadow-sm",
            estimated && "border-dashed",
            className,
          )}
        >
          <Icon
            className={cn("shrink-0", emphasized ? "size-5" : "size-4")}
            aria-hidden="true"
          />
          <span className="truncate">{ingredient.name}</span>
          {estimated ? (
            <Sparkles className="size-3.5 shrink-0 opacity-80" aria-hidden="true" />
          ) : null}
          <span className="sr-only">
            — {meta.label}. {sourceLabel}.
          </span>
        </motion.li>
      </TooltipTrigger>
      <TooltipContent side="top">
        <span className="font-semibold">{meta.label}</span>
        <span aria-hidden="true">·</span>
        <span>{sourceLabel}</span>
      </TooltipContent>
    </Tooltip>
  );
}
