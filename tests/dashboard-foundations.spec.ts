import { test, expect } from "@playwright/test";
import {
  dashboardFixtures,
  dataForWorkspace,
  emptyDashboardData,
} from "../src/features/dashboard/data/fixtures";
import {
  financialSeries,
  selectDashboard,
} from "../src/features/dashboard/lib/calculations";
import {
  kampalaDate,
  periodRange,
  validDate,
} from "../src/features/dashboard/lib/dates";
import {
  dashboardEmphasis,
  dashboardRoleViews,
  quickActions,
} from "../src/features/dashboard/lib/preferences";
import type {
  DashboardData,
  DashboardFilter,
  DashboardPeriod,
} from "../src/features/dashboard/types/dashboard";
import { availableWorkspaces } from "../src/data/demo";
import { configuredWorkspace } from "../src/lib/onboarding";
import { formatUGX } from "../src/lib/currency";

const filter: DashboardFilter = {
  workspaceId: "demo",
  branchId: "all",
  period: "day",
  reportingDate: "2026-11-05",
};
const demo = dataForWorkspace("demo");

test("confirmed incoming less explicit refunds determines money received, never unpaid bills", () => {
  const result = selectDashboard(demo, filter);
  expect(result.incoming).toBe(800000);
  expect(result.refunds).toBe(75000);
  expect(result.moneyReceived).toBe(725000);
  expect(result.paymentCount).toBe(3);
  expect(result.expenseTotal).toBe(97000);
  expect(result.expenseCount).toBe(2);
  expect(result.savedReceipts).toBe(2);
  expect(formatUGX(result.moneyReceived).replace(/\s/g, " ")).toBe(
    "UGX 725,000",
  );
});

test("partial payments and dated adjustments reduce outstanding without counting whole bill values as received", () => {
  const result = selectDashboard(demo, filter);
  expect(result.outstanding).toBe(425000); // b2:180k + b5:180k + b6:65k
  expect(result.partialBills).toBe(1);
  expect(result.reminders).toBe(1);
  const partial = result.receipts.find((r) => r.billId === "b2")!;
  expect(partial.amountReceived).toBe(100000);
  expect(partial.paymentStatus).toBe("Partially Paid");
  expect(result.receipts.find((r) => r.billId === "b6")?.paymentStatus).toBe(
    "Unpaid",
  );
});

test("receipt counts exclude drafts and voids while voiding preserves cash and audit history", () => {
  const result = selectDashboard(demo, filter);
  expect(result.receiptCount).toBe(4);
  expect(result.draftCount).toBe(1);
  const changed = {
    ...demo,
    receipts: demo.receipts.map((r) =>
      r.id === "1048"
        ? {
            ...r,
            status: "voided" as const,
            voidedAt: "2026-11-05T10:00:00+03:00",
          }
        : r,
    ),
  };
  expect(selectDashboard(changed, filter).receiptCount).toBe(3);
  expect(selectDashboard(changed, filter).moneyReceived).toBe(
    result.moneyReceived,
  );
  const week = selectDashboard(demo, { ...filter, period: "week" });
  expect(week.receipts.find((r) => r.id === "1047")?.paymentStatus).toBe(
    "Voided",
  );
  expect(week.receipts.find((r) => r.id === "1047")?.amountReceived).toBe(0);
  expect(
    week.activities.some((a) => a.kind === "void" && a.recordId === "1047"),
  ).toBe(true);
  expect(
    week.activities.some((a) => a.description.includes("Refund sent")),
  ).toBe(true);
});

test("refunds reopen valid bill balances, have explicit receipt status, and ignore invalid links", () => {
  const partialRefund = {
    ...demo.payments[0],
    id: "refund-test",
    amount: 50000,
    kind: "refund" as const,
    reversesPaymentId: "p1",
  };
  const partial = selectDashboard(
    { ...demo, payments: [...demo.payments, partialRefund] },
    filter,
  );
  expect(partial.moneyReceived).toBe(675000);
  expect(partial.outstanding).toBe(475000);
  const full = selectDashboard(
    {
      ...demo,
      payments: [...demo.payments, { ...partialRefund, amount: 480000 }],
    },
    filter,
  );
  expect(full.receipts.find((r) => r.id === "1048")?.paymentStatus).toBe(
    "Refunded",
  );
  expect(full.receiptCount).toBe(4); // valid issued document remains; refund is separate
  expect(
    selectDashboard(
      {
        ...demo,
        payments: [
          ...demo.payments,
          { ...partialRefund, reversesPaymentId: "missing" },
        ],
      },
      filter,
    ).moneyReceived,
  ).toBe(725000);
  expect(
    selectDashboard(
      {
        ...demo,
        payments: [
          ...demo.payments,
          { ...partialRefund, at: "2026-11-06T10:00:00+03:00" },
        ],
      },
      filter,
    ).moneyReceived,
  ).toBe(725000);
});

test("day/week/month filters use Kampala dates, Monday weeks and as-of balances", () => {
  expect(periodRange({ ...filter, period: "week" })).toEqual({
    start: "2026-11-02",
    end: "2026-11-05",
  });
  expect(periodRange({ ...filter, period: "month" })).toEqual({
    start: "2026-11-01",
    end: "2026-11-05",
  });
  expect(
    selectDashboard(demo, { ...filter, period: "week" }).moneyReceived,
  ).toBe(1150000);
  expect(
    selectDashboard(demo, { ...filter, period: "month" }).moneyReceived,
  ).toBe(1290000);
  const previous = selectDashboard(demo, {
    ...filter,
    reportingDate: "2026-11-04",
  });
  expect(previous.moneyReceived).toBe(75000);
  expect(previous.outstanding).toBe(300000);
  expect(previous.receipts.find((r) => r.id === "1047")?.paymentStatus).toBe(
    "Paid",
  );
  expect(kampalaDate("2026-11-04T21:30:00Z")).toBe("2026-11-05");
  const midnight = {
    ...demo.payments[0],
    id: "midnight",
    billId: null,
    at: "2026-11-04T21:30:00Z",
    amount: 1000,
  };
  expect(
    selectDashboard({ ...demo, payments: [...demo.payments, midnight] }, filter)
      .moneyReceived,
  ).toBe(726000);
  expect(validDate("2026-02-30")).toBe(false);
  expect(validDate("2028-02-29")).toBe(true);
});

test("branch filters scope payments, balances, documents, expenses and activity together", () => {
  const nakawa = selectDashboard(demo, { ...filter, branchId: "nakawa" });
  expect(nakawa.moneyReceived).toBe(220000);
  expect(nakawa.receiptCount).toBe(1);
  expect(nakawa.expenseTotal).toBe(62000);
  expect(nakawa.outstanding).toBe(0);
  expect(nakawa.activities.every((a) => a.branchId === "nakawa")).toBe(true);
  expect(
    selectDashboard(demo, { ...filter, branchId: "main" }).moneyReceived,
  ).toBe(505000);
});

test("workspace fixtures and selectors isolate every data collection", () => {
  for (const id of ["demo", "personal", "sample", "setup"]) {
    const data = dataForWorkspace(id);
    for (const rows of Object.values(data))
      expect(
        rows.every((r: { workspaceId: string }) => r.workspaceId === id),
      ).toBe(true);
  }
  expect(selectDashboard(dashboardFixtures, filter)).toEqual(
    selectDashboard(demo, filter),
  );
  const personal = selectDashboard(dashboardFixtures, {
    ...filter,
    workspaceId: "personal",
    period: "month",
  });
  expect(personal.expenseTotal).toBe(164000);
  expect(personal.expenseCount).toBe(5);
  expect(personal.savedReceipts).toBe(3);
  expect(personal.receiptCount).toBe(1);
  expect(personal.moneyReceived).toBe(60000);
  expect(
    personal.categories.reduce((sum, category) => sum + category.amount, 0),
  ).toBe(personal.expenseTotal);
});

test("empty workspaces have zero financials, no fictional records and useful empty chart points", () => {
  const result = selectDashboard(emptyDashboardData, filter);
  for (const value of Object.values(result))
    expect(Array.isArray(value) ? value.length : value).toBe(0);
  expect(dataForWorkspace("setup")).toEqual(emptyDashboardData);
  expect(
    financialSeries(emptyDashboardData, filter).every(
      (point) => point.value === 0,
    ),
  ).toBe(true);
});

test("chart buckets reconcile with metrics including negative refunds and date boundaries", () => {
  for (const period of ["day", "week", "month"] as DashboardPeriod[])
    for (const branchId of ["all", "main", "nakawa"]) {
      const selected = { ...filter, period, branchId };
      expect(
        financialSeries(demo, selected).reduce(
          (sum, point) => sum + point.value,
          0,
        ),
      ).toBe(selectDashboard(demo, selected).moneyReceived);
    }
  const refundOnly: DashboardData = {
    ...demo,
    payments: demo.payments.filter((p) => ["p4", "rf4"].includes(p.id)),
  };
  expect(
    financialSeries(refundOnly, filter).some((point) => point.value === -75000),
  ).toBe(true);
});

test("deterministic fixtures have valid links, unique IDs and integer UGX amounts", () => {
  for (const rows of Object.values(dashboardFixtures))
    expect(new Set(rows.map((r: { id: string }) => r.id)).size).toBe(
      rows.length,
    );
  for (const payment of dashboardFixtures.payments) {
    expect(Number.isSafeInteger(payment.amount) && payment.amount >= 0).toBe(
      true,
    );
    expect(
      dashboardFixtures.bills.some(
        (b) =>
          b.id === payment.billId &&
          b.workspaceId === payment.workspaceId &&
          b.branchId === payment.branchId,
      ),
    ).toBe(true);
  }
  for (const receipt of dashboardFixtures.receipts) {
    expect(
      dashboardFixtures.customers.some(
        (c) =>
          c.id === receipt.customerId && c.workspaceId === receipt.workspaceId,
      ),
    ).toBe(true);
    for (const id of receipt.paymentIds)
      expect(
        dashboardFixtures.payments.some(
          (p) =>
            p.id === id &&
            p.billId === receipt.billId &&
            p.workspaceId === receipt.workspaceId,
        ),
      ).toBe(true);
  }
});

test("all three typed setup preferences change emphasis without restricting other tools", () => {
  const workspace = availableWorkspaces[0];
  for (const primaryUse of ["receipts", "expenses", "both"] as const) {
    const configured = { ...workspace, dashboardPreferences: { primaryUse } };
    expect(dashboardEmphasis(configured)).toBe(primaryUse);
    const actions = quickActions(configured);
    expect(actions.map((a) => a.label)).toContain("New Receipt");
    expect(actions.map((a) => a.label)).toContain("Record Expense");
    expect(actions[0].label).toBe(
      primaryUse === "expenses" ? "Record Expense" : "New Receipt",
    );
    const fromSetup = configuredWorkspace({
      workspaceType: "personal",
      name: "Any name",
      category: "",
      customCategory: "",
      personalPurpose: "Spending",
      primaryUse,
      template: null,
    });
    expect(dashboardEmphasis(fromSetup)).toBe(primaryUse);
    expect(fromSetup.kind).toBe("personal");
  }
});

test("six role view configurations never give cashier or platform administrators owner financials", () => {
  expect(Object.keys(dashboardRoleViews)).toHaveLength(6);
  expect(dashboardRoleViews.business_owner.view).toBe("business");
  expect(dashboardRoleViews.individual.view).toBe("personal");
  for (const role of [
    "cashier",
    "manager",
    "accountant",
    "platform_administrator",
  ] as const) {
    expect(dashboardRoleViews[role].view).toBe("restricted");
    expect(dashboardRoleViews[role].organizationFinancials).toBe(false);
  }
});
