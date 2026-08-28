import { expect, test } from "@playwright/test";

test.describe("authentication entry", () => {
  test("explains optional GitHub identity before redirecting", async ({ page }) => {
    await page.goto("/sign-in");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Sign in with GitHub|already signed in/i);
    await expect(page.getByText(/Public Problems, Projects, progress, and Contribution Needs remain readable/)).toBeVisible();
    await expect(page.getByText(/does not install the ManyHands GitHub App/i)).toBeVisible();
    await expect(page.getByText(/does not request repository access/i)).toBeVisible();
    await expect(page.getByText(/does not publish your private GitHub email/i)).toBeVisible();
  });

  test("keeps the explanation readable without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto("/sign-in");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/Identity only when it helps/i)).toBeVisible();
    await expect(page.getByText(/does not request repository access/i)).toBeVisible();

    await context.close();
  });

  test("renders provider denial without reflecting provider payloads", async ({ page }) => {
    const secretLikePayload = "token=do-not-render&error_description=<script>alert(1)</script>";
    await page.goto(`/auth/error?code=${encodeURIComponent(secretLikePayload)}`);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Sign-in could not be completed",
    );
    await expect(page.getByText(/provider response, callback code, token, private email/)).toBeVisible();
    await expect(page.locator("body")).not.toContainText("do-not-render");
    await expect(page.locator("body")).not.toContainText("alert(1)");
  });

  test("shows the explicit cancellation recovery message", async ({ page }) => {
    await page.goto("/auth/error?code=access_denied");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "GitHub sign-in was cancelled",
    );
    await expect(page.getByText(/did not receive repository access/i)).toBeVisible();
    await expect(page.getByRole("link", { name: "Return to sign in" })).toHaveAttribute(
      "href",
      "/sign-in",
    );
  });

  test("reports missing configuration without exposing environment values", async ({ page }) => {
    await page.goto("/auth/configuration");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /configured|not configured/i,
    );
    await expect(page.getByText(/never displays client secrets/i)).toBeVisible();
    await expect(page.locator("body")).not.toContainText("SUPABASE_SERVICE_ROLE_KEY");
    await expect(page.locator("body")).not.toContainText("GITHUB_SECRET");
  });

  test("keeps the sign-in explanation usable by keyboard", async ({ page }) => {
    await page.goto("/sign-in");

    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });
});
