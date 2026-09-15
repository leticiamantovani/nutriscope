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
  adequado: {
    label: "Adequado",
    description: "Ingrediente comum, sem alertas relevantes.",
    icon: CircleCheck,
    severity: 0,
    classes: {
      chip: "bg-verdict-ok-soft text-verdict-ok border-verdict-ok-border",
      ink: "text-verdict-ok",
      dot: "bg-verdict-ok",
    },
  },
  moderado: {
    label: "Moderado",
    description: "Tudo bem em pequenas quantidades; atenção à frequência.",
    icon: CircleAlert,
    severity: 1,
    classes: {
      chip: "bg-verdict-caution-soft text-verdict-caution border-verdict-caution-border",
      ink: "text-verdict-caution",
      dot: "bg-verdict-caution",
    },
  },
  evitar: {
    label: "Evitar",
    description: "Associado a efeitos negativos à saúde; melhor evitar.",
    icon: OctagonX,
    severity: 2,
    classes: {
      chip: "bg-verdict-avoid-soft text-verdict-avoid border-verdict-avoid-border",
      ink: "text-verdict-avoid",
      dot: "bg-verdict-avoid",
    },
  },
  cancerigeno: {
    label: "Cancerígeno",
    description: "Classificado como possível ou provável cancerígeno.",
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
  "cancerigeno",
  "evitar",
  "moderado",
  "adequado",
];

/** Verdicts that must stand out visually in the ingredient list. */
export function isEmphasized(verdict: Verdict): boolean {
  return VERDICT_META[verdict].severity >= 2;
}
