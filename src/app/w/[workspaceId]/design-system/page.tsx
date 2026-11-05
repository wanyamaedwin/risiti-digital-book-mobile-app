import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InterfacePreview } from "@/features/workspaces/interface-preview";
import { getWorkspace } from "@/data/demo";

export const metadata: Metadata = { title: "Interface preview" };
export default async function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const workspace = getWorkspace((await params).workspaceId);
  if (!workspace) notFound();
  return <InterfacePreview workspace={workspace} />;
}
