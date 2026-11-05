import type { BusinessCategory, StarterTemplateId } from "@/types/onboarding";

export type ReceiptFieldType =
  "text" | "number" | "date" | "dropdown" | "checkbox";
type FieldBase = {
  id: string;
  label: string;
  type: ReceiptFieldType;
  required: boolean;
  displayOrder: number;
};
export type ReceiptTemplateField = FieldBase &
  (
    | {
        source: "system";
        systemKey: "receiptNumber" | "issuedAt" | "totalAmount";
        configurable: false;
      }
    | { source: "display"; configurable: true; options?: readonly string[] }
  );
export type ReceiptTemplateSection = {
  id: string;
  title: string;
  displayOrder: number;
  fieldIds: readonly string[];
};
export type StarterReceiptTemplate = {
  id: StarterTemplateId;
  name: string;
  description: string;
  recommendedCategories: readonly BusinessCategory[];
  defaultSections: readonly ReceiptTemplateSection[];
  defaultFields: readonly ReceiptTemplateField[];
  samplePreviewData: Readonly<Record<string, string | number | boolean>>;
};
