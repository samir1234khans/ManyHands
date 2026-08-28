import type { Metadata } from "next";

import { getCurrentAccountContext } from "@/lib/auth/current-account";
import { getPublicSupabaseConfig } from "@/lib/env";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in with GitHub only when a ManyHands action needs durable identity, consent, or account state.",
};

type SignInPageProps = Readonly<{
  searchParams: Promise<{
    returnTo?: string | string[];
  }>;
}>;

function firstString(value: string | string[] | undefined): string | null {
  if (typeof value === "string") return value;
  return Array.isArray(value) && typeof value[0] === "string" ? value[0] : null;
}

function buildStartHref(returnTo: string | null): string {
  if (!returnTo) return "/auth/start";
  const search = new URLSearchParams({ returnTo });
  return `/auth/start?${search.toString()}`;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const [{ returnTo }, account] = await Promise.all([searchParams, getCurrentAccountContext()]);
  const requestedReturn = firstString(returnTo);
  const configured = Boolean(getPublicSupabaseConfig());

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
          <nav className="primary-nav" aria-label="Sign-in navigation">
            <a href="/">Continue browsing</a>
            <a href={siteConfig.repositoryUrl}>View source</a>
          </nav>
        </div>
      </header>

      <main id="main-content" className="shell section" tabIndex={-1}>
        <article className="contribute-card" aria-labelledby="sign-in-title">
          <div>
            <p className="section-kicker">Identity only when it helps</p>
            <h1 id="sign-in-title">
              {account ? "You are already signed in." : "Sign in with GitHub when you need to act."}
            </h1>
            <p>
              Public Problems, Projects, progress, and Contribution Needs remain readable without an
              account. ManyHands asks for identity only when an action needs persistence,
              responsibility, consent, or abuse protection.
            </p>
          </div>

          <section aria-labelledby="permissions-title">
            <h2 id="permissions-title">What ordinary sign-in does—and does not do</h2>
            <ul className="check-list">
              <li>It establishes your GitHub identity through Supabase Auth.</li>
              <li>It creates a private-by-default ManyHands contributor profile.</li>
              <li>It can preserve a safe return to the action that requested sign-in.</li>
              <li>It does not install the ManyHands GitHub App.</li>
              <li>It does not request repository access or permission to push code.</li>
              <li>It does not publish your private GitHub email.</li>
            </ul>
          </section>

          {requestedReturn ? (
            <p className="noscript-note" role="status">
              After a successful sign-in, ManyHands will return you to the protected action when the
              requested path is safe. Unsafe or cross-origin destinations are ignored.
            </p>
          ) : null}

          {account ? (
            <div className="contribute-actions">
              <a className="button button-primary" href="/">
                Return to ManyHands
              </a>
              <form action="/auth/sign-out" method="post">
                <button className="button button-secondary" type="submit">
                  Sign out
                </button>
              </form>
            </div>
          ) : configured ? (
            <div className="contribute-actions">
              <a className="button button-primary" href={buildStartHref(requestedReturn)}>
                Continue to GitHub
                <span aria-hidden="true">↗</span>
              </a>
              <a className="button button-secondary" href="/">
                Not now
              </a>
            </div>
          ) : (
            <div>
              <p className="noscript-note" role="status">
                Sign-in is not configured in this environment. Public browsing still works and no
                secret or internal configuration detail is exposed here.
              </p>
              <div className="contribute-actions">
                <a className="button button-primary" href="/auth/configuration">
                  Read the safe setup status
                </a>
                <a className="button button-secondary" href="/">
                  Continue browsing
                </a>
              </div>
            </div>
          )}
        </article>
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <p>Public learning first. Account-backed actions only when identity is necessary.</p>
          <nav aria-label="Project resources">
            <a href={siteConfig.repositoryUrl}>Source</a>
            <a href={siteConfig.licenseUrl}>{siteConfig.licenseName}</a>
            <a href={siteConfig.roadmapUrl}>Roadmap</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
