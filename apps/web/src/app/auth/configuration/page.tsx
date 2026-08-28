import type { Metadata } from "next";

import { getPublicSupabaseConfig } from "@/lib/env";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Sign-in configuration",
  description: "A privacy-safe status page for the ManyHands GitHub authentication environment.",
};

export default function AuthenticationConfigurationPage() {
  const publicConfigurationAvailable = Boolean(getPublicSupabaseConfig());

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
          <nav className="primary-nav" aria-label="Authentication configuration navigation">
            <a href="/sign-in">Sign in</a>
            <a href="/">Home</a>
          </nav>
        </div>
      </header>

      <main id="main-content" className="shell section" tabIndex={-1}>
        <article className="contribute-card" aria-labelledby="configuration-title">
          <div>
            <p className="section-kicker">Safe environment status</p>
            <h1 id="configuration-title">
              {publicConfigurationAvailable
                ? "The public authentication endpoint is configured."
                : "GitHub sign-in is not configured in this environment yet."}
            </h1>
            <p>
              This page intentionally reports only a high-level state. It never displays client
              secrets, service-role keys, callback payloads, token values, private email, or
              deployment internals.
            </p>
          </div>

          <section aria-labelledby="next-title">
            <h2 id="next-title">What you can do</h2>
            <ul className="check-list">
              <li>Continue browsing all public ManyHands information without signing in.</li>
              <li>Run the documented local Supabase and GitHub OAuth setup as a contributor.</li>
              <li>Report a public configuration defect without including any secret value.</li>
            </ul>
          </section>

          <div className="contribute-actions">
            <a className="button button-primary" href="/">
              Continue browsing
            </a>
            <a
              className="button button-secondary"
              href={`${siteConfig.repositoryUrl}/blob/main/docs/AUTHENTICATION.md`}
            >
              Read authentication setup
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
      </main>
    </>
  );
}
