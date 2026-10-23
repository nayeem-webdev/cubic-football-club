import { useEffect, useState } from "react";
import PageHero from "../components/PageHero";
import ScoreCard from "../components/ScoreCard";
import Loader from "../components/Loader";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

export default function Score() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    limit: 5,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function loadMatches() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_URL}/scores/summary?page=${currentPage}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch scores");
        }

        const data = await response.json();

        console.log("Scores response:", data);

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch scores");
        }

        setMatches(data.scores || []);

        setPagination(
          data.pagination || {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            limit: 5,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        );
      } catch (err) {
        console.error("Match loading error:", err);

        setError("Unable to load matches.");
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, [API_URL, currentPage]);

  const handlePrevious = () => {
    if (pagination.hasPreviousPage && !loading) {
      setCurrentPage((page) => page - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (pagination.hasNextPage && !loading) {
      setCurrentPage((page) => page + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-text">
      <div className="mx-auto max-w-7xl">
        <PageHero
          text="Matches"
          heading="Match Center"
          subheading="View upcoming fixtures, recent results, and every match played by Cubic FC."
        />

        {/* ERROR */}
        {error && !loading && (
          <div className="mx-auto mb-6 flex max-w-xl flex-col items-center rounded-2xl border border-red-500/30 p-8 text-center text-text-muted">
            <AlertCircle className="mb-3 h-8 w-8 text-red-400" />

            <h2 className="text-lg font-semibold text-text">
              Unable to load score
            </h2>

            <p className="mt-2 text-sm text-text-muted">{error}</p>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* MATCHES */}
            {matches.length > 0 ? (
              <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6">
                {matches.map((match) => (
                  <ScoreCard key={match._id} match={match} />
                ))}
              </div>
            ) : (
              /* EMPTY */
              !error && (
                <div className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-border text-center text-text-muted">
                  <p className="text-xl font-bold text-text">
                    No Matches Found
                  </p>

                  <p className="mt-2 text-sm text-text-muted">
                    No match results are available yet.
                  </p>
                </div>
              )
            )}

            {/* PAGINATION */}
            {pagination.totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center justify-center gap-4">
                {/* PAGE INFO */}
                <p className="text-sm text-text-muted">
                  Page{" "}
                  <span className="font-semibold text-text">
                    {pagination.currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-text">
                    {pagination.totalPages}
                  </span>{" "}
                  {/* TOTAL */}
                  <span>
                    Total {pagination.totalItems}{" "}
                    {pagination.totalItems === 1 ? "match" : "matches"}.
                  </span>
                </p>

                {/* BUTTONS */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={!pagination.hasPreviousPage || loading}
                    className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-text transition hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text"
                  >
                    <ChevronLeft size={17} />
                    Prev
                  </button>

                  <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-secondary px-3 text-sm font-bold text-background">
                    {pagination.currentPage}
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!pagination.hasNextPage || loading}
                    className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-text transition hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text"
                  >
                    Next
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
