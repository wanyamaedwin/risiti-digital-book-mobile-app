import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import {
  availableWorkspaces,
  currentUser,
  getWorkspace,
  setupWorkspace,
} from "@/data/demo";
import { AppShell } from "@/components/layout/app-shell";
import { SetupWorkspaceBridge } from "@/features/onboarding/setup-workspace-bridge";

export function generateStaticParams() {
  return [...availableWorkspaces, setupWorkspace].map((workspace) => ({
    workspaceId: workspace.id,
  }));
}

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = getWorkspace(workspaceId);
  if (!workspace) notFound();
  if (workspace.id === "setup")
    return (
      <SetupWorkspaceBridge
        fallbackWorkspace={workspace}
        workspaces={availableWorkspaces}
        user={currentUser}
      >
        {children}
      </SetupWorkspaceBridge>
    );
  return (
    <AppShell
      workspace={workspace}
      workspaces={availableWorkspaces}
      user={currentUser}
    >
      {children}
    </AppShell>
  );
}
