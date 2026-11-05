import type { ComponentProps } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ActionButtonProps = Omit<
  ComponentProps<typeof Button>,
  "asChild" | "variant"
> & { loading?: boolean };
export function PrimaryButton({
  loading = false,
  disabled,
  children,
  className,
  type = "button",
  ...props
}: ActionButtonProps) {
  return (
    <Button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn("min-h-11 rounded-full", className)}
    >
      {loading && <LoaderCircle aria-hidden="true" className="animate-spin" />}
      {children}
    </Button>
  );
}
export function SecondaryButton({
  loading = false,
  disabled,
  children,
  className,
  type = "button",
  ...props
}: ActionButtonProps) {
  return (
    <Button
      {...props}
      type={type}
      variant="outline"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn("min-h-11 rounded-full bg-card", className)}
    >
      {loading && <LoaderCircle aria-hidden="true" className="animate-spin" />}
      {children}
    </Button>
  );
}
export function IconButton({
  label,
  className,
  type = "button",
  ...props
}: Omit<ComponentProps<typeof Button>, "asChild" | "size" | "aria-label"> & {
  label: string;
}) {
  return (
    <Button
      {...props}
      type={type}
      size="icon"
      variant={props.variant ?? "ghost"}
      aria-label={label}
      className={cn("size-11 shrink-0 rounded-full", className)}
    />
  );
}
