import { useState } from "react";
import { TypographyH2 } from "@/ui/components/global/typography/Headers";
import { ListCardGrid } from "@/ui/components/list/ListCardGrid";
import { ListDialog } from "@/ui/components/list/ListDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  useLists,
  useCreateList,
  useUpdateList,
  useDeleteList,
} from "@/ui/hooks";
import type { ListData } from "@/ui/hooks/useLists.js";
import { toast } from "sonner";

const Lists = () => {
  const { data: lists, loading, error, refetch } = useLists();
  const { createList, loading: creating } = useCreateList();
  const { updateList, loading: updating } = useUpdateList();
  const { deleteList } = useDeleteList();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingList, setEditingList] = useState<ListData | null>(null);

  const handleCreate = async (name: string, description: string) => {
    await createList(name, description);
    refetch();
  };

  const handleUpdate = async (name: string, description: string) => {
    if (!editingList) return;
    await updateList(editingList.id, name, description);
    setEditingList(null);
    refetch();
  };

  const handleDelete = async (listId: number) => {
    try {
      await deleteList(listId);
      refetch();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    }
  };

  const handleEdit = (list: ListData) => {
    setEditingList(list);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingList(null);
  };

  return (
    <section className="w-full px-4 py-4">
      <header className="mb-6 flex items-center justify-between">
        <TypographyH2>Your Anime Lists</TypographyH2>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create List
        </Button>
      </header>

      {error && (
        <div className="mb-4 rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {error.message}
        </div>
      )}

      <ListCardGrid
        lists={lists}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ListDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSubmit={editingList ? handleUpdate : handleCreate}
        initialName={editingList?.name || ""}
        initialDescription={editingList?.description || ""}
        title={editingList ? "Edit List" : "Create List"}
        description={
          editingList
            ? "Update your list details."
            : "Create a new custom list to organize your favorite anime."
        }
        loading={creating || updating}
      />
    </section>
  );
};

export default Lists;
