import { useState, useEffect } from "react";
import { getAnimeById } from "../api/anime.js";
import type { AnimeDetails, UseAnimeResult } from "../../../types.d.ts";

/**
 * Hook to get anime details by ID
 * @param id - Anime ID
 * @param enabled - Whether to fetch immediately (default: true)
 */
export function useAnimeById(
  id: number | null,
  enabled: boolean = true
): UseAnimeResult<AnimeDetails> {
  const [data, setData] = useState<AnimeDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled || id === null) {
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getAnimeById(id);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err
              : new Error(`Failed to fetch anime with ID ${id}`)
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
  }, [id, enabled]);

  return { data, loading, error };
}

