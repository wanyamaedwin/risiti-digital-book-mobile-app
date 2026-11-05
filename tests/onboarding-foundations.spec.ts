import { test, expect } from "@playwright/test";
import {
  accountEntrySchema,
  normalizeUgandaPhone,
  verificationSchema,
} from "../src/lib/entry-validation";
import {
  detailsSchema,
  firstIncompleteStep,
  onboardingSteps,
  parseStoredOnboarding,
} from "../src/lib/onboarding";
import {
  initialOnboardingState,
  templateIds,
  type OnboardingDraft,
} from "../src/types/onboarding";
import { starterTemplates } from "../src/data/receipt-templates";

const completeBusiness: OnboardingDraft = {
  workspaceType: "business",
  name: "Sample Traders",
  category: "retail",
  customCategory: "",
  personalPurpose: "",
  primaryUse: "receipts",
  template: { mode: "template", templateId: "general" },
};

test("phone and account validation support Ugandan local/international forms without accepting invalid values", () => {
  expect(normalizeUgandaPhone("0772 123 456")).toBe("+256772123456");
  expect(normalizeUgandaPhone("256772123456")).toBe("+256772123456");
  const schema = accountEntrySchema("create-account");
  expect(
    schema.safeParse({
      method: "phone",
      identity: "+256 772 123 456",
      password: "made-up-password",
      confirmPassword: "made-up-password",
    }).success,
  ).toBe(true);
  expect(
    schema.safeParse({
      method: "email",
      identity: "demo@example.com",
      password: "made-up-password",
      confirmPassword: "different",
    }).success,
  ).toBe(false);
  expect(
    accountEntrySchema("sign-in").safeParse({
      method: "phone",
      identity: "+25612",
      password: "sample",
      confirmPassword: "",
    }).success,
  ).toBe(false);
  expect(verificationSchema.safeParse({ code: "abcdef" }).success).toBe(false);
});
test("conditional details require only the fields for the selected workspace type", () => {
  const values = {
    name: "Sample",
    category: "",
    customCategory: "",
    personalPurpose: "Household spending",
    phone: "",
    email: "",
    address: "",
  };
  expect(detailsSchema("personal").safeParse(values).success).toBe(true);
  expect(detailsSchema("business").safeParse(values).success).toBe(false);
  expect(
    detailsSchema("business").safeParse({
      ...values,
      category: "other",
      customCategory: "Community group",
    }).success,
  ).toBe(true);
  expect(
    detailsSchema("business").safeParse({ ...values, category: "other" })
      .success,
  ).toBe(false);
});
test("restored states reject unknown fields/versions and cannot skip required choices", () => {
  expect(parseStoredOnboarding("bad json")).toEqual(initialOnboardingState);
  expect(
    parseStoredOnboarding(
      JSON.stringify({ ...initialOnboardingState, version: 2 }),
    ),
  ).toEqual(initialOnboardingState);
  expect(
    parseStoredOnboarding(
      JSON.stringify({
        ...initialOnboardingState,
        password: "must-not-be-a-draft-field",
      }),
    ),
  ).toEqual(initialOnboardingState);
  const invalid = parseStoredOnboarding(
    JSON.stringify({
      ...initialOnboardingState,
      step: "success",
      completed: true,
    }),
  );
  expect(invalid.completed).toBe(false);
  expect(invalid.step).toBe("type");
  const valid = parseStoredOnboarding(
    JSON.stringify({
      version: 1,
      draft: completeBusiness,
      step: "review",
      completed: true,
    }),
  );
  expect(valid.completed).toBe(true);
  expect(valid.step).toBe("success");
  expect(firstIncompleteStep(completeBusiness)).toBe("review");
  expect(
    onboardingSteps({
      ...completeBusiness,
      primaryUse: "expenses",
      template: null,
    }),
  ).not.toContain("template");
});
test("all nine starter templates have coherent ordered fields, samples and reserved financial definitions", () => {
  expect(starterTemplates.map((template) => template.id)).toEqual([
    ...templateIds,
  ]);
  const types = new Set<string>();
  for (const template of starterTemplates) {
    const fieldIds = template.defaultFields.map((field) => field.id);
    expect(new Set(fieldIds).size).toBe(fieldIds.length);
    expect(
      template.defaultSections.flatMap((section) => section.fieldIds),
    ).toEqual(fieldIds);
    expect(template.defaultFields.map((field) => field.displayOrder)).toEqual(
      [...template.defaultFields.map((field) => field.displayOrder)].sort(
        (a, b) => a - b,
      ),
    );
    for (const field of template.defaultFields) {
      types.add(field.type);
      expect(template.samplePreviewData[field.id]).toBeDefined();
      if (field.type === "number")
        expect(typeof template.samplePreviewData[field.id]).toBe("number");
      if (field.type === "checkbox")
        expect(typeof template.samplePreviewData[field.id]).toBe("boolean");
      if (field.source === "system") expect(field.configurable).toBe(false);
      if (field.source === "display" && field.type === "dropdown")
        expect(field.options).toContain(template.samplePreviewData[field.id]);
    }
    expect(
      template.defaultFields
        .filter((field) => field.source === "system")
        .map((field) => field.systemKey),
    ).toEqual(["receiptNumber", "issuedAt", "totalAmount"]);
  }
  expect([...types].sort()).toEqual([
    "checkbox",
    "date",
    "dropdown",
    "number",
    "text",
  ]);
});
