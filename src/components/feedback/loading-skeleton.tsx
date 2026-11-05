import { Skeleton } from "@/components/ui/skeleton";
import { AppCard } from "@/components/shared/cards";

export function LoadingSkeleton({
  label = "Loading workspace content",
  cards = 3,
}: {
  label?: string;
  cards?: number;
}) {
  return (
    <div role="status" aria-label={label} className="space-y-5">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="space-y-3">
        <Skeleton className="h-8 w-3/5 max-w-80" />
        <Skeleton className="h-4 w-4/5 max-w-lg" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: cards }, (_, index) => (
            <AppCard key={index} className="space-y-4">
              <Skeleton className="size-10 rounded-2xl" />
              <Skeleton className="h-5 w-3/5" />
              <Skeleton className="h-4 w-full" />
            </AppCard>
          ))}
        </div>
      </div>
    </div>
  );
}
