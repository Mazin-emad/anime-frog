import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext.js';
import { electronAPI } from '../utils/electron-api.js';

interface UseSignupResult {
  signup: (name: string, password: string) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

/**
 * Improved signup hook with better error handling
 */
export function useSignup(): UseSignupResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { setUser } = useAuth();

  const signup = async (name: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!name || !name.trim()) {
        throw new Error('Username is required');
      }
      
      if (name.trim().length < 2) {
        throw new Error('Username must be at least 2 characters');
      }
      
      if (!password || !password.trim()) {
        throw new Error('Password is required');
      }
      
      if (password.length < 3) {
        throw new Error('Password must be at least 3 characters');
      }

      const result = await electronAPI.signup(name.trim(), password);
      
      // Validate result structure
      if (!result || typeof result !== 'object') {
        throw new Error('Signup failed - no response from server');
      }
      
      if (!result.user || result.sessionId === undefined) {
        throw new Error('Signup failed - incomplete response');
      }
      
      // Store user and session ID
      setUser(result.user, result.sessionId);
      toast.success('Account created!', {
        description: `Welcome, ${result.user.name}!`,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to signup');
      setError(error);
      
      // Show user-friendly error message
      const errorMessage = error.message || 'An unexpected error occurred';
      toast.error('Signup failed', {
        description: errorMessage,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
}
