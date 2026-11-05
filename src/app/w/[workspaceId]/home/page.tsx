import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { currentUser, getWorkspace } from "@/data/demo";
import { WorkspaceHomePage } from "@/features/workspaces/home-page";
import { SetupHomeBridge } from "@/features/onboarding/setup-workspace-bridge";

export const metadata: Metadata = { title: "Workspace home" };
export default async function HomePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const workspace = getWorkspace((await params).workspaceId);
  if (!workspace) notFound();
  if (workspace.id === "setup") return <SetupHomeBridge user={currentUser} />;
  return <WorkspaceHomePage workspace={workspace} user={currentUser} />;
}
