import { useState, useCallback } from "react";

interface UseDeleteListResult {
  deleteList: (listId: number) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to delete a list
 */
export function useDeleteList(): UseDeleteListResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteList = useCallback(
    async (listId: number): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await window.electronAPI.deleteList(listId);
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Failed to delete list");
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { deleteList, loading, error };
}

