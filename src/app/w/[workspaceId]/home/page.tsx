import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { currentUser, getWorkspace } from "@/data/demo";
import { WorkspaceHomePage } from "@/features/workspaces/home-page";

export const metadata: Metadata = { title: "Workspace home" };
export default async function HomePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const workspace = getWorkspace((await params).workspaceId);
  if (!workspace) notFound();
  return <WorkspaceHomePage workspace={workspace} user={currentUser} />;
}
