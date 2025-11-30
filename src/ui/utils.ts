import type { User } from "../../types.d.ts";

const STORAGE_KEY = "anime_app_session_id";

// Auth utilities - using session ID stored in localStorage
export const authUtils = {
  /**
   * Get the session ID from localStorage
   */
  getSessionId: (): number | null => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      const sessionId = parseInt(stored, 10);
      return isNaN(sessionId) ? null : sessionId;
    } catch {
      return null;
    }
  },

  /**
   * Set the session ID in localStorage
   */
  setSessionId: (sessionId: number | null): void => {
    if (typeof window === "undefined") return;
    if (sessionId !== null) {
      localStorage.setItem(STORAGE_KEY, sessionId.toString());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  /**
   * Validate the current session and get user
   */
  async validateSession(): Promise<User | null> {
    const sessionId = authUtils.getSessionId();
    if (!sessionId) {
      return null;
    }

    try {
      const result = await window.electronAPI.validateSession(sessionId);
      if (result && result.valid && result.user) {
        // Validate user object structure
        if (typeof result.user.id === "number" && result.user.name) {
          return result.user;
        } else {
          console.warn("Invalid user structure in session validation");
          authUtils.setSessionId(null);
          return null;
        }
      } else {
        // Invalid session, clear session ID
        authUtils.setSessionId(null);
        return null;
      }
    } catch (err) {
      console.error("Failed to validate session:", err);
      authUtils.setSessionId(null);
      return null;
    }
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    const sessionId = authUtils.getSessionId();
    if (sessionId) {
      try {
        await window.electronAPI.logout(sessionId);
      } catch (err) {
        console.error("Failed to logout:", err);
      }
    }
    authUtils.setSessionId(null);
  },
};

export const getStatusConfig = (status: string | null) => {
  if (!status)
    return {
      text: "Unknown",
      color: "text-muted-foreground",
      bg: "bg-muted",
    };

  const statusLower = status.toLowerCase();
  if (statusLower === "releasing" || statusLower === "releasing soon") {
    return {
      text: "Airing",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-500/10",
    };
  }
  if (statusLower === "finished" || statusLower === "completed") {
    return {
      text: "Finished",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
    };
  }
  if (statusLower === "not yet released" || statusLower === "upcoming") {
    return {
      text: "Upcoming",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
    };
  }
  if (statusLower === "cancelled") {
    return {
      text: "Cancelled",
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-500/10",
    };
  }
  if (statusLower === "hiatus") {
    return {
      text: "Hiatus",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-500/10",
    };
  }
  return {
    text: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
    color: "text-muted-foreground",
    bg: "bg-muted",
  };
};