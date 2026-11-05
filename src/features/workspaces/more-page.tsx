import Link from "next/link";
import { ArrowUpRight, Palette } from "lucide-react";
import {
  getNavigationForRole,
  navigationGroups,
  workspaceHref,
} from "@/config/navigation";
import { ActionCard, AppCard } from "@/components/shared/cards";
import {
  PageContainer,
  ResponsiveGrid,
} from "@/components/layout/page-patterns";
import { PageHeading, SectionHeading } from "@/components/shared/typography";
import type { Workspace } from "@/types/workspace";

export function MorePage({ workspace }: { workspace: Workspace }) {
  const items = getNavigationForRole(workspace.role).filter(
    (item) => !["home", "create", "more"].includes(item.id),
  );
  return (
    <PageContainer>
      <PageHeading
        title="More possibilities"
        description="All your workspace spaces, together. Business features are planned; explore their previews below."
      />
      {navigationGroups.map((group) => (
        <section key={group} className="space-y-4" aria-label={group}>
          <SectionHeading>{group}</SectionHeading>
          <ResponsiveGrid>
            {items
              .filter((item) => item.group === group)
              .map((item) => (
                <ActionCard
                  key={item.id}
                  title={item.label}
                  description="See what's planned for this space."
                  icon={item.icon}
                  href={workspaceHref(workspace.id, item.path)}
                />
              ))}
          </ResponsiveGrid>
        </section>
      ))}
      <AppCard>
        <Link
          href={workspaceHref(workspace.id, "design-system")}
          className="flex min-h-11 items-center gap-3 text-sm font-medium text-primary"
        >
          <Palette aria-hidden="true" className="size-5" />
          <span className="flex-1">Risiti interface preview</span>
          <ArrowUpRight aria-hidden="true" className="size-5" />
        </Link>
      </AppCard>
    </PageContainer>
  );
}
