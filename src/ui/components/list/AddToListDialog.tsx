import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Check, Loader2 } from "lucide-react";
import { useLists } from "@/ui/hooks";
import { useCreateList } from "@/ui/hooks";
import { ListDialog } from "./ListDialog";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface AddToListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animeId: number;
  animeTitle?: string;
}

export function AddToListDialog({
  open,
  onOpenChange,
  animeId,
  animeTitle,
}: AddToListDialogProps) {
  const { data: lists, loading: listsLoading, refetch: refetchLists } = useLists();
  const { createList, loading: creatingList } = useCreateList();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [listsWithAnime, setListsWithAnime] = useState<Set<number>>(new Set());
  const [loadingStates, setLoadingStates] = useState<Set<number>>(new Set());

  // Check which lists contain this anime
  useEffect(() => {
    if (!open || !lists) return;

    const checkLists = async () => {
      const listsContainingAnime = new Set<number>();
      
      for (const list of lists) {
        try {
          const animeIds = await window.electronAPI.getListAnimes(list.id);
          if (animeIds.includes(animeId)) {
            listsContainingAnime.add(list.id);
          }
        } catch (err) {
          console.error(`Failed to check list ${list.id}:`, err);
        }
      }
      
      setListsWithAnime(listsContainingAnime);
    };

    checkLists();
  }, [open, lists, animeId]);

  const handleToggleList = async (listId: number) => {
    if (loadingStates.has(listId)) return;

    setLoadingStates((prev) => new Set(prev).add(listId));

    try {
      const isInList = listsWithAnime.has(listId);
      
      if (isInList) {
        await window.electronAPI.removeFromList(listId, animeId);
        setListsWithAnime((prev) => {
          const next = new Set(prev);
          next.delete(listId);
          return next;
        });
        toast.success("Removed from list", {
          description: `${animeTitle || "Anime"} removed from list`,
        });
      } else {
        await window.electronAPI.addToList(listId, animeId);
        setListsWithAnime((prev) => new Set(prev).add(listId));
        toast.success("Added to list", {
          description: `${animeTitle || "Anime"} added to list`,
        });
      }
    } catch (err) {
      toast.error("Failed to update list", {
        description: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setLoadingStates((prev) => {
        const next = new Set(prev);
        next.delete(listId);
        return next;
      });
    }
  };

  const handleCreateList = async (name: string, description: string) => {
    try {
      const newListId = await createList(name, description);
      setCreateDialogOpen(false);
      
      // Add anime to the newly created list first
      await window.electronAPI.addToList(newListId, animeId);
      
      // Update local state to mark the new list as containing the anime
      setListsWithAnime((prev) => new Set(prev).add(newListId));
      
      // Refetch lists to get the new list data
      await refetchLists();
      
      toast.success("List created", {
        description: `${animeTitle || "Anime"} added to the new list`,
      });
    } catch (err) {
      toast.error("Failed to create list", {
        description: err instanceof Error ? err.message : "An error occurred",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add to List</DialogTitle>
            <DialogDescription>
              {animeTitle
                ? `Add "${animeTitle}" to your lists`
                : "Add this anime to your lists"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {listsLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : lists && lists.length > 0 ? (
              lists.map((list) => {
                const isInList = listsWithAnime.has(list.id);
                const isLoading = loadingStates.has(list.id);

                return (
                  <Button
                    key={list.id}
                    variant={isInList ? "secondary" : "outline"}
                    className={cn(
                      "w-full justify-start h-auto py-3 px-4",
                      isInList && "bg-primary/10 border-primary/20"
                    )}
                    onClick={() => handleToggleList(list.id)}
                    disabled={isLoading}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {list.coverImage ? (
                          <img
                            src={list.coverImage}
                            alt={list.name}
                            className="h-10 w-10 rounded-sm object-cover shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-sm bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-primary">
                              {list.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="font-medium line-clamp-1">
                            {list.name}
                          </div>
                          {list.description && (
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {list.description}
                            </div>
                          )}
                        </div>
                      </div>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin shrink-0 ml-2" />
                      ) : isInList ? (
                        <Check className="h-4 w-4 shrink-0 ml-2 text-primary" />
                      ) : null}
                    </div>
                  </Button>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No lists yet. Create your first list!</p>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={() => setCreateDialogOpen(true)}
              disabled={creatingList}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New List
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ListDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateList}
        title="Create New List"
        description="Create a new list and add this anime to it."
        loading={creatingList}
      />
    </>
  );
}

