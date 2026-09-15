import { VerdictLegend } from "@/features/analyze/components/verdict-legend";
import { Container } from "@/shared/components/container";

export function VerdictExplainer() {
  return (
    <section aria-labelledby="verdict-title" className="bg-brand-sand/60 py-16 sm:py-20">
      <Container>
        <div className="mb-8 max-w-xl space-y-2">
          <h2 id="verdict-title" className="text-heading">
            Quatro níveis, sem ambiguidade
          </h2>
          <p className="text-muted-foreground">
            Cada nível tem cor, ícone e nome próprios — você nunca depende só
            da cor para entender o veredito.
          </p>
        </div>
        <VerdictLegend variant="detailed" />
      </Container>
    </section>
  );
}
