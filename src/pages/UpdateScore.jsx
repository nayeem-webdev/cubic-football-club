import { useNavigate } from "react-router-dom";
import PageHero from "../components/PageHero";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const UpdateScore = () => {
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/simple-scores`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch scores");
        }

        setScores(data.scores || []);
      } catch (err) {
        console.error(err.message || "Something went wrong");
        setScores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-text">
      {loading && <Loader />}

      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <PageHero
          text="MATCH CENTER"
          heading="Select a Match"
          subheading="Choose a completed match to manage its score and events."
        />

        {/* Match List */}
        {!loading && scores.length > 0 && (
          <div className="grid gap-4">
            {scores.map((score) => {
              const match = score.match;
              const schedule = match?.matchSchedule;

              if (!match) return null;

              return (
                <button
                  key={score._id}
                  type="button"
                  onClick={() => navigate(`/update-score/${score._id}`)}
                  className="group w-full rounded-2xl border-2 border-transparent bg-card hover:bg-card/80 text-text-muted p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-border"
                >
                  <div className="grid gap-2 md:grid-cols-[1fr_1.2fr] md:items-center">
                    {/* Teams */}
                    <div>
                      <div className="mb-2 flex items-center gap-3">
                        {schedule?.matchType && (
                          <span className="rounded-md bg-secondary/15 px-2 py-1 text-xs font-semibold text-secondary">
                            {schedule.matchType.toUpperCase()} MATCH
                          </span>
                        )}

                        {schedule?.matchFormat && (
                          <span className="text-xs text-text-muted">
                            {schedule.matchFormat} V {schedule.matchFormat}
                          </span>
                        )}

                        {match.matchTime && (
                          <span className="text-xs text-text-muted">
                            {match.matchTime} MIN
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-bold text-text sm:text-2xl">
                        {match.homeTeam?.name || "Home Team"}

                        <span className="mx-3 text-accent">vs</span>

                        {match.awayTeam?.name || "Away Team"}
                      </h2>
                    </div>

                    {/* Match Info */}
                    <div className="grid grid-cols-3 gap-4 text-sm text-text-muted">
                      {/* Score */}
                      <div className="min-w-0">
                        <p className="mb-1 text-xs text-text-muted">SCORE</p>

                        <p className="truncate font-medium text-text">
                          {`${score.homeScore} - ${score.awayScore}`}
                        </p>
                      </div>

                      {/* Date */}
                      <div className="min-w-0">
                        <p className="mb-1 text-xs text-text-muted">DATE</p>

                        <p className="truncate font-medium text-text">
                          {schedule?.date || "—"}
                        </p>
                      </div>

                      {/* Time */}
                      <div className="min-w-0">
                        <p className="mb-1 text-xs text-text-muted">TIME</p>

                        <p className="truncate font-medium text-text">
                          {schedule?.time || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && scores.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-text-muted">
            <p className="mb-4 text-text-muted">No score available.</p>

            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition hover:bg-secondary"
            >
              Create Match
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateScore;
