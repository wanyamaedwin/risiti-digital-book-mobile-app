"use client";

import Link from "next/link";
import { Bell, Palette, Settings } from "lucide-react";
import { IconButton } from "@/components/shared/buttons";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { workspaceHref } from "@/config/navigation";
import { roleLabels, type DemoUser, type Workspace } from "@/types/workspace";

export function HeaderActions({
  workspace,
  user,
}: {
  workspace: Workspace;
  user: DemoUser;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <IconButton label="Notifications">
            <Bell aria-hidden="true" className="size-5" strokeWidth={1.6} />
          </IconButton>
        </DialogTrigger>
        <DialogContent className="max-h-[85dvh] overflow-y-auto rounded-3xl p-6">
          <DialogHeader className="pr-8">
            <DialogTitle className="text-section-heading">
              You&apos;re all caught up
            </DialogTitle>
            <DialogDescription className="text-app-body">
              This demo has no notifications. Updates and reminders are planned
              for a future step.
            </DialogDescription>
          </DialogHeader>
          <span className="mt-3 flex size-14 items-center justify-center rounded-2xl bg-primary/8 text-primary">
            <Bell aria-hidden="true" className="size-6" />
          </span>
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Open profile menu for ${user.name}`}
          className="flex size-11 items-center justify-center rounded-full"
        >
          <UserAvatar name={user.name} initials={user.initials} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-64 max-w-[calc(100vw-2rem)] rounded-2xl p-2"
        >
          <DropdownMenuLabel>
            <span className="block text-sm">{user.name}</span>
            <span className="mt-1 block text-metadata font-normal text-muted-foreground">
              {roleLabels[workspace.role]} · Demo account
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={workspaceHref(workspace.id, "settings")}>
              <Settings aria-hidden="true" />
              Workspace settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={workspaceHref(workspace.id, "design-system")}>
              <Palette aria-hidden="true" />
              Interface preview
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/">Public welcome page</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
