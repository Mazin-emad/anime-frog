import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext.js";

interface UseLoginResult {
  login: (name: string, password: string) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to handle user login
 */
export function useLogin(): UseLoginResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { setUser } = useAuth();

  const login = async (name: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.login(name, password);
      if (result && result.user && result.sessionId) {
        // Store user and session ID
        setUser(result.user, result.sessionId);
        toast.success("Login successful!", {
          description: `Welcome back, ${result.user.name}!`,
        });
      } else {
        // result is null or invalid - user not found or wrong password
        const error = new Error("Invalid username or password");
        setError(error);
        toast.error("Login failed", {
          description: "Invalid username or password. Please check your credentials.",
        });
        throw error;
      }
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Failed to login");
      setError(error);
      
      // Don't show duplicate error if we already showed "Invalid username or password"
      if (!error.message.includes("Invalid username or password")) {
        toast.error("Login failed", {
          description: error.message || "An unexpected error occurred",
        });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

