import { TypographyH2 } from "@/ui/components/global/typography/Headers";
import { PaginatedAnimeCardGrid } from "@/ui/components/cards";
import { usePaginatedAnime } from "@/ui/hooks";

const Favorites = () => {
  const paginatedData = usePaginatedAnime({
    sort: ["POPULARITY_DESC"],
    perPage: 12,
  });

  return (
    <section className="w-full px-4 py-4">
      <header className="mb-6">
        <TypographyH2>Your Favorites Anime</TypographyH2>
      </header>
      <PaginatedAnimeCardGrid paginatedData={paginatedData} columns={4} />
    </section>
  );
};

export default Favorites;
