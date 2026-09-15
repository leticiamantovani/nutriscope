/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL da API real. Vazio/ausente => usa o mock local. */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
