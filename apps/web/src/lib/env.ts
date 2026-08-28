import "server-only";

export interface PublicSupabaseConfig {
  readonly publishableKey: string;
  readonly url: string;
}

export class ApplicationConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApplicationConfigurationError";
  }
}

function parseHttpOrigin(candidate: string | undefined): string | null {
  if (!candidate) {
    return null;
  }

  try {
    const url = new URL(candidate);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

export function getPublicSupabaseConfig(): PublicSupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !publishableKey || !parseHttpOrigin(url)) {
    return null;
  }

  return { publishableKey, url };
}

export function requirePublicSupabaseConfig(): PublicSupabaseConfig {
  const config = getPublicSupabaseConfig();

  if (!config) {
    throw new ApplicationConfigurationError(
      "Supabase URL and publishable key are required for identity features.",
    );
  }

  return config;
}

export function getServerSupabaseSecret(): string | null {
  return (
    process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || null
  );
}

export function resolveApplicationOrigin(requestUrl?: string): string | null {
  const configuredOrigin = parseHttpOrigin(process.env.SITE_URL);

  if (configuredOrigin) {
    return configuredOrigin;
  }

  if (process.env.NODE_ENV !== "production") {
    return parseHttpOrigin(requestUrl);
  }

  return null;
}
