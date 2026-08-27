import { expect, test } from "@playwright/test";

import { siteConfig } from "../../apps/web/src/lib/site-config";

test.describe("public application shell", () => {
  test("renders the core message and public source links", async ({ page }) => {
    const response = await page.goto("/");

    expect(response).not.toBeNull();
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: "Big problems. Built together." }),
    ).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByText(siteConfig.boundary, { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "View source" })).toHaveAttribute(
      "href",
      siteConfig.repositoryUrl,
    );
    await expect(page.getByRole("link", { name: siteConfig.licenseName })).toHaveAttribute(
      "href",
      siteConfig.licenseUrl,
    );
  });

  test("keeps meaningful public content available when JavaScript is disabled", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    const response = await page.goto("/");

    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: "Big problems. Built together." }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "ManyHands helps people gather around a shared need, form an open-source project, understand its real progress, and find one clear way to help.",
      ),
    ).toBeVisible();
    await expect(page.getByText(siteConfig.boundary, { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "View public roadmap" })).toBeVisible();
    await expect(page.getByRole("link", { name: "View source" })).toBeVisible();

    await context.close();
  });

  test("renders a safe not-found state", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { level: 1, name: "That page wandered off." }),
    ).toBeVisible();
    await expect(page.getByText(/stack|environment|digest/i)).toHaveCount(0);
  });
});

test.describe("visual verification artifacts", () => {
  test("captures the wide homepage", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.screenshot({
      path: "test-results/screenshots/home-wide.png",
      fullPage: true,
      animations: "disabled",
    });
  });

  test("captures the narrow homepage", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.screenshot({
      path: "test-results/screenshots/home-narrow.png",
      fullPage: true,
      animations: "disabled",
    });
  });
});
