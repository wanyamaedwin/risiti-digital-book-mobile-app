import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

const storageKey = "risiti:onboarding:v1";
async function choose(page: Page, title: string) {
  await page.getByText(title, { exact: true }).click();
}
async function continueSetup(page: Page) {
  await page.getByRole("button", { name: "Continue", exact: true }).click();
}
async function businessDetails(page: Page, category = "retail") {
  await page.goto("/onboarding");
  await choose(page, "Business / Institution");
  await continueSetup(page);
  await page
    .getByLabel(/^Business or institution name/)
    .fill("Entebbe Demo Traders");
  await page.getByLabel(/^Business category/).selectOption(category);
}
async function receiptDesignStep(page: Page) {
  await businessDetails(page);
  await continueSetup(page);
  await choose(page, "Issue Receipts");
  await continueSetup(page);
}

test("business journey validates required fields, allows any design, reviews, completes once, and restores the named demo", async ({
  page,
}) => {
  await page.goto("/onboarding");
  await expect(
    page.getByRole("button", { name: "Continue", exact: true }),
  ).toBeDisabled();
  await choose(page, "Business / Institution");
  await continueSetup(page);
  await continueSetup(page);
  await expect(
    page.getByText("Use at least two characters for your workspace name.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Choose a category, or select Other.", { exact: true }),
  ).toBeVisible();
  await page
    .getByLabel(/^Business or institution name/)
    .fill("Entebbe Demo Traders");
  await page.getByLabel(/^Business category/).selectOption("education");
  await continueSetup(page);
  await choose(page, "Both");
  await continueSetup(page);
  await expect(page.getByRole("radio")).toHaveCount(9);
  await expect(
    page.getByRole("button", { name: "Use Template", exact: true }),
  ).toBeDisabled();
  await choose(page, "General Payment Receipt");
  await page.getByRole("button", { name: "Use Template", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Looking good. Shall we begin?" }),
  ).toBeVisible();
  await expect(
    page.getByText("School / Education", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("General Payment Receipt", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Edit workspace name", exact: true })
    .click();
  await expect(page.getByLabel(/^Business or institution name/)).toHaveValue(
    "Entebbe Demo Traders",
  );
  await continueSetup(page);
  await continueSetup(page);
  await page.getByRole("button", { name: "Use Template", exact: true }).click();
  await page
    .getByRole("button", { name: "Finish Setup", exact: true })
    .evaluate((button: HTMLButtonElement) => {
      button.click();
      button.click();
    });
  await expect(
    page.getByText("Demo setup complete", { exact: true }),
  ).toBeVisible();
  const completed = await page.evaluate(
    (key) => sessionStorage.getItem(key),
    storageKey,
  );
  expect(JSON.parse(completed!).completed).toBe(true);
  await page.reload();
  await expect(
    page.getByText("Demo setup complete", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Open my demo workspace", exact: true })
    .click();
  await expect(page).toHaveURL(/\/w\/setup\/home$/);
  await expect(
    page
      .getByRole("button", {
        name: "Switch workspace, current workspace Entebbe Demo Traders",
      })
      .filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Recommended for you", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore receipt preview" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore expenses preview" }),
  ).toBeVisible();
  await page.reload();
  expect(
    await page.evaluate((key) => sessionStorage.getItem(key), storageKey),
  ).toBe(completed);
});

test("personal expense-only setup skips the receipt design and keeps other approved features available", async ({
  page,
}) => {
  await page.goto("/onboarding");
  await choose(page, "Personal Use");
  await continueSetup(page);
  await expect(page.getByLabel(/^Business category/)).toHaveCount(0);
  await expect(page.getByLabel(/^Business phone/)).toHaveCount(0);
  await page.getByLabel(/^Workspace display name/).fill("My Kampala notebook");
  await page
    .getByLabel(/^Primary intended use/)
    .selectOption("Household spending");
  await continueSetup(page);
  await choose(page, "Record Expenses");
  await continueSetup(page);
  await expect(
    page.getByRole("heading", { name: "Looking good. Shall we begin?" }),
  ).toBeVisible();
  await expect(
    page.getByText("Step 4 of 4 · Review", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Edit receipt design" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Finish Setup", exact: true }).click();
  await page
    .getByRole("link", { name: "Open my demo workspace", exact: true })
    .click();
  await expect(
    page
      .getByText("Personal workspace", { exact: true })
      .filter({ visible: true })
      .first(),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore expenses preview" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore receipt preview" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Create a receipt", exact: false }),
  ).toBeVisible();
});

test("optional details, custom category and logo stay in memory while safe choices restore across refresh", async ({
  page,
}) => {
  await businessDetails(page, "other");
  await continueSetup(page);
  await expect(
    page.getByText("Tell us your category in at least two characters.", {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByLabel(/^Your category/).fill("Community studio");
  await page.getByText("Optional business details", { exact: true }).click();
  await page.getByLabel(/^Business phone/).fill("bad");
  await page.getByLabel(/^Business email/).fill("bad");
  await continueSetup(page);
  await expect(
    page.getByText("Enter a valid email address, or leave this blank.", {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByLabel(/^Business phone/).fill("0772 123 456");
  await page.getByLabel(/^Business email/).fill("sample-contact@example.com");
  await page.getByLabel(/^Location \/ address/).fill("Sample street address");
  await page.getByLabel(/^Business logo/).setInputFiles({
    name: "demo-logo.png",
    mimeType: "image/png",
    buffer: readFileSync("public/icons/icon-192.png"),
  });
  await expect(page.getByAltText("Your demo logo preview")).toBeVisible();
  await continueSetup(page);
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await page.getByText("Optional business details", { exact: true }).click();
  await expect(page.getByLabel(/^Business phone/)).toHaveValue("0772 123 456");
  await expect(page.getByAltText("Your demo logo preview")).toBeVisible();
  const persisted = await page.evaluate(
    (key) => sessionStorage.getItem(key),
    storageKey,
  );
  expect(persisted).not.toContain("0772");
  expect(persisted).not.toContain("sample-contact");
  expect(persisted).not.toContain("Sample street");
  expect(persisted).not.toContain("demo-logo");
  await page.reload();
  await expect(page.getByLabel(/^Business or institution name/)).toHaveValue(
    "Entebbe Demo Traders",
  );
  await expect(page.getByLabel(/^Your category/)).toHaveValue(
    "Community studio",
  );
  await page.getByText("Optional business details", { exact: true }).click();
  await expect(page.getByLabel(/^Business phone/)).toHaveValue("");
  await expect(page.getByAltText("Your demo logo preview")).toHaveCount(0);
  await page.getByLabel(/^Business phone/).fill("0772 123 456");
  await page.getByRole("link", { name: "Explore Demo", exact: true }).click();
  await expect(page).toHaveURL(/\/w\/demo\/home$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/onboarding$/);
  await expect(page.getByLabel(/^Business phone/)).toHaveValue("");
});

test("logo validation rejects unsupported and oversized files without an upload", async ({
  page,
}) => {
  const mutations: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET") mutations.push(request.url());
  });
  await businessDetails(page);
  await page.getByText("Optional business details", { exact: true }).click();
  const input = page.getByLabel(/^Business logo/);
  await input.setInputFiles({
    name: "not-an-image.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("sample"),
  });
  await expect(
    page.getByText("Choose a PNG, JPEG, or WebP image no larger than 2 MB.", {
      exact: true,
    }),
  ).toBeVisible();
  await input.setInputFiles({
    name: "too-large.png",
    mimeType: "image/png",
    buffer: Buffer.alloc(2 * 1024 * 1024 + 1),
  });
  await expect(page.getByAltText("Your demo logo preview")).toHaveCount(0);
  await input.setInputFiles("public/icons/icon-192.png");
  await expect(page.getByAltText("Your demo logo preview")).toBeVisible();
  await page.getByRole("button", { name: "Remove logo", exact: true }).click();
  expect(await input.inputValue()).toBe("");
  expect(mutations).toEqual([]);
});

test("setup remains usable when tab storage is unavailable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", {
      configurable: true,
      get() {
        throw new DOMException("Storage blocked", "SecurityError");
      },
    });
  });
  await page.goto("/onboarding");
  await expect(
    page.getByText("Your browser cannot save a draft in this tab.", {
      exact: false,
    }),
  ).toBeVisible();
  await choose(page, "Personal Use");
  await continueSetup(page);
  await page.getByLabel(/^Workspace display name/).fill("Memory only demo");
  await page
    .getByLabel(/^Primary intended use/)
    .selectOption("Household spending");
  await continueSetup(page);
  await choose(page, "Record Expenses");
  await continueSetup(page);
  await page.getByRole("button", { name: "Finish Setup", exact: true }).click();
  await expect(
    page.getByText("Demo setup complete", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Open my demo workspace", exact: true })
    .click();
  await expect(
    page
      .getByRole("button", {
        name: "Switch workspace, current workspace Memory only demo",
      })
      .filter({ visible: true }),
  ).toBeVisible();
});

for (const option of [
  "Blank Receipt Book",
  "Start From Scratch",
  "Customise Later",
]) {
  test(`${option} is an optional design draft`, async ({ page }) => {
    await receiptDesignStep(page);
    if (option === "Blank Receipt Book") {
      await choose(page, option);
      await page
        .getByRole("button", { name: "Use Template", exact: true })
        .click();
    } else
      await page.getByRole("button", { name: option, exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Looking good. Shall we begin?" }),
    ).toBeVisible();
    const state = await page.evaluate(
      (key) => JSON.parse(sessionStorage.getItem(key)!),
      storageKey,
    );
    expect(state.draft.template.mode).toBe(
      option === "Customise Later" ? "later" : "blank",
    );
    expect(state.completed).toBe(false);
  });
}

test("Start Over clears saved choices, and corrupt drafts cannot open a completed workspace", async ({
  page,
}) => {
  await businessDetails(page);
  await page.getByRole("button", { name: "Start Over", exact: true }).click();
  await page.getByRole("button", { name: "Start over", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "A space that feels like you." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Continue", exact: true }),
  ).toBeDisabled();
  expect(
    await page.evaluate((key) => sessionStorage.getItem(key), storageKey),
  ).toBeNull();
  await page.evaluate(
    (key) => sessionStorage.setItem(key, '{"version":999,"completed":true}'),
    storageKey,
  );
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "A space that feels like you." }),
  ).toBeVisible();
  await page.goto("/w/setup/home");
  await expect(
    page.getByRole("heading", { name: "A fresh page is waiting" }),
  ).toBeVisible();
});

test("account, recovery and verification previews validate without submitting or storing credentials", async ({
  page,
}) => {
  const mutations: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET") mutations.push(request.url());
  });
  await page.goto("/create-account");
  await page
    .getByRole("button", { name: "Preview account setup", exact: true })
    .click();
  await expect(
    page.getByText("Use at least 8 characters for this sample password.", {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByLabel(/^Phone number/).fill("0772 123 456");
  await page.getByLabel(/^Sample password/).fill("made-up-demo-password");
  await page.getByLabel(/^Confirm sample password/).fill("wrong");
  await page
    .getByRole("button", { name: "Preview account setup", exact: true })
    .click();
  await expect(
    page.getByText("The sample passwords do not match.", { exact: true }),
  ).toBeVisible();
  await page
    .getByLabel(/^Confirm sample password/)
    .fill("made-up-demo-password");
  await page
    .getByRole("button", { name: "Preview account setup", exact: true })
    .click();
  await expect(page).toHaveURL(/\/verify$/);
  await page.getByLabel(/^Sample verification code/).fill("abcdef");
  await page.getByRole("button", { name: "Continue to Quick Setup" }).click();
  await expect(
    page.getByText("Enter six digits to try the verification preview.", {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByLabel(/^Sample verification code/).fill("123456");
  await page.getByRole("button", { name: "Continue to Quick Setup" }).click();
  await expect(page).toHaveURL(/\/onboarding$/);
  await page.goto("/sign-in");
  await page.getByText("Email", { exact: true }).click();
  await page.getByLabel(/^Email address/).fill("invalid-email");
  await page.getByLabel(/^Sample password/).fill("made-up-demo-password");
  await page
    .getByRole("button", { name: "Preview sign in", exact: true })
    .click();
  await expect(
    page.getByText("Enter a valid email address.", { exact: true }),
  ).toBeVisible();
  await page.getByLabel(/^Email address/).fill("demo@example.com");
  await page
    .getByRole("button", { name: "Preview sign in", exact: true })
    .click();
  await expect(page).toHaveURL(/\/verify$/);
  await page.goto("/forgot-password");
  await page.getByLabel(/^Phone number/).fill("+256772123456");
  await page
    .getByRole("button", { name: "Preview recovery", exact: true })
    .click();
  await expect(
    page.getByText("Recovery preview ready. No message has been sent.", {
      exact: true,
    }),
  ).toBeVisible();
  const stored = await page.evaluate(() =>
    JSON.stringify({
      session: { ...sessionStorage },
      local: { ...localStorage },
    }),
  );
  for (const secret of [
    "made-up-demo-password",
    "123456",
    "0772",
    "demo@example.com",
  ])
    expect(stored).not.toContain(secret);
  expect(mutations).toEqual([]);
  await page.getByRole("link", { name: "Explore Demo", exact: true }).click();
  await expect(page).toHaveURL(/\/w\/demo\/home$/);
});

test("leaving account previews clears unsubmitted credentials and codes on browser Back", async ({
  page,
}) => {
  await page.goto("/sign-in");
  await page.getByLabel(/^Phone number/).fill("0772 123 456");
  await page.getByLabel(/^Sample password/).fill("made-up-secret");
  await page.getByRole("link", { name: "Explore Demo", exact: true }).click();
  await expect(page).toHaveURL(/\/w\/demo\/home$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByLabel(/^Phone number/)).toHaveValue("");
  await expect(page.getByLabel(/^Sample password/)).toHaveValue("");
  await page.goto("/verify");
  await page.getByLabel(/^Sample verification code/).fill("123456");
  await page.getByRole("link", { name: "Explore Demo", exact: true }).click();
  await expect(page).toHaveURL(/\/w\/demo\/home$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/verify$/);
  await expect(page.getByLabel(/^Sample verification code/)).toHaveValue("");
});

for (const width of [320, 360, 375, 390, 428, 768, 1024, 1440]) {
  test(`entry and setup fit ${width}px, including short keyboard-sized viewports`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const path of [
      "sign-in",
      "create-account",
      "forgot-password",
      "verify",
      "onboarding",
    ]) {
      expect((await page.goto(`/${path}`))?.status()).toBe(200);
      await expect(page.locator("main h1")).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(
        page.getByRole("navigation", { name: "Mobile workspace navigation" }),
      ).toHaveCount(0);
    }
    // Keyboard-operable native radio selection, with visible labels as touch targets.
    await page.getByRole("radio", { name: /Business \/ Institution/ }).focus();
    await page.keyboard.press("Space");
    await continueSetup(page);
    await page
      .getByLabel(/^Business or institution name/)
      .fill("Responsive Demo");
    await page.getByLabel(/^Business category/).selectOption("retail");
    await page.setViewportSize({ width, height: 440 });
    const continueButton = page.getByRole("button", {
      name: "Continue",
      exact: true,
    });
    await continueButton.scrollIntoViewIfNeeded();
    const box = await continueButton.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.y + box!.height).toBeLessThanOrEqual(440);
    await continueSetup(page);
    await choose(page, "Both");
    await continueSetup(page);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await choose(page, "General Payment Receipt");
    await page
      .getByRole("button", { name: "Use Template", exact: true })
      .click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.setViewportSize({ width, height: 800 });
    if ([360, 1440].includes(width))
      await page.screenshot({
        path: `.next/validation/setup-review-${width}.png`,
        fullPage: true,
      });
    await page.emulateMedia({ reducedMotion: "reduce" });
    expect(
      await page
        .locator(".entry-actions")
        .evaluate((element) => getComputedStyle(element).animationName),
    ).toBe("none");
    expect(errors).toEqual([]);
  });
}
