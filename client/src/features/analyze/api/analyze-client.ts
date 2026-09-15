import type { AnalyzeRequest, AnalyzeStreamEvent } from "../model/types";

export interface AnalyzeStreamOptions {
  /** Aborting ends the stream early (navigation, new query, unmount). */
  signal?: AbortSignal;
}

/**
 * The single seam between UI and transport.
 * Any implementation (mock, HTTP/SSE, WebSocket…) must yield events in
 * the shape of `AnalyzeStreamEvent` and stop after `done` or `error`.
 * Transport failures are thrown (not yielded) so the caller can tell
 * "backend said no" apart from "the connection broke".
 */
export interface AnalyzeClient {
  stream(
    request: AnalyzeRequest,
    options?: AnalyzeStreamOptions,
  ): AsyncIterable<AnalyzeStreamEvent>;
}

/** Thrown by clients for transport-level problems. */
export class AnalyzeTransportError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "AnalyzeTransportError";
  }
}
