import { expect, test } from "@playwright/test";

test.describe("Problem directory foundation without hosted credentials", () => {
  test("keeps the public Problem explanation available when the database is not configured", async ({
    page,
  }) => {
    await page.goto("/problems");

    await expect(
      page.getByRole("heading", { level: 1, name: "Problems worth solving" }),
    ).toBeVisible();
    await expect(
      page.getByText(/A Problem describes an unmet need, the people affected/),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "The Problem directory is not connected here yet",
      }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Publish a Problem" })).toHaveAttribute(
      "href",
      "/problems/new",
    );
  });

  test("renders the signed-out explanation and normal search form without JavaScript", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto("/problems?q=accessibility");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Problems worth solving");
    await expect(page.getByLabel("Search public Problems")).toHaveValue("accessibility");
    await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
    await expect(page.getByText(/does not require JavaScript/)).toBeVisible();

    await context.close();
  });

  test("explains authentication and preserves return intent before authoring", async ({ page }) => {
    await page.goto("/problems/new");

    await expect(page).toHaveURL(/\/auth\/sign-in\?next=%2Fproblems%2Fnew&reason=problem$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Sign in with GitHub" }),
    ).toBeVisible();
    await expect(page.getByText(/ordinary login does not install/i)).toBeVisible();
  });

  test("does not interpret a query string as executable markup", async ({ page }) => {
    const query = "<script>window.problemQueryExecuted=true</script>";
    await page.goto(`/problems?q=${encodeURIComponent(query)}`);

    await expect(page.getByLabel("Search public Problems")).toHaveValue(query);
    await expect(page.locator("main script")).toHaveCount(0);
    await expect
      .poll(() => page.evaluate(() => Reflect.get(window, "problemQueryExecuted")))
      .toBeUndefined();
  });

  test("keeps the directory inside a 320-pixel viewport", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto("/problems");

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Publish a Problem" })).toBeVisible();
  });

  test("adds the Problem directory to shared public navigation", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toContainText(
      "Problems",
    );
    await expect(page.getByRole("navigation", { name: "Project resources" })).toContainText(
      "Problems",
    );
    await expect(page.getByRole("link", { name: "Problems", exact: true }).first()).toHaveAttribute(
      "href",
      "/problems",
    );
  });
});
