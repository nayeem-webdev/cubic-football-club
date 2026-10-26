import { useEffect, useState } from "react";
import PageHero from "../components/PageHero";
import ScoreCard from "../components/ScoreCard";
import Loader from "../components/Loader";
import { AlertCircle } from "lucide-react";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function Score() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Math.max(parseInt(searchParams.get("page")) || 1, 1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

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
  }, [currentPage]);

  // ==========================================
  // PAGINATION
  // ==========================================

  const handlePageChange = (page) => {
    if (
      page === pagination.currentPage ||
      page < 1 ||
      page > pagination.totalPages ||
      loading
    ) {
      return;
    }

    setSearchParams({
      page: String(page),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePrevious = () => {
    if (!pagination.hasPreviousPage || loading) return;

    handlePageChange(pagination.currentPage - 1);
  };

  const handleNext = () => {
    if (!pagination.hasNextPage || loading) return;

    handlePageChange(pagination.currentPage + 1);
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
              <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 gap-6">
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
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                hasPreviousPage={pagination.hasPreviousPage}
                hasNextPage={pagination.hasNextPage}
                totalItems={pagination.totalItems}
                loading={loading}
                onPageChange={handlePageChange}
                onPrevious={handlePrevious}
                onNext={handleNext}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
