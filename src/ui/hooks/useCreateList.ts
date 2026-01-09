import { useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext.js";

interface UseCreateListResult {
  createList: (name: string, description?: string) => Promise<number>;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to create a new list
 */
export function useCreateList(): UseCreateListResult {
  const { userId, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const createList = useCallback(
    async (name: string, description?: string): Promise<number> => {
      if (authLoading) {
        throw new Error("Authentication is still loading");
      }
      if (!userId) {
        throw new Error("Not logged in");
      }

      setLoading(true);
      setError(null);

      try {
        const listId = await window.electronAPI.createList(
          userId,
          name,
          description
        );
        return listId;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to create list");
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [userId, authLoading]
  );

  return { createList, loading, error };
}
