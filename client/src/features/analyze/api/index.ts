import type { AnalyzeClient } from "./analyze-client";
import { createHttpAnalyzeClient } from "./http/http-analyze-client";
import { createMockAnalyzeClient } from "./mock/mock-analyze-client";

const apiUrl = normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL);

function normalizeApiUrl(value: string | undefined): string | undefined {
  const url = value?.trim().replace(/\/+$/, "");
  if (!url) return undefined;
  // Without a scheme, fetch treats the value as a path on the frontend origin.
  return /^https?:\/\//.test(url) ? url : `https://${url}`;
}

export const analyzeClient: AnalyzeClient = apiUrl
  ? createHttpAnalyzeClient({ baseUrl: apiUrl })
  : createMockAnalyzeClient();

export type { AnalyzeClient, AnalyzeStreamOptions } from "./analyze-client";
export { AnalyzeTransportError } from "./analyze-client";
