import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/brand";
import { WorkspaceSwitcher } from "@/features/workspaces/workspace-switcher";
import { DesktopNavigationLinks } from "@/components/navigation/workspace-navigation";
import { UserAvatar } from "@/components/shared/user-avatar";
import { workspaceHref } from "@/config/navigation";
import { roleLabels, type DemoUser, type Workspace } from "@/types/workspace";

export function DesktopSidebar({
  workspace,
  workspaces,
  user,
}: {
  workspace: Workspace;
  workspaces: readonly Workspace[];
  user: DemoUser;
}) {
  return (
    <aside
      aria-label="Workspace sidebar"
      className="workspace-sidebar fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-y-auto bg-navigation px-5 py-7 text-white lg:flex"
    >
      <Link
        href="/"
        aria-label="Risiti welcome page"
        className="mb-8 self-start rounded-xl"
      >
        <Brand compact />
      </Link>
      <WorkspaceSwitcher workspace={workspace} workspaces={workspaces} dark />
      <div className="my-7">
        <Suspense
          fallback={
            <p className="text-caption text-white/70">Loading navigation…</p>
          }
        >
          <DesktopNavigationLinks workspace={workspace} />
        </Suspense>
      </div>
      <div className="mt-auto border-t border-white/15 pt-5">
        <Link
          href={workspaceHref(workspace.id, "settings")}
          className="flex min-h-14 items-center gap-3 rounded-xl p-1 transition-colors hover:bg-white/6"
        >
          <UserAvatar
            name={user.name}
            initials={user.initials}
            className="bg-white"
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">
              {user.name}
            </span>
            <span className="block text-metadata text-white/60">
              {roleLabels[workspace.role]} · Demo
            </span>
          </span>
          <ArrowUpRight aria-hidden="true" className="size-4 text-white/60" />
        </Link>
      </div>
    </aside>
  );
}
