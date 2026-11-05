import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { icons, type IconName } from "@/config/icons";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";

export function AppCard({ className, ...props }: ComponentProps<typeof Card>) {
  return (
    <Card
      {...props}
      className={cn(
        "min-w-0 gap-0 overflow-visible rounded-3xl border border-border/70 p-5 shadow-[0_4px_20px_#1e1a3403] ring-0 sm:p-6",
        className,
      )}
    />
  );
}
export function StatCard({
  label,
  value,
  icon,
  description,
  demo = true,
}: {
  label: string;
  value: ReactNode;
  icon: IconName;
  description?: string;
  demo?: boolean;
}) {
  const Icon = icons[icon];
  return (
    <AppCard>
      <div className="mb-5 flex items-center justify-between gap-2">
        <span className="text-caption text-muted-foreground">{label}</span>
        <Icon
          aria-hidden="true"
          className="size-5 text-primary"
          strokeWidth={1.5}
        />
      </div>
      <div className="text-amount break-words">{value}</div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {demo && <StatusBadge>Demo</StatusBadge>}
        {description && (
          <p className="text-metadata text-muted-foreground">{description}</p>
        )}
      </div>
    </AppCard>
  );
}
export function ActionCard({
  title,
  description,
  icon,
  href,
  planned = true,
}: {
  title: string;
  description: string;
  icon: IconName;
  href: string;
  planned?: boolean;
}) {
  const Icon = icons[icon];
  return (
    <Link href={href} className="group block min-w-0 rounded-3xl">
      <AppCard className="h-full transition-colors group-hover:border-primary/40 group-hover:bg-primary/3">
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/8 text-primary">
            <Icon aria-hidden="true" className="size-5" strokeWidth={1.6} />
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
        <h3 className="text-card-heading">{title}</h3>
        <p className="mt-2 text-caption text-muted-foreground">{description}</p>
        {planned && (
          <StatusBadge tone="planned" className="mt-4 self-start">
            Planned feature
          </StatusBadge>
        )}
      </AppCard>
    </Link>
  );
}
