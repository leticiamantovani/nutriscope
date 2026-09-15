import { PencilLine, Sparkles, Gauge, type LucideIcon } from 'lucide-react'

import { Container } from '@/shared/components/Container'

interface Step {
  icon: LucideIcon
  title: string
  description: string
}

const steps: Step[] = [
  {
    icon: PencilLine,
    title: 'Descreva o prato',
    description: 'Um nome ("feijoada") ou a lista de ingredientes, do jeito que você fala.',
  },
  {
    icon: Sparkles,
    title: 'A IA analisa',
    description: 'O modelo estima porções típicas e cruza com tabelas nutricionais.',
  },
  {
    icon: Gauge,
    title: 'Veja os macros',
    description: 'Calorias, proteína e carboidratos em tempo real, com o porquê de cada número.',
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 border-t border-border bg-cream-200/60 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-title">Como funciona</h2>
          <p className="mt-2 text-body text-muted-foreground">Três passos, nenhuma configuração.</p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="rounded-xl border border-border bg-card p-5 shadow-soft transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-md bg-primary-soft text-orange-700">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-display text-caption font-semibold text-muted-foreground">
                  Passo {i + 1}
                </span>
              </div>
              <h3 className="mt-4 font-sans text-body font-semibold">{step.title}</h3>
              <p className="mt-1 text-caption text-muted-foreground text-pretty">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
