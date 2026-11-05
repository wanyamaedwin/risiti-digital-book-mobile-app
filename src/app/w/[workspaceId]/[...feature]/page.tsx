import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { features, isFeaturePath } from "@/config/features";
import { getWorkspace } from "@/data/demo";
import { FeaturePlaceholder } from "@/components/feedback/feature-placeholder";

type Props = { params: Promise<{ workspaceId: string; feature: string[] }> };
export function generateStaticParams() {
  return Object.keys(features).map((feature) => ({
    feature: feature.split("/"),
  }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = (await params).feature.join("/");
  return {
    title: isFeaturePath(path) ? features[path].title : "Page not found",
  };
}
export default async function Page({ params }: Props) {
  const { workspaceId, feature } = await params;
  const path = feature.join("/");
  if (!getWorkspace(workspaceId) || !isFeaturePath(path)) notFound();
  return (
    <FeaturePlaceholder feature={features[path]} workspaceId={workspaceId} />
  );
}
