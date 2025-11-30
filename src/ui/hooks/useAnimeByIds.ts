import { useState, useEffect, useCallback } from "react";
import { getAnimeByIds } from "../api/anime.js";
import type { AnimeListItem, UseAnimeResult } from "../../../types.d.ts";

interface UseAnimeByIdsResult extends UseAnimeResult<AnimeListItem[]> {
  refetch: () => void;
}

/**
 * Hook to get multiple anime by their IDs
 */
export function useAnimeByIds(
  ids: number[] | null,
  enabled: boolean = true
): UseAnimeByIdsResult {
  const [data, setData] = useState<AnimeListItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled || !ids || ids.length === 0) {
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getAnimeByIds(ids);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch anime")
      );
    } finally {
      setLoading(false);
    }
  }, [ids, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

