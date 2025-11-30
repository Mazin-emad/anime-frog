import { useState, useEffect, useCallback } from "react";
import type { UseAnimeResult } from "../../../types.d.ts";

export interface UserData {
  id: number;
  name: string;
  password: string;
}

interface UseAllUsersResult extends UseAnimeResult<UserData[]> {
  refetch: () => void;
}

/**
 * Hook to get all users (admin only)
 */
export function useAllUsers(): UseAllUsersResult {
  const [data, setData] = useState<UserData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.getAllUsers();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch users")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { data, loading, error, refetch: fetchUsers };
}

