import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function UserAvatar({
  name,
  initials,
  className,
}: {
  name: string;
  initials: string;
  className?: string;
}) {
  return (
    <Avatar
      className={cn("size-10 bg-primary/10", className)}
      aria-label={name}
    >
      <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
