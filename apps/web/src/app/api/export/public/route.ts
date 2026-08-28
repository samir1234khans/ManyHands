import { NextResponse } from "next/server";

import { resolveCorrelationId } from "@/lib/operations/correlation";
import { buildPublicExport, PUBLIC_EXPORT_SCHEMA_VERSION } from "@/lib/operations/export-contract";
import { logOperationalEvent } from "@/lib/operations/events";
import { createPublicOperationsClient } from "@/lib/operations/public-supabase";
import { siteConfig } from "@/lib/site-config";

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
      event: "public_export",
      outcome: "degraded",
      reason: "database_unconfigured",
    });

    return NextResponse.json(
      {
        schema_version: PUBLIC_EXPORT_SCHEMA_VERSION,
        status: "unavailable",
        reason: "public_data_not_configured",
        source: {
          repository: siteConfig.repositoryUrl,
          license: siteConfig.licenseName,
          license_url: siteConfig.licenseUrl,
        },
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

  const { data, error } = await client.from("profile_directory").select("*").order("handle");
  const durationMs = performance.now() - startedAt;

  if (error) {
    logOperationalEvent({
      correlationId,
      dependency: "database",
      durationMs,
      event: "public_export",
      outcome: "failed",
      reason: "database_read_failed",
    });

    return NextResponse.json(
      {
        schema_version: PUBLIC_EXPORT_SCHEMA_VERSION,
        status: "unavailable",
        reason: "public_export_temporarily_unavailable",
        source: {
          repository: siteConfig.repositoryUrl,
          license: siteConfig.licenseName,
          license_url: siteConfig.licenseUrl,
        },
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

  const payload = buildPublicExport(data ?? [], new Date().toISOString());

  logOperationalEvent({
    correlationId,
    dependency: "database",
    durationMs,
    event: "public_export",
    outcome: "ok",
  });

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      "cache-control": "no-store",
      "content-disposition": 'attachment; filename="manyhands-public-export.json"',
      "x-request-id": correlationId,
    },
  });
}
