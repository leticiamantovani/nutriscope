/** Above-the-fold copy. Kept separate so the analyze flow stays generic. */
export function HeroCopy() {
  return (
    <div className="space-y-4">
      <p className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-small font-semibold text-brand-green-strong">
        Ingredients, not calories
      </p>
      <h1 className="text-display">
        See what is really on the label
      </h1>
      <p className="max-w-xl text-body text-muted-foreground">
        Type the name of a packaged food and see each ingredient classified
        as <strong className="font-semibold text-foreground">adequate, moderate, avoid, or carcinogenic</strong>{" "}
        — plus a clear explanation of what to watch.
      </p>
    </div>
  );
}

export function HeroCompactTitle() {
  return (
    <h1 className="text-heading">
      Ingredient analysis
      <span className="block text-small font-medium text-muted-foreground">
        Type another product to compare.
      </span>
    </h1>
  );
}
