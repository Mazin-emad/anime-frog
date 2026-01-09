import { useState, useEffect } from "react";
import { getAllAnime } from "../api/anime.js";
import type {
  AnimeListItem,
  UseAnimeResult,
  AnimeSort,
} from "../../../types.d.ts";

/**
 * Hook to get all anime with sorting options
 * @param sort - Sort order (default: "POPULARITY_DESC")
 * @param perPage - Number of results per page (default: 50)
 * @param enabled - Whether to fetch immediately (default: true)
 */
export function useAllAnime(
  sort: AnimeSort = "POPULARITY_DESC",
  perPage: number = 50,
  enabled: boolean = true
): UseAnimeResult<AnimeListItem[]> {
  const [data, setData] = useState<AnimeListItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getAllAnime(sort, perPage);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch all anime")
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
  }, [sort, perPage, enabled]);

  return { data, loading, error };
}
