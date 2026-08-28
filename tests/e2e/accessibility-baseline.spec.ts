import { expect, test } from "@playwright/test";

test.describe("public accessibility baseline", () => {
  test("offers keyboard entry through a visible skip link", async ({ page }) => {
    await page.goto("/");

    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await page.keyboard.press("Tab");

    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("exposes meaningful landmarks and textual status", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Big problems");

    await expect(page.getByText("Complete", { exact: true })).toBeVisible();
    await expect(page.getByText("In progress", { exact: true })).toBeVisible();
    await expect(page.getByText("Next", { exact: true })).toBeVisible();
  });

  test("publishes a discoverable accessibility statement", async ({ page }) => {
    await page.goto("/accessibility");

    await expect(
      page.getByRole("heading", { level: 1, name: "Accessibility at ManyHands" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "What we commit to" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Report an accessibility barrier/ }),
    ).toHaveAttribute("href", /accessibility_barrier\.yml/);
    await expect(page.getByText(/WCAG 2\.2 Level AA/)).toBeVisible();
  });

  test("keeps the public shell inside the narrow viewport", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto("/");

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /View public roadmap/ })).toBeVisible();
  });

  test("removes smooth scrolling and interaction motion when requested", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const styles = await page.evaluate(() => {
      const html = getComputedStyle(document.documentElement);
      const button = getComputedStyle(document.querySelector<HTMLElement>(".button")!);
      return {
        scrollBehavior: html.scrollBehavior,
        transitionDuration: button.transitionDuration,
      };
    });

    const transitionDurations = styles.transitionDuration.split(",").map((value) => {
      const seconds = Number.parseFloat(value.trim());
      return value.trim().endsWith("ms") ? seconds / 1000 : seconds;
    });

    expect(styles.scrollBehavior).toBe("auto");
    expect(
      transitionDurations.every((duration) => Number.isFinite(duration) && duration <= 0.001),
    ).toBe(true);
  });
});
