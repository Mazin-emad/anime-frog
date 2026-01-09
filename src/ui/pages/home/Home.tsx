import { TypographyH2 } from "@/ui/components/global/typography/Headers";
import { PaginatedAnimeCardGrid } from "@/ui/components/cards";
import { usePaginatedAnime } from "@/ui/hooks";
import { useAuth } from "@/ui/contexts/AuthContext";
import { useState, useEffect } from "react";

import { ChevronDown, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", 
  "Horror", "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological", 
  "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"
];

const RATINGS = [
  { label: "Any Rating", value: "0" },
  { label: "5.0+", value: "50" },
  { label: "6.0+", value: "60" },
  { label: "7.0+", value: "70" },
  { label: "7.5+", value: "75" },
  { label: "8.0+", value: "80" },
  { label: "8.5+", value: "85" },
  { label: "9.0+", value: "90" },
];

const Home = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minScore, setMinScore] = useState("0");
  
  const paginatedData = usePaginatedAnime({
    sort: ["POPULARITY_DESC"],
    perPage: 12,
    genre: selectedGenres.length > 0 ? selectedGenres : undefined,
    minScore: minScore !== "0" ? parseInt(minScore) : undefined,
  });

  const { userId } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (userId) {
      window.electronAPI.getFavorites(userId).then((ids) => {
        setFavoriteIds(new Set(ids));
      });
    }
  }, [userId]);

  const handleToggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleRatingChange = (value: string) => {
    setMinScore(value);
  };

  const clearGenres = () => setSelectedGenres([]);
  const clearRating = () => setMinScore("0");

  const handleFavoriteClick = async (animeId: number) => {
    if (!userId) return;
    try {
      const isFav = await window.electronAPI.toggleFavorite(userId, animeId);
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isFav) {
          next.add(animeId);
        } else {
          next.delete(animeId);
        }
        return next;
      });
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const currentRatingLabel = RATINGS.find(r => r.value === minScore)?.label || "Rating";

  return (
    <section className="w-full px-4 py-4 space-y-6">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <TypographyH2>All Anime That Exist Sorted By Popularity</TypographyH2>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Filters:</span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 shrink-0">
                  Genres
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-[400px] overflow-y-auto">
                <DropdownMenuLabel>Pick Genres</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {GENRES.map((genre) => (
                  <DropdownMenuCheckboxItem
                    key={genre}
                    checked={selectedGenres.includes(genre)}
                    onCheckedChange={() => handleToggleGenre(genre)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {genre}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 shrink-0 min-w-[100px]">
                  {currentRatingLabel}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>Minimum Rating</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={minScore} onValueChange={handleRatingChange}>
                  {RATINGS.map((rating) => (
                    <DropdownMenuRadioItem key={rating.value} value={rating.value}>
                      {rating.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Selected Filters Display */}
        {(selectedGenres.length > 0 || minScore !== "0") && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground">Active Filters:</span>
            
            {/* Rating Badge */}
            {minScore !== "0" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 text-xs font-semibold border border-yellow-500/20">
                <Star className="h-3 w-3 fill-current" />
                {RATINGS.find(r => r.value === minScore)?.label}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-yellow-700 dark:hover:text-yellow-300" 
                  onClick={clearRating}
                />
              </span>
            )}

            {/* Genre Badges */}
            {selectedGenres.map(genre => (
              <span 
                key={genre} 
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20"
              >
                {genre}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-primary/70" 
                  onClick={() => handleToggleGenre(genre)}
                />
              </span>
            ))}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs" 
              onClick={() => {
                clearGenres();
                clearRating();
              }}
            >
              Clear All
            </Button>
          </div>
        )}
      </header>
      <PaginatedAnimeCardGrid 
        paginatedData={paginatedData} 
        columns={4} 
        onFavoriteClick={handleFavoriteClick}
        favoriteIds={favoriteIds}
      />
    </section>
  );
};

export default Home;
