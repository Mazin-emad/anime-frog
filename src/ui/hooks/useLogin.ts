import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext.js';
import { electronAPI } from '../utils/electron-api.js';

interface UseLoginResult {
  login: (name: string, password: string) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

/**
 * Improved login hook with better error handling
 */
export function useLogin(): UseLoginResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { setUser } = useAuth();

  const login = async (name: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!name || !name.trim()) {
        throw new Error('Username is required');
      }
      
      if (!password || !password.trim()) {
        throw new Error('Password is required');
      }

      const result = await electronAPI.login(name.trim(), password);
      
      if (result && result.user && result.sessionId) {
        // Store user and session ID
        setUser(result.user, result.sessionId);
        toast.success('Login successful!', {
          description: `Welcome back, ${result.user.name}!`,
        });
      } else {
        // result is null - invalid credentials
        const loginError = new Error('Invalid username or password');
        setError(loginError);
        toast.error('Login failed', {
          description: 'Invalid username or password. Please check your credentials.',
        });
        throw loginError;
      }
    } catch (err) {
      // Only handle errors that weren't already handled above
      if (err instanceof Error && err.message === 'Invalid username or password') {
        throw err;
      }
      
      const error = err instanceof Error ? err : new Error('Failed to login');
      setError(error);
      
      toast.error('Login failed', {
        description: error.message || 'An unexpected error occurred',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
