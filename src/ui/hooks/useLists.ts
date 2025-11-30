import { useState, useEffect, useCallback } from "react";
import type { UseAnimeResult } from "../../../types.d.ts";
import { useAuth } from "../contexts/AuthContext.js";

export interface ListData {
  id: number;
  name: string;
  description: string | null;
  coverImage: string | null;
  bannerImage: string | null;
}

interface UseListsResult extends UseAnimeResult<ListData[]> {
  refetch: () => void;
}

/**
 * Hook to get all lists for the current user
 */
export function useLists(): UseListsResult {
  const { userId, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<ListData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLists = useCallback(async () => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    if (!userId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.getLists(userId);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch lists")
      );
    } finally {
      setLoading(false);
    }
  }, [userId, authLoading]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  return { data, loading, error, refetch: fetchLists };
}

