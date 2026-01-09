import { useState, useEffect } from "react";
import { getAnimeByIds } from "../api/anime.js";
import { useAuth } from "../contexts/AuthContext.js";
import type { AnimeListItem } from "../../../types.d.ts";

export function useFavorites() {
  const { userId, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<AnimeListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, [userId, isAuthenticated]);

  const fetchFavorites = async () => {
    if (!isAuthenticated || !userId) {
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const favoriteIds = await window.electronAPI.getFavorites(userId);
      
      if (favoriteIds && favoriteIds.length > 0) {
        const animeData = await getAnimeByIds(favoriteIds);
        setFavorites(animeData);
      } else {
        setFavorites([]);
      }
      
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch favorites"));
    } finally {
      setLoading(false);
    }
  };

  return { favorites, loading, error, refetch: fetchFavorites };
}
