import { cn } from "@/shared/lib/utils";

export interface StreamingTextProps {
  text: string;
  /** Shows a caret and marks the region busy for assistive tech. */
  isStreaming: boolean;
  className?: string;
}

/**
 * Renders the AI explanation as it streams. Paragraphs are split on blank
 * lines; a caret marks the insertion point while tokens still arrive.
 * `aria-live` lets screen readers pick up the text once it settles.
 */
export function StreamingText({ text, isStreaming, className }: StreamingTextProps) {
  const paragraphs = text.split(/\n{2,}/);

  return (
    <div
      className={cn("space-y-3 text-body text-foreground/90", className)}
      aria-live="polite"
      aria-busy={isStreaming}
    >
      {paragraphs.map((paragraph, index) => {
        const isLast = index === paragraphs.length - 1;
        return (
          <p key={index} className="whitespace-pre-wrap">
            {paragraph}
            {isLast && isStreaming ? (
              <span
                className="caret-blink ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-[0.2em] bg-primary"
                aria-hidden="true"
              />
            ) : null}
          </p>
        );
      })}
    </div>
  );
}
