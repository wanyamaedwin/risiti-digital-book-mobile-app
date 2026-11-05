"use client";

import { useMemo, useState } from "react";
import type { Workspace } from "@/types/workspace";
import type { DashboardData, DashboardFilter } from "../types/dashboard";
import { financialSeries, selectDashboard } from "../lib/calculations";
import { demoReportingDate, rangeLabel } from "../lib/dates";

export function useDashboard(workspace: Workspace, data: DashboardData) {
  // Each workspace has its own component key; Activity may retain these harmless display choices.
  const [filter, setFilter] = useState<DashboardFilter>({
    workspaceId: workspace.id,
    reportingDate: demoReportingDate,
    period: workspace.kind === "personal" ? "month" : "day",
    branchId: "all",
  });
  const summary = useMemo(() => selectDashboard(data, filter), [data, filter]);
  const points = useMemo(() => financialSeries(data, filter), [data, filter]);
  return { filter, setFilter, summary, points, range: rangeLabel(filter) };
}
