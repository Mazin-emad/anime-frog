import { useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AnimeCardGrid from "./AnimeCardGrid.js";
import type { UsePaginatedAnimeResult } from "../../../../types.d.ts";
import { cn } from "@/lib/utils";

interface PaginatedAnimeCardGridProps {
  paginatedData: UsePaginatedAnimeResult;
  onFavoriteClick?: (id: number) => void;
  favoriteIds?: Set<number>;
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
  showPagination?: boolean;
}

export default function PaginatedAnimeCardGrid({
  paginatedData,
  onFavoriteClick,
  favoriteIds,
  columns = 4,
  className,
  showPagination = true,
}: PaginatedAnimeCardGridProps) {
  const { data, pageInfo, loading, error, currentPage, goToPage } =
    paginatedData;

  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    if (!pageInfo) return [];

    const pages: (number | "ellipsis")[] = [];
    const totalPages = pageInfo.lastPage;
    const current = currentPage;

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    let start = Math.max(2, current - 1);
    let end = Math.min(totalPages - 1, current + 1);

    // Adjust if we're near the start
    if (current <= 3) {
      end = Math.min(5, totalPages - 1);
    }

    // Adjust if we're near the end
    if (current >= totalPages - 2) {
      start = Math.max(2, totalPages - 4);
    }

    // Add ellipsis before range if needed
    if (start > 2) {
      pages.push("ellipsis");
    }

    // Add pages in range
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Add ellipsis after range if needed
    if (end < totalPages - 1) {
      pages.push("ellipsis");
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }, [pageInfo, currentPage]);

  const handlePageClick = (page: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (
      page !== currentPage &&
      page >= 1 &&
      page <= (pageInfo?.lastPage || 1)
    ) {
      goToPage(page);
      // Scroll to top of grid
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Grid */}
      <AnimeCardGrid
        anime={data}
        loading={loading}
        error={error}
        onFavoriteClick={onFavoriteClick}
        favoriteIds={favoriteIds}
        columns={columns}
      />

      {/* Pagination */}
      {showPagination && pageInfo && (
        <div className="flex flex-col items-center gap-4 pt-6 border-t">
          {/* Page Info */}
          <div className="text-sm text-muted-foreground text-center">
            Showing page{" "}
            <span className="font-semibold text-foreground">{currentPage}</span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {pageInfo.lastPage}
            </span>
            {" • "}
            <span className="font-semibold text-foreground">
              {pageInfo.total.toLocaleString()}
            </span>{" "}
            total results
          </div>

          {/* Pagination Controls - Only show if more than 1 page */}
          {pageInfo.lastPage > 1 && (
            <Pagination>
              <PaginationContent className="flex-wrap justify-center gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        handlePageClick(currentPage - 1, e);
                      }
                    }}
                    className={cn(
                      "cursor-pointer",
                      currentPage === 1 && "pointer-events-none opacity-50"
                    )}
                    aria-disabled={currentPage === 1}
                    tabIndex={currentPage === 1 ? -1 : 0}
                  />
                </PaginationItem>

                {pageNumbers.map((page, index) => {
                  if (page === "ellipsis") {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis className="text-muted-foreground" />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => handlePageClick(page, e)}
                        isActive={page === currentPage}
                        className={cn(
                          "min-w-[2.5rem] cursor-pointer transition-all",
                          page === currentPage &&
                            "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm"
                        )}
                        aria-label={`Go to page ${page}`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < (pageInfo?.lastPage || 1)) {
                        handlePageClick(currentPage + 1, e);
                      }
                    }}
                    className={cn(
                      "cursor-pointer",
                      currentPage === (pageInfo?.lastPage || 1) &&
                        "pointer-events-none opacity-50"
                    )}
                    aria-disabled={currentPage === (pageInfo?.lastPage || 1)}
                    tabIndex={
                      currentPage === (pageInfo?.lastPage || 1) ? -1 : 0
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}
