/**
 * Geometric illustration: a product label being read through a lens,
 * with the four verdict dots. Pure SVG bound to design tokens.
 */
export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 420 340"
      className="mx-auto w-full max-w-md"
      role="img"
      aria-label="Ilustração de um rótulo sendo analisado por uma lupa"
    >
      {/* backdrop blob */}
      <path
        d="M70 80c40-60 180-70 250-30s90 140 40 210-190 80-260 30S30 140 70 80Z"
        className="fill-brand-mustard/60"
      />
      {/* label card */}
      <rect x="110" y="60" width="200" height="230" rx="20" className="fill-card stroke-border" strokeWidth="2" />
      <rect x="132" y="86" width="90" height="12" rx="6" className="fill-brand-cocoa/80" />
      <rect x="132" y="108" width="140" height="8" rx="4" className="fill-muted-foreground/40" />
      <rect x="132" y="124" width="120" height="8" rx="4" className="fill-muted-foreground/40" />
      {/* ingredient rows */}
      <g>
        <circle cx="140" cy="158" r="7" className="fill-verdict-ok" />
        <rect x="154" y="153" width="110" height="10" rx="5" className="fill-muted" />
        <circle cx="140" cy="186" r="7" className="fill-verdict-caution" />
        <rect x="154" y="181" width="90" height="10" rx="5" className="fill-muted" />
        <circle cx="140" cy="214" r="7" className="fill-verdict-avoid" />
        <rect x="154" y="209" width="120" height="10" rx="5" className="fill-muted" />
        <circle cx="140" cy="242" r="7" className="fill-verdict-danger" />
        <rect x="154" y="237" width="70" height="10" rx="5" className="fill-muted" />
      </g>
      {/* lens */}
      <circle cx="292" cy="228" r="56" className="fill-brand-orange/25 stroke-brand-cocoa" strokeWidth="6" />
      <circle cx="292" cy="228" r="44" className="fill-card/70" />
      <circle cx="292" cy="228" r="12" className="fill-verdict-danger" />
      <rect x="270" y="226" width="44" height="6" rx="3" className="fill-brand-cocoa/80" transform="rotate(-8 292 228)" />
      <path d="M332 268l38 38" className="stroke-brand-cocoa" strokeWidth="14" strokeLinecap="round" />
      {/* leaf accent */}
      <path d="M52 250c10-40 45-60 80-58-2 36-30 62-80 58Z" className="fill-brand-green" />
      <path d="M60 246c20-16 40-28 62-40" className="stroke-brand-green-strong" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* coral dot */}
      <circle cx="350" cy="90" r="14" className="fill-brand-coral" />
    </svg>
  );
}
