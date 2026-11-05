import { formatUGX } from "../../../lib/currency";
import { displayDate, kampalaDate, periodRange, shiftDate } from "./dates";
import type {
  ActivityView,
  DashboardData,
  DashboardFilter,
  DashboardSummary,
  PaymentSummary,
  ReceiptView,
} from "../types/dashboard";

/** All money is non-negative integer UGX; refund direction carries the sign. */
export function signedPayment(payment: PaymentSummary): number {
  return payment.kind === "refund" ? -payment.amount : payment.amount;
}
function settledPayments(
  data: DashboardData,
  filter: DashboardFilter,
): PaymentSummary[] {
  const payments = data.payments.filter(
    (p) =>
      p.workspaceId === filter.workspaceId &&
      (filter.branchId === "all" || p.branchId === filter.branchId) &&
      kampalaDate(p.at) <= filter.reportingDate &&
      p.status === "confirmed",
  );
  return payments.filter(
    (p) =>
      p.kind === "incoming" ||
      payments.some(
        (original) =>
          original.id === p.reversesPaymentId &&
          original.kind === "incoming" &&
          original.branchId === p.branchId &&
          original.billId === p.billId &&
          Date.parse(original.at) <= Date.parse(p.at),
      ),
  );
}
export function selectDashboard(
  data: DashboardData,
  filter: DashboardFilter,
): DashboardSummary {
  const { start, end } = periodRange(filter);
  const scope = (row: { workspaceId: string; branchId: string }) =>
    row.workspaceId === filter.workspaceId &&
    (filter.branchId === "all" || row.branchId === filter.branchId);
  const asOf = (at: string) => kampalaDate(at) <= end;
  const inPeriod = (at: string) => {
    const date = kampalaDate(at);
    return date >= start && date <= end;
  };
  const settled = settledPayments(data, filter);
  const currentPayments = settled.filter((p) => inPeriod(p.at));
  const billRows = data.bills.filter((b) => scope(b) && asOf(b.at));
  const balance = (id: string) => {
    const b = billRows.find((b) => b.id === id);
    if (
      !b ||
      (b.status === "cancelled" && (!b.cancelledAt || asOf(b.cancelledAt)))
    )
      return { due: 0, paid: 0, total: 0 };
    const total = Math.max(
      0,
      b.amount -
        b.adjustments
          .filter((a) => asOf(a.at))
          .reduce((sum, a) => sum + a.amount, 0),
    );
    const paid = settled
      .filter((p) => p.billId === id)
      .reduce((sum, p) => sum + signedPayment(p), 0);
    return { due: Math.max(0, total - paid), paid, total };
  };
  const issued = data.receipts.filter((r) => scope(r) && asOf(r.at));
  const receiptViews: ReceiptView[] = issued
    .filter((r) => r.status !== "draft" && inPeriod(r.at))
    .map((r) => {
      const linkedIncoming = settled.filter(
        (p) =>
          r.paymentIds.includes(p.id) &&
          p.kind === "incoming" &&
          p.billId === r.billId &&
          p.branchId === r.branchId,
      );
      const linkedRefunds = settled.filter(
        (p) =>
          p.kind === "refund" &&
          linkedIncoming.some(
            (original) => original.id === p.reversesPaymentId,
          ),
      );
      const amountReceived = [...linkedIncoming, ...linkedRefunds].reduce(
        (sum, p) => sum + signedPayment(p),
        0,
      );
      const voided = r.status === "voided" && (!r.voidedAt || asOf(r.voidedAt));
      const { due } = balance(r.billId);
      const paymentStatus: ReceiptView["paymentStatus"] = voided
        ? "Voided"
        : linkedRefunds.length && amountReceived <= 0
          ? "Refunded"
          : amountReceived <= 0
            ? "Unpaid"
            : due > 0
              ? "Partially Paid"
              : "Paid";
      return {
        ...r,
        amountReceived,
        paymentStatus,
        customer:
          data.customers.find(
            (c) =>
              c.workspaceId === filter.workspaceId && c.id === r.customerId,
          )?.name ?? "Payer",
        branch:
          data.branches.find(
            (b) => b.workspaceId === filter.workspaceId && b.id === r.branchId,
          )?.name ?? "Main Branch",
      };
    })
    .sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
  const expenses = data.expenses
    .filter((e) => scope(e) && e.status === "recorded" && inPeriod(e.at))
    .sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
  const categories: DashboardSummary["categories"] = [];
  for (const expense of expenses) {
    const category = categories.find((c) => c.category === expense.category);
    if (category) {
      category.amount += expense.amount;
      category.count++;
    } else
      categories.push({
        category: expense.category,
        amount: expense.amount,
        count: 1,
      });
  }
  const activities: ActivityView[] = [];
  for (const activity of data.activities.filter(
    (a) => scope(a) && inPeriod(a.at),
  )) {
    if (activity.kind === "receipt" || activity.kind === "void") {
      const r = issued.find(
        (r) => r.id === activity.recordId && r.status !== "draft",
      );
      if (!r || (activity.kind === "void" && !r.voidedAt)) continue;
      const payer =
        data.customers.find(
          (c) => c.workspaceId === filter.workspaceId && c.id === r.customerId,
        )?.name ?? "Payer";
      activities.push({
        ...activity,
        icon: "receipts",
        description:
          activity.kind === "void"
            ? `Receipt ${r.number} voided · audit retained`
            : `Receipt ${r.number} issued to ${payer}`,
      });
    } else if (activity.kind === "payment") {
      const p = settled.find((p) => p.id === activity.recordId);
      if (!p) continue;
      const b = billRows.find((b) => b.id === p.billId);
      const payer =
        data.customers.find(
          (c) => c.workspaceId === filter.workspaceId && c.id === b?.customerId,
        )?.name ?? "Payer";
      activities.push({
        ...activity,
        icon: "payments",
        description: `${p.kind === "refund" ? "Refund sent" : "Customer payment received"} · ${payer} · ${formatUGX(p.amount)}`,
      });
    } else {
      const e = expenses.find((e) => e.id === activity.recordId);
      if (!e) continue;
      activities.push({
        ...activity,
        icon: "expenses",
        description: `Expense recorded · ${e.merchant} · ${formatUGX(e.amount)}`,
      });
    }
  }
  const balances = billRows.map((b) => ({ bill: b, ...balance(b.id) }));
  const incoming = currentPayments
    .filter((p) => p.kind === "incoming")
    .reduce((s, p) => s + p.amount, 0);
  const refunds = currentPayments
    .filter((p) => p.kind === "refund")
    .reduce((s, p) => s + p.amount, 0);
  return {
    incoming,
    refunds,
    moneyReceived: incoming - refunds,
    receiptCount: receiptViews.filter((r) => r.paymentStatus !== "Voided")
      .length,
    outstanding: balances.reduce((s, b) => s + b.due, 0),
    paymentCount: currentPayments.filter((p) => p.kind === "incoming").length,
    expenseTotal: expenses.reduce((s, e) => s + e.amount, 0),
    expenseCount: expenses.length,
    savedReceipts: expenses.filter((e) => e.attachment).length,
    draftCount: issued.filter((r) => r.status === "draft").length,
    partialBills: balances.filter((b) => b.paid > 0 && b.due > 0).length,
    reminders: balances.filter((b) => b.due > 0 && b.bill.reminderAt).length,
    receipts: receiptViews,
    expenses,
    activities: activities.sort((a, b) => Date.parse(b.at) - Date.parse(a.at)),
    categories: categories.sort((a, b) => b.amount - a.amount),
  };
}

export type ChartPoint = { label: string; value: number };
export function financialSeries(
  data: DashboardData,
  filter: DashboardFilter,
): ChartPoint[] {
  const { start, end } = periodRange(filter);
  const payments = settledPayments(data, filter).filter(
    (p) => kampalaDate(p.at) >= start,
  );
  const hours = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    hourCycle: "h23",
    timeZone: "Africa/Kampala",
  });
  if (filter.period === "day") {
    const points = Array.from({ length: 6 }, (_, index) => ({
      label: `${String(index * 4).padStart(2, "0")}:00`,
      value: 0,
    }));
    for (const payment of payments)
      points[
        Math.floor(Number(hours.format(new Date(payment.at))) / 4)
      ].value += signedPayment(payment);
    return points;
  }
  const points: ChartPoint[] = [];
  for (let day = start; day <= end; day = shiftDate(day, 1))
    points.push({
      label: displayDate(day),
      value: payments
        .filter((p) => kampalaDate(p.at) === day)
        .reduce((sum, p) => sum + signedPayment(p), 0),
    });
  return points;
}
