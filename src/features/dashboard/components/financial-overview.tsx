import { useId } from "react";
import { formatUGX } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { ChartPoint } from "../lib/calculations";
import type { DashboardSummary } from "../types/dashboard";
import { DashboardSection } from "./dashboard-primitives";

export function FinancialOverviewCard({
  points,
  range,
}: {
  points: ChartPoint[];
  range: string;
}) {
  const max = Math.max(1, ...points.map((p) => Math.abs(p.value)));
  const total = points.reduce((sum, point) => sum + point.value, 0);
  const hasData = points.some((p) => p.value !== 0);
  return (
    <DashboardSection
      title="Money received over time"
      description={`${range} · Confirmed incoming less refunds (UGX)`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-amount">{formatUGX(total)}</p>
        <span className="text-metadata text-muted-foreground">
          Net received · demo
        </span>
      </div>
      {hasData ? (
        <>
          <div
            role="img"
            aria-label={`Money received chart, ${range}. Net ${formatUGX(total)}. Full values in the data table below.`}
          >
            <p className="mb-2 text-metadata text-muted-foreground">
              Scale: ±{formatUGX(max)}
            </p>
            <div
              aria-hidden="true"
              className="relative grid h-44 items-center gap-1 border-b border-border"
              style={{
                gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))`,
              }}
            >
              <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-border" />
              {points.map((point) => (
                <div key={point.label} className="relative h-full">
                  <div
                    className={cn(
                      "absolute inset-x-0 rounded-sm",
                      point.value < 0
                        ? "top-1/2 bg-destructive"
                        : "bottom-1/2 bg-primary",
                    )}
                    style={{ height: `${(Math.abs(point.value) / max) * 45}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between gap-2 text-metadata text-muted-foreground">
              <span>{points[0]?.label}</span>
              <span>{points.at(-1)?.label}</span>
            </div>
          </div>
          <p className="text-metadata text-muted-foreground">
            Above zero: net incoming. Below zero: refunds exceed incoming.
          </p>
        </>
      ) : (
        <p className="rounded-2xl bg-muted/40 p-5 text-caption text-muted-foreground">
          No money received or refunded in this period.
        </p>
      )}
      <details className="text-caption">
        <summary className="min-h-11 cursor-pointer py-3 font-medium text-primary">
          View chart data
        </summary>
        <table className="w-full text-left text-metadata">
          <caption className="sr-only">
            Net money received in UGX · {range}
          </caption>
          <thead>
            <tr>
              <th scope="col" className="py-2">
                Period
              </th>
              <th scope="col" className="py-2 text-right">
                Net received
              </th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={point.label} className="border-t border-border/50">
                <th scope="row" className="py-2 font-normal">
                  {point.label}
                </th>
                <td className="py-2 text-right tabular-nums">
                  {formatUGX(point.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </DashboardSection>
  );
}
export function SpendingCategoryRow({
  category,
  total,
}: {
  category: DashboardSummary["categories"][number];
  total: number;
}) {
  const id = useId();
  return (
    <li className="space-y-2">
      <div className="flex flex-wrap justify-between gap-2 text-caption">
        <span id={id} className="font-medium">
          {category.category}
        </span>
        <span className="font-semibold tabular-nums">
          {formatUGX(category.amount)}
        </span>
      </div>
      <progress
        aria-labelledby={id}
        max={Math.max(1, total)}
        value={category.amount}
        className="dashboard-progress block h-2 w-full overflow-hidden rounded-full"
      />
      <p className="text-metadata text-muted-foreground">
        {category.count} expense{category.count !== 1 ? "s" : ""} ·{" "}
        {total ? Math.round((category.amount / total) * 100) : 0}% of recorded
        spending
      </p>
    </li>
  );
}
export function SpendingBreakdown({
  categories,
  total,
}: {
  categories: DashboardSummary["categories"];
  total: number;
}) {
  return (
    <DashboardSection
      title="Spending by category"
      description="Recorded outgoing expenses. No income or profit estimate."
    >
      {categories.length ? (
        <ul className="space-y-5">
          {categories.map((category) => (
            <SpendingCategoryRow
              key={category.category}
              category={category}
              total={total}
            />
          ))}
        </ul>
      ) : (
        <p className="py-4 text-caption text-muted-foreground">
          No spending categories yet. Recorded expenses will build this picture.
        </p>
      )}
    </DashboardSection>
  );
}
