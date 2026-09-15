import { AnalyzeExperience } from "@/features/analyze/components/analyze-experience";
import { Container } from "@/shared/components/container";
import { SiteFooter } from "@/shared/components/site-footer";
import { SiteHeader } from "@/shared/components/site-header";
import { HeroCompactTitle, HeroCopy } from "./hero-copy";
import { HeroIllustration } from "./hero-illustration";
import { HowItWorks } from "./how-it-works";
import { VerdictExplainer } from "./verdict-explainer";

/**
 * Single-page flow: hero with the live input, results in place,
 * then supporting sections. Nothing above the fold competes with the input.
 */
export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 right-[-10%] size-[28rem] rounded-full bg-brand-orange/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 left-[-10%] size-[24rem] rounded-full bg-brand-green/20 blur-3xl"
          />
          <Container className="relative">
            <AnalyzeExperience
              hero={<HeroCopy />}
              compactTitle={<HeroCompactTitle />}
              aside={<HeroIllustration />}
            />
          </Container>
        </section>
        <HowItWorks />
        <VerdictExplainer />
      </main>
      <SiteFooter />
    </>
  );
}
