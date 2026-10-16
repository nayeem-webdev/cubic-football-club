import { useMemo } from "react";

// Converts match time in seconds to minutes string (e.g. 360 -> "6'")
const formatTime = (seconds) => `${Math.ceil(seconds / 60)}'`;

export default function Summary({ matchData }) {
  // Safe resolution of root object properties
  const matchObj = matchData?.match ? matchData.match : matchData;
  const matchEvents = matchData?.matchEvents || matchObj?.matchEvents || [];

  // Helper to look up player name from any roster list
  const getPlayerName = (playerId) => {
    if (!playerId || !matchObj) return null;

    const allPlayers = [
      ...(matchObj.homeStartingPlayers || []),
      ...(matchObj.homeSubstitutes || []),
      ...(matchObj.awayStartingPlayers || []),
      ...(matchObj.awaySubstitutes || []),
    ];

    const player = allPlayers.find((p) => p._id === playerId);
    return player ? player.name : "Unknown Player";
  };

  // Process & group goal/card events
  const { homeGoalsGrouped, awayGoalsGrouped, homeCards, awayCards } =
    useMemo(() => {
      const homeGoals = {};
      const awayGoals = {};
      const homeCardsList = [];
      const awayCardsList = [];

      matchEvents.forEach((event) => {
        // CARDS
        if (
          event.type === "yellow_card" ||
          event.type === "red_card" ||
          event.type === "card"
        ) {
          const isRedCard =
            event.card === "red" ||
            event.cardType === "red" ||
            event.type === "red_card";

          const cardData = {
            id: event.id,
            team: event.team,
            type: event.type,
            cardType: isRedCard ? "red" : "yellow",
            player:
              getPlayerName(event.player || event.scorer) || "Unknown Player",
            minute: formatTime(event.time),
          };

          if (event.team === "home") {
            homeCardsList.push(cardData);
          } else {
            awayCardsList.push(cardData);
          }
          return;
        }

        // GOALS
        if (event.type === "goal") {
          const scorerName = getPlayerName(event.scorer) || "Unknown Player";
          const assisterName = getPlayerName(event.assister);
          const timeFormatted = formatTime(event.time);
          const targetGroup = event.team === "home" ? homeGoals : awayGoals;

          if (!targetGroup[scorerName]) {
            targetGroup[scorerName] = {
              scorer: scorerName,
              times: [],
              assists: [],
            };
          }

          targetGroup[scorerName].times.push(timeFormatted);

          if (assisterName) {
            targetGroup[scorerName].assists.push({
              assister: assisterName,
              time: timeFormatted,
            });
          }
        }
      });

      return {
        homeGoalsGrouped: Object.values(homeGoals),
        awayGoalsGrouped: Object.values(awayGoals),
        homeCards: homeCardsList,
        awayCards: awayCardsList,
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchData]);

  if (!matchEvents || matchEvents.length === 0) {
    return (
      <p
        className="py-6 text-center text-sm"
        style={{ color: "var(--color-text-text-muted, #a1a1aa)" }}
      >
        No match events
      </p>
    );
  }

  const hasCards = homeCards.length > 0 || awayCards.length > 0;

  return (
    <div className="mt-4">
      {/* --- GOALS TIMELINE --- */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
        {/* LEFT SIDE (HOME GOALS - LEFT ALIGNED) */}
        <div className="space-y-2 text-left">
          {homeGoalsGrouped.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-start text-[10px] lg:text-sm"
            >
              <p className="font-semibold">
                ⚽ {item.scorer}{" "}
                <span className="font-normal text-gray-300">
                  {item.times.join(", ")}
                </span>
              </p>
              {item.assists.map((ast, aIdx) => (
                <p
                  key={aIdx}
                  className="mt-0.5 flex items-center justify-start gap-1 text-text-muted"
                >
                  👟 {ast.assister} ({ast.time})
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* CENTER BALL ICON */}
        <div className="flex items-center justify-center h-full">
          <span className="text-[10px] lg:text-sm">⚽</span>
        </div>

        {/* RIGHT SIDE (AWAY GOALS - RIGHT ALIGNED) */}
        <div className="space-y-2 text-right">
          {awayGoalsGrouped.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-end text-[10px] lg:text-sm"
            >
              <p className="font-semibold">
                {item.scorer}{" "}
                <span className="font-normal text-gray-300">
                  {item.times.join(", ")} ⚽
                </span>
              </p>
              {item.assists.map((ast, aIdx) => (
                <p
                  key={aIdx}
                  className="mt-0.5 flex items-center justify-end gap-1 text-text-muted"
                >
                  {ast.assister} ({ast.time}) 👟
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* --- CARDS SECTION --- */}
      {hasCards && (
        <div className="mt-6 border-t border-gray-700/60 pt-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
            {/* LEFT SIDE (HOME CARDS - LEFT ALIGNED) */}
            <div className="space-y-2 text-left">
              {homeCards.map((card) => {
                const isRed = card.cardType === "red";
                return (
                  <div
                    key={card.id}
                    className="flex items-center justify-start gap-1.5 text-[10px] lg:text-sm font-semibold"
                  >
                    <span
                      className={`inline-block h-3.5 w-2.5 shrink-0 rounded-xs ${
                        isRed ? "bg-red-500" : "bg-yellow-400"
                      }`}
                    />
                    <span>{card.player}</span>
                    <span className="font-normal text-gray-300">
                      {card.minute}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* CENTER CARD ICON */}
            <div className="flex items-center justify-center h-full">
              <span className="text-[10px] lg:text-sm">🟨</span>
            </div>

            {/* RIGHT SIDE (AWAY CARDS - RIGHT ALIGNED) */}
            <div className="space-y-2 text-right">
              {awayCards.map((card) => {
                const isRed = card.cardType === "red";
                return (
                  <div
                    key={card.id}
                    className="flex items-center justify-end gap-1.5 text-[10px] lg:text-sm font-semibold"
                  >
                    <span className="font-normal text-gray-300">
                      {card.minute}
                    </span>
                    <span>{card.player}</span>
                    <span
                      className={`inline-block h-3.5 w-2.5 shrink-0 rounded-xs ${
                        isRed ? "bg-red-500" : "bg-yellow-400"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
