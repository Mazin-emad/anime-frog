import { useParams, Link } from "react-router-dom";
import { TypographyH2 } from "@/ui/components/global/typography/Headers";
import AnimeCardGrid from "@/ui/components/cards/AnimeCardGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useList,
  useListAnimes,
  useAnimeByIds,
  useUpdateList,
  useDeleteList,
} from "@/ui/hooks";
import { ListDialog } from "@/ui/components/list/ListDialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ListPage = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const listIdNum = listId ? parseInt(listId, 10) : null;

  const {
    data: list,
    loading: listLoading,
    error: listError,
    refetch: refetchList,
  } = useList(listIdNum);
  const {
    data: animeIds,
    loading: idsLoading,
    removeAnime,
  } = useListAnimes(listIdNum);
  const {
    data: anime,
    loading: animeLoading,
    error: animeError,
  } = useAnimeByIds(animeIds || null, !!animeIds && animeIds.length > 0);
  const { updateList, loading: updating } = useUpdateList();
  const { deleteList, loading: deleting } = useDeleteList();

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleUpdate = async (name: string, description: string) => {
    if (!listIdNum) return;
    await updateList(listIdNum, name, description);
    setDialogOpen(false);
    refetchList();
  };

  const handleDelete = async () => {
    if (!listIdNum) return;
    if (
      window.confirm(
        `Are you sure you want to delete "${list?.name}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteList(listIdNum);
        navigate("/lists");
      } catch (err) {
        console.error("Failed to delete list:", err);
      }
    }
  };

  const handleRemoveAnime = async (animeId: number) => {
    if (!listIdNum) return;
    try {
      await removeAnime(animeId);
    } catch (err) {
      console.error("Failed to remove anime from list:", err);
    }
  };

  if (listLoading) {
    return (
      <section className="w-full px-4 py-4">
        <div className="mb-6 space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </section>
    );
  }

  if (listError || !list) {
    return (
      <section className="w-full px-4 py-4">
        <div className="mb-6">
          <Link to="/lists">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Lists
            </Button>
          </Link>
        </div>
        <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {listError?.message || "List not found"}
        </div>
      </section>
    );
  }

  return (
    <div className="w-full min-h-screen">
      {/* Banner Section */}
      {list.bannerImage && (
        <div className="relative h-48 md:h-64 w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${list.bannerImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
      )}

      <section className="w-full px-4 py-4">
        <div className="mb-6">
          <Link to="/lists">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Lists
            </Button>
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <TypographyH2>{list.name}</TypographyH2>
              {list.description && (
                <p className="mt-2 text-muted-foreground">{list.description}</p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                {animeIds?.length || 0} anime in this list
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(true)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {animeError && (
          <div className="mb-4 rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
            {animeError.message}
          </div>
        )}

        {idsLoading || animeLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : !anime || anime.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">
              This list is empty. Add some anime to get started!
            </p>
            <Button asChild>
              <Link to="/">
                <Plus className="mr-2 h-4 w-4" />
                Browse Anime
              </Link>
            </Button>
          </div>
        ) : (
          <AnimeCardGrid
            anime={anime}
            onRemoveFromList={handleRemoveAnime}
            listId={listIdNum}
          />
        )}

        <ListDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleUpdate}
          initialName={list.name}
          initialDescription={list.description || ""}
          title="Edit List"
          description="Update your list details."
          loading={updating}
        />
      </section>
    </div>
  );
};

export default ListPage;
