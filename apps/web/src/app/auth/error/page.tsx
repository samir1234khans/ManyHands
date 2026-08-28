import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getAuthenticationMessage,
  type AuthenticationErrorCode,
} from "@/lib/auth/messages";
import { sanitizeReturnPath } from "@/lib/auth/return-path";

export const metadata: Metadata = {
  title: "Sign-in problem",
  description: "A safe ManyHands sign-in error with a clear recovery path.",
};

const legacyReasonCodes: Record<string, AuthenticationErrorCode> = {
  configuration: "configuration",
  exchange_failed: "callback_invalid",
  identity_invalid: "session_revoked",
  missing_code: "callback_invalid",
  provider_denied: "access_denied",
  provider_error: "unknown",
  provider_unavailable: "unknown",
};

function resolvePublicErrorCode(code: string | undefined, reason: string | undefined): unknown {
  return code ?? legacyReasonCodes[reason ?? ""] ?? "unknown";
}

function buildPublicRetryHref(nextValue: string | undefined, nextPath: string): string {
  if (!nextValue) {
    return "/sign-in";
  }

  const search = new URLSearchParams({ returnTo: nextPath });
  return `/sign-in?${search.toString()}`;
}

export default async function AuthErrorPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ code?: string; next?: string; reason?: string }>;
}>) {
  const parameters = await searchParams;
  const nextPath = sanitizeReturnPath(parameters.next, "/profile");
  const message = getAuthenticationMessage(
    resolvePublicErrorCode(parameters.code, parameters.reason),
  );
  const usesLegacyRoute = !parameters.code && Boolean(parameters.reason);
  const legacyRetrySearch = new URLSearchParams({ next: nextPath });
  const retryHref = usesLegacyRoute
    ? `/auth/sign-in?${legacyRetrySearch.toString()}`
    : message.code === "configuration"
      ? "/auth/configuration"
      : buildPublicRetryHref(parameters.next, nextPath);
  const retryLabel = usesLegacyRoute ? "Try GitHub sign-in again" : message.actionLabel;

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="shell identity-page" tabIndex={-1}>
        <section className="identity-card state-card" aria-labelledby="auth-error-title">
          <p className="eyebrow">Safe failure</p>
          <h1 id="auth-error-title">{message.title}</h1>
          <p className="identity-lead">{message.description}</p>
          <p>
            No repository permission is installed by ordinary login, and ManyHands does not expose
            provider responses, callback codes, tokens, private email, or private account details on
            this page.
          </p>
          <div className="state-actions">
            <a className="button button-primary" href={retryHref}>
              {retryLabel}
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
