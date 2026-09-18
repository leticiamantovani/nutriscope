import { BrandLogo } from "./brand-logo";
import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 py-10">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <BrandLogo className="text-foreground" />
          <p className="max-w-sm text-small text-muted-foreground">
            A critical reading of ingredient lists on packaged foods. This
            is not a calorie counter.
          </p>
        </div>
        <p className="max-w-md text-small text-muted-foreground">
          Classifications are informational and based on public sources
          about food additives. They do not replace advice from a
          dietitian or physician. Contains data from{" "}
          <a
            href="https://world.openfoodfacts.org/"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Open Food Facts
          </a>
          , available under the{" "}
          <a
            href="https://opendatacommons.org/licenses/odbl/1-0/"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Open Database License
          </a>
          .
        </p>
      </Container>
    </footer>
  );
}
