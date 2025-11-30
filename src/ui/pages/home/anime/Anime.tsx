import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Plus,
  Star,
  Play,
  Circle,
  Calendar,
  Clock,
  Film,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnimeById } from "@/ui/hooks";
import { getStatusConfig } from "@/ui/utils";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLists } from "@/ui/hooks";
import { useAuth } from "@/ui/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Anime = () => {
  const { animeId } = useParams<{ animeId: string }>();
  const animeIdNum = animeId ? parseInt(animeId, 10) : null;
  const { data: anime, loading, error } = useAnimeById(animeIdNum);
  const { data: lists } = useLists();
  const { userId, isLoading: authLoading } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Check if anime is favorite
  useEffect(() => {
    if (animeIdNum && userId && !authLoading) {
      window.electronAPI.isFavorite(userId, animeIdNum).then(setIsFavorite);
    }
  }, [animeIdNum, userId, authLoading]);

  const handleFavorite = async () => {
    if (!animeIdNum || !userId || authLoading) return;
    setFavoriteLoading(true);
    try {
      await window.electronAPI.addFavorite(userId, animeIdNum);
      setIsFavorite(!isFavorite);
      toast.success(
        isFavorite ? "Removed from favorites" : "Added to favorites",
        {
          description: isFavorite
            ? `${
                anime?.title.english || anime?.title.romaji
              } removed from favorites`
            : `${
                anime?.title.english || anime?.title.romaji
              } added to favorites`,
        }
      );
    } catch (err) {
      toast.error("Failed to update favorites", {
        description: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleAddToList = async (listId: number) => {
    if (!animeIdNum) return;
    try {
      await window.electronAPI.addToList(listId, animeIdNum);
      toast.success("Added to list", {
        description: "Anime successfully added to your list",
      });
    } catch (err) {
      toast.error("Failed to add to list", {
        description: err instanceof Error ? err.message : "An error occurred",
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <Skeleton className="h-64 w-full" />
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="flex gap-6">
            <Skeleton className="h-80 w-56 shrink-0" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Anime not found</h2>
          <p className="text-muted-foreground">
            {error?.message || "The anime you're looking for doesn't exist"}
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const displayTitle = anime.title.english || anime.title.romaji;
  const score = anime.averageScore
    ? (anime.averageScore / 10).toFixed(1)
    : null;
  const statusConfig = getStatusConfig(anime.status);
  const formatDisplay = anime.format?.replace(/_/g, " ") || "Unknown";
  const seasonDisplay = anime.season
    ? `${anime.season} ${anime.seasonYear || ""}`.trim()
    : null;

  // Clean description HTML
  const cleanDescription = anime.description
    ? anime.description.replace(/<[^>]*>/g, "").trim()
    : "No description available.";

  return (
    <div className="w-full min-h-screen">
      {/* Banner Section */}
      {anime.bannerImage && (
        <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${anime.bannerImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
      )}

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/" className="inline-block mb-6">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          {/* Cover Image */}
          <div className="shrink-0">
            <div className="relative w-56 md:w-64 lg:w-80 aspect-[2/3] rounded-lg overflow-hidden shadow-lg border">
              <img
                src={anime.coverImage.extraLarge || anime.coverImage.large}
                alt={displayTitle}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Title and Actions */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {displayTitle}
                </h1>
                {anime.title.english &&
                  anime.title.romaji !== anime.title.english && (
                    <p className="text-xl text-muted-foreground">
                      {anime.title.romaji}
                    </p>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleFavorite}
                  disabled={favoriteLoading}
                  variant={isFavorite ? "default" : "outline"}
                  className={cn(
                    isFavorite && "bg-red-500 hover:bg-red-600 text-white"
                  )}
                >
                  <Heart
                    className={cn("mr-2 h-4 w-4", isFavorite && "fill-current")}
                  />
                  {isFavorite ? "Favorited" : "Add to Favorites"}
                </Button>

                {lists && lists.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add to List
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {lists.map((list) => (
                        <DropdownMenuItem
                          key={list.id}
                          onClick={() => handleAddToList(list.id)}
                        >
                          {list.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {score && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Score</div>
                    <div className="font-semibold">{score}/10</div>
                  </div>
                </div>
              )}

              {anime.episodes && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <Play className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Episodes
                    </div>
                    <div className="font-semibold">{anime.episodes}</div>
                  </div>
                </div>
              )}

              {anime.duration && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Duration
                    </div>
                    <div className="font-semibold">{anime.duration} min</div>
                  </div>
                </div>
              )}

              {anime.format && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <Film className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Format</div>
                    <div className="font-semibold">{formatDisplay}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Status and Season */}
            <div className="flex flex-wrap gap-3 items-center">
              {anime.status && (
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium",
                    statusConfig.bg,
                    statusConfig.color
                  )}
                >
                  <Circle className="h-2 w-2 fill-current shrink-0" />
                  <span>{statusConfig.text}</span>
                </div>
              )}

              {seasonDisplay && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{seasonDisplay}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Studios */}
            {anime.studios?.nodes && anime.studios.nodes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Studios
                </h3>
                <div className="flex flex-wrap gap-2">
                  {anime.studios.nodes.map((studio, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-md bg-muted text-sm"
                    >
                      {studio.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {cleanDescription}
              </p>
            </div>

            {/* Characters */}
            {anime.characters?.nodes && anime.characters.nodes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Characters</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {anime.characters.nodes.slice(0, 12).map((character, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <img
                          src={character.image.medium}
                          alt={character.name.full}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-center font-medium line-clamp-2">
                        {character.name.full}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Anime;
