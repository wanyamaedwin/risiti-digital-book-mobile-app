"use client";

import Link from "next/link";
import { Check, ChevronsUpDown } from "lucide-react";
import type { Workspace } from "@/types/workspace";
import { workspaceHref } from "@/config/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function WorkspaceSwitcher({
  workspace,
  workspaces,
  dark = false,
}: {
  workspace: Workspace;
  workspaces: readonly Workspace[];
  dark?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex min-h-12 w-full min-w-0 items-center gap-2.5 rounded-2xl p-2 text-left outline-offset-2 transition-colors",
          dark ? "bg-white/6 hover:bg-white/10" : "hover:bg-muted/50",
        )}
        aria-label={`Switch workspace, current workspace ${workspace.name}`}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-semibold",
            dark ? "bg-white/12 text-white" : "bg-primary/10 text-primary",
          )}
        >
          {workspace.initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">
            {workspace.name}
          </span>
          <span
            className={cn(
              "block truncate text-metadata",
              dark ? "text-white/65" : "text-muted-foreground",
            )}
          >
            {workspace.branch}
          </span>
        </span>
        <ChevronsUpDown
          aria-hidden="true"
          className="size-4 shrink-0 opacity-60"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 max-w-[calc(100vw-2rem)] rounded-2xl p-2"
      >
        <DropdownMenuLabel className="text-metadata text-muted-foreground">
          Demo workspaces
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.map((item) => (
          <DropdownMenuItem
            key={item.id}
            asChild
            className="min-h-12 rounded-xl"
          >
            <Link
              href={workspaceHref(item.id)}
              className="flex items-center justify-between gap-2"
            >
              <span className="min-w-0">
                <span className="block truncate">{item.name}</span>
                <span className="block text-metadata text-muted-foreground">
                  {item.branch}
                </span>
              </span>
              {item.id === workspace.id && (
                <>
                  <Check aria-hidden="true" className="size-4 text-primary" />
                  <span className="sr-only">Current workspace</span>
                </>
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
