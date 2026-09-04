import { useNavigate } from "react-router-dom";
import PageHero from "./PageHero";

const SelectMatch = ({ matches, onSelectMatch }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#07111F] px-4 py-10 text-[#F8FAFC]">
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
              className="group w-full rounded-2xl border border-[#28466B] bg-card p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#0E5FD8] hover:shadow-[0_0_25px_rgba(14,95,216,0.18)]"
            >
              <div className="grid gap-5 md:grid-cols-[1fr_1.2fr] md:items-center">
                {/* Teams */}
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded-md bg-[#0E5FD8]/15 px-2 py-1 text-xs font-semibold text-[#3A82FF]">
                      {match.matchSchedule.matchType.toUpperCase()} MATCH
                    </span>

                    <span className="text-xs text-[#B8C2D1]">
                      {match.matchSchedule.matchFormat} V{" "}
                      {match.matchSchedule.matchFormat}
                    </span>
                    <span className="text-xs text-[#B8C2D1]">
                      {match.matchTime} MIN
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#F8FAFC] sm:text-2xl">
                    {match.homeTeam.name}

                    <span className="mx-3 text-[#D4AF37]">vs</span>

                    {match.awayTeam.name}
                  </h2>
                </div>

                {/* Match Info */}
                <div className="grid grid-cols-3 gap-4 text-sm text-[#B8C2D1]">
                  {/* Date */}
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-[#B8C2D1]/60">DATE</p>

                    <p className="font-medium text-[#F8FAFC]">
                      {match.matchSchedule.date}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-[#B8C2D1]/60">TIME</p>

                    <p className="font-medium text-[#F8FAFC]">
                      {match.matchSchedule.time}
                    </p>
                  </div>

                  {/* Venue */}
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-[#B8C2D1]/60">VENUE</p>

                    <p className="font-medium text-[#F8FAFC]">
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
          <div className="rounded-2xl border border-dashed border-[#28466B] bg-[#0E1D34] p-10 text-center">
            <p className="mb-4 text-[#B8C2D1]">No matches available.</p>

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
