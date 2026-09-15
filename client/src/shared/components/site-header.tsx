import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { Container } from "./container";

/** Minimal top bar: brand + one anchor. No menus competing with the input. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <BrandLogo />
        </Link>
        <nav aria-label="Principal">
          <a
            href="#como-funciona"
            className="rounded-md px-2 py-1 text-small font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Como funciona
          </a>
        </nav>
      </Container>
    </header>
  );
}
