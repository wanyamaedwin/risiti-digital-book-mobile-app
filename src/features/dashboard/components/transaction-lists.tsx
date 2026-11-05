import Link from "next/link";
import { Paperclip, ReceiptText } from "lucide-react";
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge";
import { icons } from "@/config/icons";
import { workspaceHref } from "@/config/navigation";
import { formatUGX } from "@/lib/currency";
import { displayDate, displayTime } from "../lib/dates";
import type {
  ActivityView,
  ExpenseSummary,
  ReceiptView,
} from "../types/dashboard";
import { DashboardSection } from "./dashboard-primitives";

const tones: Record<ReceiptView["paymentStatus"], StatusTone> = {
  Paid: "success",
  "Partially Paid": "warning",
  Unpaid: "neutral",
  Voided: "error",
  Refunded: "info",
};
export function ReceiptListItem({
  receipt,
  personal = false,
}: {
  receipt: ReceiptView;
  personal?: boolean;
}) {
  return (
    <li className="min-w-0 space-y-2 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-caption font-semibold">{receipt.customer}</p>
          <p className="mt-1 text-metadata text-muted-foreground">
            {receipt.number} · {displayDate(receipt.at)}
          </p>
        </div>
        <ReceiptText
          aria-hidden="true"
          className="size-4 shrink-0 text-primary"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-caption font-semibold tabular-nums">
          {formatUGX(receipt.amountReceived)}
          <span className="block text-metadata font-normal text-muted-foreground">
            Amount received
            {receipt.amountReceived === 0 && receipt.paymentStatus === "Voided"
              ? " after refund"
              : ""}
          </span>
        </p>
        <StatusBadge tone={tones[receipt.paymentStatus]}>
          {receipt.paymentStatus}
        </StatusBadge>
      </div>
      {!personal && (
        <p className="text-metadata text-muted-foreground">{receipt.branch}</p>
      )}
    </li>
  );
}
export function ExpenseListItem({ expense }: { expense: ExpenseSummary }) {
  return (
    <li className="min-w-0 py-4">
      <div className="flex flex-wrap justify-between gap-2">
        <p className="text-caption font-semibold">{expense.merchant}</p>
        <p className="text-caption font-semibold tabular-nums">
          {formatUGX(expense.amount)}
        </p>
      </div>
      <p className="mt-1 text-metadata text-muted-foreground">
        {expense.category} · {displayDate(expense.at)}
      </p>
      <p className="mt-2 inline-flex items-center gap-1 text-metadata text-muted-foreground">
        {expense.attachment && (
          <Paperclip aria-hidden="true" className="size-3.5" />
        )}
        {expense.attachment
          ? "Expense receipt saved"
          : "Manual entry · no attachment"}
      </p>
    </li>
  );
}
export function ActivityListItem({ activity }: { activity: ActivityView }) {
  const Icon = icons[activity.icon];
  return (
    <li className="flex min-w-0 gap-3 py-3">
      <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-caption">{activity.description}</p>
        <time
          dateTime={activity.at}
          className="mt-1 block text-metadata text-muted-foreground"
        >
          {displayDate(activity.at)} · {displayTime(activity.at)} EAT
        </time>
      </div>
    </li>
  );
}
function ViewAll({
  workspaceId,
  expenses = false,
}: {
  workspaceId: string;
  expenses?: boolean;
}) {
  return (
    <Link
      href={workspaceHref(workspaceId, expenses ? "expenses" : "receipts")}
      className="inline-flex min-h-11 items-center text-caption font-semibold text-primary hover:underline"
    >
      {expenses ? "View expense records" : "View all receipts"}{" "}
      <span className="sr-only">(planned feature)</span>
    </Link>
  );
}
export function RecentReceipts({
  receipts,
  workspaceId,
  personal = false,
}: {
  receipts: ReceiptView[];
  workspaceId: string;
  personal?: boolean;
}) {
  return (
    <DashboardSection
      title={personal ? "Receipts you issued" : "Recent receipts"}
      description={
        personal
          ? "For money you collected. Separate from expense attachments."
          : "Issued documents · amounts actually received, net of refunds."
      }
      action={<ViewAll workspaceId={workspaceId} />}
    >
      {receipts.length ? (
        <ul className="divide-y divide-border/60">
          {receipts.slice(0, 5).map((receipt) => (
            <ReceiptListItem
              key={receipt.id}
              receipt={receipt}
              personal={personal}
            />
          ))}
        </ul>
      ) : (
        <p className="py-4 text-caption text-muted-foreground">
          No issued receipts in this period.
        </p>
      )}
    </DashboardSection>
  );
}
export function RecentExpenses({
  expenses,
  workspaceId,
}: {
  expenses: ExpenseSummary[];
  workspaceId: string;
}) {
  return (
    <DashboardSection
      title="Recent expenses"
      description="Outgoing spending · saved receipts belong to these expenses."
      action={<ViewAll workspaceId={workspaceId} expenses />}
    >
      {expenses.length ? (
        <ul className="divide-y divide-border/60">
          {expenses.slice(0, 5).map((expense) => (
            <ExpenseListItem key={expense.id} expense={expense} />
          ))}
        </ul>
      ) : (
        <p className="py-4 text-caption text-muted-foreground">
          No recorded expenses in this period.
        </p>
      )}
    </DashboardSection>
  );
}
export function RecentActivity({ activities }: { activities: ActivityView[] }) {
  return (
    <DashboardSection
      title="Recent activity"
      description="Fictional record history · Africa/Kampala"
    >
      <p className="text-metadata text-muted-foreground">
        Latest {Math.min(activities.length, 8)} of {activities.length} events in
        this period.
      </p>
      {activities.length ? (
        <ul className="divide-y divide-border/60">
          {activities.slice(0, 8).map((activity) => (
            <ActivityListItem key={activity.id} activity={activity} />
          ))}
        </ul>
      ) : (
        <p className="py-4 text-caption text-muted-foreground">
          No activity in this period.
        </p>
      )}
    </DashboardSection>
  );
}
