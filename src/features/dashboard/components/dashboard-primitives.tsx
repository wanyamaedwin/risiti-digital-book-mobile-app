import Link from "next/link";
import { useId, type ReactNode } from "react";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { AppCard, StatCard } from "@/components/shared/cards";
import { CurrencyAmount, SectionHeading } from "@/components/shared/typography";
import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { icons } from "@/config/icons";
import { workspaceHref } from "@/config/navigation";
import { formatUGX } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { DashboardMetric, DashboardQuickAction } from "../types/dashboard";

export function DashboardSection({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <AppCard className={cn("gap-5", className)}>
      <section aria-labelledby={id} className="min-w-0 space-y-5">
        <SectionHeading id={id} description={description} action={action}>
          {title}
        </SectionHeading>
        {children}
      </section>
    </AppCard>
  );
}
export function DashboardMetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <div data-testid={`metric-${metric.id}`}>
      <StatCard
        label={metric.label}
        value={
          metric.format === "money" ? (
            <CurrencyAmount amount={metric.value} demo={false} />
          ) : (
            metric.value.toLocaleString("en-UG")
          )
        }
        icon={metric.icon}
        description={metric.note}
      />
    </div>
  );
}
export function DashboardMetricGrid({
  metrics,
}: {
  metrics: DashboardMetric[];
}) {
  return (
    <div className="grid min-w-0 gap-3 min-[360px]:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <DashboardMetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}
export function QuickActionGrid({
  actions,
  workspaceId,
}: {
  actions: DashboardQuickAction[];
  workspaceId: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {actions.map((action) => {
        const Icon = icons[action.icon];
        return (
          <Link
            key={action.label}
            href={workspaceHref(workspaceId, action.path)}
            className={cn(
              "group flex min-h-28 min-w-0 flex-col items-start justify-between gap-3 rounded-2xl border p-4 transition-colors hover:border-primary",
              action.emphasis
                ? "border-lime bg-lime text-ink"
                : "border-border/70 bg-card hover:bg-primary/4",
            )}
          >
            <Icon aria-hidden="true" className="size-5" strokeWidth={1.6} />
            <span className="text-caption font-semibold">
              {action.label}
              <span className="mt-1 block text-metadata font-normal opacity-80">
                Planned feature <span aria-hidden="true">↗</span>
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
export function DashboardEmptyState({
  title = "Your next chapter starts here",
  description = "This workspace has no receipts or expenses. Your first records will appear here when recording becomes available.",
  workspaceId,
  expenses = false,
}: {
  title?: string;
  description?: string;
  workspaceId: string;
  expenses?: boolean;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon={expenses ? "expenses" : "books"}
      action={
        <Button
          asChild
          className="rounded-full bg-lime text-ink hover:bg-lime/90"
        >
          <Link
            href={workspaceHref(
              workspaceId,
              expenses ? "expenses" : "receipts/new",
            )}
          >
            {expenses
              ? "Explore adding an expense"
              : "Explore your first receipt"}
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </Button>
      }
    />
  );
}
export function FinancialSummaryCard({
  label,
  amount,
  description,
  href,
  incoming,
  refunds,
  spending = false,
}: {
  label: string;
  amount: number;
  description: string;
  href: string;
  incoming?: number;
  refunds?: number;
  spending?: boolean;
}) {
  const id = useId();
  return (
    <AppCard className="relative justify-between gap-7 overflow-hidden border-0 bg-navigation p-6 text-navigation-foreground sm:p-8">
      <section aria-labelledby={id} className="relative z-10 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <h2
            id={id}
            className="max-w-64 text-caption font-medium text-white/85"
          >
            {label}
          </h2>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-lime text-ink">
            <ArrowDownLeft aria-hidden="true" className="size-5" />
          </span>
        </div>
        <p
          data-testid="primary-amount"
          className="break-words text-[clamp(2rem,5vw,3.5rem)] leading-tight font-semibold tracking-[-0.055em] tabular-nums"
        >
          {formatUGX(amount)}
        </p>
        <p className="max-w-md text-caption text-white/75">{description}</p>
        {incoming !== undefined && (
          <p className="text-metadata text-white/80">
            Confirmed {formatUGX(incoming)}
            <br />
            Less refunds {formatUGX(refunds ?? 0)}
          </p>
        )}
        <Link
          href={href}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-caption font-medium text-white hover:bg-white/15"
        >
          {spending ? "Explore expense records" : "Explore payment records"}
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
        <p className="text-metadata text-white/65">
          Fictional demo · No live transactions
        </p>
      </section>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -bottom-24 size-80 rounded-full border-[40px] border-white/4"
      />
    </AppCard>
  );
}
