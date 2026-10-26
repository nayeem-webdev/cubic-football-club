import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

import Loader from "../components/Loader";
import PageHero from "../components/PageHero";
import MatchCard from "../components/MatchCard";
import { useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";

const API_URL = import.meta.env.VITE_API_URL;

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Math.max(parseInt(searchParams.get("page")) || 1, 1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // ==========================================
  // FETCH MATCHES
  // ==========================================

  const fetchMatches = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/all-matches?page=${page}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch matches");
      }

      setMatches(data.matches || []);

      // Backend pagination
      setPagination({
        currentPage: data.pagination?.page || page,
        totalPages: data.pagination?.totalPages || 1,
        totalItems: data.pagination?.totalMatches || 0,
        hasNextPage: data.pagination?.hasNextPage || false,
        hasPreviousPage: data.pagination?.hasPreviousPage || false,
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMatches(currentPage);
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
      {loading && <Loader />}

      {error && (
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-red-500/30 p-8 text-center text-text-muted">
          <AlertCircle className="mb-3 h-8 w-8 text-red-400" />

          <h2 className="text-lg font-semibold text-text">
            Unable to load matches
          </h2>

          <p className="mt-2 text-sm text-text-muted">{error}</p>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        {/* HERO */}
        <PageHero
          text={"CUBIC FC"}
          heading={"Matches"}
          subheading={
            "Follow upcoming fixtures, friendly matches, and previous games."
          }
        />

        {/* MATCHES */}
        {matches.length === 0 && !loading ? (
          <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <p className="text-text-muted">No matches available.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {matches.map((match) => (
                <MatchCard match={match} key={match._id} />
              ))}
            </div>

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
};

export default Matches;
