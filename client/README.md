# NutriLens — frontend

Interface do NutriLens: o usuário digita o nome de um produto industrializado e recebe, em streaming, a lista de ingredientes classificada em quatro vereditos (**adequado · moderado · evitar · cancerígeno**) mais uma explicação gerada por IA.

Este frontend roda **sem backend**: a camada de dados usa um client mockado que simula a cadência de um SSE. A troca pela API real é uma mudança de uma linha (ver [Ponto de troca do mock](#ponto-de-troca-do-mock)).

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm run lint       # eslint
```

Requer Node 20+.

### Testando todos os estados com o mock

O mock ignora o que foi digitado e sempre devolve o mesmo produto de exemplo. Para exercitar os outros estados, adicione `?mock=` à URL:

| URL                          | Estado                                                     |
| ---------------------------- | ---------------------------------------------------------- |
| `/?q=miojo`                  | Caminho feliz (lendo → classificando → explicando → pronto) |
| `/?q=miojo&mock=not-found`   | Produto não encontrado                                     |
| `/?q=miojo&mock=error`       | Falha de rede antes de qualquer dado                       |
| `/?q=miojo&mock=interrupted` | Stream cai no meio: mostra resultado parcial + refazer     |

O estado vazio é a própria landing; enviar o formulário sem texto mostra a validação inline.

## Stack

- **Next.js 16 (App Router)** + TypeScript
- **Tailwind CSS v4** + **shadcn/ui** (componentes em `src/shared/components/ui`)
- **Framer Motion** para microinterações (respeita `prefers-reduced-motion`)
- **TanStack Query** (`experimental_streamedQuery`) para orquestrar o streaming e cachear resultados por consulta
- Ícones **Lucide**

## Estrutura

```
src/
├── app/                      # Next.js: layout raiz, providers, rotas
│   ├── (routes)/page.tsx     # única rota do MVP (landing + resultado)
│   ├── (routes)/error.tsx    # error boundary da rota
│   ├── not-found.tsx
│   ├── providers.tsx         # QueryClient, MotionConfig, TooltipProvider
│   └── globals.css           # importa Tailwind + tokens
├── features/
│   ├── analyze/              # fluxo input → streaming → resultado
│   │   ├── api/              # ← camada de dados (mock / http)
│   │   ├── model/            # contrato, reducer do stream, metadados de veredito
│   │   ├── hooks/            # useAnalyze (TanStack), useQueryParam (?q=)
│   │   └── components/       # form, chips, legenda, progresso, estados
│   └── landing/              # copy do hero, ilustração, seções abaixo da dobra
└── shared/
    ├── components/           # header, footer, container, empty-state, ui/ (shadcn)
    ├── design-system/        # tokens.css (cores, tipografia, radius) + fonts.ts
    └── lib/utils.ts          # cn() ciente dos tokens
```

## Ponto de troca do mock

Tudo que fala com "o servidor" passa pela interface `AnalyzeClient` ([src/features/analyze/api/analyze-client.ts](src/features/analyze/api/analyze-client.ts)):

```ts
interface AnalyzeClient {
  stream(request: AnalyzeRequest, options?: { signal?: AbortSignal }): AsyncIterable<AnalyzeStreamEvent>;
}
```

A instância usada pela UI é escolhida em **um único arquivo**: [src/features/analyze/api/index.ts](src/features/analyze/api/index.ts).

```ts
// hoje
export const analyzeClient: AnalyzeClient = createMockAnalyzeClient();

// quando a API existir
export const analyzeClient = createHttpAnalyzeClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
});
```

`createHttpAnalyzeClient` ([api/http/http-analyze-client.ts](src/features/analyze/api/http/http-analyze-client.ts)) já está escrito: faz `POST {baseUrl}/analyze` e lê `text/event-stream`, esperando um `AnalyzeStreamEvent` em JSON por linha `data:`. Ajuste path/parsing ali se o contrato final for diferente. Nenhum componente ou hook precisa mudar.

### Contrato de dados

Definido em [src/features/analyze/model/types.ts](src/features/analyze/model/types.ts):

```ts
type AnalyzeStreamEvent =
  | { type: "token"; content: string }
  | { type: "ingredients"; items: FlaggedIngredient[] }
  | { type: "done" }
  | { type: "error"; message: string };
```

Convenção para **produto não encontrado**: o backend emite `{ type: "error", message: "NOT_FOUND: ..." }`. O prefixo é reconhecido em `classifyErrorMessage` ([model/analysis.ts](src/features/analyze/model/analysis.ts)) e vira a tela específica. Qualquer outro `error` vira falha genérica com retry. Erros de transporte (fetch falhou, stream caiu) são lançados pelo client — se já havia dados parciais, a UI mostra o que chegou com aviso de interrupção.

## Design tokens

Todos em [src/shared/design-system/tokens.css](src/shared/design-system/tokens.css). Componentes consomem só utilitários semânticos (`bg-primary`, `text-verdict-avoid`, `text-heading`…); não há hex/oklch nem nome de fonte fora dessa pasta.

- **Paleta**: laranja/coral/mostarda + verde fresco de acento sobre creme neutro.
- **Vereditos** (`--verdict-ok|caution|avoid|danger` + variantes `-soft`/`-border`): reservados exclusivamente para o sistema de classificação. Cada veredito sempre aparece com ícone + rótulo, nunca só cor. Pares texto/fundo medidos ≥ 4.5:1.
- **Tipografia**: Nunito (títulos) + Inter (corpo); escala de 4 tamanhos (`text-display`, `text-heading`, `text-body`, `text-small`). `text-sm`/`text-xs` do shadcn são mapeados para `text-small`.
- **Radius**: derivado de `--radius: 1rem`.

Se adicionar um token de cor ou tamanho, registre-o também em [src/shared/lib/utils.ts](src/shared/lib/utils.ts) para que `cn()` não trate `text-body` e `text-verdict-*` como conflito.

## Acessibilidade

- Progresso do streaming anunciado via `role="status"`; explicação em região `aria-live="polite"` com `aria-busy` durante o stream.
- Chips focáveis por teclado, com tooltip e texto oculto descrevendo veredito e origem (curada vs. estimada).
- Contraste AA verificado com axe-core em todos os estados.

## Próximos passos previstos

Entrada por foto do rótulo e outras fontes de dado entram como novas implementações de `AnalyzeClient` / novos componentes de entrada em `features/analyze`, sem alterar o fluxo de resultado.
