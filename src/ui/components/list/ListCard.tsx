import { Link } from "react-router-dom";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { ListData } from "../../hooks/useLists.js";

interface ListCardProps {
  list: ListData;
  onEdit: (list: ListData) => void;
  onDelete: (listId: number) => void;
}

export function ListCard({ list, onEdit, onDelete }: ListCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${list.name}"?`)) {
      onDelete(list.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(list);
  };

  return (
    <Item variant="outline" asChild role="listitem">
      <Link to={`/lists/${list.id}`} className="group">
        <ItemMedia variant="image">
          {list.coverImage ? (
            <img
              src={list.coverImage}
              alt={list.name}
              className="size-10 rounded-sm object-cover"
            />
          ) : (
            <div className="size-10 rounded-sm bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {list.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </ItemMedia>
        <ItemContent className="flex-1 min-w-0">
          <ItemTitle className="line-clamp-1">{list.name}</ItemTitle>
          <ItemDescription className="line-clamp-2">
            {list.description || "No description"}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleEdit}
            title="Edit list"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={handleDelete}
            title="Delete list"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </ItemActions>
      </Link>
    </Item>
  );
}
