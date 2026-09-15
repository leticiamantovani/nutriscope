import { Camera, ChefHat, ScanBarcode, type LucideIcon } from 'lucide-react'

import { Container } from '@/shared/components/Container'
import { Badge } from '@/shared/components/ui/badge'

interface Item {
  icon: LucideIcon
  title: string
  description: string
}

const items: Item[] = [
  {
    icon: Camera,
    title: 'Foto dos ingredientes',
    description: 'Aponte a câmera para a geladeira e deixe a IA identificar o que dá para fazer.',
  },
  {
    icon: ScanBarcode,
    title: 'Leitura de rótulos',
    description: 'Escaneie o rótulo e veja quais aditivos são inofensivos e quais merecem atenção.',
  },
  {
    icon: ChefHat,
    title: 'Receitas sob medida',
    description: 'Sugestões de receitas a partir do que você tem, respeitando seus macros.',
  },
]

/** Sinaliza o roadmap sem links mortos: cards informativos, não clicáveis. */
export function Roadmap() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-title">O que vem por aí</h2>
          <p className="mt-2 text-body text-muted-foreground">
            O MVP cobre texto. As próximas etapas ampliam a mesma ideia para outros formatos.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <li key={item.title} className="rounded-xl border border-dashed border-border bg-card/60 p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-md bg-accent-soft text-accent-foreground">
                  <item.icon className="size-5" aria-hidden="true" />
                </span>
                <Badge variant="neutral">Em breve</Badge>
              </div>
              <h3 className="mt-4 font-sans text-body font-semibold">{item.title}</h3>
              <p className="mt-1 text-caption text-muted-foreground text-pretty">{item.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
