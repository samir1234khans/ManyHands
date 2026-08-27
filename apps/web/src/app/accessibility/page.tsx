import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "ManyHands accessibility commitments, current limitations, testing approach, and barrier-reporting route.",
  alternates: {
    canonical: "/accessibility",
  },
};

const commitments = [
  "Public exploration remains usable without signing in.",
  "Core actions are operable by keyboard with visible, logical focus.",
  "Status and progress never rely on color, motion, shape, or sound alone.",
  "Reduced-motion, zoom, reflow, forced-colors, narrow screens, and constrained devices are tested as product requirements.",
  "Forms preserve input, identify errors programmatically, and explain how to recover.",
  "Automated checks are combined with manual assistive-technology review.",
] as const;

const usefulReportDetails = [
  "The page or route where the barrier occurred.",
  "What you were trying to understand or complete.",
  "What happened and what you expected instead.",
  "Browser, device, operating system, zoom level, and assistive technology when you are comfortable sharing them.",
  "Privacy-safe reproduction steps, screenshot, or recording when useful.",
] as const;

export default function AccessibilityPage() {
  return (
    <>
      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="/" aria-label="ManyHands home">
            <span className="brand-mark" aria-hidden="true">
              M
            </span>
            <span>ManyHands</span>
          </a>

          <nav className="primary-nav" aria-label="Accessibility page navigation">
            <a href="/">Home</a>
            <a href="#commitments">Commitments</a>
            <a href="#report">Report a barrier</a>
          </nav>
        </div>
      </header>

      <main id="main-content" className="shell content-page" tabIndex={-1}>
        <header className="content-hero">
          <p className="eyebrow">Participation is the product</p>
          <h1>Accessibility at ManyHands</h1>
          <p className="content-lead">
            ManyHands cannot help more people build together if the product itself blocks people who
            use keyboards, assistive technology, zoom, reduced motion, narrow screens, slow devices,
            or limited bandwidth.
          </p>
          <p className="product-boundary">
            Target: WCAG 2.2 Level AA, plus explicit project requirements for constrained devices
            and understandable contributor journeys.
          </p>
        </header>

        <section className="content-section" id="commitments" aria-labelledby="commitments-title">
          <div>
            <p className="section-kicker">Our baseline</p>
            <h2 id="commitments-title">What every core flow must preserve</h2>
          </div>
          <ul className="check-list content-check-list">
            {commitments.map((commitment) => (
              <li key={commitment}>{commitment}</li>
            ))}
          </ul>
        </section>

        <section className="content-section" aria-labelledby="testing-title">
          <div>
            <p className="section-kicker">How we test</p>
            <h2 id="testing-title">Automation catches some failures. People find the rest.</h2>
          </div>
          <div className="prose-stack">
            <p>
              Pull requests run browser-based accessibility scans on representative public routes,
              keyboard and skip-link checks, narrow-layout overflow checks, reduced-motion checks,
              and forced-colors smoke tests. These checks fail the build when an automatically
              detectable violation is introduced.
            </p>
            <p>
              Automated tools cannot decide whether an explanation is understandable, a focus order
              is useful, an announcement is excessive, or a real task is comfortable with a screen
              reader. Core journeys also require documented manual testing.
            </p>
            <a className="text-link" href={siteConfig.accessibilityGuideUrl}>
              Read the engineering and manual test baseline
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className="content-section" aria-labelledby="status-title">
          <div>
            <p className="section-kicker">Current status</p>
            <h2 id="status-title">Pre-alpha, with limitations stated plainly</h2>
          </div>
          <div className="prose-stack">
            <p>
              The public landing page and foundational error/loading states are available now.
              GitHub sign-in, contributor profiles, Problems, Projects, contribution workflows,
              moderation, and stewardship handoff are still being implemented.
            </p>
            <p>
              Each new journey inherits the accessibility baseline and must add route-specific
              keyboard, assistive-technology, reflow, error, and dynamic-update evidence before it
              is considered complete.
            </p>
          </div>
        </section>

        <section
          className="content-section report-section"
          id="report"
          aria-labelledby="report-title"
        >
          <div>
            <p className="section-kicker">Tell us what blocked you</p>
            <h2 id="report-title">Report an accessibility barrier</h2>
            <p>
              A useful report helps us reproduce the barrier without asking you to disclose private
              information.
            </p>
          </div>
          <div>
            <ul className="plain-list">
              {usefulReportDetails.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
            <a className="button button-primary" href={siteConfig.accessibilityReportUrl}>
              Open the accessibility barrier form
              <span aria-hidden="true">↗</span>
            </a>
            <p className="privacy-note">
              Do not include passwords, tokens, private reports, personal data, or exploit details.
              Security-sensitive findings follow the private route in our security policy.
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <p>Accessibility barriers are product defects, not optional polish.</p>
          <nav aria-label="Accessibility resources">
            <a href="/">Home</a>
            <a href={siteConfig.accessibilityGuideUrl}>Accessibility guide</a>
            <a href={siteConfig.securityUrl}>Security policy</a>
            <a href={siteConfig.repositoryUrl}>View source</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
