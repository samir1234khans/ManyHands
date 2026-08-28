import { expect, test } from "@playwright/test";

test.describe("identity and profile foundations without hosted credentials", () => {
  test("sign-in explains the boundary and remains recoverable when not configured", async ({
    page,
  }) => {
    await page.goto("/auth/sign-in?reason=profile&next=/profile");

    await expect(page.getByRole("heading", { level: 1, name: "Sign in with GitHub" })).toBeVisible();
    await expect(page.getByText("Sign in to create or update your contributor profile.")).toBeVisible();
    await expect(page.getByText("GitHub sign-in is not configured in this environment yet.")).toBeVisible();
    await expect(page.getByText(/Does not install the ManyHands GitHub App/)).toBeVisible();
  });

  test("provider denial is shown as a safe, non-sensitive error", async ({ page }) => {
    await page.goto("/auth/error?reason=provider_denied&next=/profile");

    await expect(
      page.getByRole("heading", { level: 1, name: "GitHub sign-in was cancelled" }),
    ).toBeVisible();
    await expect(page.getByText(/Nothing was connected/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Try GitHub sign-in again" })).toHaveAttribute(
      "href",
      "/auth/sign-in?next=%2Fprofile",
    );
  });

  test("the public people directory stays useful before a database is configured", async ({
    page,
  }) => {
    await page.goto("/people");

    await expect(page.getByRole("heading", { level: 1, name: "Public contributors" })).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "The public directory is not connected in this environment",
      }),
    ).toBeVisible();
  });

  test("protected profile and settings routes preserve their return intent", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/auth\/sign-in\?next=%2Fprofile&reason=profile$/);

    await page.goto("/settings");
    await expect(page).toHaveURL(/\/auth\/sign-in\?next=%2Fsettings&reason=account$/);
  });

  test("OAuth start fails closed when identity configuration is absent", async ({ request }) => {
    const response = await request.post("/auth/start", {
      form: { next: "https://attacker.example/profile" },
      maxRedirects: 0,
    });

    expect(response.status()).toBe(303);
    expect(response.headers().location).toMatch(/\/auth\/error\?reason=configuration$/);
  });

  test("unknown public profiles return the safe not-found page", async ({ page }) => {
    const response = await page.goto("/people/no-such-public-profile");

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "This path is still unclaimed." })).toBeVisible();
  });
});
