import { BrandLogo } from "./brand-logo";
import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 py-10">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <BrandLogo className="text-foreground" />
          <p className="max-w-sm text-small text-muted-foreground">
            Leitura crítica da lista de ingredientes de alimentos
            industrializados. Não é um contador de calorias.
          </p>
        </div>
        <p className="max-w-md text-small text-muted-foreground">
          As classificações são informativas e baseadas em fontes públicas
          sobre aditivos alimentares. Elas não substituem orientação de
          nutricionista ou médico.
        </p>
      </Container>
    </footer>
  );
}
