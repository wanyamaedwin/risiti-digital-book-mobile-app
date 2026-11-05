import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { currentUser, getWorkspace } from "@/data/demo";
import { WorkspaceHomePage } from "@/features/workspaces/home-page";
import { SetupHomeBridge } from "@/features/onboarding/setup-workspace-bridge";
import {
  dataForWorkspace,
  emptyDashboardData,
} from "@/features/dashboard/data/fixtures";
import { dashboardRoleViews } from "@/features/dashboard/lib/preferences";

export const metadata: Metadata = { title: "Workspace home" };
export default async function HomePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const workspace = getWorkspace((await params).workspaceId);
  if (!workspace) notFound();
  if (workspace.id === "setup") return <SetupHomeBridge user={currentUser} />;
  const data =
    dashboardRoleViews[workspace.role].view === "restricted"
      ? emptyDashboardData
      : dataForWorkspace(workspace.id);
  return (
    <WorkspaceHomePage workspace={workspace} user={currentUser} data={data} />
  );
}
