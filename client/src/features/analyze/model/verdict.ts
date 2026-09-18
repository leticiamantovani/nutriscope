import {
  Biohazard,
  CircleAlert,
  CircleCheck,
  OctagonX,
  type LucideIcon,
} from "lucide-react";
import type { Verdict } from "./types";

export interface VerdictMeta {
  /** Short visible label. */
  label: string;
  /** One-line meaning shown in the legend and tooltips. */
  description: string;
  /** Icon always rendered next to the color (color is never the only cue). */
  icon: LucideIcon;
  /** Higher = more concerning. Drives emphasis and summary ordering. */
  severity: 0 | 1 | 2 | 3;
  /**
   * Tailwind classes bound to the reserved verdict tokens.
   * `chip` styles a badge, `ink` colors text/icons on neutral surfaces.
   */
  classes: {
    chip: string;
    ink: string;
    dot: string;
  };
}

export const VERDICT_META: Record<Verdict, VerdictMeta> = {
  adequate: {
    label: "Adequate",
    description: "A common ingredient with no notable warnings.",
    icon: CircleCheck,
    severity: 0,
    classes: {
      chip: "bg-verdict-ok-soft text-verdict-ok border-verdict-ok-border",
      ink: "text-verdict-ok",
      dot: "bg-verdict-ok",
    },
  },
  moderate: {
    label: "Moderate",
    description: "Fine in small amounts; watch how often you eat it.",
    icon: CircleAlert,
    severity: 1,
    classes: {
      chip: "bg-verdict-caution-soft text-verdict-caution border-verdict-caution-border",
      ink: "text-verdict-caution",
      dot: "bg-verdict-caution",
    },
  },
  avoid: {
    label: "Avoid",
    description: "Linked to negative health effects; better to avoid.",
    icon: OctagonX,
    severity: 2,
    classes: {
      chip: "bg-verdict-avoid-soft text-verdict-avoid border-verdict-avoid-border",
      ink: "text-verdict-avoid",
      dot: "bg-verdict-avoid",
    },
  },
  carcinogenic: {
    label: "Carcinogenic",
    description: "Classified as a possible or probable carcinogen.",
    icon: Biohazard,
    severity: 3,
    classes: {
      chip: "bg-verdict-danger text-verdict-danger-foreground border-verdict-danger-border",
      ink: "text-verdict-danger",
      dot: "bg-verdict-danger",
    },
  },
};

/** Legend/summary order: from most to least concerning. */
export const VERDICTS_BY_SEVERITY: Verdict[] = [
  "carcinogenic",
  "avoid",
  "moderate",
  "adequate",
];

/** Verdicts that must stand out visually in the ingredient list. */
export function isEmphasized(verdict: Verdict): boolean {
  return VERDICT_META[verdict].severity >= 2;
}
