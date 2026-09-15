# NutriLens — Frontend

Assistente de nutrição com IA. O usuário descreve um prato (ou lista ingredientes) e recebe,
em streaming, calorias, proteínas e carboidratos estimados com uma explicação curta.

Este diretório contém **apenas o frontend**. O backend será integrado depois; até lá o app
roda de forma independente com um mock local que simula a cadência de um SSE real.

## Rodando

```bash
cd front
npm install
npm run dev        # http://localhost:5173
```

Outros scripts: `npm run build` (typecheck + bundle), `npm run preview`, `npm run lint`.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + primitivos no estilo shadcn/ui (`src/shared/components/ui`)
- Framer Motion (transições, count-up dos macros, cursor de digitação)
- TanStack Query v5 com `experimental_streamedQuery` para orquestrar o stream
- Lucide (ícones outline)

## Estrutura

```
src/
├── app/                      # bootstrap: App + providers (QueryClient)
├── features/
│   ├── analyze/              # fluxo input -> resultado em streaming
│   │   ├── components/       # AnalyzeForm, ResultPanel, MacroCards, StreamingText, ...
│   │   └── hooks/useAnalyze.ts
│   └── landing/              # Header, Hero, HowItWorks, Roadmap, Footer
└── shared/
    ├── api/                  # DATA LAYER (ver abaixo)
    ├── components/           # Logo, Container, ui/* (button, card, badge, alert, skeleton, textarea)
    ├── design-system/        # tokens.css (cores, fontes, radius, sombras, animações) + globals.css
    └── lib/                  # cn(), formatadores
```

Features futuras (foto, rótulos, receitas) entram como novas pastas em `features/`, reutilizando
`shared/api` para transporte e `shared/components` para UI.

## Onde trocar o mock pela API real

Ponto único: **`src/shared/api/client.ts`**.

```
src/shared/api/
├── types.ts          # contrato (AnalyzeRequest, AnalyzeStreamEvent, interface NutriLensApi)
├── client.ts         # escolhe a implementação e exporta `api`  <-- ponto de troca
├── mock/             # fixtures + gerador assíncrono que imita SSE
└── http/             # fetch + parser SSE (já pronto, dormente)
```

A escolha é feita pela env var `VITE_API_BASE_URL` (veja `.env.example`):

| `VITE_API_BASE_URL` | Implementação |
| ------------------- | ------------- |
| vazia / ausente     | `mockApi` — fixtures locais, streaming simulado |
| definida            | `httpApi` — `POST {base}/analyze`, resposta `text/event-stream` |

Contrato assumido pelo client HTTP (ajuste só `http/httpApi.ts` se o backend divergir):

```
POST {VITE_API_BASE_URL}/analyze
Content-Type: application/json
{ "query": "feijoada completa" }

--> text/event-stream, cada mensagem:
data: {"type":"macros","calories":780,"protein":42,"carbs":68}
data: {"type":"token","content":"A feijoada "}
data: {"type":"done"}
```

Nada fora de `shared/api` sabe qual implementação está ativa. O hook `useAnalyze` consome
apenas a interface `NutriLensApi`.

## Estados cobertos

| Estado        | Quando                                   | UI                                             |
| ------------- | ---------------------------------------- | ---------------------------------------------- |
| `idle`        | nada enviado                             | hero + input + sugestões                       |
| `connecting`  | aguardando o primeiro evento             | skeleton nos cards e no texto                  |
| `streaming`   | tokens chegando                          | count-up nos macros, cursor piscando, "Parar"  |
| `done`        | evento `done` recebido                   | badge "Concluído", disclaimer, "Nova análise"  |
| `interrupted` | usuário parou ou stream caiu sem `done`  | conteúdo parcial + alerta + "Tentar novamente" |
| `error`       | evento `error` ou falha de rede          | alerta com mensagem + "Tentar novamente"       |

### Simulando cenários no mock

Inclua a palavra na consulta:

- `erro` — backend responde com `{ type: "error" }`
- `cortar` — stream é encerrado no meio, sem `done`
- `lento` — latência inicial de ~3,5 s (bom para ver o skeleton)

Pratos com fixture dedicada: feijoada, salada caesar, ovos/pão francês, açaí, frango grelhado,
pizza, pão de queijo, strogonoff. Qualquer outro texto gera macros determinísticos a partir do hash.

## Design tokens

Tudo em `src/shared/design-system/tokens.css` (bloco `@theme` do Tailwind v4). Nenhum componente
usa hex ou nome de fonte diretamente — só utilities derivadas dos tokens (`bg-primary`,
`text-macro-protein-foreground`, `font-display`, `rounded-lg`, `shadow-soft`...).

- Paleta: laranja (primária), coral, mostarda, verde-folha (acento), creme (fundo), cacau (texto)
- Tipografia: Fredoka (títulos) + Inter (corpo); exatamente 4 tamanhos — `text-display`,
  `text-title`, `text-body`, `text-caption` (a escala padrão do Tailwind foi desativada)
- Radius: `sm` `md` `lg` `xl` `full`
- Sombras: `soft`, `lift`, `focus`

`src/shared/lib/utils.ts` estende o `tailwind-merge` com esses tokens para que `cn()` não
descarte `text-title` ao encontrar `text-primary`.

## Acessibilidade

- Contraste AA nos textos sobre fundos claros (cores `*-foreground` dos macros são as versões 700)
- Navegação por teclado: Enter envia, Shift+Enter quebra linha; foco visível em todos os controles
- `aria-live="polite"` + `aria-busy` na área de streaming — o leitor de tela anuncia quando o texto
  se estabiliza, sem ler token a token
- `prefers-reduced-motion` desativa animações (Framer `useReducedMotion` + CSS)
