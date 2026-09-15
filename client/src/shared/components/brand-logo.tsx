import { cn } from "@/shared/lib/utils";

interface BrandLogoProps {
  className?: string;
  /** Hide the wordmark and render only the lens mark. */
  markOnly?: boolean;
}

/** NutriLens wordmark: a geometric lens over a leaf, drawn with brand tokens. */
export function BrandLogo({ className, markOnly = false }: BrandLogoProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2 font-heading", className)}
    >
      <svg
        viewBox="0 0 32 32"
        className="size-8 shrink-0"
        role="img"
        aria-label="NutriLens"
      >
        <circle cx="14" cy="14" r="11" className="fill-brand-orange" />
        <path
          d="M8 18c2-7 8-10 13-9-1 6-5 9-13 9Z"
          className="fill-brand-green"
        />
        <path
          d="M9 18c3-3 6-5 10-7"
          className="stroke-brand-green-strong"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
        <circle
          cx="14"
          cy="14"
          r="11"
          className="stroke-brand-cocoa"
          strokeWidth="2.4"
          fill="none"
        />
        <path
          d="M22 22l7 7"
          className="stroke-brand-cocoa"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>
      {markOnly ? null : (
        <span className="text-heading leading-none">
          Nutri<span className="text-primary">Lens</span>
        </span>
      )}
    </span>
  );
}
