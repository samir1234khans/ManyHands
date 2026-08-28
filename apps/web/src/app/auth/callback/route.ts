import { type NextRequest, NextResponse } from "next/server";

import { logIdentityEvent } from "@/lib/auth/events";
import { sanitizeReturnPath } from "@/lib/auth/return-path";
import { getPublicSupabaseConfig, resolveApplicationOrigin } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function redirectToError(origin: string, reason: string): NextResponse {
  return NextResponse.redirect(
    new URL(`/auth/error?reason=${encodeURIComponent(reason)}`, origin),
    303,
  );
}

function hasGitHubIdentity(appMetadata: Record<string, unknown>): boolean {
  if (appMetadata.provider === "github") {
    return true;
  }

  return Array.isArray(appMetadata.providers) && appMetadata.providers.includes("github");
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const origin = resolveApplicationOrigin(request.url) ?? request.nextUrl.origin;
  const nextPath = sanitizeReturnPath(request.nextUrl.searchParams.get("next"), "/profile");
  const providerError = request.nextUrl.searchParams.get("error");
  const code = request.nextUrl.searchParams.get("code");

  if (providerError) {
    const reason = providerError === "access_denied" ? "provider_denied" : "provider_error";
    logIdentityEvent({
      name: "oauth_callback",
      outcome: "denied",
      reason,
      route: "/auth/callback",
    });
    return redirectToError(origin, reason);
  }

  if (!code || !getPublicSupabaseConfig()) {
    const reason = code ? "configuration" : "missing_code";
    logIdentityEvent({
      name: "oauth_callback",
      outcome: "failed",
      reason,
      route: "/auth/callback",
    });
    return redirectToError(origin, reason);
  }

  const supabase = await createServerSupabaseClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    logIdentityEvent({
      name: "oauth_callback",
      outcome: "failed",
      reason: "exchange_failed",
      route: "/auth/callback",
    });
    return redirectToError(origin, "exchange_failed");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || !hasGitHubIdentity(user.app_metadata)) {
    await supabase.auth.signOut({ scope: "local" });
    logIdentityEvent({
      name: "oauth_callback",
      outcome: "failed",
      reason: "identity_invalid",
      route: "/auth/callback",
    });
    return redirectToError(origin, "identity_invalid");
  }

  logIdentityEvent({ name: "oauth_callback", outcome: "completed", route: "/auth/callback" });
  return NextResponse.redirect(new URL(nextPath, origin), 303);
}
