import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { authUtils } from '../utils/auth.js';
import type { User } from '../../../types.d.ts';

interface AuthContextType {
  user: User | null;
  userId: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null, sessionId?: number) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Improved AuthProvider with better error handling and session management
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUserState] = useState<User | null>(null);

  // Validate session on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const validatedUser = await authUtils.validateSession();
        if (isMounted) {
          setUserState(validatedUser);
        }
      } catch (err) {
        console.error('Failed to load session:', err);
        if (isMounted) {
          setUserState(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for storage changes (e.g., from other tabs/windows)
  useEffect(() => {
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === 'anime_app_session_id') {
        try {
          const validatedUser = await authUtils.validateSession();
          setUserState(validatedUser);
        } catch (err) {
          console.error('Failed to validate session on storage change:', err);
          setUserState(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setUser = useCallback((newUser: User | null, sessionId?: number) => {
    // Validate user has required fields before storing
    if (newUser) {
      if (typeof newUser.id !== 'number' || !newUser.name) {
        console.error('Invalid user object: missing required fields', newUser);
        return;
      }

      // When setting a user, sessionId is required
      if (sessionId === undefined || sessionId === null) {
        console.error('Cannot set user without sessionId');
        return;
      }

      authUtils.setSessionId(sessionId);
      setUserState(newUser);
    } else {
      // Logging out - clear everything
      authUtils.setSessionId(null);
      setUserState(null);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authUtils.logout();
      setUserState(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if logout fails
      setUserState(null);
      authUtils.setSessionId(null);
    }
  }, []);

  // Compute userId safely
  const userId = user && typeof user.id === 'number' ? user.id : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        isAuthenticated: !!user && !!userId,
        isLoading,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
