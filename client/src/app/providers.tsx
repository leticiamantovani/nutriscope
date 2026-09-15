"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { useState, type ReactNode } from "react";
import { TooltipProvider } from "@/shared/components/ui/tooltip";

/**
 * Client-side providers shared by every route.
 * - TanStack Query orchestrates async/streaming state.
 * - MotionConfig honours the user's reduced-motion preference globally.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: Infinity,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
}
