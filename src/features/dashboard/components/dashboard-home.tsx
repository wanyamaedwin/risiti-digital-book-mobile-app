"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-patterns";
import { PageHeading } from "@/components/shared/typography";
import { AppCard } from "@/components/shared/cards";
import { Button } from "@/components/ui/button";
import { workspaceHref } from "@/config/navigation";
import { roleLabels, type DemoUser, type Workspace } from "@/types/workspace";
import type { DashboardData } from "../types/dashboard";
import { dashboardRoleViews } from "../lib/preferences";
import { BusinessDashboard } from "./business-dashboard";
import { IndividualDashboard } from "./individual-dashboard";

const empty: DashboardData = {
  branches: [],
  customers: [],
  receipts: [],
  expenses: [],
  bills: [],
  payments: [],
  activities: [],
};
export function DashboardHome({
  workspace,
  user,
  data = empty,
  recommendations,
}: {
  workspace: Workspace;
  user: DemoUser;
  data?: DashboardData;
  recommendations?: ReactNode;
}) {
  const view = dashboardRoleViews[workspace.role].view;
  if (view === "restricted")
    return (
      <PageContainer>
        <PageHeading
          title={`Welcome, ${user.name.split(" ")[0]}.`}
          eyebrow={`${workspace.name} · ${roleLabels[workspace.role]}`}
          description="Your role-specific dashboard is planned. No workspace-wide financial information is shown here."
        />
        <AppCard className="gap-4">
          <p className="text-caption text-muted-foreground">
            Demo presentation only. Real access will require backend membership
            and record-scope checks.
          </p>
          <Button asChild variant="outline">
            <Link
              href={workspaceHref(
                workspace.id,
                workspace.role === "cashier" ? "receipts/history" : "more",
              )}
            >
              {workspace.role === "cashier"
                ? "My History (planned)"
                : "Explore permitted spaces"}
            </Link>
          </Button>
        </AppCard>
      </PageContainer>
    );
  const Dashboard =
    view === "personal" ? IndividualDashboard : BusinessDashboard;
  return (
    <Dashboard
      key={`${workspace.id}:${workspace.kind}:${workspace.dashboardPreferences?.primaryUse}`}
      workspace={workspace}
      user={user}
      data={data}
      recommendations={recommendations}
    />
  );
}
