import { NextResponse } from "next/server";

import { resolveCorrelationId } from "@/lib/operations/correlation";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const correlationId = resolveCorrelationId(request.headers.get("x-request-id"));

  return NextResponse.json(
    {
      status: "ok",
      service: "manyhands-web",
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
