import { useNavigate } from "react-router-dom";
import PageHero from "./PageHero";

const SelectMatch = ({ matches, onSelectMatch }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-text">
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
              className="group w-full rounded-2xl border border-border text-muted p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#0E5FD8] hover:shadow-[0_0_25px_rgba(14,95,216,0.18)]"
            >
              <div className="grid gap-2 md:grid-cols-[1fr_1.2fr] md:items-center">
                {/* Teams */}
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded-md bg-primary/15 px-2 py-1 text-xs font-semibold text-secondary">
                      {match.matchSchedule.matchType.toUpperCase()} MATCH
                    </span>

                    <span className="text-xs text-muted">
                      {match.matchSchedule.matchFormat} V{" "}
                      {match.matchSchedule.matchFormat}
                    </span>
                    <span className="text-xs text-muted">
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
                <div className="grid grid-cols-3 gap-4 text-sm text-muted">
                  {/* Date */}
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-muted/60">DATE</p>

                    <p className="font-medium text-text">
                      {match.matchSchedule.date}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-muted/60">TIME</p>

                    <p className="font-medium text-text">
                      {match.matchSchedule.time}
                    </p>
                  </div>

                  {/* Venue */}
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-muted/60">VENUE</p>

                    <p className="font-medium text-text">
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
          <div className="rounded-2xl border border-dashed border-border text-muted p-10 text-center">
            <p className="mb-4 text-muted">No matches available.</p>

            <button
              type="button"
              onClick={() => navigate("/new-match")}
              className="rounded-lg bg-[#2563EB]/40 px-5 py-2.5 font-medium text-white transition hover:bg-[#1D4ED8]/30"
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
