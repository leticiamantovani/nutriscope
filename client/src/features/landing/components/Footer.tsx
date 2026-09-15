import { Container } from '@/shared/components/Container'
import { Logo } from '@/shared/components/Logo'

export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <Container className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Logo iconOnly />
        <p className="max-w-lg text-caption text-muted-foreground text-pretty">
          As estimativas são geradas por IA e servem como referência. Não substituem a orientação
          de um profissional de nutrição.
        </p>
        <p className="text-caption text-muted-foreground">© {new Date().getFullYear()} NutriLens</p>
      </Container>
    </footer>
  )
}
