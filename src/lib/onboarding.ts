import { z } from "zod";
import {
  businessCategories,
  initialOnboardingState,
  templateIds,
  type OnboardingDraft,
  type OnboardingState,
  type OnboardingStep,
  type SetupDetails,
  type WorkspaceType,
} from "@/types/onboarding";
import { ugandaPhoneSchema } from "@/lib/entry-validation";
import type { Workspace } from "@/types/workspace";

const categoryIds = businessCategories.map((category) => category.id);
const selectionSchema = z.discriminatedUnion("mode", [
  z
    .object({ mode: z.literal("template"), templateId: z.enum(templateIds) })
    .strict(),
  z
    .object({ mode: z.literal("blank"), templateId: z.literal("blank") })
    .strict(),
  z.object({ mode: z.literal("later") }).strict(),
]);
export const draftSchema = z
  .object({
    workspaceType: z.enum(["business", "personal"]).nullable(),
    name: z.string().max(80),
    category: z.union([z.enum(categoryIds), z.literal("")]),
    customCategory: z.string().max(80),
    personalPurpose: z.string().max(80),
    primaryUse: z.enum(["receipts", "expenses", "both"]).nullable(),
    template: selectionSchema.nullable(),
  })
  .strict();
const storedSchema = z
  .object({
    version: z.literal(1),
    draft: draftSchema,
    step: z.enum(["type", "details", "use", "template", "review", "success"]),
    completed: z.boolean(),
  })
  .strict();

export function detailsSchema(type: WorkspaceType) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Use at least two characters for your workspace name.")
        .max(80, "Keep the name to 80 characters."),
      category: z.union([z.enum(categoryIds), z.literal("")]),
      customCategory: z.string().trim().max(80),
      personalPurpose: z.string().trim().max(80),
      phone: z.string().max(30),
      email: z.string().trim().max(254),
      address: z.string().trim().max(160),
    })
    .superRefine((values, context) => {
      if (type === "business" && !values.category)
        context.addIssue({
          code: "custom",
          path: ["category"],
          message: "Choose a category, or select Other.",
        });
      if (
        type === "business" &&
        values.category === "other" &&
        values.customCategory.length < 2
      )
        context.addIssue({
          code: "custom",
          path: ["customCategory"],
          message: "Tell us your category in at least two characters.",
        });
      if (type === "personal" && !values.personalPurpose.trim())
        context.addIssue({
          code: "custom",
          path: ["personalPurpose"],
          message: "Choose what your personal workspace is mainly for.",
        });
      if (
        type === "business" &&
        values.phone &&
        !ugandaPhoneSchema.safeParse(values.phone).success
      )
        context.addIssue({
          code: "custom",
          path: ["phone"],
          message:
            "Enter a valid +256 or 0-prefixed Ugandan phone number, or leave this blank.",
        });
      if (
        type === "business" &&
        values.email &&
        !z.email().safeParse(values.email).success
      )
        context.addIssue({
          code: "custom",
          path: ["email"],
          message: "Enter a valid email address, or leave this blank.",
        });
    });
}

export function draftDetails(draft: OnboardingDraft): SetupDetails {
  return {
    name: draft.name,
    category: draft.category,
    customCategory: draft.customCategory,
    personalPurpose: draft.personalPurpose,
    phone: "",
    email: "",
    address: "",
  };
}
export function needsReceiptBook(draft: OnboardingDraft): boolean {
  return draft.primaryUse === "receipts" || draft.primaryUse === "both";
}
export function onboardingSteps(draft: OnboardingDraft): OnboardingStep[] {
  return [
    "type",
    "details",
    "use",
    ...(draft.primaryUse === "expenses" ? [] : ["template" as const]),
    "review",
  ];
}
export function firstIncompleteStep(draft: OnboardingDraft): OnboardingStep {
  if (!draft.workspaceType) return "type";
  if (
    !detailsSchema(draft.workspaceType).safeParse(draftDetails(draft)).success
  )
    return "details";
  if (!draft.primaryUse) return "use";
  if (needsReceiptBook(draft) && !draft.template) return "template";
  return "review";
}
export function parseStoredOnboarding(raw: string | null): OnboardingState {
  if (!raw) return initialOnboardingState;
  try {
    const parsed = storedSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return initialOnboardingState;
    const first = firstIncompleteStep(parsed.data.draft);
    const completed = parsed.data.completed && first === "review";
    const steps = onboardingSteps(parsed.data.draft);
    let step: OnboardingStep = parsed.data.step;
    if (completed) step = "success";
    else if (
      step === "success" ||
      !steps.includes(step) ||
      steps.indexOf(step) > steps.indexOf(first)
    )
      step = first;
    return { ...parsed.data, completed, step };
  } catch {
    return initialOnboardingState;
  }
}
export function configuredWorkspace(draft: OnboardingDraft): Workspace {
  return {
    id: "setup",
    name: draft.name.trim(),
    initials: draft.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase(),
    branch:
      draft.workspaceType === "personal" ? "Personal workspace" : "Main Branch",
    currency: "UGX",
    role: draft.workspaceType === "personal" ? "individual" : "business_owner",
    isDemo: true,
    kind: draft.workspaceType ?? "business",
  };
}
