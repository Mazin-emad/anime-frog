import { useState, useEffect } from "react";
import { getSeasonalAnime } from "../api/anime.js";
import type { AnimeListItem, UseAnimeResult, AnimeSeason } from "../../../types.d.ts";

/**
 * Hook to get seasonal anime
 * @param season - Season (WINTER, SPRING, SUMMER, FALL)
 * @param year - Year
 * @param perPage - Number of results per page (default: 50)
 * @param enabled - Whether to fetch immediately (default: true)
 */
export function useSeasonalAnime(
  season: AnimeSeason,
  year: number,
  perPage: number = 50,
  enabled: boolean = true
): UseAnimeResult<AnimeListItem[]> {
  const [data, setData] = useState<AnimeListItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getSeasonalAnime(season, year, perPage);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err
              : new Error(`Failed to fetch ${season} ${year} anime`)
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [season, year, perPage, enabled]);

  return { data, loading, error };
}

