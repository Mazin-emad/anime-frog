import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext.js";

interface UseSignupResult {
  signup: (name: string, password: string) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to handle user signup
 */
export function useSignup(): UseSignupResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { setUser } = useAuth();

  const signup = async (name: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Check if user already exists
      const exists = await window.electronAPI.isUserExists(name);
      if (exists) {
        const error = new Error("Username already exists");
        setError(error);
        toast.error("Signup failed", {
          description: "Username already exists. Please choose a different one.",
        });
        throw error;
      }

      const result = await window.electronAPI.signup(name, password);
      
      // Validate result structure
      if (!result || !result.user || !result.sessionId) {
        throw new Error("Invalid response from server");
      }
      
      // Store user and session ID
      setUser(result.user, result.sessionId);
      toast.success("Account created!", {
        description: `Welcome, ${result.user.name}!`,
      });
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Failed to signup");
      setError(error);
      // Show user-friendly error message
      const errorMessage = error.message || "An unexpected error occurred";
      toast.error("Signup failed", {
        description: errorMessage,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
}

