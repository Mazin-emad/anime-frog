import { useState, useEffect } from "react";
import { searchAnime } from "../api/anime.js";
import type { AnimeListItem, UseAnimeResult } from "../../../types.d.ts";

/**
 * Hook to search anime by query string
 * @param query - Search query string
 * @param enabled - Whether to fetch immediately (default: true)
 */
export function useSearchAnime(
  query: string,
  enabled: boolean = true
): UseAnimeResult<AnimeListItem[]> {
  const [data, setData] = useState<AnimeListItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled || !query.trim()) {
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await searchAnime(query);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err : new Error("Failed to search anime")
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [query, enabled]);

  return { data, loading, error };
}

