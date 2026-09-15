import { Skeleton } from '@/shared/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'

export interface StreamingTextProps {
  text: string
  /** Mostra o cursor piscando e marca a região como ocupada para leitores de tela. */
  streaming: boolean
  /** Antes do primeiro token: skeleton de linhas em vez de área vazia. */
  connecting?: boolean
  className?: string
}

/**
 * Texto que chega token a token, estilo interface de IA.
 * `aria-live="polite"` + `aria-busy` fazem o leitor de tela anunciar o
 * conteúdo quando ele se estabiliza, sem ler cada token.
 */
export function StreamingText({ text, streaming, connecting = false, className }: StreamingTextProps) {
  return (
    <div
      aria-live="polite"
      aria-busy={streaming || connecting}
      className={cn('text-body text-foreground/90 whitespace-pre-wrap text-pretty', className)}
    >
      {connecting && !text ? (
        <div className="space-y-2.5 py-1" aria-hidden="true">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      ) : (
        <>
          {text}
          {streaming && (
            <span
              aria-hidden="true"
              className="ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-[0.2em] rounded-full bg-primary animate-caret"
            />
          )}
        </>
      )}
    </div>
  )
}
