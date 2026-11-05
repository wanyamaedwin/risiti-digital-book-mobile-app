"use client";

import type { ReactNode } from "react";
import { PageContainer } from "@/components/layout/page-patterns";
import { PageHeading } from "@/components/shared/typography";
import { StatusBadge } from "@/components/shared/status-badge";
import { workspaceHref } from "@/config/navigation";
import type { DemoUser, Workspace } from "@/types/workspace";
import type { DashboardData, DashboardMetric } from "../types/dashboard";
import { useDashboard } from "../hooks/use-dashboard";
import { dashboardEmphasis, quickActions } from "../lib/preferences";
import { DashboardFilters } from "./dashboard-filters";
import {
  DashboardEmptyState,
  DashboardMetricGrid,
  DashboardSection,
  FinancialSummaryCard,
  QuickActionGrid,
} from "./dashboard-primitives";
import { FinancialOverviewCard, SpendingBreakdown } from "./financial-overview";
import {
  RecentActivity,
  RecentExpenses,
  RecentReceipts,
} from "./transaction-lists";

export function BusinessDashboard({
  workspace,
  user,
  data,
  recommendations,
}: {
  workspace: Workspace;
  user: DemoUser;
  data: DashboardData;
  recommendations?: ReactNode;
}) {
  const { filter, setFilter, summary, points, range } = useDashboard(
    workspace,
    data,
  );
  const use = dashboardEmphasis(workspace);
  const suffix =
    filter.period === "day"
      ? "Today"
      : filter.period === "week"
        ? "This Week"
        : "This Month";
  const metrics: DashboardMetric[] = [
    {
      id: "receipts",
      label: `Receipts Issued ${suffix}`,
      value: summary.receiptCount,
      format: "count",
      note: "Issued documents; excludes drafts and voids",
      icon: "receipts",
    },
    {
      id: "outstanding",
      label: "Outstanding Balances",
      value: summary.outstanding,
      format: "money",
      note: "As of reporting date · all valid bills",
      icon: "books",
    },
    {
      id: "payments",
      label: "Payments Received",
      value: summary.paymentCount,
      format: "count",
      note: "Confirmed incoming payments in period",
      icon: "payments",
    },
    {
      id: "expenses",
      label: "Recorded Expenses",
      value: summary.expenseTotal,
      format: "money",
      note: `${summary.expenseCount} recorded expenses in period`,
      icon: "expenses",
    },
  ];
  if (use === "expenses") metrics.unshift(metrics.pop()!);
  const noRecords =
    !data.receipts.length &&
    !data.expenses.length &&
    !data.payments.length &&
    !data.bills.length;
  return (
    <PageContainer>
      <PageHeading
        eyebrow={`${workspace.name} · ${workspace.branch}`}
        title={`Welcome, ${user.name.split(" ")[0]}.`}
        description={
          use === "expenses"
            ? "A clearer picture of your business spending."
            : "Your business, a little clearer."
        }
        action={<StatusBadge tone="planned">Demo workspace</StatusBadge>}
      />
      <p className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-caption text-muted-foreground">
        {noRecords
          ? "New workspace · No seeded transactions. Your dashboard starts at zero."
          : "Fictional business records · Reference date: 5 Nov 2026. No live activity."}
      </p>
      {recommendations}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <FinancialSummaryCard
          label={`Money Received ${suffix}`}
          amount={summary.moneyReceived}
          incoming={summary.incoming}
          refunds={summary.refunds}
          description={`${range} · ${data.branches.find((b) => b.id === filter.branchId)?.name ?? "All Branches"} · Net confirmed payments`}
          href={workspaceHref(workspace.id, "payments")}
        />
        <div className="min-w-0 xl:col-span-2 xl:row-start-2">
          <DashboardFilters
            filter={filter}
            branches={data.branches}
            personal={false}
            onChange={setFilter}
          />
        </div>
        <div className="min-w-0 xl:col-start-2 xl:row-start-1">
          <DashboardSection
            title="Make your next move"
            description={
              use === "expenses"
                ? "Expense tools first. Receipt and business tools stay available."
                : "Your everyday shortcuts. Destinations are planned previews."
            }
          >
            <QuickActionGrid
              workspaceId={workspace.id}
              actions={quickActions(workspace)}
            />
          </DashboardSection>
        </div>
      </div>
      <DashboardMetricGrid metrics={metrics} />
      <p className="text-caption text-muted-foreground">
        As of reporting date: {summary.draftCount} draft receipt
        {summary.draftCount !== 1 ? "s" : ""} · {summary.partialBills} partially
        paid bill{summary.partialBills !== 1 ? "s" : ""} · {summary.reminders}{" "}
        pending reminder{summary.reminders !== 1 ? "s" : ""} (demo only; nothing
        sent).
      </p>
      {noRecords && (
        <DashboardEmptyState
          workspaceId={workspace.id}
          expenses={use === "expenses"}
        />
      )}
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {use === "expenses" ? (
          <SpendingBreakdown
            categories={summary.categories}
            total={summary.expenseTotal}
          />
        ) : (
          <FinancialOverviewCard points={points} range={range} />
        )}
        {use === "receipts" ? (
          <RecentReceipts
            receipts={summary.receipts}
            workspaceId={workspace.id}
          />
        ) : (
          <RecentExpenses
            expenses={summary.expenses}
            workspaceId={workspace.id}
          />
        )}
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-2">
        {use === "both" ? (
          <RecentReceipts
            receipts={summary.receipts}
            workspaceId={workspace.id}
          />
        ) : use === "expenses" ? (
          <FinancialOverviewCard points={points} range={range} />
        ) : (
          <RecentExpenses
            expenses={summary.expenses}
            workspaceId={workspace.id}
          />
        )}
        <RecentActivity activities={summary.activities} />
      </div>
    </PageContainer>
  );
}
