"use client";

import {
  PackageSearch,
  PencilLine,
  RotateCcw,
  Unplug,
  WifiOff,
} from "lucide-react";
import { EmptyState } from "@/shared/components/empty-state";
import { Button } from "@/shared/components/ui/button";
import type { AnalyzeFailure } from "../model/analysis";

interface FeedbackActions {
  onRetry: () => void;
  /** Focuses the input so the user can try a different name. */
  onEdit: () => void;
}

export interface NotFoundStateProps extends FeedbackActions {
  query: string;
}

/** Specific message when the backend cannot identify the product. */
export function NotFoundState({ query, onRetry, onEdit }: NotFoundStateProps) {
  return (
    <EmptyState
      icon={<PackageSearch />}
      title={`We could not find “${query}”`}
      description={
        <>
          Try including the brand and product type (e.g. “filled cookie brand
          X”) or double-check the spelling. If it is a very new product, it
          may not be in the database yet.
        </>
      }
      action={
        <>
          <Button size="lg" onClick={onEdit}>
            <PencilLine data-icon="inline-start" aria-hidden="true" />
            Try another name
          </Button>
          <Button size="lg" variant="outline" onClick={onRetry}>
            <RotateCcw data-icon="inline-start" aria-hidden="true" />
            Search again
          </Button>
        </>
      }
    />
  );
}

export interface ErrorStateProps extends FeedbackActions {
  failure: AnalyzeFailure;
}

/** Generic failure with a clear retry path. */
export function ErrorState({ failure, onRetry, onEdit }: ErrorStateProps) {
  const isNetwork = failure.kind === "network";
  return (
    <EmptyState
      icon={isNetwork ? <WifiOff /> : <Unplug />}
      title={isNetwork ? "We could not connect" : "The analysis failed"}
      description={
        isNetwork
          ? "Check your connection and try again. Nothing was lost — the product you typed is still in the field."
          : failure.message || "An unexpected error occurred while analyzing the product."
      }
      action={
        <>
          <Button size="lg" onClick={onRetry}>
            <RotateCcw data-icon="inline-start" aria-hidden="true" />
            Try again
          </Button>
          <Button size="lg" variant="ghost" onClick={onEdit}>
            Edit search
          </Button>
        </>
      }
    />
  );
}

/** Inline notice shown above partial results when the stream broke. */
export function InterruptedBanner({ onRetry }: Pick<FeedbackActions, "onRetry">) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-2xl border border-border bg-accent px-4 py-3 text-small sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="flex items-start gap-2">
        <Unplug className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>
          <strong className="font-semibold">The connection dropped mid-analysis.</strong>{" "}
          We are showing what arrived so far; the explanation may be incomplete.
        </span>
      </p>
      <Button size="sm" variant="outline" onClick={onRetry} className="shrink-0">
        <RotateCcw data-icon="inline-start" aria-hidden="true" />
        Retry analysis
      </Button>
    </div>
  );
}
