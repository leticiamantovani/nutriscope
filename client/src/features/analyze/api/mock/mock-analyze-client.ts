import {
  CLASSIFY_INGREDIENTS,
  GENERATE_ANSWER,
  GET_INGREDIENTS_INFO,
  STRUCTURED_OUTPUT,
} from "../../model/graph";
import type { AnalyzeStreamEvent } from "../../model/types";
import { AnalyzeTransportError, type AnalyzeClient } from "../analyze-client";
import { SAMPLE_EXPLANATION, SAMPLE_INGREDIENTS } from "./fixtures";

/**
 * Deterministic in-memory stream that mimics SSE cadence.
 * The typed query is ignored on purpose — the goal is to validate UI,
 * not to simulate the AI.
 *
 * Dev-only scenarios (append to the URL): `?mock=not-found`,
 * `?mock=error`, `?mock=interrupted`. Anything else = happy path.
 */
export type MockScenario = "happy" | "not-found" | "error" | "interrupted";

export interface MockAnalyzeClientOptions {
  /** Resolves the scenario per call; defaults to reading `?mock=` from the URL. */
  scenario?: () => MockScenario;
  /** Speed multiplier — `0` makes the stream instant (handy for tests). */
  speed?: number;
}

/** Fixed, cyclic delays so runs are reproducible yet feel organic. */
const TOKEN_CADENCE_MS = [38, 22, 55, 30, 90, 26, 44, 18, 70, 34];
const READING_MS = 900;
const CLASSIFYING_MS = 650;

export function createMockAnalyzeClient(
  options: MockAnalyzeClientOptions = {},
): AnalyzeClient {
  const { scenario = readScenarioFromUrl, speed = 1 } = options;

  return {
    async *stream(_request, { signal } = {}) {
      const wait = (ms: number) => sleep(ms * speed, signal);
      const current = scenario();

      yield chainStart(STRUCTURED_OUTPUT);
      yield chainStart(GET_INGREDIENTS_INFO);
      await wait(READING_MS);
      if (signal?.aborted) return;

      if (current === "error") {
        throw new AnalyzeTransportError("Mock: simulated network failure");
      }
      if (current === "not-found") {
        yield {
          type: "error",
          message: "NOT_FOUND: We could not find that product in the database.",
        } satisfies AnalyzeStreamEvent;
        return;
      }

      yield chainStart(CLASSIFY_INGREDIENTS);
      await wait(CLASSIFYING_MS);
      if (signal?.aborted) return;

      yield {
        type: "on_chain_end",
        name: CLASSIFY_INGREDIENTS,
        node: CLASSIFY_INGREDIENTS,
        items: SAMPLE_INGREDIENTS,
      };
      yield chainStart(GENERATE_ANSWER);

      const chunks = chunkText(SAMPLE_EXPLANATION);
      const cutAt =
        current === "interrupted" ? Math.floor(chunks.length * 0.35) : Infinity;

      for (const [index, content] of chunks.entries()) {
        if (index >= cutAt) {
          throw new AnalyzeTransportError("Mock: connection interrupted");
        }
        yield {
          type: "on_chat_model_stream",
          name: "ChatGoogleGenerativeAI",
          node: GENERATE_ANSWER,
          content,
        };
        await wait(TOKEN_CADENCE_MS[index % TOKEN_CADENCE_MS.length]);
        if (signal?.aborted) return;
      }

      yield { type: "done" };
    },
  };
}

function chainStart(node: string): AnalyzeStreamEvent {
  return { type: "on_chain_start", name: node, node };
}

/** Splits text into word-sized chunks, keeping whitespace attached. */
function chunkText(text: string): string[] {
  return text.match(/\S+\s*/g) ?? [];
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (ms <= 0 || signal?.aborted) return resolve();
    const id = setTimeout(done, ms);
    signal?.addEventListener("abort", done, { once: true });
    function done() {
      clearTimeout(id);
      signal?.removeEventListener("abort", done);
      resolve();
    }
  });
}

function readScenarioFromUrl(): MockScenario {
  if (typeof window === "undefined") return "happy";
  const value = new URLSearchParams(window.location.search).get("mock");
  return value === "not-found" || value === "error" || value === "interrupted"
    ? value
    : "happy";
}
