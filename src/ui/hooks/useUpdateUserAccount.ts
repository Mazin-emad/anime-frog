import { useState } from "react";
import { toast } from "sonner";

interface UseUpdateUserAccountResult {
  updateUser: (userId: number, name: string, password: string) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to update a user account
 */
export function useUpdateUserAccount(): UseUpdateUserAccountResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const updateUser = async (
    userId: number,
    name: string,
    password: string
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await window.electronAPI.updateUser(userId, name, password);
      toast.success("Account updated", {
        description: "Your account has been updated successfully",
      });
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to update account");
      setError(error);
      toast.error("Update failed", {
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
}

