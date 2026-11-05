import { Suspense } from "react";
import type { DemoUser, Workspace } from "@/types/workspace";
import { WorkspaceSwitcher } from "@/features/workspaces/workspace-switcher";
import { AppBreadcrumbs } from "@/components/navigation/app-breadcrumbs";
import { HeaderActions } from "@/components/layout/header-actions";
import { StatusBadge } from "@/components/shared/status-badge";

export function WorkspaceHeader({
  workspace,
  workspaces,
  user,
}: {
  workspace: Workspace;
  workspaces: readonly Workspace[];
  user: DemoUser;
}) {
  return (
    <header className="border-b border-border/60 bg-card">
      <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-7 xl:px-10">
        <div className="min-w-0 flex-1 lg:hidden">
          <WorkspaceSwitcher workspace={workspace} workspaces={workspaces} />
        </div>
        <Suspense
          fallback={
            <span className="hidden text-caption lg:block">Workspace</span>
          }
        >
          <AppBreadcrumbs workspaceId={workspace.id} />
        </Suspense>
        <div className="hidden flex-1 items-center justify-end gap-2 lg:flex">
          <StatusBadge tone="planned">Demo workspace</StatusBadge>
          <span className="text-caption text-muted-foreground">
            {workspace.branch}
          </span>
        </div>
        <HeaderActions workspace={workspace} user={user} />
      </div>
    </header>
  );
}
