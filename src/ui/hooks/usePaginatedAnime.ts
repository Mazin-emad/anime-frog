import { useState, useEffect, useCallback } from "react";
import { getPaginatedAnime } from "../api/anime.js";
import type {
  AnimeListItem,
  UsePaginatedAnimeResult,
  AnimeFilters,
  PageInfo,
} from "../../../types.d.ts";

/**
 * Hook to get paginated anime with filters
 * @param filters - Filter options
 * @param enabled - Whether to fetch immediately (default: true)
 */
export function usePaginatedAnime(
  filters: AnimeFilters = {},
  enabled: boolean = true
): UsePaginatedAnimeResult {
  const [data, setData] = useState<AnimeListItem[] | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(filters.page || 1);

  const fetchPage = useCallback(
    async (page: number) => {
      let cancelled = false;

      setLoading(true);
      setError(null);

      try {
        const result = await getPaginatedAnime({
          ...filters,
          page,
        });

        if (!cancelled) {
          setData(result.media);
          setPageInfo(result.pageInfo);
          setCurrentPage(page);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to fetch paginated anime")
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }

      return () => {
        cancelled = true;
      };
    },
    [filters]
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    setData(null);
    setPageInfo(null);
    setCurrentPage(filters.page || 1);
    fetchPage(filters.page || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enabled,
    filters.search,
    filters.genre?.join(","),
    filters.tag?.join(","),
    filters.format,
    filters.status,
    filters.season,
    filters.seasonYear,
    filters.sort?.join(","),
    filters.minScore,
    filters.maxScore,
    filters.perPage,
  ]);

  const goToPage = useCallback(
    (page: number) => {
      if (pageInfo && (page < 1 || page > pageInfo.lastPage)) return;
      fetchPage(page);
    },
    [pageInfo, fetchPage]
  );

  const loadMore = useCallback(() => {
    if (!pageInfo?.hasNextPage || loading) return;
    fetchPage(currentPage + 1);
  }, [pageInfo, loading, currentPage, fetchPage]);

  return {
    data,
    pageInfo,
    loading,
    error,
    loadMore,
    hasMore: pageInfo?.hasNextPage || false,
    currentPage,
    goToPage,
  };
}
