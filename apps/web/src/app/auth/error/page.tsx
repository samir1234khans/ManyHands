import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { sanitizeReturnPath } from "@/lib/auth/return-path";

export const metadata: Metadata = {
  title: "Sign-in problem",
  description: "A safe ManyHands sign-in error with a clear recovery path.",
};

const errors: Record<string, { detail: string; title: string }> = {
  configuration: {
    detail: "GitHub sign-in is not configured correctly in this environment. Public browsing still works.",
    title: "Sign-in is not available here yet",
  },
  exchange_failed: {
    detail: "The one-time sign-in code could not be exchanged. It may have expired or already been used.",
    title: "That sign-in link is no longer valid",
  },
  identity_invalid: {
    detail: "ManyHands could not verify a GitHub identity for this session, so the local session was cleared.",
    title: "We could not verify the GitHub account",
  },
  missing_code: {
    detail: "The callback did not include the one-time code required to finish sign-in.",
    title: "The sign-in response was incomplete",
  },
  provider_denied: {
    detail: "GitHub reported that authorization was cancelled or denied. Nothing was connected.",
    title: "GitHub sign-in was cancelled",
  },
  provider_error: {
    detail: "GitHub returned an unexpected provider error. No account change was completed.",
    title: "GitHub could not complete sign-in",
  },
  provider_unavailable: {
    detail: "ManyHands could not begin the GitHub provider flow. Please try again after checking configuration.",
    title: "GitHub sign-in could not start",
  },
};

export default async function AuthErrorPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ next?: string; reason?: string }> }>) {
  const parameters = await searchParams;
  const nextPath = sanitizeReturnPath(parameters.next, "/profile");
  const error = errors[parameters.reason ?? ""] ?? {
    detail: "The sign-in flow stopped safely before a trusted session was established.",
    title: "Sign-in did not complete",
  };
  const retrySearch = new URLSearchParams({ next: nextPath });

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="shell identity-page" tabIndex={-1}>
        <section className="identity-card state-card" aria-labelledby="auth-error-title">
          <p className="eyebrow">Safe failure</p>
          <h1 id="auth-error-title">{error.title}</h1>
          <p className="identity-lead">{error.detail}</p>
          <p>
            No repository permission is installed by ordinary login, and ManyHands does not expose
            provider tokens or private account details in this error page.
          </p>
          <div className="state-actions">
            <a className="button button-primary" href={`/auth/sign-in?${retrySearch.toString()}`}>
              Try GitHub sign-in again
            </a>
            <a className="button button-secondary" href="/">
              Return home
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
