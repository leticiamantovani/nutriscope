import { Skeleton } from "@/shared/components/ui/skeleton";

/** Chip-shaped placeholders sized like real ingredients, not a spinner. */
export function IngredientsSkeleton() {
  const widths = [112, 64, 168, 96, 128, 56, 144, 120, 88, 104];
  return (
    <div className="space-y-4" aria-hidden="true">
      <Skeleton className="h-5 w-56 rounded-full" />
      <div className="flex flex-wrap gap-2">
        {widths.map((width, index) => (
          <Skeleton
            key={index}
            className="h-9 rounded-full"
            style={{ width }}
          />
        ))}
      </div>
    </div>
  );
}

/** Text-line placeholders for the explanation block. */
export function ExplanationSkeleton() {
  return (
    <div className="space-y-2.5" aria-hidden="true">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
