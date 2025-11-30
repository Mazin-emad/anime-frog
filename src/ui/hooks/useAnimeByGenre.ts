import { useState, useEffect } from "react";
import { getAnimeByGenre } from "../api/anime.js";
import type {
  AnimeListItem,
  UseAnimeResult,
  AnimeSort,
} from "../../../types.d.ts";

/**
 * Hook to get anime by genre
 * @param genres - Array of genre names
 * @param sort - Sort order (default: "POPULARITY_DESC")
 * @param perPage - Number of results per page (default: 50)
 * @param enabled - Whether to fetch immediately (default: true)
 */
export function useAnimeByGenre(
  genres: string[],
  sort: AnimeSort = "POPULARITY_DESC",
  perPage: number = 50,
  enabled: boolean = true
): UseAnimeResult<AnimeListItem[]> {
  const [data, setData] = useState<AnimeListItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled || !genres || genres.length === 0) {
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getAnimeByGenre(genres, sort, perPage);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to fetch anime by genre")
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [genres.join(","), sort, perPage, enabled]);

  return { data, loading, error };
}

