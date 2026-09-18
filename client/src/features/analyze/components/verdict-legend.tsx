import { cn } from "@/shared/lib/utils";
import { VERDICTS_BY_SEVERITY, VERDICT_META } from "../model/verdict";

export interface VerdictLegendProps {
  /** `inline` = compact row for the results card; `detailed` = with descriptions. */
  variant?: "inline" | "detailed";
  className?: string;
}

/** Always-visible key for the four verdict levels (icon + color + label). */
export function VerdictLegend({
  variant = "inline",
  className,
}: VerdictLegendProps) {
  return (
    <ul
      aria-label="Verdict legend"
      className={cn(
        variant === "inline"
          ? "flex flex-wrap gap-x-4 gap-y-2"
          : "grid gap-3 sm:grid-cols-2",
        className,
      )}
    >
      {VERDICTS_BY_SEVERITY.map((verdict) => {
        const meta = VERDICT_META[verdict];
        const Icon = meta.icon;
        return (
          <li
            key={verdict}
            className={cn(
              "flex items-start gap-2",
              variant === "detailed" &&
                "rounded-2xl border bg-card p-4 shadow-xs",
            )}
          >
            <span
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full border",
                meta.classes.chip,
                variant === "inline" ? "size-6" : "size-9",
              )}
              aria-hidden="true"
            >
              <Icon className={variant === "inline" ? "size-3.5" : "size-5"} />
            </span>
            <span className="min-w-0">
              <span
                className={cn(
                  "block font-semibold",
                  variant === "inline" ? "text-small leading-6" : "text-body",
                  meta.classes.ink,
                )}
              >
                {meta.label}
              </span>
              {variant === "detailed" ? (
                <span className="block text-small text-muted-foreground">
                  {meta.description}
                </span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
