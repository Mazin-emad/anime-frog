import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AnimeCardSkeletonProps {
  className?: string;
}

export default function AnimeCardSkeleton({
  className,
}: AnimeCardSkeletonProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        <Skeleton className="h-full w-full" />
      </div>

      <CardContent className="p-4">
        <Skeleton className="mb-2 h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="mt-2 h-3 w-1/4" />
      </CardContent>
    </Card>
  );
}
