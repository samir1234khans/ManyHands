import type { Route } from "next";

const AUTH_INTERNAL_PATHS = ["/auth/callback", "/auth/start", "/auth/error"] as const;

export function sanitizeReturnPath(value: unknown, fallback = "/"): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const candidate = value.trim();

  if (!candidate.startsWith("/") || candidate.startsWith("//") || candidate.includes("\\")) {
    return fallback;
  }

  try {
    const parsed = new URL(candidate, "https://manyhands.invalid");

    if (parsed.origin !== "https://manyhands.invalid") {
      return fallback;
    }

    if (AUTH_INTERNAL_PATHS.some((path) => parsed.pathname.startsWith(path))) {
      return fallback;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export function createSignInPath(nextPath: string, reason: string): Route {
  const search = new URLSearchParams({
    next: sanitizeReturnPath(nextPath, "/profile"),
    reason,
  });

  return `/auth/sign-in?${search.toString()}` as Route;
}
