import { useState, useEffect, useCallback } from "react";
import type { UseAnimeResult } from "../../../types.d.ts";

export interface ListDetails {
  id: number;
  name: string;
  description: string | null;
  coverImage: string | null;
  bannerImage: string | null;
}

interface UseListResult extends UseAnimeResult<ListDetails> {
  refetch: () => void;
}

/**
 * Hook to get a single list by ID
 */
export function useList(listId: number | null): UseListResult {
  const [data, setData] = useState<ListDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchList = useCallback(async () => {
    if (!listId) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.getList(listId);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error(`Failed to fetch list ${listId}`)
      );
    } finally {
      setLoading(false);
    }
  }, [listId]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { data, loading, error, refetch: fetchList };
}

