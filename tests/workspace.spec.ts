import { test, expect, type Page } from "@playwright/test";

async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
}

for (const width of [320, 360, 375, 390, 428, 768, 1024, 1440]) {
  test(`workspace foundations fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    for (const path of ["home", "more", "receipts/new", "design-system"]) {
      const response = await page.goto(`/w/demo/${path}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("main h1")).toHaveCount(1);
      await noOverflow(page);
      const mobile = page.getByRole("navigation", {
        name: "Mobile workspace navigation",
      });
      const desktop = page.getByRole("complementary", {
        name: "Workspace sidebar",
      });
      if (width < 1024) {
        await expect(mobile).toBeVisible();
        await expect(desktop).toBeHidden();
        await expect(mobile.getByRole("link")).toHaveCount(5);
        for (const link of await mobile.getByRole("link").all()) {
          const box = await link.boundingBox();
          expect(box!.width).toBeGreaterThanOrEqual(44);
          expect(box!.height).toBeGreaterThanOrEqual(44);
          const label = link.locator("span").last();
          expect(
            await label.evaluate(
              (element) => getComputedStyle(element).fontSize,
            ),
          ).toBe("12px");
          const labelBox = await label.boundingBox();
          expect(labelBox!.x).toBeGreaterThanOrEqual(box!.x);
          expect(labelBox!.x + labelBox!.width).toBeLessThanOrEqual(
            box!.x + box!.width,
          );
        }
        await page.evaluate(() =>
          window.scrollTo(0, document.body.scrollHeight),
        );
        const navBox = await mobile.boundingBox();
        const lastContent = await page
          .locator("#workspace-main > div")
          .boundingBox();
        expect(lastContent!.y + lastContent!.height).toBeLessThanOrEqual(
          navBox!.y,
        );
      } else {
        await expect(mobile).toBeHidden();
        await expect(desktop).toBeVisible();
      }
      if (path === "home" && [360, 1440].includes(width)) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({
          path: `.next/validation/workspace-${width}.png`,
          fullPage: true,
        });
      }
    }
    expect(errors).toEqual([]);
  });
}

test("mobile navigation selects the current destination including nested Create and More pages", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/w/demo/home");
  const nav = page.getByRole("navigation", {
    name: "Mobile workspace navigation",
  });
  for (const [label, path] of [
    ["Create", "receipts/new"],
    ["Receipts", "receipts"],
    ["Expenses", "expenses"],
    ["More", "more"],
    ["Home", "home"],
  ]) {
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/w/demo/${path}$`));
    await expect(nav.locator('[aria-current="page"]')).toHaveText(label);
  }
  await page.goto("/w/demo/receipt-books");
  await expect(nav.locator('[aria-current="page"]')).toHaveText("More");
  await page.goto("/w/demo/receipts/new");
  await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(nav.locator('[aria-current="page"]')).toHaveText("Create");
});

test("every planned route is labelled and can return home", async ({
  page,
}) => {
  for (const path of [
    "receipts",
    "receipt-books",
    "expenses",
    "payments",
    "customers",
    "catalog",
    "reports",
    "staff",
    "branches",
    "settings",
    "receipts/new",
    "receipts/history",
  ]) {
    expect((await page.goto(`/w/demo/${path}`))?.status()).toBe(200);
    await expect(
      page.getByText("Planned feature", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("no records or transactions can be created here", {
        exact: false,
      }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Back to Home", exact: true }).click();
    await expect(page).toHaveURL(/\/w\/demo\/home$/);
  }
});

test("keyboard skip link, notification dialog and workspace switching work on a narrow phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/w/demo/home");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to workspace content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#workspace-main")).toBeFocused();
  const notifications = page.getByRole("button", {
    name: "Notifications",
    exact: true,
  });
  await notifications.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await noOverflow(page);
  await page.keyboard.press("Escape");
  await expect(notifications).toBeFocused();
  const switcher = page
    .getByRole("button", {
      name: "Switch workspace, current workspace Kampala Traders",
    })
    .filter({ visible: true });
  await switcher.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("menuitem", { name: "Wakiso Supplies" }).click();
  await expect(page).toHaveURL(/\/w\/sample\/home$/);
  await expect(
    page
      .getByRole("button", {
        name: "Switch workspace, current workspace Wakiso Supplies",
      })
      .filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Wakiso Branch").filter({ visible: true }).first(),
  ).toBeVisible();
});

test("preview fields validate, filters work, switches toggle and confirmation restores focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/w/demo/design-system");
  await page.getByLabel("Sample workspace name", { exact: false }).fill("x");
  await page.getByRole("button", { name: "Apply to preview" }).click();
  const applyBox = await page
    .getByRole("button", { name: "Apply to preview" })
    .boundingBox();
  const navigationBox = await page
    .getByRole("navigation", { name: "Mobile workspace navigation" })
    .boundingBox();
  expect(applyBox!.y + applyBox!.height).toBeLessThanOrEqual(navigationBox!.y);
  await expect(page.locator("#sample-name-error")).toHaveText(
    "Use at least two characters for the sample name.",
  );
  await expect(
    page.getByLabel("Sample workspace name", { exact: false }),
  ).toHaveAttribute("aria-invalid", "true");
  await page
    .getByLabel("Sample workspace name", { exact: false })
    .fill("Sample business");
  await page.getByRole("button", { name: "Apply to preview" }).click();
  await expect(
    page.getByText("Preview updated for Sample business", { exact: false }),
  ).toBeVisible();
  const reset = page.getByRole("button", {
    name: "Reset preview",
    exact: true,
  });
  await reset.click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await noOverflow(page);
  await expect(
    page.getByRole("button", { name: "Cancel", exact: true }),
  ).toBeFocused();
  for (let index = 0; index < 5; index++) {
    await page.keyboard.press("Tab");
    expect(
      await page
        .locator(":focus")
        .evaluate((element) =>
          Boolean(element.closest('[role="alertdialog"]')),
        ),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(reset).toBeFocused();
  await reset.click();
  await page
    .getByRole("button", { name: "Reset sample values", exact: true })
    .click();
  await expect(
    page.getByLabel("Sample workspace name", { exact: false }),
  ).toHaveValue("Kampala Traders");
  await page.getByRole("switch", { name: "Show sample captions" }).click();
  await expect(
    page.getByRole("switch", { name: "Show sample captions" }),
  ).not.toBeChecked();
  await page
    .getByRole("searchbox", { name: "Search preview components" })
    .fill("notfound");
  await expect(
    page.getByRole("heading", { name: "No sample matches" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByLabel("Component category").selectOption("feedback");
  await expect(
    page.getByText("2 sample components", { exact: true }),
  ).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page
      .locator('[data-slot="skeleton"]')
      .first()
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
});

test("public welcome, manifest and invalid workspace boundaries remain intact", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("fresh page.");
  await expect(
    page.getByRole("navigation", { name: "Mobile workspace navigation" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Explore the demo workspace", exact: true }),
  ).toHaveAttribute("href", "/w/demo/home");
  await page.getByRole("link", { name: "Meet Risiti", exact: true }).click();
  await expect(page).toHaveURL(/\/#about$/);
  expect((await request.get("/manifest.webmanifest")).status()).toBe(200);
  await page.goto("/w/not-a-workspace/home");
  await expect(page.getByText("This page could not be found.")).toBeVisible();
  await page.goto("/w/demo/not-a-feature");
  await expect(page.getByText("This page could not be found.")).toBeVisible();
});
