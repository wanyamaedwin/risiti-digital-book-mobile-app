import type { ReactNode } from "react";
import { DashboardHome } from "@/features/dashboard/components/dashboard-home";
import type { DashboardData } from "@/features/dashboard/types/dashboard";
import type { DemoUser, Workspace } from "@/types/workspace";

/** Keep the existing Home composition entry point for fixture and setup routes. */
export function WorkspaceHomePage(props: {
  workspace: Workspace;
  user: DemoUser;
  data?: DashboardData;
  recommendations?: ReactNode;
}) {
  return <DashboardHome {...props} />;
}
