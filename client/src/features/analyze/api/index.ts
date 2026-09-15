/**
 * ─────────────────────────────────────────────────────────────────────
 *  DATA LAYER SWITCH POINT
 *  This is the only file to touch when the real backend is ready:
 *  replace `createMockAnalyzeClient()` with the HTTP client below.
 * ─────────────────────────────────────────────────────────────────────
 *
 *  import { createHttpAnalyzeClient } from "./http/http-analyze-client";
 *  export const analyzeClient = createHttpAnalyzeClient({
 *    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
 *  });
 */
import type { AnalyzeClient } from "./analyze-client";
import { createMockAnalyzeClient } from "./mock/mock-analyze-client";

export const analyzeClient: AnalyzeClient = createMockAnalyzeClient();

export type { AnalyzeClient, AnalyzeStreamOptions } from "./analyze-client";
export { AnalyzeTransportError } from "./analyze-client";
