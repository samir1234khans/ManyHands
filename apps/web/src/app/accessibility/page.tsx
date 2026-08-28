import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "The ManyHands accessibility baseline, current commitments, and public barrier-reporting route.",
};

const commitments = [
  "Keyboard access and visible focus for every core action.",
  "Semantic structure and assistive-technology-friendly status and errors.",
  "Readable reflow at narrow widths and high zoom.",
  "Reduced-motion support without removing essential information.",
  "Public content that remains meaningful when JavaScript fails or is disabled.",
  "Manual testing alongside automation for every core journey.",
] as const;

export default function AccessibilityPage() {
  return (
    <>
      <SiteHeader />

      <main
        id="main-content"
        className="shell section"
        aria-labelledby="accessibility-title"
        tabIndex={-1}
      >
        <article className="contribute-card">
          <div>
            <p className="section-kicker">Participation is the product</p>
            <h1 id="accessibility-title">Accessibility at ManyHands</h1>
            <p>
              ManyHands is being built so people can discover, understand, and contribute to
              open-source work using the interaction mode and device that works for them. The
              project targets WCAG 2.2 Level AA for its public and authenticated core journeys.
            </p>
          </div>

          <section aria-labelledby="commitments-title">
            <h2 id="commitments-title">What we commit to</h2>
            <ul className="check-list">
              {commitments.map((commitment) => (
                <li key={commitment}>{commitment}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="testing-title">
            <h2 id="testing-title">How we test</h2>
            <p>
              Automated checks catch regressions, but they cannot prove that a journey is usable.
              Core flows also require keyboard, screen-reader, zoom/reflow, reduced-motion,
              forced-colors, touch, and constrained-network evidence on the exact review candidate.
            </p>
          </section>

          <section aria-labelledby="barrier-title">
            <h2 id="barrier-title">Found a barrier?</h2>
            <p>
              Public accessibility defects can be reported through the dedicated issue form. Do not
              publish private account information, harassment reports, tokens, or security
              vulnerabilities; use the private security route for those.
            </p>
            <div className="contribute-actions">
              <a
                className="button button-primary"
                href={`${siteConfig.repositoryUrl}/issues/new?template=accessibility_barrier.yml`}
              >
                Report an accessibility barrier
                <span aria-hidden="true">↗</span>
              </a>
              <a
                className="button button-secondary"
                href={`${siteConfig.repositoryUrl}/blob/main/docs/ACCESSIBILITY.md`}
              >
                Read the engineering baseline
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
