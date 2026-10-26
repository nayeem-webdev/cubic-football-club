import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";

const API_URL = import.meta.env.VITE_API_URL;

const UpdateMatch = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async (page = 1) => {
    try {
      setLoading(true);

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
      console.log(err.message || "Something went wrong");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="mx-auto max-w-4xl">
        <PageHero
          text="MATCH CENTER"
          heading="Select a Match to Edit"
          subheading="Choose a match to edit players and match duration."
        />
        {loading && <Loader />}

        <div className="grid gap-4">
          {matches.map((match) => (
            <button
              key={match._id}
              onClick={() => navigate(`/edit-match/${match._id}`)}
              className="group w-full rounded-2xl border-2 border-transparent bg-card hover:bg-card/80 text-text-muted p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-border"
            >
              <div className="grid gap-2 md:grid-cols-[1fr_1.2fr] md:items-center">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded-md bg-secondary/15 px-2 py-1 text-xs font-semibold text-secondary">
                      {match.matchSchedule?.matchType?.toUpperCase() ||
                        "FRIENDLY"}{" "}
                      MATCH
                    </span>
                    <span className="text-xs text-text-muted">
                      {match.matchSchedule?.matchFormat} V{" "}
                      {match.matchSchedule?.matchFormat}
                    </span>
                    <span className="text-xs text-text-muted">
                      {match.matchTime} MIN
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-text sm:text-2xl">
                    {match.homeTeam?.name || "Home Team"}
                    <span className="mx-3 text-accent">vs</span>
                    {match.awayTeam?.name || "Away Team"}
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm text-text-muted">
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-text-muted">DATE</p>
                    <p className="font-medium text-text">
                      {match.matchSchedule?.date || "N/A"}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-text-muted">TIME</p>
                    <p className="font-medium text-text">
                      {match.matchSchedule?.time || "N/A"}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-text-muted">VENUE</p>
                    <p className="font-medium text-text">
                      {match.matchSchedule?.venue?.venue || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {matches.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border text-text-muted p-10 text-center">
            <p className="mb-4 text-text-muted">
              No matches available to edit.
            </p>
            <button
              type="button"
              onClick={() => navigate("/new-match")}
              className="rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition hover:bg-secondary"
            >
              Create Match
            </button>
          </div>
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
      </div>
    </div>
  );
};

export default UpdateMatch;
