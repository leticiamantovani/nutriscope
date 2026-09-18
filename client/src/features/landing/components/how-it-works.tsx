import { Keyboard, ScanSearch, MessageSquareText } from "lucide-react";
import { Container } from "@/shared/components/container";

const STEPS = [
  {
    icon: Keyboard,
    title: "Type the product",
    text: "A common name is enough: “instant noodles”, “sandwich cookie”. No sign-up.",
  },
  {
    icon: ScanSearch,
    title: "We read the list",
    text: "Each ingredient is matched against a curated additives database and classified into four levels.",
  },
  {
    icon: MessageSquareText,
    title: "Understand the alerts",
    text: "The AI explains, in plain language, why each item deserves attention.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="py-16 sm:py-20">
      <Container>
        <div className="mb-8 max-w-xl space-y-2">
          <h2 id="how-title" className="text-heading">
            How it works
          </h2>
          <p className="text-muted-foreground">
            One flow, three steps, no menus.
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
