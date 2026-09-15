import { Keyboard, ScanSearch, MessageSquareText } from "lucide-react";
import { Container } from "@/shared/components/container";

const STEPS = [
  {
    icon: Keyboard,
    title: "Digite o produto",
    text: "Nome popular basta: “miojo”, “bolacha recheada”. Sem cadastro.",
  },
  {
    icon: ScanSearch,
    title: "Lemos a lista",
    text: "Cada ingrediente é cruzado com uma base curada de aditivos e classificado em quatro níveis.",
  },
  {
    icon: MessageSquareText,
    title: "Entenda os alertas",
    text: "A IA explica, em linguagem simples, por que cada item merece atenção.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" aria-labelledby="how-title" className="py-16 sm:py-20">
      <Container>
        <div className="mb-8 max-w-xl space-y-2">
          <h2 id="how-title" className="text-heading">
            Como funciona
          </h2>
          <p className="text-muted-foreground">
            Um fluxo só, três passos, nenhum menu.
          </p>
        </div>
        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="group rounded-3xl border bg-card p-6 shadow-xs transition-[transform,box-shadow] duration-(--duration-base) ease-(--ease-soft) hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-heading text-heading text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-body font-bold">{step.title}</h3>
                <p className="mt-1 text-small text-muted-foreground">{step.text}</p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
