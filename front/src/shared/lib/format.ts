const integerFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 })

/** Formata inteiros no padrão pt-BR (1.240). */
export function formatInteger(value: number): string {
  return integerFormatter.format(Math.round(value))
}
