"use client";

import {
  PackageSearch,
  PencilLine,
  RotateCcw,
  Unplug,
  WifiOff,
} from "lucide-react";
import { EmptyState } from "@/shared/components/empty-state";
import { Button } from "@/shared/components/ui/button";
import type { AnalyzeFailure } from "../model/analysis";

interface FeedbackActions {
  onRetry: () => void;
  /** Focuses the input so the user can try a different name. */
  onEdit: () => void;
}

export interface NotFoundStateProps extends FeedbackActions {
  query: string;
}

/** Specific message when the backend cannot identify the product. */
export function NotFoundState({ query, onRetry, onEdit }: NotFoundStateProps) {
  return (
    <EmptyState
      icon={<PackageSearch />}
      title={`Não encontramos “${query}”`}
      description={
        <>
          Tente incluir a marca e o tipo do produto (ex.: “biscoito recheado
          marca X”) ou confira a grafia. Se for um produto muito novo, ele
          pode ainda não estar na base.
        </>
      }
      action={
        <>
          <Button size="lg" onClick={onEdit}>
            <PencilLine data-icon="inline-start" aria-hidden="true" />
            Tentar outro nome
          </Button>
          <Button size="lg" variant="outline" onClick={onRetry}>
            <RotateCcw data-icon="inline-start" aria-hidden="true" />
            Buscar de novo
          </Button>
        </>
      }
    />
  );
}

export interface ErrorStateProps extends FeedbackActions {
  failure: AnalyzeFailure;
}

/** Generic failure with a clear retry path. */
export function ErrorState({ failure, onRetry, onEdit }: ErrorStateProps) {
  const isNetwork = failure.kind === "network";
  return (
    <EmptyState
      icon={isNetwork ? <WifiOff /> : <Unplug />}
      title={isNetwork ? "Não conseguimos conectar" : "A análise falhou"}
      description={
        isNetwork
          ? "Verifique sua conexão e tente novamente. Nada foi perdido — o produto que você digitou continua no campo."
          : failure.message || "Ocorreu um erro inesperado ao analisar o produto."
      }
      action={
        <>
          <Button size="lg" onClick={onRetry}>
            <RotateCcw data-icon="inline-start" aria-hidden="true" />
            Tentar novamente
          </Button>
          <Button size="lg" variant="ghost" onClick={onEdit}>
            Editar busca
          </Button>
        </>
      }
    />
  );
}

/** Inline notice shown above partial results when the stream broke. */
export function InterruptedBanner({ onRetry }: Pick<FeedbackActions, "onRetry">) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-2xl border border-border bg-accent px-4 py-3 text-small sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="flex items-start gap-2">
        <Unplug className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>
          <strong className="font-semibold">A conexão caiu no meio da análise.</strong>{" "}
          Mostramos o que chegou até agora; a explicação pode estar incompleta.
        </span>
      </p>
      <Button size="sm" variant="outline" onClick={onRetry} className="shrink-0">
        <RotateCcw data-icon="inline-start" aria-hidden="true" />
        Refazer análise
      </Button>
    </div>
  );
}
