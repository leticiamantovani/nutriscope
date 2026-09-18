# NutriLens — frontend

NutriLens UI: the user types the name of a packaged food and receives, in a stream, the ingredient list classified into four verdicts (**adequate · moderate · avoid · carcinogenic**) plus an AI-generated explanation.

This frontend runs **without a backend**: the data layer uses a mocked client that simulates SSE cadence. Switching to the real API is a one-line change (see [Mock swap point](#mock-swap-point)).

## Running

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # eslint
```

Requires Node 20+.

### Testing every state with the mock

The mock ignores what was typed and always returns the same sample product. To exercise the other states, add `?mock=` to the URL:

| URL                          | State                                                      |
| ---------------------------- | ---------------------------------------------------------- |
| `/?q=noodles`                | Happy path (reading → classifying → explaining → done)     |
| `/?q=noodles&mock=not-found` | Product not found                                          |
| `/?q=noodles&mock=error`     | Network failure before any data                            |
| `/?q=noodles&mock=interrupted` | Stream drops mid-way: partial result + retry             |

The empty state is the landing itself; submitting the form with no text shows inline validation.

## Stack

- **Next.js 16 (App Router)** + TypeScript
- **Tailwind CSS v4** + **shadcn/ui** (components in `src/shared/components/ui`)
- **Framer Motion** for micro-interactions (respects `prefers-reduced-motion`)
- **TanStack Query** (`experimental_streamedQuery`) to orchestrate streaming and cache results per query
- **Lucide** icons

## Structure

```
src/
├── app/                      # Next.js: root layout, providers, routes
│   ├── (routes)/page.tsx     # only MVP route (landing + result)
│   ├── (routes)/error.tsx    # route error boundary
│   ├── not-found.tsx
│   ├── providers.tsx         # QueryClient, MotionConfig, TooltipProvider
│   └── globals.css           # imports Tailwind + tokens
├── features/
│   ├── analyze/              # input → streaming → result flow
│   │   ├── api/              # ← data layer (mock / http)
│   │   ├── model/            # contract, stream reducer, verdict metadata
│   │   ├── hooks/            # useAnalyze (TanStack), useQueryParam (?q=)
│   │   └── components/       # form, chips, legend, progress, states
│   └── landing/              # hero copy, illustration, below-the-fold sections
└── shared/
    ├── components/           # header, footer, container, empty-state, ui/ (shadcn)
    ├── design-system/        # tokens.css (colors, typography, radius) + fonts.ts
    └── lib/utils.ts          # token-aware cn()
```

## Mock swap point

Everything that talks to "the server" goes through the `AnalyzeClient` interface ([src/features/analyze/api/analyze-client.ts](src/features/analyze/api/analyze-client.ts)):

```ts
interface AnalyzeClient {
  stream(request: AnalyzeRequest, options?: { signal?: AbortSignal }): AsyncIterable<AnalyzeStreamEvent>;
}
```

The instance used by the UI is chosen in **a single file**: [src/features/analyze/api/index.ts](src/features/analyze/api/index.ts).

```ts
// today
export const analyzeClient: AnalyzeClient = createMockAnalyzeClient();

// when the API exists
export const analyzeClient = createHttpAnalyzeClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
});
```

`createHttpAnalyzeClient` ([api/http/http-analyze-client.ts](src/features/analyze/api/http/http-analyze-client.ts)) is already written: it `POST`s `{baseUrl}/analyze` and reads `text/event-stream`, expecting one JSON `AnalyzeStreamEvent` per `data:` line. Adjust path/parsing there if the final contract differs. No component or hook needs to change.

### Data contract

Defined in [src/features/analyze/model/types.ts](src/features/analyze/model/types.ts):

```ts
type AnalyzeStreamEvent =
  | { type: "token"; content: string }
  | { type: "ingredients"; items: FlaggedIngredient[] }
  | { type: "done" }
  | { type: "error"; message: string };
```

Convention for **product not found**: the backend emits `{ type: "error", message: "NOT_FOUND: ..." }`. The prefix is recognized in `classifyErrorMessage` ([model/analysis.ts](src/features/analyze/model/analysis.ts)) and becomes the dedicated screen. Any other `error` becomes a generic failure with retry. Transport errors (fetch failed, stream dropped) are thrown by the client — if partial data already arrived, the UI shows what came through with an interruption notice.

## Design tokens

All in [src/shared/design-system/tokens.css](src/shared/design-system/tokens.css). Components consume only semantic utilities (`bg-primary`, `text-verdict-avoid`, `text-heading`…); there is no hex/oklch or font name outside that folder.

- **Palette**: orange/coral/mustard + a fresh green accent on a neutral cream.
- **Verdicts** (`--verdict-ok|caution|avoid|danger` + `-soft`/`-border` variants): reserved exclusively for the classification system. Each verdict always appears with icon + label, never color alone. Text/background pairs measured ≥ 4.5:1.
- **Typography**: Nunito (headings) + Inter (body); 4-size scale (`text-display`, `text-heading`, `text-body`, `text-small`). shadcn `text-sm`/`text-xs` are mapped to `text-small`.
- **Radius**: derived from `--radius: 1rem`.

If you add a color or size token, also register it in [src/shared/lib/utils.ts](src/shared/lib/utils.ts) so `cn()` does not treat `text-body` and `text-verdict-*` as a conflict.

## Accessibility

- Streaming progress announced via `role="status"`; explanation in an `aria-live="polite"` region with `aria-busy` during the stream.
- Keyboard-focusable chips, with tooltip and hidden text describing the verdict and source (curated vs. estimated).
- AA contrast verified with axe-core in every state.

## Planned next steps

Label photo input and other data sources land as new `AnalyzeClient` implementations / new input components in `features/analyze`, without changing the result flow.
