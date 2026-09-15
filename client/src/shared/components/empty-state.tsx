import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface EmptyStateProps {
  /** Optional decorative icon/illustration rendered above the title. */
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  /** Primary (and optionally secondary) call to action. */
  action?: ReactNode;
  className?: string;
}

/** Generic centred message block for empty, error and not-found states. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-md flex-col items-center gap-4 text-center",
        className,
      )}
    >
      {icon ? (
        <div
          className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-foreground [&_svg]:size-7"
          aria-hidden="true"
        >
          {icon}
        </div>
      ) : null}
      <div className="space-y-2">
        <h2 className="text-heading">{title}</h2>
        {description ? (
          <p className="text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {action}
        </div>
      ) : null}
    </div>
  );
}
