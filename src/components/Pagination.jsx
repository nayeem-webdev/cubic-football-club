import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  loading = false,
  onPageChange,
  onPrevious,
  onNext,
  totalItems,
}) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Left ellipsis
    if (currentPage > 4) {
      pages.push("left-ellipsis");
    }

    // Pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    // Right ellipsis
    if (currentPage < totalPages - 3) {
      pages.push("right-ellipsis");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-4">
      {/* PAGE INFO */}
      {totalItems !== undefined && (
        <p className="text-sm text-text-muted">
          Page <span className="font-semibold text-text">{currentPage}</span> of{" "}
          <span className="font-semibold text-text">{totalPages}</span>{" "}
          <span>
            Total {totalItems} {totalItems === 1 ? "match" : "matches"}.
          </span>
        </p>
      )}

      {/* PAGINATION */}
      <div className="flex items-center gap-2">
        {/* PREVIOUS */}
        <button
          type="button"
          onClick={onPrevious}
          disabled={!hasPreviousPage || loading}
          className="flex h-9 items-center gap-1 rounded-lg border border-border bg-surface px-3 text-sm font-semibold text-text transition hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text"
        >
          <ChevronLeft size={17} />
        </button>

        {/* PAGE NUMBERS */}
        <div className="flex items-center gap-1">
          {getPages().map((page, index) => {
            if (page === "left-ellipsis" || page === "right-ellipsis") {
              return (
                <span
                  key={`${page}-${index}`}
                  className="flex h-9 w-9 items-center justify-center text-sm text-text-muted"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                disabled={loading}
                className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-secondary text-background"
                    : "border border-border bg-surface text-text hover:border-secondary hover:text-secondary"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* NEXT */}
        <button
          type="button"
          onClick={onNext}
          disabled={!hasNextPage || loading}
          className="flex h-9 items-center gap-1 rounded-lg border border-border bg-surface px-3 text-sm font-semibold text-text transition hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text"
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
