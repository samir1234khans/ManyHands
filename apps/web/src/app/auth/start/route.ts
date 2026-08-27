import { type NextRequest, NextResponse } from "next/server";

import { logIdentityEvent } from "@/lib/auth/events";
import { sanitizeReturnPath } from "@/lib/auth/return-path";
import { getPublicSupabaseConfig, resolveApplicationOrigin } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function errorRedirect(origin: string, reason: string): NextResponse {
  return NextResponse.redirect(
    new URL(`/auth/error?reason=${encodeURIComponent(reason)}`, origin),
    303,
  );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const formData = await request.formData();
  const nextPath = sanitizeReturnPath(formData.get("next"), "/profile");
  const origin = resolveApplicationOrigin(request.url);

  if (!origin || !getPublicSupabaseConfig()) {
    logIdentityEvent({
      name: "oauth_start",
      outcome: "failed",
      reason: "configuration",
      route: "/auth/start",
    });
    return errorRedirect(origin ?? request.nextUrl.origin, "configuration");
  }

  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("next", nextPath);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: callbackUrl.toString(),
    },
  });

  if (error || !data.url) {
    logIdentityEvent({
      name: "oauth_start",
      outcome: "failed",
      reason: "provider_initialization",
      route: "/auth/start",
    });
    return errorRedirect(origin, "provider_unavailable");
  }

  let providerUrl: URL;

  try {
    providerUrl = new URL(data.url);
  } catch {
    logIdentityEvent({
      name: "oauth_start",
      outcome: "failed",
      reason: "invalid_provider_url",
      route: "/auth/start",
    });
    return errorRedirect(origin, "provider_unavailable");
  }

  if (providerUrl.protocol !== "https:" && providerUrl.protocol !== "http:") {
    return errorRedirect(origin, "provider_unavailable");
  }

  logIdentityEvent({ name: "oauth_start", outcome: "allowed", route: "/auth/start" });
  return NextResponse.redirect(providerUrl, 303);
}
