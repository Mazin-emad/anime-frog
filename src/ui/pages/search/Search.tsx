import { useState, useEffect } from "react";
import { useAuth } from "@/ui/contexts/AuthContext";
import { TypographyH2 } from "@/ui/components/global/typography/Headers";
import { PaginatedAnimeCardGrid } from "@/ui/components/cards";
import { useAdvancedSearch } from "@/ui/hooks/useAdvancedSearch";
import { Search as SearchIcon, ChevronDown, X, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
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

// Common Anime Genres
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

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minScore, setMinScore] = useState("0");
  
  const { data, pageInfo, loading, error, setFilters, goToPage, loadMore, hasMore } = useAdvancedSearch({
    perPage: 12,
    sort: ["POPULARITY_DESC"]
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear genres when searching by text to keep them independent as requested before
    setSelectedGenres([]);
    setFilters({ 
      search: searchQuery, 
      genre: undefined, 
      sort: undefined,
      minScore: minScore !== "0" ? parseInt(minScore) : undefined 
    });
  };

  const handleToggleGenre = (genre: string) => {
    setSelectedGenres(prev => {
      const isSelected = prev.includes(genre);
      const next = isSelected 
        ? prev.filter(g => g !== genre)
        : [...prev, genre];
      
      // If we have genres, clear the text search to keep them independent
      if (next.length > 0) {
        setSearchQuery("");
      }

      setFilters({ 
        genre: next.length > 0 ? next : undefined, 
        search: next.length > 0 ? undefined : searchQuery,
        sort: next.length > 0 ? ["POPULARITY_DESC"] : undefined,
        minScore: minScore !== "0" ? parseInt(minScore) : undefined
      });
      
      return next;
    });
  };

  const handleRatingChange = (value: string) => {
    setMinScore(value);
    setFilters({ 
      minScore: value !== "0" ? parseInt(value) : undefined 
    });
  };

  const clearGenres = () => {
    setSelectedGenres([]);
    setFilters({ genre: undefined });
  };

  const clearRating = () => {
    setMinScore("0");
    setFilters({ minScore: undefined });
  };

  // Transform data to match PaginatedAnimeCardGrid expectation
  const paginatedData = {
    data,
    pageInfo,
    loading,
    error,
    currentPage: pageInfo.currentPage,
    goToPage,
    loadMore,
    hasMore
  };

  const { userId } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  // Check favorites when results change or user logs in
  useEffect(() => {
    if (userId && data && data.length > 0) {
      window.electronAPI.getFavorites(userId).then((ids) => {
        setFavoriteIds(new Set(ids));
      });
    }
  }, [userId, data]);

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
          <TypographyH2>Search Anime</TypographyH2>
          
          <form onSubmit={handleSearch} className="flex flex-1 max-w-xl gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search anime..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 shrink-0">
                  Genres
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-[400px] overflow-y-auto">
                <DropdownMenuLabel>Select Genres</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {GENRES.map((genre) => (
                  <DropdownMenuCheckboxItem
                    key={genre}
                    checked={selectedGenres.includes(genre)}
                    onCheckedChange={() => handleToggleGenre(genre)}
                    onSelect={(e) => e.preventDefault()} // Keep open for multi-select
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
            
            <Button type="submit" className="shrink-0">
              Search
            </Button>
          </form>
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

export default Search;
