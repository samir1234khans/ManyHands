import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { signOutAction } from "@/app/auth/actions";
import { deleteAccountAction } from "./actions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentAccountContext } from "@/lib/auth/current-account";
import { isRecentSignIn } from "@/lib/auth/recent-sign-in";
import { createSignInPath } from "@/lib/auth/return-path";

export const metadata: Metadata = {
  title: "Account settings",
  description: "Review ManyHands identity, lifecycle state, sign-out, and account deletion.",
};

const errorMessages: Record<string, string> = {
  administration_unavailable:
    "Account administration is not configured in this environment. No deletion request was started.",
  account_inactive: "This account is not active, so the deletion request was not changed.",
  confirmation: "Type DELETE exactly before requesting account deletion.",
  deletion_failed_compensated:
    "Authentication deletion failed. The write lock was removed so your account was not left stranded.",
  deletion_request_failed:
    "The account could not be write-locked safely. No deletion was attempted.",
  recent_authentication_required:
    "Account deletion requires a GitHub sign-in from the last 10 minutes. Sign in again, return here, and review the request.",
};

export default async function SettingsPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ error?: string }> }>) {
  const context = await getCurrentAccountContext();
  if (!context) {
    redirect(createSignInPath("/settings", "account"));
  }

  const parameters = await searchParams;
  const errorMessage = parameters.error ? errorMessages[parameters.error] : null;
  const recentAuthentication = isRecentSignIn(context.user.last_sign_in_at);
  const active = context.status === "active";

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="shell settings-page" tabIndex={-1}>
        <header className="content-hero">
          <p className="eyebrow">Identity and lifecycle</p>
          <h1>Account settings</h1>
          <p className="content-lead">
            GitHub proves the external identity. ManyHands keeps a separate stable account record so
            attribution can survive suspension or deletion without retaining unnecessary personal
            data.
          </p>
        </header>

        {errorMessage ? (
          <div className="form-summary form-summary-error" role="alert">
            <p>{errorMessage}</p>
          </div>
        ) : null}

        <section className="settings-card" aria-labelledby="account-status-title">
          <div>
            <p className="section-kicker">Current state</p>
            <h2 id="account-status-title">{context.status.replaceAll("_", " ")}</h2>
          </div>
          <div className="prose-stack">
            <p>
              {active
                ? "Protected profile actions are available after server-side authorization."
                : context.status === "suspended"
                  ? "Protected writes are disabled, while existing attribution remains intact."
                  : "Protected writes are locked while the deletion request is completed or compensated."}
            </p>
            <p>
              Ordinary GitHub login does not install a repository integration or grant Project
              authority.
            </p>
          </div>
        </section>

        <section className="settings-card" aria-labelledby="session-title">
          <div>
            <p className="section-kicker">Session</p>
            <h2 id="session-title">GitHub identity connected</h2>
          </div>
          <div>
            <p>
              Last verified sign-in:{" "}
              {context.user.last_sign_in_at
                ? new Date(context.user.last_sign_in_at).toLocaleString("en", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "UTC",
                  }) + " UTC"
                : "not available"}
              .
            </p>
            <p>
              Recent authentication for deletion:{" "}
              {recentAuthentication ? "available" : "required again"}.
            </p>
            <form action={signOutAction}>
              <button className="button button-secondary" type="submit">
                Sign out on this device
              </button>
            </form>
          </div>
        </section>

        <section className="settings-card danger-card" aria-labelledby="delete-title">
          <div>
            <p className="section-kicker">Permanent account action</p>
            <h2 id="delete-title">Delete your ManyHands account</h2>
          </div>
          <div className="prose-stack">
            <p>
              Deletion removes the GitHub authentication connection and optional profile data.
              Neutral historical attribution remains where Project integrity requires it.
            </p>
            {active && recentAuthentication ? (
              <form action={deleteAccountAction} className="delete-account-form">
                <div className="form-field">
                  <label htmlFor="confirmation">
                    Type <strong>DELETE</strong> to confirm
                  </label>
                  <input
                    autoComplete="off"
                    id="confirmation"
                    name="confirmation"
                    pattern="DELETE"
                    required
                  />
                </div>
                <button className="button button-danger" type="submit">
                  Request permanent account deletion
                </button>
              </form>
            ) : active ? (
              <form action="/auth/start" method="post">
                <input name="next" type="hidden" value="/settings" />
                <button className="button button-secondary" type="submit">
                  Sign in with GitHub again before deletion
                </button>
              </form>
            ) : (
              <p>The deletion form is unavailable in the current account state.</p>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
