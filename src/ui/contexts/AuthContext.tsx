import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authUtils } from "../utils.js";
import type { User } from "../../../types.d.ts";

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

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUserState] = useState<User | null>(null);

  // Validate session on mount
  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const validatedUser = await authUtils.validateSession();
        setUserState(validatedUser);
      } catch (err) {
        console.error("Failed to load session:", err);
        setUserState(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  // Listen for storage changes (e.g., from other tabs/windows)
  useEffect(() => {
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === "anime_app_session_id") {
        const validatedUser = await authUtils.validateSession();
        setUserState(validatedUser);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const setUser = (newUser: User | null, sessionId?: number) => {
    // Validate user has required fields before storing
    if (newUser) {
      if (typeof newUser.id !== "number" || !newUser.name) {
        console.error("Invalid user object: missing required fields", newUser);
        return;
      }

      // When setting a user, sessionId is required
      if (!sessionId) {
        console.error("Cannot set user without sessionId");
        return;
      }

      authUtils.setSessionId(sessionId);
      setUserState(newUser);
    } else {
      // Logging out - clear everything
      authUtils.setSessionId(null);
      setUserState(null);
    }
  };

  const logout = async () => {
    await authUtils.logout();
    setUserState(null);
  };

  // Compute userId safely
  const userId = user && typeof user.id === "number" ? user.id : null;

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
