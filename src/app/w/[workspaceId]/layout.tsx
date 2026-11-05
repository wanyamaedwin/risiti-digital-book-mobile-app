import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { availableWorkspaces, currentUser, getWorkspace } from "@/data/demo";
import { AppShell } from "@/components/layout/app-shell";

export function generateStaticParams() {
  return availableWorkspaces.map((workspace) => ({
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
