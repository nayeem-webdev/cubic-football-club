import { useNavigate } from "react-router-dom";
import PageHero from "./PageHero";
import Loader from "./Loader";

const SelectMatch = ({ matches, onSelectMatch, loading }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-text">
      {loading && <Loader />}
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <PageHero
          text="MATCH CENTER"
          heading="Select a Match"
          subheading="Choose a match to manage the timer and match details."
        />

        {/* Match List */}
        <div className="grid gap-4">
          {matches.map((match) => (
            <button
              key={match._id}
              onClick={() => onSelectMatch(match)}
              className="group w-full rounded-2xl border-2 border-transparent bg-card hover:bg-card/80 text-text-muted p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-border"
            >
              <div className="grid gap-2 md:grid-cols-[1fr_1.2fr] md:items-center">
                {/* Teams */}
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded-md bg-secondary/15 px-2 py-1 text-xs font-semibold text-secondary">
                      {match.matchSchedule.matchType.toUpperCase()} MATCH
                    </span>

                    <span className="text-xs text-text-muted">
                      {match.matchSchedule.matchFormat} V{" "}
                      {match.matchSchedule.matchFormat}
                    </span>
                    <span className="text-xs text-text-muted">
                      {match.matchTime} MIN
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-text sm:text-2xl">
                    {match.homeTeam.name}

                    <span className="mx-3 text-accent">vs</span>

                    {match.awayTeam.name}
                  </h2>
                </div>

                {/* Match Info */}
                <div className="grid grid-cols-3 gap-4 text-sm text-text-muted">
                  {/* Date */}
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-text-muted">DATE</p>

                    <p className="font-medium text-text truncate">
                      {match.matchSchedule.date}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-text-muted">TIME</p>

                    <p className="font-medium text-text truncate">
                      {match.matchSchedule.time}
                    </p>
                  </div>

                  {/* Venue */}
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-text-muted">VENUE</p>

                    <p className="truncate font-medium text-text">
                      {match.matchSchedule.venue?.venue ||
                        "Venue not available"}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty State */}
        {matches.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border text-text-muted p-10 text-center">
            <p className="mb-4 text-text-muted">No matches available.</p>

            <button
              type="button"
              onClick={() => navigate("/new-match")}
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

export default SelectMatch;
