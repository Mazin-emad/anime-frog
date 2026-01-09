import { TypographyH2 } from "@/ui/components/global/typography/Headers";
import { AnimeCardGrid } from "@/ui/components/cards";
import { useFavorites } from "@/ui/hooks/useFavorites";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const Favorites = () => {
  const { favorites, loading, refetch } = useFavorites();

  return (
    <section className="w-full px-4 py-4">
      <header className="mb-6 flex items-center justify-between">
        <TypographyH2>Your Favorites Anime</TypographyH2>
        <Button 
          variant="outline"
          size="icon"
          onClick={refetch}
          disabled={loading}
          title="Refresh Favorites"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </header>
      
      <AnimeCardGrid 
        anime={favorites} 
        loading={loading}
        columns={4} 
      />
    </section>
  );
};

export default Favorites;
