import { test, expect } from "@playwright/test";

for (const width of [320, 360, 375, 390, 428, 768, 1024, 1440]) {
  test(`business and personal dashboards fit ${width}px with readable charts and one shell`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const workspace of ["demo", "personal"]) {
      await page.goto(`/w/${workspace}/home`);
      await expect(
        page.getByRole("main").getByRole("heading", { level: 1 }),
      ).toHaveCount(1);
      await expect(
        page.getByRole("button", { name: "Notifications", exact: true }),
      ).toBeVisible();
      if (workspace === "demo")
        await page.getByText("View chart data", { exact: true }).click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      for (const filter of await page.getByRole("combobox").all()) {
        const box = await filter.boundingBox();
        expect(box!.height).toBeGreaterThanOrEqual(44);
        await filter.focus();
        await expect(filter).toBeFocused();
      }
      if ([320, 1440].includes(width)) {
        await page.getByRole("heading", { level: 1 }).click();
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({
          path: `.next/validation/dashboard-${workspace}-${width}.png`,
          fullPage: true,
        });
      }
    }
    expect(errors).toEqual([]);
  });
}

test("business filters update money, metrics, recent records, activity and chart data", async ({
  page,
}) => {
  await page.goto("/w/demo/home");
  await expect(
    page.getByTestId("primary-amount").filter({ visible: true }),
  ).toHaveText(/UGX\s725,000/);
  await expect(page.getByTestId("metric-outstanding")).toContainText(
    /UGX\s425,000/,
  );
  await expect(page.getByTestId("metric-receipts")).toContainText(
    "Receipts Issued Today",
  );
  await page.getByLabel("Branch", { exact: true }).selectOption("nakawa");
  await expect(
    page.getByTestId("primary-amount").filter({ visible: true }),
  ).toHaveText(/UGX\s220,000/);
  await expect(page.getByTestId("metric-outstanding")).toContainText(/UGX\s0/);
  await expect(
    page.getByRole("region", { name: "Recent receipts", exact: true }),
  ).toContainText("Kato Hardware");
  await expect(
    page.getByRole("region", { name: "Recent receipts", exact: true }),
  ).not.toContainText("Sarah's Groceries");
  await page
    .getByLabel("Reporting period", { exact: true })
    .selectOption("week");
  await expect(
    page.getByTestId("primary-amount").filter({ visible: true }),
  ).toHaveText(/UGX\s220,000/);
  await page.getByLabel("Branch", { exact: true }).selectOption("all");
  await expect(
    page.getByTestId("primary-amount").filter({ visible: true }),
  ).toHaveText(/UGX\s1,150,000/);
  await expect(page.getByRole("status")).toContainText("2 Nov 2026");
  await expect(
    page.getByRole("region", { name: "Recent receipts", exact: true }),
  ).toContainText("Voided");
  await expect(
    page.getByRole("region", { name: "Recent activity", exact: true }),
  ).toContainText("Receipt KT-1047 voided");
  await page
    .getByLabel("Reporting period", { exact: true })
    .selectOption("month");
  await expect(
    page.getByTestId("primary-amount").filter({ visible: true }),
  ).toHaveText(/UGX\s1,290,000/);
  await page.getByLabel("Reporting date", { exact: true }).fill("2026-11-04");
  await expect(
    page.getByTestId("primary-amount").filter({ visible: true }),
  ).toHaveText(/UGX\s565,000/);
  await page.getByLabel("Reporting date", { exact: true }).fill("2026-10-01");
  await expect(
    page.getByTestId("primary-amount").filter({ visible: true }),
  ).toHaveText(/UGX\s0/);
  await expect(
    page.getByText("No money received or refunded in this period."),
  ).toBeVisible();
});

test("personal overview distinguishes saved expense receipts from issued documents", async ({
  page,
}) => {
  await page.goto("/w/personal/home");
  await expect(
    page.getByRole("heading", { name: "Recorded Spending This Month" }),
  ).toBeVisible();
  await expect(
    page.getByTestId("primary-amount").filter({ visible: true }),
  ).toHaveText(/UGX\s164,000/);
  await expect(page.getByTestId("metric-expense-count")).toContainText("5");
  await expect(page.getByTestId("metric-saved-receipts")).toContainText("3");
  await expect(
    page.getByRole("region", { name: "Recent expenses" }),
  ).toContainText("Neighbourhood Market");
  await expect(
    page.getByRole("region", { name: "Receipts you issued" }),
  ).toContainText("PB-001");
  await expect(
    page.getByRole("region", { name: "Recent expenses" }),
  ).not.toContainText("PB-001");
  await expect(page.getByLabel("Branch", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("progressbar")).toHaveCount(5);
  await page
    .getByLabel("Reporting period", { exact: true })
    .selectOption("week");
  await expect(
    page.getByTestId("primary-amount").filter({ visible: true }),
  ).toHaveText(/UGX\s132,000/);
  await expect(page.getByTestId("metric-expense-count")).toContainText("4");
});

test("workspace switching selects the separate personal dataset and an honest empty business", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/w/demo/home");
  await page
    .getByRole("button", {
      name: "Switch workspace, current workspace Kampala Traders",
    })
    .filter({ visible: true })
    .click();
  await page.getByRole("menuitem", { name: "My Personal Book" }).click();
  await expect(page).toHaveURL(/\/w\/personal\/home$/);
  await expect(
    page.getByTestId("primary-amount").filter({ visible: true }),
  ).toHaveText(/UGX\s164,000/);
  await expect(
    page.getByRole("region", { name: "Recent expenses" }),
  ).not.toContainText("Kato Hardware");
  await page
    .getByRole("button", {
      name: "Switch workspace, current workspace My Personal Book",
    })
    .filter({ visible: true })
    .click();
  await page.getByRole("menuitem", { name: "Wakiso Supplies" }).click();
  await expect(page).toHaveURL(/\/w\/sample\/home$/);
  await expect(
    page.getByTestId("primary-amount").filter({ visible: true }),
  ).toHaveText(/UGX\s0/);
  await expect(
    page.getByRole("heading", { name: "Your next chapter starts here" }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Recent receipts", exact: true }),
  ).not.toContainText("Nile Corner Shop");
});

test("business and personal quick actions and view-all links reach honest planned pages", async ({
  page,
}) => {
  for (const [workspace, actions] of [
    [
      "demo",
      [
        "New Receipt",
        "Receipt Books",
        "Customers",
        "Record Expense",
        "Payments",
        "Reports",
      ],
    ],
    [
      "personal",
      [
        "Scan Receipt",
        "Add Expense",
        "Create a receipt",
        "View Records",
        "Export Expenses",
      ],
    ],
  ] as const) {
    for (const label of actions) {
      await page.goto(`/w/${workspace}/home`);
      const section = page.getByRole("region", {
        name:
          workspace === "demo" ? "Make your next move" : "Your everyday tools",
      });
      await section
        .getByRole("link", { name: new RegExp(`^${label}`) })
        .click();
      await expect(
        page.getByText("Planned feature", { exact: true }),
      ).toBeVisible();
      await expect(page.getByRole("main")).toContainText(
        "no records or transactions can be created here",
      );
    }
  }
  await page.goto("/w/demo/home");
  await page.getByRole("link", { name: "View all receipts" }).click();
  await expect(page).toHaveURL(/\/w\/demo\/receipts$/);
  await page.goto("/w/personal/home");
  await page.getByRole("link", { name: "View expense records" }).click();
  await expect(page).toHaveURL(/\/w\/personal\/expenses$/);
});

for (const workspaceType of ["business", "personal"] as const)
  for (const primaryUse of ["receipts", "expenses", "both"] as const) {
    test(`${workspaceType} setup with ${primaryUse} preference opens an empty tailored dashboard`, async ({
      page,
    }) => {
      await page.addInitScript(
        ({ workspaceType, primaryUse }) => {
          sessionStorage.setItem(
            "risiti:onboarding:v1",
            JSON.stringify({
              version: 1,
              completed: true,
              step: "success",
              draft: {
                workspaceType,
                name: "My New Book",
                category: workspaceType === "business" ? "retail" : "",
                customCategory: "",
                personalPurpose: workspaceType === "personal" ? "Spending" : "",
                primaryUse,
                template: primaryUse === "expenses" ? null : { mode: "later" },
              },
            }),
          );
        },
        { workspaceType, primaryUse },
      );
      await page.setViewportSize({ width: 320, height: 800 });
      await page.goto("/w/setup/home");
      await expect(
        page.getByRole("heading", { name: "Your next chapter starts here" }),
      ).toBeVisible();
      await expect(
        page.getByTestId("primary-amount").filter({ visible: true }),
      ).toHaveText(/UGX\s0/);
      await expect(page.getByRole("main")).toContainText(
        "No seeded transactions",
      );
      await expect(page.getByRole("main")).not.toContainText(
        "Nile Corner Shop",
      );
      await expect(page.getByRole("main")).not.toContainText(
        "Neighbourhood Market",
      );
      if (workspaceType === "personal") {
        await expect(
          page.getByRole("heading", {
            name:
              primaryUse === "receipts"
                ? "Money Collected This Month"
                : "Recorded Spending This Month",
          }),
        ).toBeVisible();
        await expect(
          page.getByRole("heading", { name: "Receipts you issued" }),
        ).toHaveCount(primaryUse === "expenses" ? 0 : 1);
      } else {
        const firstMetric = page.locator('[data-testid^="metric-"]').first();
        await expect(firstMetric).toContainText(
          primaryUse === "expenses"
            ? "Recorded Expenses"
            : "Receipts Issued Today",
        );
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.reload();
      await expect(
        page.getByTestId("primary-amount").filter({ visible: true }),
      ).toHaveText(/UGX\s0/);
    });
  }
