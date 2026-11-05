"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { features, isFeaturePath } from "@/config/features";
import { workspaceHref } from "@/config/navigation";

export function AppBreadcrumbs({ workspaceId }: { workspaceId: string }) {
  const pathname = usePathname();
  const section = pathname.slice(`/w/${workspaceId}/`.length);
  const title =
    section === "home"
      ? "Home"
      : section === "more"
        ? "More"
        : section === "design-system"
          ? "Interface preview"
          : isFeaturePath(section)
            ? features[section].title
            : "Workspace";
  return (
    <nav aria-label="Breadcrumb" className="hidden min-w-0 lg:block">
      <ol className="flex items-center gap-2 text-caption">
        <li>
          <Link
            href={workspaceHref(workspaceId)}
            className="inline-flex min-h-11 items-center text-muted-foreground hover:text-primary"
          >
            Workspace
          </Link>
        </li>
        <li>
          <ChevronRight
            aria-hidden="true"
            className="size-3.5 text-muted-foreground"
          />
        </li>
        <li className="truncate font-medium" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  );
}
