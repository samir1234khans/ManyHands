import { describe, expect, it } from "vitest";

import { resolveCorrelationId } from "../../apps/web/src/lib/operations/correlation";
import {
  buildOperationalEvent,
  sanitizeOperationalReason,
} from "../../apps/web/src/lib/operations/events";
import { buildPublicExport } from "../../apps/web/src/lib/operations/export-contract";

const profile = (handle: string, accountId: string) => ({
  account_id: accountId,
  availability: "open" as const,
  avatar_url: null,
  biography: null,
  display_name: handle.toUpperCase(),
  handle,
  interests: [],
  languages: [],
  non_code_roles: [],
  public_links: [],
  skills: [],
  timezone: null,
  updated_at: "2026-08-28T00:00:00Z",
});

describe("operations helpers", () => {
  it("preserves a bounded safe request identifier", () => {
    expect(resolveCorrelationId("request_42.trace")).toBe("request_42.trace");
  });

  it("replaces untrusted request identifiers", () => {
    const generated = resolveCorrelationId("bad request id with spaces and a token=secret");
    expect(generated).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("redacts sensitive operational reasons", () => {
    expect(sanitizeOperationalReason("Bearer token leaked")).toBe("redacted");
    expect(sanitizeOperationalReason("Database unavailable")).toBe("database_unavailable");
  });

  it("builds bounded structured operational events", () => {
    expect(
      buildOperationalEvent({
        correlationId: "request-1",
        dependency: "database",
        durationMs: 900_000,
        event: "readiness",
        outcome: "degraded",
        reason: "Database unavailable",
      }),
    ).toEqual({
      event: "manyhands.operations.readiness",
      correlation_id: "request-1",
      outcome: "degraded",
      dependency: "database",
      duration_ms: 300_000,
      reason: "database_unavailable",
    });
  });

  it("exports only the supplied public read model in deterministic handle order", () => {
    const payload = buildPublicExport(
      [profile("zeta", "account-z"), profile("alpha", "account-a")],
      "2026-08-28T12:00:00Z",
      "0123456789abcdef0123456789abcdef01234567",
    );

    expect(payload.schema_version).toBe("2026-08-01");
    expect(payload.source.revision).toBe("0123456789abcdef0123456789abcdef01234567");
    expect(payload.data.contributors.map((entry) => entry.handle)).toEqual(["alpha", "zeta"]);
    expect(JSON.stringify(payload)).not.toMatch(/email|token|secret|moderation/i);
  });
});
