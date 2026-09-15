import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

import { AnalyzeSection } from '@/features/analyze'
import { Container } from '@/shared/components/Container'
import { Badge } from '@/shared/components/ui/badge'
import { HeroDecor } from './HeroDecor'

const fadeUp = (reduce: boolean | null, delay = 0) => ({
  initial: reduce ? false : { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const },
})

/**
 * Hero com o input já na dobra principal: digitar + enviar = primeiro resultado.
 */
export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section id="top" className="relative overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-24">
      <HeroDecor />

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div {...fadeUp(reduce)}>
            <Badge variant="primary">
              <Sparkles aria-hidden="true" />
              Análise nutricional com IA
            </Badge>
          </motion.div>

          <motion.h1 className="mt-5 text-display text-balance" {...fadeUp(reduce, 0.05)}>
            Descubra o que tem no seu prato{' '}
            <span className="text-primary">em segundos</span>.
          </motion.h1>

          <motion.p
            className="mx-auto mt-4 max-w-xl text-body text-muted-foreground text-pretty"
            {...fadeUp(reduce, 0.1)}
          >
            Digite um prato ou uma lista de ingredientes e receba calorias, proteínas e
            carboidratos estimados, com uma explicação clara. Sem cadastro.
          </motion.p>
        </div>

        <motion.div className="mx-auto mt-8 max-w-2xl" {...fadeUp(reduce, 0.15)}>
          <AnalyzeSection />
        </motion.div>
      </Container>
    </section>
  )
}
