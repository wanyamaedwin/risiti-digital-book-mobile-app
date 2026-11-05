import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChoiceCard({
  name,
  value,
  title,
  description,
  selected,
  onSelect,
  icon: Icon,
  children,
}: {
  name: string;
  value: string;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  icon?: LucideIcon;
  children?: ReactNode;
}) {
  return (
    <label
      className={cn(
        "relative flex min-h-24 min-w-0 cursor-pointer flex-col rounded-3xl border-2 bg-card p-5 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-ring sm:p-6",
        selected
          ? "border-primary bg-primary/4"
          : "border-border/70 hover:border-primary/40",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <span className="mb-4 flex items-center justify-between gap-3">
        {Icon ? (
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/8 text-primary">
            <Icon aria-hidden="true" className="size-5" strokeWidth={1.5} />
          </span>
        ) : (
          <span className="text-metadata font-medium text-muted-foreground">
            Receipt design
          </span>
        )}
        <span
          className={cn(
            "flex min-h-7 items-center gap-1 rounded-full px-2 text-metadata font-medium",
            selected
              ? "bg-primary text-white"
              : "border border-border text-muted-foreground",
          )}
        >
          {selected ? (
            <>
              <Check aria-hidden="true" className="size-3.5" />
              Selected
            </>
          ) : (
            "Choose"
          )}
        </span>
      </span>
      <span className="text-card-heading">{title}</span>
      <span className="mt-2 text-caption text-muted-foreground">
        {description}
      </span>
      {children}
    </label>
  );
}
