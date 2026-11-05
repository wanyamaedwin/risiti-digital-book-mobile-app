import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InterfacePreview } from "@/features/workspaces/interface-preview";
import { getWorkspace } from "@/data/demo";
import { SetupInterfaceBridge } from "@/features/onboarding/setup-workspace-bridge";

export const metadata: Metadata = { title: "Interface preview" };
export default async function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const workspace = getWorkspace((await params).workspaceId);
  if (!workspace) notFound();
  if (workspace.id === "setup") return <SetupInterfaceBridge />;
  return <InterfacePreview workspace={workspace} />;
}
