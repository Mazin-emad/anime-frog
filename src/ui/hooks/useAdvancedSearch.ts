import { useState, useEffect } from "react";
import { getPaginatedAnime } from "../api/anime.js";
import type { PaginatedAnimeResult, AnimeFilters, AnimeListItem, PageInfo } from "../../../types.d.ts";

interface UseAdvancedSearchResult {
  data: AnimeListItem[];
  pageInfo: PageInfo;
  loading: boolean;
  error: Error | null;
  setFilters: (filters: Partial<AnimeFilters>) => void;
  goToPage: (page: number) => void;
  loadMore: () => void;
  hasMore: boolean;
  currentPage: number;
}

export function useAdvancedSearch(initialFilters: AnimeFilters = {}): UseAdvancedSearchResult {
  const [data, setData] = useState<PaginatedAnimeResult["media"] | null>(null);
  const [pageInfo, setPageInfo] = useState<PaginatedAnimeResult["pageInfo"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const [filters, setFiltersState] = useState<AnimeFilters>({
    page: 1,
    perPage: 20,
    ...initialFilters
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPaginatedAnime(filters);
      setData(result.media);
      setPageInfo(result.pageInfo);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to search anime"));
    } finally {
      setLoading(false);
    }
  };

  const setFilters = (newFilters: Partial<AnimeFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters, page: 1 })); // Reset to page 1 on filter change
  };

  const goToPage = (page: number) => {
    setFiltersState(prev => ({ ...prev, page }));
  };

  const loadMore = () => {
    // Current implementation uses pagination, so loadMore is not typically used 
    // in the same way as infinite scroll, but we can implement it if needed or leave as no-op
    // for compatibility with the interface.
    if (pageInfo?.hasNextPage) {
        goToPage((pageInfo.currentPage || 1) + 1);
    }
  };

  const defaultPageInfo = {
    total: 0,
    currentPage: 1,
    lastPage: 1,
    hasNextPage: false,
    perPage: 20
  };

  return {
    data: data || [],
    pageInfo: pageInfo || defaultPageInfo,
    loading,
    error,
    setFilters,
    goToPage,
    loadMore,
    hasMore: pageInfo?.hasNextPage || false,
    currentPage: pageInfo?.currentPage || 1
  };
}
