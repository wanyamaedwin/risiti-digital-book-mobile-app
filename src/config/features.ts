import type { IconName } from "@/config/icons";

export type FeatureDefinition = {
  title: string;
  description: string;
  icon: IconName;
  planned: readonly string[];
};
export const features = {
  receipts: {
    title: "Receipts",
    description: "A clear home for the receipts your workspace will issue.",
    icon: "receipts",
    planned: [
      "Search and filter workspace receipts",
      "View receipt details and status",
      "Share and export receipts",
    ],
  },
  "receipts/new": {
    title: "New receipt",
    description: "A simpler way to record a sale, planned for a future step.",
    icon: "create",
    planned: [
      "Choose a receipt book and customer",
      "Add items and review totals in UGX",
      "Issue a receipt after validation",
    ],
  },
  "receipt-books": {
    title: "Receipt books",
    description: "Give every kind of receipt its own place.",
    icon: "books",
    planned: [
      "Organise receipt books by purpose",
      "Manage numbering and book details",
      "Choose a book when issuing receipts",
    ],
  },
  expenses: {
    title: "Expenses",
    description: "A thoughtful space for your everyday business spending.",
    icon: "expenses",
    planned: [
      "Record and categorise expenses",
      "Find spending by date or branch",
      "Review supporting records",
    ],
  },
  payments: {
    title: "Payments",
    description: "A future view of payment information linked to your records.",
    icon: "payments",
    planned: [
      "Review recorded payment statuses",
      "Link payment records to receipts",
      "Filter by payment method",
    ],
  },
  customers: {
    title: "Customers",
    description: "Keep the people you do business with close at hand.",
    icon: "customers",
    planned: [
      "Maintain workspace contact details",
      "Search your customer directory",
      "Link customers to future receipts",
    ],
  },
  catalog: {
    title: "Products & services",
    description: "A future catalogue for the things your business offers.",
    icon: "catalog",
    planned: [
      "Organise products and services",
      "Set prices in Uganda Shillings",
      "Choose catalogue items in future receipts",
    ],
  },
  reports: {
    title: "Reports",
    description: "Make room for a clearer view of your business.",
    icon: "reports",
    planned: [
      "Review workspace summaries",
      "Filter by date and branch",
      "Export reports when available",
    ],
  },
  staff: {
    title: "Staff",
    description: "A place for the people who help your business move forward.",
    icon: "staff",
    planned: [
      "Invite workspace members",
      "Assign workspace-scoped roles",
      "Review access with an audit trail",
    ],
  },
  branches: {
    title: "Branches",
    description: "One workspace, with room for every location.",
    icon: "branches",
    planned: [
      "Maintain branch details",
      "Assign staff to branches",
      "Scope records to their branch",
    ],
  },
  settings: {
    title: "Settings",
    description: "Future controls for your workspace, kept in one place.",
    icon: "settings",
    planned: [
      "Update business and contact details",
      "Manage workspace preferences",
      "Configure receipt defaults",
    ],
  },
  "receipts/history": {
    title: "My history",
    description:
      "A future view limited to your own activity in this workspace.",
    icon: "history",
    planned: [
      "View only your own receipt history",
      "Filter your activity by date",
      "Open records within your permitted scope",
    ],
  },
} satisfies Record<string, FeatureDefinition>;
export type FeaturePath = keyof typeof features;
export function isFeaturePath(path: string): path is FeaturePath {
  return Object.hasOwn(features, path);
}
