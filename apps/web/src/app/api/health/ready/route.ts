import { NextResponse } from "next/server";

import { resolveCorrelationId } from "@/lib/operations/correlation";
import { logOperationalEvent } from "@/lib/operations/events";
import { createPublicOperationsClient } from "@/lib/operations/public-supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const correlationId = resolveCorrelationId(request.headers.get("x-request-id"));
  const startedAt = performance.now();
  const client = createPublicOperationsClient();

  if (!client) {
    logOperationalEvent({
      correlationId,
      dependency: "database",
      durationMs: performance.now() - startedAt,
      event: "readiness",
      outcome: "degraded",
      reason: "database_unconfigured",
    });

    return NextResponse.json(
      {
        status: "degraded",
        checks: { database: "unconfigured" },
      },
      {
        status: 503,
        headers: {
          "cache-control": "no-store",
          "x-request-id": correlationId,
        },
      },
    );
  }

  const { error } = await client.from("profile_directory").select("account_id").limit(1);
  const durationMs = performance.now() - startedAt;

  if (error) {
    logOperationalEvent({
      correlationId,
      dependency: "database",
      durationMs,
      event: "readiness",
      outcome: "degraded",
      reason: "database_unavailable",
    });

    return NextResponse.json(
      {
        status: "degraded",
        checks: { database: "unavailable" },
      },
      {
        status: 503,
        headers: {
          "cache-control": "no-store",
          "x-request-id": correlationId,
        },
      },
    );
  }

  logOperationalEvent({
    correlationId,
    dependency: "database",
    durationMs,
    event: "readiness",
    outcome: "ok",
  });

  return NextResponse.json(
    {
      status: "ready",
      checks: { database: "ok" },
    },
    {
      status: 200,
      headers: {
        "cache-control": "no-store",
        "x-request-id": correlationId,
      },
    },
  );
}
