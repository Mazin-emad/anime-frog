import { useMemo } from "react";
import AnimeCard from "./AnimeCard.js";
import AnimeCardSkeleton from "./AnimeCardSkeleton.js";
import type { AnimeListItem } from "../../../../types.d.ts";
import { cn } from "@/lib/utils";

interface AnimeCardGridProps {
  anime: AnimeListItem[] | null;
  loading?: boolean;
  error?: Error | null;
  onFavoriteClick?: (id: number) => void;
  favoriteIds?: Set<number>;
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
  skeletonCount?: number;
  onRemoveFromList?: (animeId: number) => void;
  listId?: number | null;
}

export default function AnimeCardGrid({
  anime,
  loading = false,
  error = null,
  onFavoriteClick,
  favoriteIds,
  columns = 4,
  className,
  skeletonCount = 12,
  onRemoveFromList,
  listId,
}: AnimeCardGridProps) {
  const gridCols = useMemo(() => {
    const colsMap = {
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
      5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
      6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
    };
    return colsMap[columns];
  }, [columns]);

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive">
            Error loading anime
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={cn("grid gap-4", gridCols, className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <AnimeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!anime || anime.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">No anime found</p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4", gridCols, className)}>
      {anime.map((item) => (
        <AnimeCard
          key={item.id}
          anime={item}
          onFavorite={onFavoriteClick}
          isFavorite={favoriteIds?.has(item.id) ?? false}
          onRemoveFromList={onRemoveFromList}
          listId={listId}
        />
      ))}
    </div>
  );
}
