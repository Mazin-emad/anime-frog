import { useState, useCallback } from "react";

interface UseUpdateListResult {
  updateList: (listId: number, name: string, description: string) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to update an existing list
 */
export function useUpdateList(): UseUpdateListResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const updateList = useCallback(
    async (listId: number, name: string, description: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await window.electronAPI.updateList(listId, name, description);
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Failed to update list");
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateList, loading, error };
}

