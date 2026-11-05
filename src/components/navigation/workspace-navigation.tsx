"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { icons } from "@/config/icons";
import {
  getMobileNavigation,
  getNavigationForRole,
  isNavigationActive,
  navigationGroups,
  workspaceHref,
} from "@/config/navigation";
import type { Workspace } from "@/types/workspace";
import { cn } from "@/lib/utils";

export function MobileBottomNavigation({
  workspace,
}: {
  workspace: Workspace;
}) {
  const pathname = usePathname();
  const items = getMobileNavigation(workspace.role);
  return (
    <nav
      aria-label="Mobile workspace navigation"
      className="workspace-bottom-nav fixed left-1/2 z-40 grid w-[calc(100%-1rem)] max-w-md -translate-x-1/2 gap-0.5 rounded-[1.75rem] bg-navigation p-1.5 text-navigation-foreground shadow-[0_8px_32px_#1e1a3430] sm:w-[calc(100%-1.5rem)] sm:gap-1 sm:p-2 lg:hidden"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item) => {
        const Icon = icons[item.icon];
        const active = isNavigationActive(pathname, workspace.id, item, true);
        return (
          <Link
            key={item.id}
            href={workspaceHref(workspace.id, item.path)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-0.5 py-1.5 text-metadata font-medium transition-colors active:scale-[0.98]",
              active
                ? "bg-navigation-selected text-navigation-selected-foreground"
                : item.id === "create"
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "text-white/80 hover:bg-white/8 hover:text-white",
            )}
          >
            <Icon aria-hidden="true" className="size-5" strokeWidth={1.7} />
            <span>
              {item.id === "create"
                ? workspace.role === "cashier"
                  ? "New Receipt"
                  : "Create"
                : item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function DesktopNavigationLinks({
  workspace,
}: {
  workspace: Workspace;
}) {
  const pathname = usePathname();
  const items = getNavigationForRole(workspace.role);
  const create = items.find((item) => item.id === "create");
  return (
    <>
      <nav aria-label="Desktop workspace navigation" className="space-y-6">
        {create && (
          <Link
            href={workspaceHref(workspace.id, create.path)}
            aria-current={
              pathname === workspaceHref(workspace.id, create.path)
                ? "page"
                : undefined
            }
            className={cn(
              "flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors",
              pathname === workspaceHref(workspace.id, create.path)
                ? "bg-lime text-ink"
                : "bg-primary text-white hover:bg-primary/90",
            )}
          >
            <icons.create aria-hidden="true" className="size-5" />
            New receipt
          </Link>
        )}
        {navigationGroups.map((group) => {
          const groupItems = items.filter(
            (item) =>
              item.group === group && !["create", "more"].includes(item.id),
          );
          if (!groupItems.length) return null;
          return (
            <div key={group}>
              <p className="mb-2 px-3 text-metadata font-medium tracking-widest text-white/55 uppercase">
                {group}
              </p>
              <ul className="space-y-1">
                {groupItems.map((item) => {
                  const Icon = icons[item.icon];
                  const active = isNavigationActive(
                    pathname,
                    workspace.id,
                    item,
                  );
                  return (
                    <li key={item.id}>
                      <Link
                        href={workspaceHref(workspace.id, item.path)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                          active
                            ? "bg-lime font-semibold text-ink"
                            : "text-white/75 hover:bg-white/8 hover:text-white",
                        )}
                      >
                        <Icon
                          aria-hidden="true"
                          className="size-5 shrink-0"
                          strokeWidth={1.6}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </>
  );
}
