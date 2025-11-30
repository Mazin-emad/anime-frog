import { useState, useEffect } from "react";
import { getAiringAnime } from "../api/anime.js";
import type { AnimeListItem, UseAnimeResult } from "../../../types.d.ts";

/**
 * Hook to get currently airing anime
 * @param perPage - Number of results per page (default: 50)
 * @param enabled - Whether to fetch immediately (default: true)
 */
export function useAiringAnime(
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
        const result = await getAiringAnime(perPage);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to fetch airing anime")
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
  }, [perPage, enabled]);

  return { data, loading, error };
}

