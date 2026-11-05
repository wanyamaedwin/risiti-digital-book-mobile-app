import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageContainer({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "mx-auto w-full min-w-0 max-w-6xl space-y-7 px-4 py-6 sm:space-y-8 sm:px-7 sm:py-8 xl:px-10",
        className,
      )}
    />
  );
}
export function ResponsiveGrid({
  columns = 3,
  className,
  ...props
}: ComponentProps<"div"> & { columns?: 2 | 3 | 4 }) {
  const columnClasses = {
    2: "md:grid-cols-2",
    3: "sm:grid-cols-2 xl:grid-cols-3",
    4: "sm:grid-cols-2 xl:grid-cols-4",
  };
  return (
    <div
      {...props}
      className={cn(
        "grid min-w-0 grid-cols-1 gap-4",
        columnClasses[columns],
        className,
      )}
    />
  );
}
/** Standard/list headers share a slot for real page-specific search and filter controls. */
export function ListPagePattern({
  toolbar,
  children,
}: {
  toolbar: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        {toolbar}
      </div>
      {children}
    </div>
  );
}
export function FormPagePattern({
  children,
  actions,
  label,
  onSubmit,
}: {
  children: ReactNode;
  actions: ReactNode;
  label: string;
  onSubmit?: ComponentProps<"form">["onSubmit"];
}) {
  return (
    <form aria-label={label} onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-5">{children}</div>
      <div className="workspace-form-actions sticky z-10 flex flex-wrap justify-end gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
        {actions}
      </div>
    </form>
  );
}
export function DetailPagePattern({
  summary,
  children,
}: {
  summary: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <aside className="min-w-0">{summary}</aside>
      <div className="min-w-0 space-y-5">{children}</div>
    </div>
  );
}
export function SettingsPagePattern({
  navigation,
  children,
}: {
  navigation: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[13rem_minmax(0,1fr)]">
      <nav
        aria-label="Settings sections"
        className="flex flex-wrap gap-2 xl:flex-col"
      >
        {navigation}
      </nav>
      <div className="min-w-0 space-y-6">{children}</div>
    </div>
  );
}
export function MobilePageHeader({
  title,
  backHref,
  action,
}: {
  title: string;
  backHref?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 lg:hidden">
      {backHref && (
        <Link
          href={backHref}
          aria-label="Back to workspace home"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-card"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </Link>
      )}
      <p className="min-w-0 flex-1 truncate text-caption font-medium">
        {title}
      </p>
      {action}
    </div>
  );
}
