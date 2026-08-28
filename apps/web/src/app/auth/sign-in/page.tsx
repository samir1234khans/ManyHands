import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentAccountContext } from "@/lib/auth/current-account";
import { sanitizeReturnPath } from "@/lib/auth/return-path";
import { getPublicSupabaseConfig } from "@/lib/env";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to ManyHands with GitHub when an action needs durable identity.",
};

const reasonMessages: Record<string, string> = {
  account: "Sign in to manage your ManyHands account.",
  contribute: "Sign in so a project can acknowledge and respond to your contribution offer.",
  follow: "Sign in to keep this follow preference attached to your account.",
  need: "Sign in to add one reversible “I need this” signal.",
  profile: "Sign in to create or update your contributor profile.",
  reauth: "Sign in again before completing this security-sensitive action.",
};

export default async function SignInPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ next?: string; reason?: string }> }>) {
  const parameters = await searchParams;
  const nextPath = sanitizeReturnPath(parameters.next, "/profile");
  const reason = parameters.reason ? reasonMessages[parameters.reason] : null;
  const configured = Boolean(getPublicSupabaseConfig());
  const account = await getCurrentAccountContext();

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="shell identity-page" tabIndex={-1}>
        <section className="identity-card" aria-labelledby="sign-in-title">
          <p className="eyebrow">Identity only when it is useful</p>
          <h1 id="sign-in-title">Sign in with GitHub</h1>
          <p className="identity-lead">
            Public Problems, Projects, progress, and contributor profiles remain readable without an
            account. ManyHands asks you to sign in only when an action must be saved, attributed, or
            protected from abuse.
          </p>

          {reason ? <p className="notice notice-information">{reason}</p> : null}

          {account ? (
            <div className="notice notice-success">
              <p>You are already signed in.</p>
              <a className="button button-primary" href={nextPath}>
                Continue
              </a>
            </div>
          ) : configured ? (
            <form action="/auth/start" method="post">
              <input name="next" type="hidden" value={nextPath} />
              <button className="button button-primary" type="submit">
                Continue with GitHub
                <span aria-hidden="true">→</span>
              </button>
            </form>
          ) : (
            <div className="notice notice-warning" role="status">
              <p>GitHub sign-in is not configured in this environment yet.</p>
              <p>
                You can continue browsing while the local or hosted Supabase and GitHub OAuth
                settings are completed.
              </p>
            </div>
          )}

          <div className="identity-explainer">
            <h2>What this sign-in does</h2>
            <ul className="plain-list">
              <li>Establishes a ManyHands account connected to your GitHub identity.</li>
              <li>Keeps your profile private until you choose another visibility.</li>
              <li>Does not install the ManyHands GitHub App or request repository access.</li>
              <li>Does not publish your GitHub email by default.</li>
            </ul>
          </div>

          <div className="identity-actions">
            <a className="button button-secondary" href={nextPath === "/profile" ? "/" : nextPath}>
              Continue without signing in
            </a>
            <a className="text-link" href="/people">
              Browse public contributors
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
