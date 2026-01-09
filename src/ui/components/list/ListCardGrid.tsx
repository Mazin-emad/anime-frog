import { ItemGroup } from "@/components/ui/item";
import { ListCard } from "./ListCard.js";
import { Skeleton } from "@/components/ui/skeleton";
import type { ListData } from "../../hooks/useLists.js";

interface ListCardGridProps {
  lists: ListData[] | null;
  loading?: boolean;
  onEdit: (list: ListData) => void;
  onDelete: (listId: number) => void;
}

export function ListCardGrid({
  lists,
  loading = false,
  onEdit,
  onDelete,
}: ListCardGridProps) {
  if (loading) {
    return (
      <div className="flex w-full max-w-2xl flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-md border p-4"
          >
            <Skeleton className="h-10 w-10 rounded-sm" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (!lists || lists.length === 0) {
    return (
      <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          No lists yet. Create your first Anime list!
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <ItemGroup className="gap-2 grid grid-cols-1 sm:grid-cols-2">
        {lists.map((list) => (
          <ListCard
            key={list.id}
            list={list}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ItemGroup>
    </div>
  );
}
