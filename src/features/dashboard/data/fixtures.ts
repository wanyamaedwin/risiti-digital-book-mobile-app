import type {
  DashboardData,
  ExpenseSummary,
  PaymentSummary,
  ReceiptSummary,
  BillSummary,
} from "../types/dashboard";

// Fixed fictional dates. No random rendering or wall-clock-dependent financial records.
const at = (day: string, hour = "10:00") => `2026-${day}T${hour}:00+03:00`;
const business = { workspaceId: "demo", branchId: "main" };
const bill = (
  id: string,
  amount: number,
  customerId: string,
  day: string,
  branchId = "main",
): BillSummary => ({
  ...business,
  branchId,
  id,
  amount,
  customerId,
  at: at(day, "08:00"),
  status: "valid",
  adjustments: [],
});
const payment = (
  id: string,
  billId: string,
  amount: number,
  day: string,
  hour: string,
  branchId = "main",
): PaymentSummary => ({
  ...business,
  branchId,
  id,
  billId,
  amount,
  at: at(day, hour),
  kind: "incoming",
  status: "confirmed",
});
const receipt = (
  id: string,
  billId: string,
  customerId: string,
  paymentIds: string[],
  day: string,
  hour: string,
  branchId = "main",
): ReceiptSummary => ({
  ...business,
  branchId,
  id,
  number: `KT-${id}`,
  billId,
  customerId,
  paymentIds,
  at: at(day, hour),
  status: "issued",
});
const expense = (
  id: string,
  merchant: string,
  category: ExpenseSummary["category"],
  amount: number,
  day: string,
  workspaceId = "demo",
  branchId = "main",
  attachment = true,
): ExpenseSummary => ({
  id,
  workspaceId,
  branchId,
  merchant,
  category,
  amount,
  at: at(day, "14:00"),
  status: "recorded",
  attachment,
});

const bills: BillSummary[] = [
  bill("b1", 480000, "c1", "11-05"),
  {
    ...bill("b2", 300000, "c2", "11-04"),
    adjustments: [
      { at: at("11-05", "09:00"), amount: 20000, reason: "Agreed discount" },
    ],
    reminderAt: at("11-06"),
  },
  bill("b3", 220000, "c3", "11-05", "nakawa"),
  {
    ...bill("b4", 75000, "c1", "11-04"),
    status: "cancelled",
    cancelledAt: at("11-05", "12:00"),
  },
  bill("b5", 180000, "c2", "11-05"),
  bill("b6", 65000, "c3", "11-05"),
  bill("b7", 350000, "c1", "11-02"),
  bill("b8", 140000, "c3", "11-01", "nakawa"),
  bill("b9", 90000, "c2", "10-30"),
  {
    ...bill("pb1", 60000, "pc1", "11-03", "personal"),
    workspaceId: "personal",
  },
];
const payments: PaymentSummary[] = [
  payment("p1", "b1", 480000, "11-05", "09:15"),
  payment("p2", "b2", 100000, "11-05", "10:40"),
  payment("p3", "b3", 220000, "11-05", "11:20", "nakawa"),
  payment("p4", "b4", 75000, "11-04", "12:00"),
  {
    ...payment("rf4", "b4", 75000, "11-05", "12:05"),
    kind: "refund",
    reversesPaymentId: "p4",
  },
  { ...payment("pending", "b5", 180000, "11-05", "13:00"), status: "pending" },
  { ...payment("reversed", "b6", 65000, "11-05", "13:10"), status: "reversed" },
  payment("p7", "b7", 350000, "11-02", "08:30"),
  payment("p8", "b8", 140000, "11-01", "16:30", "nakawa"),
  payment("p9", "b9", 90000, "10-30", "10:00"),
  {
    ...payment("pp1", "pb1", 60000, "11-03", "15:00", "personal"),
    workspaceId: "personal",
  },
];
const receipts: ReceiptSummary[] = [
  receipt("1048", "b1", "c1", ["p1"], "11-05", "09:16"),
  receipt("1049", "b2", "c2", ["p2"], "11-05", "10:41"),
  receipt("1050", "b3", "c3", ["p3"], "11-05", "11:21", "nakawa"),
  {
    ...receipt("1047", "b4", "c1", ["p4"], "11-04", "12:01"),
    status: "voided",
    voidedAt: at("11-05", "12:00"),
  },
  { ...receipt("D051", "b5", "c2", [], "11-05", "13:00"), status: "draft" },
  receipt("1052", "b6", "c3", ["reversed"], "11-05", "13:12"),
  receipt("1046", "b7", "c1", ["p7"], "11-02", "08:31"),
  receipt("1045", "b8", "c3", ["p8"], "11-01", "16:31", "nakawa"),
  receipt("1044", "b9", "c2", ["p9"], "10-30", "10:01"),
  {
    ...receipt("001", "pb1", "pc1", ["pp1"], "11-03", "15:01", "personal"),
    workspaceId: "personal",
    number: "PB-001",
  },
];
const expenses: ExpenseSummary[] = [
  expense("e1", "City Transport Co.", "Transport", 35000, "11-05"),
  expense(
    "e2",
    "Nakawa Stationery",
    "Shopping",
    62000,
    "11-05",
    "demo",
    "nakawa",
  ),
  expense("e3", "Market Lunch Kitchen", "Food", 24000, "11-04"),
  expense("e4", "Demo Power Co.", "Utilities", 80000, "11-02"),
  expense("e5", "Office Supplies Ltd.", "Shopping", 45000, "11-01"),
  {
    ...expense("ed", "Unsubmitted estimate", "Other", 90000, "11-05"),
    status: "draft",
  },
  expense(
    "pe1",
    "Kampala Taxi",
    "Transport",
    12000,
    "11-05",
    "personal",
    "personal",
    false,
  ),
  expense(
    "pe2",
    "Neighbourhood Market",
    "Food",
    48000,
    "11-04",
    "personal",
    "personal",
  ),
  expense(
    "pe3",
    "Demo Power Co.",
    "Utilities",
    45000,
    "11-02",
    "personal",
    "personal",
  ),
  expense(
    "pe4",
    "Study Bookshop",
    "Education",
    32000,
    "11-01",
    "personal",
    "personal",
  ),
  expense(
    "pe5",
    "Community Pharmacy",
    "Health",
    18000,
    "10-30",
    "personal",
    "personal",
  ),
  expense(
    "pe6",
    "Household Shop",
    "Shopping",
    27000,
    "11-03",
    "personal",
    "personal",
    false,
  ),
];

export const emptyDashboardData: DashboardData = {
  branches: [],
  customers: [],
  bills: [],
  payments: [],
  receipts: [],
  expenses: [],
  activities: [],
};
export const dashboardFixtures: DashboardData = {
  branches: [
    { id: "main", workspaceId: "demo", name: "Main Branch" },
    { id: "nakawa", workspaceId: "demo", name: "Nakawa Branch" },
    { id: "personal", workspaceId: "personal", name: "Personal workspace" },
  ],
  customers: [
    { id: "c1", workspaceId: "demo", name: "Nile Corner Shop" },
    { id: "c2", workspaceId: "demo", name: "Sarah's Groceries" },
    { id: "c3", workspaceId: "demo", name: "Kato Hardware" },
    { id: "pc1", workspaceId: "personal", name: "Alex · shared project" },
  ],
  bills,
  payments,
  receipts,
  expenses,
  activities: [
    ...receipts
      .filter((r) => r.status !== "draft")
      .map((r) => ({
        id: `issued-${r.id}`,
        workspaceId: r.workspaceId,
        branchId: r.branchId,
        at: r.at,
        kind: "receipt" as const,
        recordId: r.id,
      })),
    ...receipts
      .filter((r) => r.voidedAt)
      .map((r) => ({
        id: `void-${r.id}`,
        workspaceId: r.workspaceId,
        branchId: r.branchId,
        at: r.voidedAt!,
        kind: "void" as const,
        recordId: r.id,
      })),
    ...payments
      .filter((p) => p.status === "confirmed")
      .map((p) => ({
        id: `paid-${p.id}`,
        workspaceId: p.workspaceId,
        branchId: p.branchId,
        at: p.at,
        kind: "payment" as const,
        recordId: p.id,
      })),
    ...expenses
      .filter((e) => e.status === "recorded")
      .map((e) => ({
        id: `spent-${e.id}`,
        workspaceId: e.workspaceId,
        branchId: e.branchId,
        at: e.at,
        kind: "expense" as const,
        recordId: e.id,
      })),
  ],
};

/** Slice before crossing the server/client boundary; never ship another workspace's records. */
export function dataForWorkspace(workspaceId: string): DashboardData {
  const scoped = <T extends { workspaceId: string }>(records: readonly T[]) =>
    records.filter((r) => r.workspaceId === workspaceId);
  return {
    branches: scoped(dashboardFixtures.branches),
    customers: scoped(dashboardFixtures.customers),
    bills: scoped(bills),
    payments: scoped(payments),
    receipts: scoped(receipts),
    expenses: scoped(expenses),
    activities: scoped(dashboardFixtures.activities),
  };
}
