import { Suspense } from "react";
import type { ReactNode } from "react";
import type { DemoUser, Workspace } from "@/types/workspace";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { WorkspaceHeader } from "@/components/layout/workspace-header";
import { MobileBottomNavigation } from "@/components/navigation/workspace-navigation";

/** Workspace shell. The original public shell remains in components/app-shell.tsx. */
export function AppShell({
  children,
  workspace,
  workspaces,
  user,
}: {
  children: ReactNode;
  workspace: Workspace;
  workspaces: readonly Workspace[];
  user: DemoUser;
}) {
  return (
    <div className="workspace-shell min-h-dvh bg-background">
      <a href="#workspace-main" className="skip-link">
        Skip to workspace content
      </a>
      <DesktopSidebar
        workspace={workspace}
        workspaces={workspaces}
        user={user}
      />
      <div className="min-w-0 lg:pl-64">
        <WorkspaceHeader
          workspace={workspace}
          workspaces={workspaces}
          user={user}
        />
        <main
          id="workspace-main"
          tabIndex={-1}
          className="workspace-content min-w-0"
        >
          {children}
        </main>
      </div>
      <Suspense
        fallback={
          <div
            className="workspace-bottom-nav fixed left-3 right-3 h-[72px] rounded-3xl bg-navigation lg:hidden"
            aria-label="Loading navigation"
          />
        }
      >
        <MobileBottomNavigation workspace={workspace} />
      </Suspense>
    </div>
  );
}
