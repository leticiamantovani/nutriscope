import { FlaskConical } from 'lucide-react'

import { isMockApi } from '@/shared/api/client'
import { Container } from '@/shared/components/Container'
import { Logo } from '@/shared/components/Logo'
import { Badge } from '@/shared/components/ui/badge'

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="rounded-md" aria-label="NutriLens — início">
          <Logo />
        </a>
        <nav className="flex items-center gap-4" aria-label="Principal">
          <a
            href="#como-funciona"
            className="hidden rounded-sm text-caption font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            Como funciona
          </a>
          {isMockApi && (
            <Badge variant="neutral" title="Os resultados são simulados localmente, sem chamada a API.">
              <FlaskConical aria-hidden="true" />
              Demo
            </Badge>
          )}
        </nav>
      </Container>
    </header>
  )
}
