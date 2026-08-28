export type OperationalOutcome = "ok" | "degraded" | "failed";

export interface OperationalEventInput {
  readonly correlationId: string;
  readonly dependency?: "database" | "none";
  readonly durationMs?: number;
  readonly event: "public_export" | "readiness";
  readonly outcome: OperationalOutcome;
  readonly reason?: string;
}

const SENSITIVE_REASON = /(authorization|bearer|cookie|email|password|secret|token)/i;

export function sanitizeOperationalReason(reason: string | undefined): string | undefined {
  if (!reason) {
    return undefined;
  }

  if (SENSITIVE_REASON.test(reason)) {
    return "redacted";
  }

  const normalized = reason
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);

  return normalized || undefined;
}

export function buildOperationalEvent(input: OperationalEventInput) {
  const durationMs =
    typeof input.durationMs === "number" && Number.isFinite(input.durationMs)
      ? Math.max(0, Math.min(Math.round(input.durationMs), 300_000))
      : undefined;
  const reason = sanitizeOperationalReason(input.reason);

  return {
    event: `manyhands.operations.${input.event}`,
    correlation_id: input.correlationId,
    outcome: input.outcome,
    ...(input.dependency ? { dependency: input.dependency } : {}),
    ...(durationMs === undefined ? {} : { duration_ms: durationMs }),
    ...(reason ? { reason } : {}),
  } as const;
}

export function logOperationalEvent(input: OperationalEventInput): void {
  console.info(JSON.stringify(buildOperationalEvent(input)));
}
