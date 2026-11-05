import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWorkspace } from "@/data/demo";
import { MorePage } from "@/features/workspaces/more-page";

export const metadata: Metadata = { title: "More" };
export default async function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const workspace = getWorkspace((await params).workspaceId);
  if (!workspace) notFound();
  return <MorePage workspace={workspace} />;
}
