export const businessCategories = [
  { id: "retail", label: "Retail and Wholesale" },
  { id: "agriculture", label: "Agriculture / Agrovet" },
  { id: "education", label: "School / Education" },
  { id: "healthcare", label: "Clinic / Healthcare" },
  { id: "rentals", label: "Real Estate / Rentals" },
  { id: "hospitality", label: "Hotel / Restaurant" },
  { id: "professional", label: "Professional Services" },
  { id: "sacco", label: "SACCO / Savings Group" },
  { id: "charity", label: "NGO / Charity" },
  { id: "religious", label: "Religious Institution" },
  { id: "other", label: "Other" },
] as const;
export type WorkspaceType = "business" | "personal";
export type BusinessCategory = (typeof businessCategories)[number]["id"];
export type PrimaryUse = "receipts" | "expenses" | "both";
export type OnboardingStep =
  "type" | "details" | "use" | "template" | "review" | "success";
export const templateIds = [
  "general",
  "retail",
  "school",
  "rent",
  "medical",
  "service",
  "donations",
  "agriculture",
  "blank",
] as const;
export type StarterTemplateId = (typeof templateIds)[number];
export type TemplateSelection =
  | { mode: "template"; templateId: StarterTemplateId }
  | { mode: "blank"; templateId: "blank" }
  | { mode: "later" };

/** Only non-sensitive display configuration is eligible for tab-scoped storage. */
export type OnboardingDraft = {
  workspaceType: WorkspaceType | null;
  name: string;
  category: BusinessCategory | "";
  customCategory: string;
  personalPurpose: string;
  primaryUse: PrimaryUse | null;
  template: TemplateSelection | null;
};
export type OnboardingState = {
  version: 1;
  draft: OnboardingDraft;
  step: OnboardingStep;
  completed: boolean;
};

/** Optional contact fields and logo URL never enter OnboardingDraft or storage. */
export type SetupDetails = Pick<
  OnboardingDraft,
  "name" | "category" | "customCategory" | "personalPurpose"
> & { phone: string; email: string; address: string };

export const primaryUseLabels: Record<PrimaryUse, string> = {
  receipts: "Issue Receipts",
  expenses: "Record Expenses",
  both: "Both",
};
export const initialOnboardingState: OnboardingState = {
  version: 1,
  step: "type",
  completed: false,
  draft: {
    workspaceType: null,
    name: "",
    category: "",
    customCategory: "",
    personalPurpose: "",
    primaryUse: null,
    template: null,
  },
};
