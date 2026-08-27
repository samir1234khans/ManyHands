import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const publicRoutes = ["/", "/accessibility"] as const;

async function expectNoAxeViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();

  expect(
    results.violations,
    results.violations
      .map(
        (violation) =>
          `${violation.id}: ${violation.help}\n${violation.nodes
            .map((node) => `  ${node.target.join(" ")} — ${node.failureSummary ?? ""}`)
            .join("\n")}`,
      )
      .join("\n\n"),
  ).toEqual([]);
}

test.describe("automated accessibility baseline", () => {
  for (const route of publicRoutes) {
    test(`${route} has no automatically detectable accessibility violations`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "networkidle" });

      expect(response?.status()).toBe(200);
      await expect(page.getByRole("main")).toBeVisible();
      await expectNoAxeViolations(page);
    });

    test(`${route} reflows without page-level horizontal overflow at 320 CSS pixels`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 320, height: 900 });
      await page.goto(route, { waitUntil: "networkidle" });

      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));

      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    });
  }

  test("the skip link is the first keyboard stop and moves focus to main content", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toBeFocused();

    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/#main-content$/);
    await expect(page.getByRole("main")).toBeFocused();
  });

  test("primary actions meet the project touch-target baseline", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const actions = page.locator(".button");
    const count = await actions.count();
    expect(count).toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      const box = await actions.nth(index).boundingBox();
      expect(box).not.toBeNull();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    }
  });

  test("reduced-motion preference removes smooth scrolling and visible transition delay", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const styles = await page.evaluate(() => {
      const button = document.querySelector<HTMLElement>(".button");
      return {
        buttonTransitionDuration: button ? getComputedStyle(button).transitionDuration : null,
        scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      };
    });

    expect(styles.scrollBehavior).toBe("auto");
    expect(styles.buttonTransitionDuration).toMatch(/^(0s|0\.01ms|0\.00001s)(, (0s|0\.01ms|0\.00001s))*$/);
  });

  test("core content and focus remain visible in forced-colors mode", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: "Big problems. Built together." }),
    ).toBeVisible();

    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  });

  test("the public statement exposes an accessibility barrier reporting route", async ({ page }) => {
    await page.goto("/accessibility");

    await expect(
      page.getByRole("heading", { level: 1, name: "Accessibility at ManyHands" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Open the accessibility barrier form/ })).toHaveAttribute(
      "href",
      /accessibility_barrier\.yml/,
    );
  });
});
