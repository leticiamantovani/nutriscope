import type { AnalyzeClient } from "./analyze-client";
import { createHttpAnalyzeClient } from "./http/http-analyze-client";
import { createMockAnalyzeClient } from "./mock/mock-analyze-client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const analyzeClient: AnalyzeClient = apiUrl
  ? createHttpAnalyzeClient({ baseUrl: apiUrl })
  : createMockAnalyzeClient();

export type { AnalyzeClient, AnalyzeStreamOptions } from "./analyze-client";
export { AnalyzeTransportError } from "./analyze-client";
