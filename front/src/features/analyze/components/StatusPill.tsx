import { AlertCircle, Check, PauseCircle } from 'lucide-react'

import { Badge } from '@/shared/components/ui/badge'
import type { AnalyzeStatus } from '../hooks/useAnalyze'

export interface StatusPillProps {
  status: AnalyzeStatus
}

/** Indicador compacto do estado do stream. */
export function StatusPill({ status }: StatusPillProps) {
  switch (status) {
    case 'connecting':
    case 'streaming':
      return (
        <Badge variant="primary" role="status">
          <span aria-hidden="true" className="size-2 rounded-full bg-primary animate-pulse-dot" />
          {status === 'connecting' ? 'Analisando…' : 'Gerando…'}
        </Badge>
      )
    case 'done':
      return (
        <Badge variant="accent" role="status">
          <Check aria-hidden="true" />
          Concluído
        </Badge>
      )
    case 'interrupted':
      return (
        <Badge variant="neutral" role="status">
          <PauseCircle aria-hidden="true" />
          Interrompido
        </Badge>
      )
    case 'error':
      return (
        <Badge variant="destructive" role="status">
          <AlertCircle aria-hidden="true" />
          Erro
        </Badge>
      )
    default:
      return null
  }
}
