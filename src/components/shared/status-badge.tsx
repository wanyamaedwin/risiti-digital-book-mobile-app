import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusTone =
  "neutral" | "success" | "warning" | "error" | "info" | "planned";
const tones: Record<StatusTone, string> = {
  neutral: "bg-muted text-foreground",
  planned: "bg-primary/8 text-primary",
  success: "bg-success-surface text-success",
  warning: "bg-warning-surface text-warning",
  error: "bg-error-surface text-destructive",
  info: "bg-info-surface text-info",
};
export function StatusBadge({
  tone = "neutral",
  className,
  ...props
}: ComponentProps<typeof Badge> & { tone?: StatusTone }) {
  return (
    <Badge
      {...props}
      className={cn(
        "h-auto max-w-full rounded-full border-0 px-2.5 py-1 text-metadata leading-4 whitespace-normal",
        tones[tone],
        className,
      )}
    />
  );
}
