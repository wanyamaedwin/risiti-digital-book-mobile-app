import { redirect, notFound } from "next/navigation";
import { getWorkspace } from "@/data/demo";
import { workspaceHref } from "@/config/navigation";

export default async function WorkspaceIndex({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  if (!getWorkspace(workspaceId)) notFound();
  redirect(workspaceHref(workspaceId));
}
