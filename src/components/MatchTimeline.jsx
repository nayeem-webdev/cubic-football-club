import { useMemo } from "react";

const MatchTimeline = ({ selectedMatch }) => {
  // =========================================
  // PLAYER MAP
  // =========================================

  const playerMap = useMemo(() => {
    if (!selectedMatch) return {};

    const allPlayers = [
      ...(selectedMatch.homeStartingPlayers || []),
      ...(selectedMatch.homeSubstitutes || []),
      ...(selectedMatch.awayStartingPlayers || []),
      ...(selectedMatch.awaySubstitutes || []),
    ];

    return Object.fromEntries(allPlayers.map((player) => [player._id, player]));
  }, [selectedMatch]);

  if (!selectedMatch) return null;

  const events = [...(selectedMatch.matchEvents || [])].sort(
    (a, b) => a.time - b.time,
  );

  return (
    <div className="mt-5 rounded-2xl border border-[#28466B] bg-[#0E1D34] p-4">
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#F8FAFC] sm:text-base">
          Match Timeline
        </h2>

        <span className="text-[10px] font-medium uppercase tracking-wider text-[#B8C2D1]/40">
          {events.length} Events
        </span>
      </div>

      {/* ========================================= */}
      {/* TEAM HEADERS */}
      {/* ========================================= */}

      <div className="mb-3 grid grid-cols-[1fr_32px_1fr] items-center">
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#49C85A]">
            {selectedMatch.homeTeam.name}
          </p>
        </div>

        <div />

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#49C85A]">
            {selectedMatch.awayTeam.name}
          </p>
        </div>
      </div>

      {/* ========================================= */}
      {/* TIMELINE */}
      {/* ========================================= */}

      <div className="relative">
        {/* CENTER LINE */}

        {events.length > 0 && (
          <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-[#28466B]" />
        )}

        <div className="space-y-3">
          {events.map((event) => {
            // =========================================
            // PLAYERS
            // =========================================

            const player = playerMap[event.scorer] || playerMap[event.player];

            const playerOut = playerMap[event.playerOut];
            const playerIn = playerMap[event.playerIn];

            // =========================================
            // TIME
            // =========================================

            const minutes = Math.floor(event.time / 60);
            const seconds = event.time % 60;

            const eventTime = `${String(minutes).padStart(2, "0")}:${String(
              seconds,
            ).padStart(2, "0")}`;

            // =========================================
            // EVENT TYPE
            // =========================================

            let icon = "⚽";
            let title = "Goal";

            if (event.type === "penalty") {
              icon = "⚽";
              title = "Penalty";
            }

            if (event.type === "ownGoal") {
              icon = "↩";
              title = "Own Goal";
            }

            if (event.type === "card") {
              icon = event.card === "yellow" ? "🟨" : "🟥";
              title = event.card === "yellow" ? "Yellow Card" : "Red Card";
            }

            if (event.type === "substitution") {
              icon = "🔄";
              title = "Substitution";
            }

            // =========================================
            // DESCRIPTION
            // =========================================

            let description = player?.name || "Unknown";

            if (event.type === "substitution") {
              description = `${playerOut?.name || "Unknown"} → ${
                playerIn?.name || "Unknown"
              }`;
            }

            // =========================================
            // TEAM
            // =========================================

            const isHome = event.team === "home";

            return (
              <div
                key={event.id}
                className="grid min-h-[42px] grid-cols-[1fr_32px_1fr] items-center"
              >
                {/* ================================= */}
                {/* HOME */}
                {/* ================================= */}

                <div className="pr-3">
                  {isHome && (
                    <div className="flex items-center justify-end gap-2">
                      <div className="min-w-0 text-right">
                        <p className="text-xs font-semibold text-[#F8FAFC]">
                          {description}
                        </p>

                        <p className="text-[9px] uppercase tracking-wider text-[#B8C2D1]/40">
                          {title}
                        </p>
                      </div>

                      <span className="shrink-0 text-sm">{icon}</span>

                      <span className="text-[10px] font-bold tabular-nums text-[#B8C2D1]">
                        {eventTime}
                      </span>
                    </div>
                  )}
                </div>

                {/* ================================= */}
                {/* CENTER */}
                {/* ================================= */}

                <div className="relative z-10 flex justify-center">
                  <div className="h-2 w-2 rounded-full border-2 border-[#49C85A] bg-[#0E1D34]" />
                </div>

                {/* ================================= */}
                {/* AWAY */}
                {/* ================================= */}

                <div className="pl-3">
                  {!isHome && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tabular-nums text-[#B8C2D1]">
                        {eventTime}
                      </span>

                      <span className="shrink-0 text-sm">{icon}</span>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#F8FAFC]">
                          {description}
                        </p>

                        <p className="text-[9px] uppercase tracking-wider text-[#B8C2D1]/40">
                          {title}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================= */}
      {/* EMPTY STATE */}
      {/* ========================================= */}

      {events.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-[#B8C2D1]/50">No match events yet</p>
        </div>
      )}
    </div>
  );
};

export default MatchTimeline;
