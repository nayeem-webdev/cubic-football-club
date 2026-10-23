import { useMemo } from "react";

export const Timeline = ({
  events,
  matchData = {},
  match,
  emptyText = "No match events",
}) => {
  // =========================================
  // MATCH DATA
  // Supports:
  // <Timeline matchData={data} />
  // <Timeline match={data} />
  // =========================================

  const data =
    matchData && Object.keys(matchData).length > 0 ? matchData : match || {};

  const matchObj = data?.match ? data.match : data;

  // =========================================
  // EVENTS
  // =========================================

  const matchEvents =
    events || data?.matchEvents || matchObj?.matchEvents || [];

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
      if (!player) return;

      // Player is already populated
      if (player._id) {
        map.set(player._id.toString(), player);
      }
    });

    return map;
  }, [matchObj]);

  // =========================================
  // GET PLAYER
  // Handles ObjectId / string / populated object
  // =========================================

  const getPlayer = (player) => {
    if (!player) return null;

    // If event contains populated player object
    if (typeof player === "object" && player._id) {
      return playerMap.get(player._id.toString()) || player;
    }

    // If event contains just player ID
    return playerMap.get(player.toString()) || null;
  };

  // =========================================
  // GET PLAYER NAME
  // =========================================

  const getPlayerName = (player, fallback = "Unknown Player") => {
    const foundPlayer = getPlayer(player);

    return foundPlayer?.name || fallback;
  };

  // =========================================
  // CARD TYPE
  // =========================================

  const isRedCard = (event) => {
    return (
      event?.card === "red" ||
      event?.cardType === "red" ||
      event?.type === "red_card"
    );
  };

  // =========================================
  // FORMAT TIME
  // =========================================

  const formatTime = (timeInSeconds) => {
    if (
      typeof timeInSeconds !== "number" ||
      Number.isNaN(timeInSeconds) ||
      timeInSeconds < 0
    ) {
      return "00:00";
    }

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  };

  // =========================================
  // EVENT ICON
  // =========================================

  const renderEventIcon = (event) => {
    switch (event?.type) {
      case "goal":
        return "⚽";

      case "yellow_card":
      case "card":
      case "red_card":
        return isRedCard(event) ? "🟥" : "🟨";

      case "substitution":
        return "🔄";

      case "penalty":
        return "🥅";

      case "ownGoal":
      case "own_goal":
        return "↩";

      default:
        return "📌";
    }
  };

  // =========================================
  // EVENT INFORMATION
  // =========================================

  const getEventInfo = (event) => {
    if (!event) {
      return {
        player: "Unknown Player",
        assister: null,
        title: "EVENT",
      };
    }

    // =========================================
    // GOAL
    // =========================================

    if (event.type === "goal") {
      const scorerId = event.scorer || event.player;

      const scorer = getPlayerName(scorerId, "Unknown Scorer");

      const assister = event.assister
        ? getPlayerName(event.assister, "Unknown Assister")
        : null;

      return {
        player: scorer,
        assister: assister && assister !== "Unknown Assister" ? assister : null,
        title: "GOAL",
      };
    }

    // =========================================
    // SUBSTITUTION
    // =========================================

    if (event.type === "substitution") {
      const playerOut = getPlayerName(event.playerOut, "Unknown");

      const playerIn = getPlayerName(event.playerIn, "Unknown");

      return {
        player: `${playerOut} → ${playerIn}`,
        assister: null,
        title: "SUBSTITUTION",
      };
    }

    // =========================================
    // OTHER EVENTS
    // =========================================

    const playerId = event.player || event.scorer;

    const player = getPlayerName(playerId);

    let title = "EVENT";

    if (
      event.type === "yellow_card" ||
      event.type === "red_card" ||
      event.type === "card"
    ) {
      title = isRedCard(event) ? "RED CARD" : "YELLOW CARD";
    } else if (event.type === "penalty") {
      title = "PENALTY";
    } else if (event.type === "ownGoal" || event.type === "own_goal") {
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
      <p className="py-6 text-center text-sm text-text-muted/50">{emptyText}</p>
    );
  }

  // =========================================
  // TIMELINE
  // =========================================

  return (
    <div className="relative px-4 py-2">
      {/* CENTER VERTICAL LINE */}
      <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-secondary/50" />

      {/* EVENTS */}
      <div>
        {matchEvents.map((event, idx) => {
          const isHome = event?.team === "home";

          const { player, assister, title } = getEventInfo(event);

          const eventTime = formatTime(event?.time);

          return (
            <div
              key={event?.id || event?._id || idx}
              className="relative grid min-h-12 grid-cols-2 items-center gap-x-8"
            >
              {/* =========================================
                  CENTER DOT
              ========================================= */}

              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <div className="h-2 w-2 rounded-full border-2 border-secondary bg-surface" />
              </div>

              {/* =========================================
                  HOME / LEFT
              ========================================= */}

              {isHome ? (
                <div className="col-start-1 flex items-center justify-end gap-3 pr-2 text-right">
                  {/* PLAYER DETAILS */}

                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold leading-4 text-text">
                      {player}
                    </p>

                    {assister && (
                      <p className="text-[10px] font-medium leading-3.5 text-secondary">
                        👟 {assister}
                      </p>
                    )}

                    <p className="text-[9px] font-medium uppercase leading-3 tracking-wider text-text-muted">
                      {title}
                    </p>
                  </div>

                  {/* ICON */}

                  <span className="shrink-0 text-sm leading-none">
                    {renderEventIcon(event)}
                  </span>

                  {/* TIME */}

                  <span className="shrink-0 text-[11px] font-bold tabular-nums text-text">
                    {eventTime}
                  </span>
                </div>
              ) : (
                <div className="col-start-1" />
              )}

              {/* =========================================
                  AWAY / RIGHT
              ========================================= */}

              {!isHome ? (
                <div className="col-start-2 flex items-center justify-start gap-3 pl-2 text-left">
                  {/* TIME */}

                  <span className="shrink-0 text-[11px] font-bold tabular-nums text-text">
                    {eventTime}
                  </span>

                  {/* ICON */}

                  <span className="shrink-0 text-sm leading-none">
                    {renderEventIcon(event)}
                  </span>

                  {/* PLAYER DETAILS */}

                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold leading-4 text-text">
                      {player}
                    </p>

                    {assister && (
                      <p className="text-[10px] font-medium leading-3.5 text-secondary">
                        👟 {assister}
                      </p>
                    )}

                    <p className="text-[9px] font-medium uppercase leading-3 tracking-wider text-text-muted">
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
