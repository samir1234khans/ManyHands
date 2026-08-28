import { expect, test } from "@playwright/test";

test("liveness is public, minimal, and correlation-aware", async ({ request }) => {
  const response = await request.get("/api/health/live", {
    headers: { "x-request-id": "playwright-health-1" },
  });

  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(response.headers()["x-request-id"]).toBe("playwright-health-1");
  await expect(response.json()).resolves.toEqual({
    status: "ok",
    service: "manyhands-web",
  });
});

test("readiness degrades safely when the database is not configured", async ({ request }) => {
  const response = await request.get("/api/health/ready");
  expect(response.status()).toBe(503);

  const text = await response.text();
  expect(text).toContain('"database":"unconfigured"');
  expect(text).not.toMatch(/service[_-]?role|token|secret|password|email/i);
});

test("public export refuses to invent partial data when dependencies are unavailable", async ({ request }) => {
  const response = await request.get("/api/export/public");
  expect(response.status()).toBe(503);

  const payload = await response.json();
  expect(payload).toMatchObject({
    schema_version: "2026-08-01",
    status: "unavailable",
    reason: "public_data_not_configured",
  });
  expect(JSON.stringify(payload)).not.toMatch(/service[_-]?role|token|secret|password|email/i);
});

test("public pages keep source and AGPL licensing visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "View source" })).toHaveAttribute(
    "href",
    "https://github.com/samir1234khans/ManyHands",
  );
  await expect(page.getByRole("link", { name: "GNU AGPL v3 or later" })).toBeVisible();
});
