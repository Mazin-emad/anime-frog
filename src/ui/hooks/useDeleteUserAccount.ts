import { useState } from "react";
import { toast } from "sonner";

interface UseDeleteUserAccountResult {
  deleteUser: (userId: number) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to delete a user account
 */
export function useDeleteUserAccount(): UseDeleteUserAccountResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteUser = async (userId: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await window.electronAPI.deleteUser(userId);
      toast.success("Account deleted", {
        description: "Your account has been deleted successfully",
      });
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to delete account");
      setError(error);
      toast.error("Delete failed", {
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
}

