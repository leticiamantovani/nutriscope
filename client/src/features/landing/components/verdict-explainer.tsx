import { VerdictLegend } from "@/features/analyze/components/verdict-legend";
import { Container } from "@/shared/components/container";

export function VerdictExplainer() {
  return (
    <section aria-labelledby="verdict-title" className="bg-brand-sand/60 py-16 sm:py-20">
      <Container>
        <div className="mb-8 max-w-xl space-y-2">
          <h2 id="verdict-title" className="text-heading">
            Four levels, no ambiguity
          </h2>
          <p className="text-muted-foreground">
            Each level has its own color, icon, and name — you never rely on
            color alone to understand the verdict.
          </p>
        </div>
        <VerdictLegend variant="detailed" />
      </Container>
    </section>
  );
}
