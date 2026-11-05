import type { IconName } from "@/config/icons";
import type { PrimaryUse } from "@/types/onboarding";

export type DashboardPeriod = "day" | "week" | "month";
export type WorkspaceDashboardPreferences = { primaryUse: PrimaryUse };
export type DashboardFilter = {
  workspaceId: string;
  period: DashboardPeriod;
  reportingDate: string;
  branchId: string;
};
type ScopedRecord = {
  id: string;
  workspaceId: string;
  branchId: string;
  at: string;
};
export type PaymentSummary = ScopedRecord & {
  billId: string | null;
  amount: number;
  kind: "incoming" | "refund";
  status: "confirmed" | "pending" | "reversed";
  reversesPaymentId?: string;
};
export type ReceiptSummary = ScopedRecord & {
  number: string;
  customerId: string;
  billId: string;
  paymentIds: readonly string[];
  status: "issued" | "draft" | "voided";
  voidedAt?: string;
};
export type SpendingCategory =
  | "Transport"
  | "Food"
  | "Shopping"
  | "Utilities"
  | "Education"
  | "Health"
  | "Other";
export type ExpenseSummary = ScopedRecord & {
  merchant: string;
  category: SpendingCategory;
  amount: number;
  status: "recorded" | "draft";
  attachment: boolean;
};
export type BillSummary = ScopedRecord & {
  customerId: string;
  amount: number;
  status: "valid" | "cancelled";
  cancelledAt?: string;
  adjustments: readonly { at: string; amount: number; reason: string }[];
  reminderAt?: string;
};
export type DashboardActivity = {
  id: string;
  workspaceId: string;
  branchId: string;
  at: string;
  kind: "receipt" | "payment" | "expense" | "void";
  recordId: string;
};
export type DashboardData = {
  branches: readonly { id: string; workspaceId: string; name: string }[];
  customers: readonly { id: string; workspaceId: string; name: string }[];
  receipts: readonly ReceiptSummary[];
  payments: readonly PaymentSummary[];
  expenses: readonly ExpenseSummary[];
  bills: readonly BillSummary[];
  activities: readonly DashboardActivity[];
};
export type DashboardMetric = {
  id: string;
  label: string;
  value: number;
  format: "money" | "count";
  note: string;
  icon: IconName;
};
export type DashboardQuickAction = {
  label: string;
  path: string;
  icon: IconName;
  emphasis?: boolean;
};
export type ReceiptView = ReceiptSummary & {
  customer: string;
  branch: string;
  amountReceived: number;
  paymentStatus: "Paid" | "Partially Paid" | "Unpaid" | "Voided" | "Refunded";
};
export type ActivityView = DashboardActivity & {
  description: string;
  icon: IconName;
};
export type DashboardSummary = {
  incoming: number;
  refunds: number;
  moneyReceived: number;
  receiptCount: number;
  outstanding: number;
  paymentCount: number;
  expenseTotal: number;
  expenseCount: number;
  savedReceipts: number;
  draftCount: number;
  partialBills: number;
  reminders: number;
  receipts: ReceiptView[];
  expenses: ExpenseSummary[];
  activities: ActivityView[];
  categories: { category: SpendingCategory; amount: number; count: number }[];
};
