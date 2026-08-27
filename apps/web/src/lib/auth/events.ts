import "server-only";

export type IdentityEventName =
  | "oauth_start"
  | "oauth_callback"
  | "sign_out"
  | "profile_update"
  | "account_deletion";

export type IdentityEventOutcome = "allowed" | "completed" | "denied" | "failed";

export interface IdentityEvent {
  readonly name: IdentityEventName;
  readonly outcome: IdentityEventOutcome;
  readonly reason?: string;
  readonly route: string;
}

export interface IdentityLogRecord {
  readonly event: "manyhands.identity";
  readonly name: IdentityEventName;
  readonly outcome: IdentityEventOutcome;
  readonly reason?: string;
  readonly route: string;
}

function sanitizeToken(value: string, fallback: string): string {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9_./-]/g, "_");
  return normalized.slice(0, 80) || fallback;
}

export function buildIdentityLogRecord(input: IdentityEvent): IdentityLogRecord {
  const record: IdentityLogRecord = {
    event: "manyhands.identity",
    name: input.name,
    outcome: input.outcome,
    route: sanitizeToken(input.route, "unknown"),
    ...(input.reason ? { reason: sanitizeToken(input.reason, "unspecified") } : {}),
  };

  return record;
}

export function logIdentityEvent(input: IdentityEvent): void {
  console.info(JSON.stringify(buildIdentityLogRecord(input)));
}
