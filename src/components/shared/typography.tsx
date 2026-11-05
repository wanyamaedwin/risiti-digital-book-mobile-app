import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { formatUGX } from "@/lib/currency";

export function PageHeading({
  title,
  description,
  eyebrow,
  action,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-metadata font-medium text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="text-page-heading">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-app-body text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0 self-start sm:self-auto">{action}</div>
      )}
    </div>
  );
}
export function SectionHeading({
  children,
  description,
  action,
  id,
}: {
  children: ReactNode;
  description?: string;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 id={id} className="text-section-heading">
          {children}
        </h2>
        {description && (
          <p className="mt-1 text-caption text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
export function CurrencyAmount({
  amount,
  demo = true,
  className,
}: {
  amount: number;
  demo?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-baseline gap-x-2 gap-y-1",
        className,
      )}
    >
      <span className="text-amount">{formatUGX(amount)}</span>
      {demo && (
        <span className="text-metadata font-normal text-muted-foreground">
          Demo amount
        </span>
      )}
    </span>
  );
}
