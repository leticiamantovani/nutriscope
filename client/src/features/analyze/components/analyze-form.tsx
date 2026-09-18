"use client";

import { ArrowRight, LoaderCircle, Search } from "lucide-react";
import { useId, useState, type FormEvent, type RefObject } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";

const MIN_QUERY_LENGTH = 2;

export interface AnalyzeFormProps {
  /** Value to seed the input with (e.g. from the URL). */
  defaultValue?: string;
  /** Disables the submit affordance while a run is streaming. */
  isBusy?: boolean;
  onSubmit: (query: string) => void;
  /** Quick-start suggestions rendered under the input. */
  examples?: string[];
  inputRef?: RefObject<HTMLInputElement | null>;
  className?: string;
}

/**
 * The single entry point of the product: one input, one button.
 * Pressing Enter or clicking an example both count as "submit".
 */
export function AnalyzeForm({
  defaultValue = "",
  isBusy = false,
  onSubmit,
  examples = [],
  inputRef,
  className,
}: AnalyzeFormProps) {
  const [value, setValue] = useState(defaultValue);
  const [showHint, setShowHint] = useState(false);
  const inputId = useId();
  const hintId = useId();

  const isValid = value.trim().length >= MIN_QUERY_LENGTH;

  function submit(query: string) {
    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setShowHint(true);
      inputRef?.current?.focus();
      return;
    }
    setShowHint(false);
    onSubmit(trimmed);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    submit(value);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("w-full space-y-3", className)}
      role="search"
      aria-label="Analyze product"
    >
      <label htmlFor={inputId} className="sr-only">
        Packaged food name
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            ref={inputRef}
            id={inputId}
            name="q"
            type="search"
            inputMode="search"
            autoComplete="off"
            enterKeyHint="search"
            placeholder="e.g. sandwich cookie, instant noodles, soda…"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              if (showHint) setShowHint(false);
            }}
            aria-invalid={showHint || undefined}
            aria-describedby={showHint ? hintId : undefined}
            className="h-14 rounded-2xl bg-card pl-12 text-body shadow-sm md:text-body"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-14 rounded-2xl px-6 text-body font-semibold shadow-sm"
          aria-disabled={!isValid}
        >
          {isBusy ? (
            <>
              <LoaderCircle
                data-icon="inline-start"
                className="animate-spin"
                aria-hidden="true"
              />
              Analyzing…
            </>
          ) : (
            <>
              Analyze
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>

      {showHint ? (
        <p id={hintId} className="text-small text-destructive" role="alert">
          Enter a product name (at least {MIN_QUERY_LENGTH} letters).
        </p>
      ) : null}

      {examples.length > 0 ? (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-small text-muted-foreground">
          <span>Try:</span>
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setValue(example);
                submit(example);
              }}
              className="rounded-full border border-border bg-card px-3 py-1 text-small text-foreground transition-colors outline-none hover:border-ring hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {example}
            </button>
          ))}
        </div>
      ) : null}
    </form>
  );
}
