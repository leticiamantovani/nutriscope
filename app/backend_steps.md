# Implementation plan — Backend MVP (LangChain + LangGraph)

## Contract my backend needs to fulfill

frontend is already built expecting these 4 event types via streaming:

```ts
type AnalyzeStreamEvent =
  | { type: "token"; content: string }
  | { type: "macros"; calories: number; protein: number; carbs: number }
  | { type: "done" }
  | { type: "error"; message: string };
```

Keeping this as my north star through every step below — it's the meeting point between what I'm building and what the frontend already knows how to consume.

---

## Step 0 — Set up the environment

**Goal:** get the Python project ready to take on LangChain and LangGraph without version surprises.

**To research:**
- Package manager (poetry, uv, pip + venv) — pick one, stay consistent.
- LangChain today is modular (`langchain-core`, `langchain-openai`, `langchain-anthropic`, etc). Check current docs before installing the generic `langchain` package — I probably only need specific pieces.

---

## Step 1 — Structured output schema

**Goal:** turn "calories, protein, carbs, explanatory text" into a formal contract the LLM is required to respect.

**To understand:**
- `pydantic.BaseModel` as a schema definition.
- How LangChain exposes `with_structured_output()` to bind that schema to a model call.

**To research:**
- The difference between structured output via the provider's native function/tool calling vs. manual JSON parsing — this changes how reliable the result is.

**My decision:** how granular the schema should be for now (e.g. is it worth leaving room for a confidence or source field, even if unused right now?).

---

## Step 2 — Minimal graph in LangGraph

**Goal:** start in graph form even though it's simple now, so it grows without a rewrite once vision and RAG come in.

**To understand:**
- The `State` concept shared between nodes (TypedDict or Pydantic).
- Nodes as functions that receive and return the state.
- `StateGraph`, `add_node`, `add_edge`, `compile()`.

**To research:**
- LangGraph's "graph state" docs — there's more than one way to manage how state updates between nodes (reducers). Worth understanding before I lock into an approach, since it shapes how I structure future nodes.

**My decision:** how many nodes make sense right now — a single node doing everything, or already splitting into something like "prepare input" / "generate response"? That's mine to figure out.

---

## Step 3 — Wire the LLM into the graph with structured output

**Goal:** inside the node, call the model and get back a typed response per the Step 1 schema.

**To understand:**
- Binding the schema to the model call.
- What to do when the model doesn't return exactly the expected format (it happens) — validation and possible retry.

**To research:**
- Retry/validation patterns on top of structured output — usually involves re-prompting the model showing it the validation error.

---

## Step 4 — Expose via API

**Goal:** a route that receives the text query and triggers the graph.

**To understand:**
- Async endpoints in Python (`async def`) — important before I get to Step 5, since streaming depends on it.

**My decision:** web framework (FastAPI is the most common choice for this kind of streaming in Python, but it's up to me).

At this stage, keep the response synchronous (wait for the full result and return it all at once). Not mixing "get the graph working" with "get streaming working" in the same step — otherwise it'll be harder to tell which part broke if something goes wrong.

---

## Step 5 — SSE streaming

**Goal:** convert LangGraph's internal events into my 4 contract event types (`token`, `macros`, `done`, `error`).

**To understand:**
- How to consume the graph in streaming mode (more than one way — event by event, or by state update).
- How to return this as `text/event-stream`.

**To research:**
- LangGraph's different `stream_mode`s (`values`, `updates`, `messages`) — each gives a different data shape on every callback, and that decides how my conversion function to the frontend's SSE format ends up looking.

**Watch out for:** an error mid-stream needs to become an explicit `error` event sent to the frontend — can't just drop the connection without notice.

---

## Step 6 — End-to-end integration

**Goal:** swap the fixed mock in Next.js for the real call.

**Validation checklist:**
- The event types match exactly what the frontend expects.
- Streaming doesn't freeze the UI while it's coming in.
- A deliberate error (e.g. killing the API mid-stream) correctly shows up as an error state in the frontend, not a frozen screen.

---

## Step 7 — Observability

**Goal:** have traceability from the start, not only once something has already broken.

**To understand:**
- LangSmith connects via environment variables, no manual instrumentation needed for basic tracing.

**To research:**
- How tracing shows up specifically for LangGraph graphs (the integration is native) — worth checking the dashboard with the simple MVP running, before I need to debug something more complex later.

---

## Left open on purpose

- Project folder structure
- Graph topology (how many nodes, how to split responsibilities)
- Web framework
- Structured output retry/validation strategy

These are architecture decisions — the plan gets me to the point of deciding, it doesn't decide for me.