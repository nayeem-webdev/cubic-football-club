import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "../components/PageHero";
import Loader from "../components/Loader";

const API_URL = import.meta.env.VITE_API_URL;

const UpdateMatch = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(`${API_URL}/matches`);
        const data = await response.json();
        const matchesList = Array.isArray(data.matches) ? data.matches : [];
        setMatches(matchesList);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-text">
      <div className="mx-auto max-w-4xl">
        <PageHero
          text="MATCH CENTER"
          heading="Select a Match to Edit"
          subheading="Choose a match to edit players and match duration."
        />

        <div className="grid gap-4">
          {matches.map((match) => (
            <button
              key={match._id}
              onClick={() => navigate(`/edit-match/${match._id}`)}
              className="group w-full rounded-2xl border border-border text-text-muted p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#0E5FD8] hover:shadow-[0_0_25px_rgba(14,95,216,0.18)]"
            >
              <div className="grid gap-2 md:grid-cols-[1fr_1.2fr] md:items-center">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded-md bg-primary/15 px-2 py-1 text-xs font-semibold text-[#3A82FF]">
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
                    <span className="mx-3 text-[#D4AF37]">vs</span>
                    {match.awayTeam?.name || "Away Team"}
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm text-text-muted">
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-text-muted/60">DATE</p>
                    <p className="font-medium text-text">
                      {match.matchSchedule?.date || "N/A"}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-text-muted/60">TIME</p>
                    <p className="font-medium text-text">
                      {match.matchSchedule?.time || "N/A"}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-text-muted/60">VENUE</p>
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
              className="rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition hover:bg-[#3A82FF]"
            >
              Create Match
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateMatch;
