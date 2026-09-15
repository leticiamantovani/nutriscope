/** Above-the-fold copy. Kept separate so the analyze flow stays generic. */
export function HeroCopy() {
  return (
    <div className="space-y-4">
      <p className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-small font-semibold text-brand-green-strong">
        Ingredientes, não calorias
      </p>
      <h1 className="text-display">
        Descubra o que realmente tem no rótulo
      </h1>
      <p className="max-w-xl text-body text-muted-foreground">
        Digite o nome de um produto industrializado e veja cada ingrediente
        classificado — <strong className="font-semibold text-foreground">adequado, moderado, evitar ou cancerígeno</strong> —
        com uma explicação clara dos pontos de atenção.
      </p>
    </div>
  );
}

export function HeroCompactTitle() {
  return (
    <h1 className="text-heading">
      Análise de ingredientes
      <span className="block text-small font-medium text-muted-foreground">
        Digite outro produto para comparar.
      </span>
    </h1>
  );
}
