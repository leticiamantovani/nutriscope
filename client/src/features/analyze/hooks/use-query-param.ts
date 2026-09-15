"use client";

import { useCallback, useSyncExternalStore } from "react";

const CHANGE_EVENT = "nutrilens:querychange";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/**
 * Mirrors a single URL search param into React state without a Next.js
 * navigation (no Suspense boundary, no scroll reset). Keeps searches
 * shareable/refreshable while the page stays a single flow.
 * Server snapshot is `null`, so SSR and first client render match.
 */
export function useQueryParam(
  key: string,
): [string | null, (value: string | null) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(key),
    () => null,
  );

  const update = useCallback(
    (next: string | null) => {
      const url = new URL(window.location.href);
      if (next) url.searchParams.set(key, next);
      else url.searchParams.delete(key);
      window.history.replaceState(window.history.state, "", url);
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [key],
  );

  return [value, update];
}
