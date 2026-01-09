import { useState, useEffect, useCallback } from "react";
import type { UseAnimeResult } from "../../../types.d.ts";

interface UseListAnimesResult extends UseAnimeResult<number[]> {
  refetch: () => void;
  addAnime: (animeId: number) => Promise<void>;
  removeAnime: (animeId: number) => Promise<void>;
}

/**
 * Hook to get anime IDs in a list and manage them
 */
export function useListAnimes(listId: number | null): UseListAnimesResult {
  const [data, setData] = useState<number[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnimes = useCallback(async () => {
    if (!listId) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.getListAnimes(listId);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error(`Failed to fetch anime for list ${listId}`)
      );
    } finally {
      setLoading(false);
    }
  }, [listId]);

  const addAnime = useCallback(
    async (animeId: number) => {
      if (!listId) throw new Error("No list selected");
      try {
        await window.electronAPI.addToList(listId, animeId);
        // Optimistically update
        setData((prev) => (prev?.includes(animeId) ? prev : [...(prev || []), animeId]));
        // Refetch to ensure consistency
        await fetchAnimes();
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to add anime to list")
        );
        throw err;
      }
    },
    [listId, fetchAnimes]
  );

  const removeAnime = useCallback(
    async (animeId: number) => {
      if (!listId) throw new Error("No list selected");
      try {
        // Optimistically update
        setData((prev) => prev?.filter((id) => id !== animeId) || []);
        await window.electronAPI.removeFromList(listId, animeId);
        // Refetch to ensure consistency
        await fetchAnimes();
      } catch (err) {
        // Revert on error
        await fetchAnimes();
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to remove anime from list")
        );
        throw err;
      }
    },
    [listId, fetchAnimes]
  );

  useEffect(() => {
    fetchAnimes();
  }, [fetchAnimes]);

  return { data, loading, error, refetch: fetchAnimes, addAnime, removeAnime };
}

