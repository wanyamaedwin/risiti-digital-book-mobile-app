import type {
  ReceiptTemplateField,
  StarterReceiptTemplate,
} from "@/types/receipt-template";
import type {
  BusinessCategory,
  StarterTemplateId,
  TemplateSelection,
} from "@/types/onboarding";

const systemFields: readonly ReceiptTemplateField[] = [
  {
    id: "receipt-number",
    label: "Receipt number",
    type: "text",
    required: true,
    displayOrder: 1,
    source: "system",
    systemKey: "receiptNumber",
    configurable: false,
  },
  {
    id: "issued-at",
    label: "Date",
    type: "date",
    required: true,
    displayOrder: 2,
    source: "system",
    systemKey: "issuedAt",
    configurable: false,
  },
  {
    id: "total-amount",
    label: "Total amount (UGX)",
    type: "number",
    required: true,
    displayOrder: 3,
    source: "system",
    systemKey: "totalAmount",
    configurable: false,
  },
];
const displayField = (
  id: string,
  label: string,
  type: ReceiptTemplateField["type"] = "text",
  options?: readonly string[],
): ReceiptTemplateField => ({
  id,
  label,
  type,
  required: id !== "notes",
  displayOrder: 4,
  source: "display",
  configurable: true,
  ...(options ? { options } : {}),
});

function starter(
  id: StarterTemplateId,
  name: string,
  description: string,
  recommendedCategories: readonly BusinessCategory[],
  fields: ReceiptTemplateField[],
  sample: Record<string, string | number | boolean>,
): StarterReceiptTemplate {
  const orderedFields = fields.map((field, index) => ({
    ...field,
    displayOrder: index + 4,
  }));
  return {
    id,
    name,
    description,
    recommendedCategories,
    defaultSections: [
      {
        id: "system",
        title: "Payment record",
        displayOrder: 1,
        fieldIds: systemFields.map((field) => field.id),
      },
      {
        id: "details",
        title: "Your details",
        displayOrder: 2,
        fieldIds: orderedFields.map((field) => field.id),
      },
    ],
    defaultFields: [...systemFields, ...orderedFields],
    samplePreviewData: {
      "receipt-number": "DEMO-001",
      "issued-at": "2026-01-15",
      "total-amount": 125000,
      ...sample,
    },
  };
}

/** Suggestions only: every template is selectable by every workspace/category. */
export const starterTemplates: readonly StarterReceiptTemplate[] = [
  starter(
    "general",
    "General Payment Receipt",
    "A flexible starting point for everyday payments.",
    [],
    [
      displayField("payer", "Received from"),
      displayField("purpose", "Payment for"),
      displayField("notes", "Notes"),
    ],
    {
      payer: "Sample customer",
      purpose: "Sample payment",
      notes: "Example only",
    },
  ),
  starter(
    "retail",
    "Retail Sales Receipt",
    "A simple layout for goods sold in your shop.",
    ["retail", "hospitality"],
    [
      displayField("item", "Item description"),
      displayField("quantity", "Quantity", "number"),
    ],
    { item: "Sample product", quantity: 2 },
  ),
  starter(
    "school",
    "School Fees Receipt",
    "Make room for learner and school payment details.",
    ["education"],
    [
      displayField("student", "Learner name"),
      displayField("term", "School term", "dropdown", [
        "Term 1",
        "Term 2",
        "Term 3",
      ]),
      displayField("sponsored", "Sponsored payment", "checkbox"),
    ],
    { student: "Sample learner", term: "Term 1", sponsored: false },
  ),
  starter(
    "rent",
    "Rent Receipt",
    "A starting point for property and rent payments.",
    ["rentals"],
    [
      displayField("tenant", "Payer name"),
      displayField("property", "Property / unit"),
      displayField("period", "Rental period"),
    ],
    { tenant: "Sample payer", property: "Unit A", period: "Sample month" },
  ),
  starter(
    "medical",
    "Medical / Clinic Receipt",
    "A clear layout for clinic service payments.",
    ["healthcare"],
    [
      displayField("reference", "Client reference"),
      displayField("service", "Service description"),
    ],
    { reference: "SAMPLE-001", service: "Sample service" },
  ),
  starter(
    "service",
    "Service Payment Receipt",
    "For professional work and services provided.",
    ["professional"],
    [
      displayField("client", "Client name"),
      displayField("service", "Service provided"),
    ],
    { client: "Sample client", service: "Sample service" },
  ),
  starter(
    "donations",
    "Donations / Contributions",
    "A starting point for giving and community contributions.",
    ["charity", "religious", "sacco"],
    [
      displayField("contributor", "Contributor name"),
      displayField("fund", "Fund / purpose"),
    ],
    { contributor: "Sample contributor", fund: "Sample fund" },
  ),
  starter(
    "agriculture",
    "Agriculture / Agrovet Receipt",
    "For produce, farm supplies, and related payments.",
    ["agriculture"],
    [
      displayField("item", "Produce / supply"),
      displayField("quantity", "Quantity", "number"),
      displayField("unit", "Unit", "dropdown", ["kg", "bag", "item"]),
    ],
    { item: "Sample supply", quantity: 5, unit: "kg" },
  ),
  starter(
    "blank",
    "Blank Receipt Book",
    "Start with receipt number, date, and total. Add your own details later.",
    [],
    [],
    {},
  ),
];

export function getStarterTemplate(
  id: StarterTemplateId,
): StarterReceiptTemplate {
  const template = starterTemplates.find((item) => item.id === id);
  if (!template) throw new Error("Unknown starter template");
  return template;
}
export function templateSelectionLabel(
  selection: TemplateSelection | null,
): string {
  return selection && selection.mode !== "later"
    ? getStarterTemplate(selection.templateId).name
    : "Customise later";
}
