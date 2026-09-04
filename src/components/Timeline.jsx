import { useMemo } from "react";

export const Timeline = ({
  events,
  matchData = {},
  emptyText = "No match events",
}) => {
  // Safe resolution of root object properties (matching working component logic)
  const matchObj = matchData?.match ? matchData.match : matchData;
  const matchEvents =
    events || matchData?.matchEvents || matchObj?.matchEvents || [];

  // Map player IDs to player objects for fast lookup
  const playerMap = useMemo(() => {
    const map = new Map();
    const allPlayers = [
      ...(matchObj?.homeStartingPlayers || []),
      ...(matchObj?.homeSubstitutes || []),
      ...(matchObj?.awayStartingPlayers || []),
      ...(matchObj?.awaySubstitutes || []),
    ];

    allPlayers.forEach((player) => {
      if (player && player._id) {
        map.set(player._id, player);
      }
    });

    return map;
  }, [matchObj]);

  // Convert time in seconds to match minutes (e.g., 360s -> "6'")
  const formatTime = (timeInSeconds) => {
    if (typeof timeInSeconds !== "number") return "0'";
    const minutes = Math.ceil(timeInSeconds / 60);
    return `${minutes}'`;
  };

  // Render event icon according to type
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
      default:
        return "📌";
    }
  };

  // Get display text for event (resolving scorer and assister names)
  const getEventText = (event) => {
    if (event.type === "goal") {
      const scorerId = event.scorer || event.player;
      const scorer = playerMap.get(scorerId)?.name || "Unknown Scorer";
      const assister = event.assister
        ? playerMap.get(event.assister)?.name
        : null;

      return (
        <div>
          <p className="text-sm font-semibold">{scorer}</p>
          {assister && (
            <p
              className="text-[10px]"
              style={{ color: "var(--color-text-muted, #9ca3af)" }}
            >
              👟 {assister}
            </p>
          )}
        </div>
      );
    }

    const playerId = event.player || event.scorer;
    const player = playerMap.get(playerId)?.name || "Unknown Player";
    return <p className="text-sm font-semibold">{player}</p>;
  };

  if (!matchEvents || matchEvents.length === 0) {
    return (
      <p
        className="py-6 text-center text-sm"
        style={{ color: "var(--color-text-muted, #6b7280)" }}
      >
        {emptyText}
      </p>
    );
  }

  return (
    <div className="relative mt-4">
      {/* CENTER LINE */}
      <div
        className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2"
        style={{ background: "var(--color-border, #374151)" }}
      />

      <div className="space-y-3">
        {matchEvents.map((event, idx) => {
          const isHome = event.team === "home";

          return (
            <div
              key={event.id || idx}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-3"
            >
              {/* HOME SIDE */}
              <div
                className={
                  isHome ? "flex items-center justify-end gap-2 text-right" : ""
                }
              >
                {isHome && (
                  <>
                    <div>
                      {getEventText(event)}
                      <p
                        className="mt-0.5 text-[10px]"
                        style={{ color: "var(--color-text-muted, #9ca3af)" }}
                      >
                        {matchObj?.homeTeam?.shortForm}
                      </p>
                    </div>

                    <span className="text-sm">{renderEventIcon(event)}</span>
                  </>
                )}
              </div>

              {/* CENTER TIME */}
              <div
                className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold shadow-sm"
                style={{
                  background: "var(--color-surface, #1f2937)",
                  border: "1px solid var(--color-border, #374151)",
                  color: "var(--color-secondary, #f3f4f6)",
                }}
              >
                {formatTime(event.time)}
              </div>

              {/* AWAY SIDE */}
              <div>
                {!isHome && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{renderEventIcon(event)}</span>

                    <div>
                      {getEventText(event)}
                      <p
                        className="mt-0.5 text-[10px]"
                        style={{ color: "var(--color-text-muted, #9ca3af)" }}
                      >
                        {matchObj?.awayTeam?.shortForm}
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
  );
};
