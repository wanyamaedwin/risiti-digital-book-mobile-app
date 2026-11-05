import type { ReactNode } from "react";
import { icons, type IconName } from "@/config/icons";
import { AppCard } from "@/components/shared/cards";

export function EmptyState({
  title,
  description,
  icon = "receipts",
  action,
}: {
  title: string;
  description: string;
  icon?: IconName;
  action?: ReactNode;
}) {
  const Icon = icons[icon];
  return (
    <AppCard className="items-center py-10 text-center sm:py-12">
      <span className="mb-5 flex size-16 items-center justify-center rounded-3xl bg-primary/8 text-primary">
        <Icon aria-hidden="true" className="size-7" strokeWidth={1.4} />
      </span>
      <h2 className="text-card-heading">{title}</h2>
      <p className="mt-3 max-w-md text-app-body text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </AppCard>
  );
}
