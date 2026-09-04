import { useMemo } from "react";

export const Timeline = ({
  events,
  matchData = {},
  emptyText = "No match events",
}) => {
  // =========================================
  // MATCH DATA
  // =========================================

  const matchObj = matchData?.match ? matchData.match : matchData;

  const matchEvents =
    events || matchData?.matchEvents || matchObj?.matchEvents || [];

  // =========================================
  // PLAYER MAP
  // =========================================

  const playerMap = useMemo(() => {
    const map = new Map();

    const allPlayers = [
      ...(matchObj?.homeStartingPlayers || []),
      ...(matchObj?.homeSubstitutes || []),
      ...(matchObj?.awayStartingPlayers || []),
      ...(matchObj?.awaySubstitutes || []),
    ];

    allPlayers.forEach((player) => {
      if (player?._id) {
        map.set(player._id, player);
      }
    });

    return map;
  }, [matchObj]);

  // =========================================
  // FORMAT TIME
  // =========================================

  const formatTime = (timeInSeconds) => {
    if (typeof timeInSeconds !== "number") return "00:00";

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  };

  // =========================================
  // EVENT ICON
  // =========================================

  const renderEventIcon = (event) => {
    switch (event.type) {
      case "goal":
        return "⚽";

      case "yellow_card":
      case "card":
        return event.cardType === "red" ? "🟥" : "🟨";

      case "red_card":
        return "🟥";

      case "substitution":
        return "🔄";

      case "penalty":
        return "🥅";

      case "ownGoal":
        return "↩";

      default:
        return "📌";
    }
  };

  // =========================================
  // EVENT INFORMATION
  // =========================================

  const getEventInfo = (event) => {
    // GOAL
    if (event.type === "goal") {
      const scorerId = event.scorer || event.player;

      const scorer = playerMap.get(scorerId)?.name || "Unknown Scorer";

      const assister = event.assister
        ? playerMap.get(event.assister)?.name
        : null;

      return {
        player: scorer,
        assister,
        title: "GOAL",
      };
    }

    // SUBSTITUTION
    if (event.type === "substitution") {
      const playerOut = playerMap.get(event.playerOut)?.name || "Unknown";

      const playerIn = playerMap.get(event.playerIn)?.name || "Unknown";

      return {
        player: `${playerOut} → ${playerIn}`,
        assister: null,
        title: "SUBSTITUTION",
      };
    }

    // OTHER EVENTS
    const playerId = event.player || event.scorer;

    const player = playerMap.get(playerId)?.name || "Unknown Player";

    let title = "EVENT";

    if (
      event.type === "yellow_card" ||
      (event.type === "card" && event.cardType !== "red")
    ) {
      title = "YELLOW CARD";
    }

    if (
      event.type === "red_card" ||
      (event.type === "card" && event.cardType === "red")
    ) {
      title = "RED CARD";
    }

    if (event.type === "penalty") {
      title = "PENALTY";
    }

    if (event.type === "ownGoal") {
      title = "OWN GOAL";
    }

    return {
      player,
      assister: null,
      title,
    };
  };

  // =========================================
  // EMPTY STATE
  // =========================================

  if (!matchEvents || matchEvents.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-[#B8C2D1]/50">{emptyText}</p>
    );
  }

  // =========================================
  // TIMELINE
  // =========================================

  return (
    <div className="relative py-2 px-4">
      {/* CENTER VERTICAL LINE */}
      <div className="absolute bottom-0 top-0 left-1/2 w-px -translate-x-1/2 bg-[#28466B]" />

      {/* EVENTS CONTAINER */}
      <div>
        {matchEvents.map((event, idx) => {
          const isHome = event.team === "home";

          const { player, assister, title } = getEventInfo(event);
          const eventTime = formatTime(event.time);

          return (
            <div
              key={event.id || idx}
              className="relative grid grid-cols-2 gap-x-8 items-center min-h-12"
            >
              {/* GREEN CENTER DOT */}
              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <div className="h-2 w-2 rounded-full border-2 border-accent bg-[#0E1D34]" />
              </div>

              {/* HOME SIDE (LEFT COLUMN) */}
              {isHome ? (
                <div className="col-start-1 flex items-center justify-end gap-3 text-right pr-2">
                  {/* PLAYER & EVENT DETAILS */}
                  <div className="min-w-0">
                    <p className="text-xs font-bold leading-4 text-[#F8FAFC]">
                      {player}
                    </p>

                    {assister && (
                      <p className="text-[10px] font-medium leading-3.5 text-secondary">
                        👟 {assister}
                      </p>
                    )}

                    <p className="text-[9px] font-medium uppercase leading-3 tracking-wider text-[#6F86A3]">
                      {title}
                    </p>
                  </div>

                  {/* ICON */}
                  <span className="shrink-0 text-sm leading-none">
                    {renderEventIcon(event)}
                  </span>

                  {/* TIME */}
                  <span className="shrink-0 text-[11px] font-bold tabular-nums text-[#F8FAFC]">
                    {eventTime}
                  </span>
                </div>
              ) : (
                <div className="col-start-1" />
              )}

              {/* AWAY SIDE (RIGHT COLUMN) */}
              {!isHome ? (
                <div className="col-start-2 flex items-center justify-start gap-3 text-left pl-2">
                  {/* TIME */}
                  <span className="shrink-0 text-[11px] font-bold tabular-nums text-[#F8FAFC]">
                    {eventTime}
                  </span>

                  {/* ICON */}
                  <span className="shrink-0 text-sm leading-none">
                    {renderEventIcon(event)}
                  </span>

                  {/* PLAYER & EVENT DETAILS */}
                  <div className="min-w-0">
                    <p className="text-xs font-bold leading-4 text-[#F8FAFC]">
                      {player}
                    </p>

                    {assister && (
                      <p className="text-[10px] font-medium leading-3.5 text-secondary">
                        👟 {assister}
                      </p>
                    )}

                    <p className="text-[9px] font-medium uppercase leading-3 tracking-wider text-[#6F86A3]">
                      {title}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="col-start-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
