import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, Eye, Play, ListPlus, X } from "lucide-react";
import type { AnimeListItem } from "../../../../types.d.ts";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { AddToListDialog } from "@/ui/components/list/AddToListDialog";
import { toast } from "sonner";

interface AnimeCardProps {
  anime: AnimeListItem;
  onFavorite?: (id: number) => void;
  isFavorite?: boolean;
  className?: string;
  showFavoriteButton?: boolean;
  onRemoveFromList?: (animeId: number) => void;
  listId?: number | null;
}

export default function AnimeCard({
  anime,
  onFavorite,
  isFavorite = false,
  className,
  showFavoriteButton = true,
  onRemoveFromList,
  listId,
}: AnimeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [addToListDialogOpen, setAddToListDialogOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  const navigate = useNavigate();
  const isInListContext = !!onRemoveFromList && !!listId;

  const handleClick = () => {
    navigate(`/${anime.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(anime.id);
  };

  const handleAddToListClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAddToListDialogOpen(true);
  };

  const displayTitle = anime.title.english || anime.title.romaji;

  const handleRemoveFromList = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onRemoveFromList) return;
    
    if (
      window.confirm(
        `Remove "${displayTitle}" from this list?`
      )
    ) {
      setRemoving(true);
      try {
        await onRemoveFromList(anime.id);
        toast.success("Removed from list", {
          description: `${displayTitle} has been removed from the list`,
        });
      } catch (err) {
        toast.error("Failed to remove from list", {
          description: err instanceof Error ? err.message : "An error occurred",
        });
      } finally {
        setRemoving(false);
      }
    }
  };
  const score = anime.averageScore
    ? (anime.averageScore / 10).toFixed(1)
    : null;

  return (
    <Card
      className={cn(
        "group relative p-0 overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer",
        "bg-card border-border",
        className
      )}
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-muted" />
            )}
            <img
              src={anime.coverImage.extraLarge}
              alt={displayTitle}
              className={cn(
                "h-full w-full object-cover transition-transform duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            <Eye className="h-12 w-12" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Score Badge */}
        {score && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{score}</span>
          </div>
        )}

        {/* Favorite Button */}
        {showFavoriteButton && !isInListContext && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 left-2 h-8 w-8 rounded-full bg-black/50 text-white backdrop-blur-sm transition-all",
              "hover:bg-black/70 hover:scale-110",
              "opacity-0 group-hover:opacity-100",
              isFavorite && "opacity-100 bg-red-500/80 hover:bg-red-500"
            )}
            onClick={handleFavoriteClick}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-all",
                isFavorite && "fill-red-500 text-red-500"
              )}
            />
          </Button>
        )}

        {/* Remove from List Button */}
        {isInListContext && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 h-8 w-8 rounded-full bg-red-500/80 text-white backdrop-blur-sm transition-all",
              "hover:bg-red-500 hover:scale-110",
              "opacity-0 group-hover:opacity-100",
              removing && "opacity-100"
            )}
            onClick={handleRemoveFromList}
            disabled={removing}
            aria-label="Remove from list"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* Hover Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 text-white transition-transform duration-300 group-hover:translate-y-0">
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
            {displayTitle}
          </h3>
          {anime.title.english &&
            anime.title.romaji !== anime.title.english && (
              <p className="mt-1 line-clamp-1 text-xs text-white/80">
                {anime.title.romaji}
              </p>
            )}
        </div>
      </div>

      <CardContent className="pb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="line-clamp-2 text-sm font-semibold leading-tight transition-colors group-hover:text-primary">
              {displayTitle}
            </h3>
            {anime.title.english &&
              anime.title.romaji !== anime.title.english && (
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {anime.title.romaji}
                </p>
              )}
          </div>

          {score && (
            <div className="flex items-center gap-1.5 text-xs">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 shrink-0" />
              <span className="font-semibold text-foreground">{score}</span>
              <span className="text-muted-foreground">/10</span>
            </div>
          )}
        </div>

        <CardFooter className="flex items-center justify-between p-0 gap-3 flex-wrap border-t mt-auto">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 text-xs">
            <Play className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="font-medium text-foreground">
              {anime.episodes ? anime.episodes : "?"}
            </span>
            <span className="text-muted-foreground text-[10px]">eps</span>
          </div>

          {isInListContext ? (
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs text-destructive hover:text-destructive"
              onClick={handleRemoveFromList}
              disabled={removing}
            >
              <X className="h-3 w-3 mr-1" />
              {removing ? "Removing..." : "Remove"}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={handleAddToListClick}
            >
              <ListPlus className="h-3 w-3 mr-1" />
              Add to List
            </Button>
          )}
        </CardFooter>
      </CardContent>

      <AddToListDialog
        open={addToListDialogOpen}
        onOpenChange={setAddToListDialogOpen}
        animeId={anime.id}
        animeTitle={displayTitle}
      />
    </Card>
  );
}
