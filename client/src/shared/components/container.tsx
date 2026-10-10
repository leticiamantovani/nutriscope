import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

interface ContainerProps extends ComponentProps<"div"> {
  /** Max content width. `narrow` keeps reading widths comfortable. */
  size?: "default" | "narrow";
}

/** Horizontal page gutter + max width. Mobile-first: 16px side padding minimum. */
export function Container({
  size = "default",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        size === "narrow" ? "max-w-3xl" : "max-w-6xl",
        className,
      )}
      {...props}
    />
  );
}
