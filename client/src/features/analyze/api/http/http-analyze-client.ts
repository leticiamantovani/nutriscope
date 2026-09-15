import type { AnalyzeRequest, AnalyzeStreamEvent } from "../../model/types";
import { AnalyzeTransportError, type AnalyzeClient } from "../analyze-client";

/**
 * Real transport (NOT wired yet — see ../index.ts).
 * Expects `POST {baseUrl}/analyze` answering `text/event-stream`, each
 * `data:` line carrying one JSON-encoded `AnalyzeStreamEvent`.
 * Adjust the path/parsing here when the backend contract is final.
 */
export interface HttpAnalyzeClientOptions {
  baseUrl: string;
  path?: string;
}

export function createHttpAnalyzeClient({
  baseUrl,
  path = "/analyze",
}: HttpAnalyzeClientOptions): AnalyzeClient {
  return {
    async *stream(request: AnalyzeRequest, { signal } = {}) {
      let response: Response;
      try {
        response = await fetch(`${baseUrl}${path}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify(request),
          signal,
        });
      } catch (cause) {
        throw new AnalyzeTransportError("Não foi possível conectar à API", cause);
      }

      if (!response.ok || !response.body) {
        throw new AnalyzeTransportError(`API respondeu ${response.status}`);
      }

      for await (const data of readSseData(response.body)) {
        yield parseEvent(data);
      }
    },
  };
}

function parseEvent(data: string): AnalyzeStreamEvent {
  try {
    return JSON.parse(data) as AnalyzeStreamEvent;
  } catch (cause) {
    throw new AnalyzeTransportError("Evento SSE inválido", cause);
  }
}

/** Minimal SSE reader: yields the joined `data:` payload of each event. */
async function* readSseData(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let dataLines: string[] = [];

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newline: number;
      while ((newline = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, newline).replace(/\r$/, "");
        buffer = buffer.slice(newline + 1);

        if (line === "") {
          if (dataLines.length) yield dataLines.join("\n");
          dataLines = [];
        } else if (line.startsWith("data:")) {
          dataLines.push(line.slice(5).trimStart());
        }
        // `event:`, `id:`, `retry:` and comments are ignored on purpose.
      }
    }
    if (dataLines.length) yield dataLines.join("\n");
  } finally {
    reader.releaseLock();
  }
}
