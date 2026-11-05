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
import { SpendingBreakdown } from "./financial-overview";
import { RecentExpenses, RecentReceipts } from "./transaction-lists";

export function IndividualDashboard({
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
  const { filter, setFilter, summary, range } = useDashboard(workspace, data);
  const use = dashboardEmphasis(workspace);
  const suffix = filter.period === "week" ? "This Week" : "This Month";
  const metrics: DashboardMetric[] = [
    {
      id: "expense-count",
      label: "Number of Expenses",
      value: summary.expenseCount,
      format: "count",
      note: "Recorded outgoing transactions in period",
      icon: "expenses",
    },
    {
      id: "saved-receipts",
      label: "Saved Expense Receipts",
      value: summary.savedReceipts,
      format: "count",
      note: "Attachments received from others",
      icon: "receipts",
    },
    {
      id: "categories",
      label: "Spending Categories",
      value: summary.categories.length,
      format: "count",
      note: "Categories used in this period",
      icon: "layers",
    },
    {
      id: "personal-issued",
      label: "Personal Receipts Issued",
      value: summary.receiptCount,
      format: "count",
      note: "Documents for money you collected",
      icon: "books",
    },
  ];
  const receiptFirst = use === "receipts";
  const noRecords =
    !data.receipts.length && !data.expenses.length && !data.payments.length;
  return (
    <PageContainer>
      <PageHeading
        eyebrow={workspace.name}
        title={`A little clarity, ${user.name.split(" ")[0]}.`}
        description={
          receiptFirst
            ? "Keep track of the money you collect, in your own space."
            : "Your spending. Your records. All in one little book."
        }
        action={<StatusBadge tone="planned">Personal demo</StatusBadge>}
      />
      <p className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-caption text-muted-foreground">
        {noRecords
          ? "New personal workspace · No seeded transactions. Your dashboard starts at zero."
          : "Fictional personal records · Reference date: 5 Nov 2026. No live activity."}
      </p>
      {recommendations}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <FinancialSummaryCard
          label={
            receiptFirst
              ? `Money Collected ${suffix}`
              : `Recorded Spending ${suffix}`
          }
          amount={receiptFirst ? summary.moneyReceived : summary.expenseTotal}
          incoming={receiptFirst ? summary.incoming : undefined}
          refunds={receiptFirst ? summary.refunds : undefined}
          spending={!receiptFirst}
          description={`${range} · ${receiptFirst ? "Confirmed incoming less refunds" : "Recorded outgoing expenses only"}`}
          href={workspaceHref(
            workspace.id,
            receiptFirst ? "receipts" : "expenses",
          )}
        />
        <div className="min-w-0 xl:col-span-2 xl:row-start-2">
          <DashboardFilters
            filter={filter}
            branches={data.branches}
            personal
            onChange={setFilter}
          />
        </div>
        <div className="min-w-0 xl:col-start-2 xl:row-start-1">
          <DashboardSection
            title="Your everyday tools"
            description="Preview the next step. Scanning, recording and export are planned."
          >
            <QuickActionGrid
              actions={quickActions(workspace)}
              workspaceId={workspace.id}
            />
          </DashboardSection>
        </div>
      </div>
      <DashboardMetricGrid
        metrics={
          receiptFirst
            ? [metrics[3], ...metrics.slice(0, 3)]
            : use === "expenses"
              ? metrics.slice(0, 3)
              : metrics
        }
      />
      {noRecords && (
        <DashboardEmptyState
          workspaceId={workspace.id}
          expenses={!receiptFirst}
        />
      )}
      {receiptFirst && (
        <RecentReceipts
          receipts={summary.receipts}
          workspaceId={workspace.id}
          personal
        />
      )}
      <div className="grid items-start gap-4 xl:grid-cols-2">
        <RecentExpenses
          expenses={summary.expenses}
          workspaceId={workspace.id}
        />
        <SpendingBreakdown
          categories={summary.categories}
          total={summary.expenseTotal}
        />
      </div>
      {use === "both" && (
        <RecentReceipts
          receipts={summary.receipts}
          workspaceId={workspace.id}
          personal
        />
      )}
    </PageContainer>
  );
}
