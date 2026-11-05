import { cn } from "@/lib/utils";

export function Brand({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        aria-hidden="true"
        className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-3xl font-bold tracking-tighter text-white"
      >
        R<span className="text-lime">.</span>
      </span>
      <span className="flex flex-col">
        <span className="text-2xl leading-none font-bold tracking-tight">
          risiti<span className="text-lime">.</span>
        </span>
        {!compact && (
          <span className="mt-1.5 text-[10px] font-medium tracking-[0.2em] uppercase opacity-70">
            Digital Book
          </span>
        )}
      </span>
    </span>
  );
}
