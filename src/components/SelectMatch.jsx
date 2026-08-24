const SelectMatch = ({ matches, onSelectMatch }) => {
  return (
    <div className="min-h-screen bg-[#07111F] px-4 py-8 text-[#F8FAFC]">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold tracking-wider text-[#D4AF37]">
            MATCH CENTER
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">Select a Match</h1>

          <p className="mt-2 text-[#B8C2D1]">
            Choose a match to manage the timer and match details.
          </p>
        </div>

        {/* Match List */}
        <div className="grid gap-4">
          {matches.map((match) => (
            <button
              key={match._id}
              onClick={() => onSelectMatch(match)}
              className="group w-full rounded-2xl border border-[#28466B] bg-card p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#0E5FD8] hover:shadow-[0_0_25px_rgba(14,95,216,0.18)]"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                {/* Teams */}
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded-md bg-[#0E5FD8]/15 px-2 py-1 text-xs font-semibold text-[#3A82FF]">
                      MATCH
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
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-[#B8C2D1] sm:flex sm:items-center sm:gap-6">
                  {/* Date */}
                  <div>
                    <p className="mb-1 text-xs text-[#B8C2D1]/60">DATE</p>

                    <p className="font-medium text-[#F8FAFC]">
                      {match.matchSchedule.date}
                    </p>
                  </div>

                  {/* Time */}
                  <div>
                    <p className="mb-1 text-xs text-[#B8C2D1]/60">TIME</p>

                    <p className="font-medium text-[#F8FAFC]">
                      {match.matchSchedule.time}
                    </p>
                  </div>

                  {/* Venue */}
                  <div className="col-span-2 sm:col-span-1">
                    <p className="mb-1 text-xs text-[#B8C2D1]/60">VENUE</p>

                    <p className="font-medium text-[#F8FAFC]">
                      {match.matchSchedule.venue}
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
            <p className="text-[#B8C2D1]">No matches available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectMatch;
