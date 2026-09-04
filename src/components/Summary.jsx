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
          const cardData = {
            id: event.id,
            team: event.team,
            type: event.type,
            cardType:
              event.cardType || (event.type === "red_card" ? "red" : "yellow"),
            player: getPlayerName(event.player || event.scorer),
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
    }, [matchData]);

  if (!matchEvents || matchEvents.length === 0) {
    return (
      <p
        className="py-6 text-center text-sm"
        style={{ color: "var(--color-text-muted, #a1a1aa)" }}
      >
        No match events
      </p>
    );
  }

  const hasCards = homeCards.length > 0 || awayCards.length > 0;

  return (
    <div className="px-4 pt-4">
      {/* --- GOALS TIMELINE --- */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-4">
        {/* LEFT SIDE (HOME TEAM - LEFT ALIGNED) */}
        <div className="space-y-2 text-left">
          {homeGoalsGrouped.map((item, idx) => (
            <div key={idx} className="flex flex-col items-start">
              <p className="text-sm font-semibold">
                ⚽ {item.scorer}{" "}
                <span className="font-normal text-gray-300">
                  {item.times.join(", ")}
                </span>
              </p>
              {item.assists.map((ast, aIdx) => (
                <p
                  key={aIdx}
                  className="mt-0.5 flex items-center justify-start gap-1 text-sm text-gray-400"
                >
                  👟 {ast.assister} ({ast.time})
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* CENTER BALL ICON */}
        <div className="flex items-center justify-center h-full">
          <span className="text-lg">⚽</span>
        </div>

        {/* RIGHT SIDE (AWAY TEAM - RIGHT ALIGNED) */}
        <div className="space-y-1 text-right">
          {awayGoalsGrouped.map((item, idx) => (
            <div key={idx} className="flex flex-col items-end">
              <p className="text-sm font-semibold">
                {item.scorer}{" "}
                <span className="font-normal text-gray-300">
                  {item.times.join(", ")} ⚽
                </span>
              </p>
              {item.assists.map((ast, aIdx) => (
                <p
                  key={aIdx}
                  className="mt-0.5 flex items-center justify-end gap-1 text-sm text-gray-400"
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
          <h4 className="mb-3 text-center font-normal font-semibold uppercase tracking-wider text-gray-400">
            Cards
          </h4>

          <div className="grid grid-cols-2 gap-4">
            {/* HOME CARDS (LEFT ALIGNED) */}
            <div className="flex flex-wrap items-center justify-start gap-2">
              {homeCards.map((card) => {
                const isRed =
                  card.cardType === "red" || card.type === "red_card";
                return (
                  <div
                    key={card.id}
                    className="flex items-center gap-2 rounded bg-white/5 px-2.5 py-1 font-normal text-gray-200"
                  >
                    <span
                      className={`inline-block h-3.5 w-2.5 rounded-sm ${
                        isRed ? "bg-red-500" : "bg-yellow-400"
                      }`}
                    />
                    <span className="font-medium">{card.player}</span>
                    <span className="text-gray-400">({card.minute})</span>
                  </div>
                );
              })}
            </div>

            {/* AWAY CARDS (RIGHT ALIGNED) */}
            <div className="flex flex-wrap items-center justify-end gap-2">
              {awayCards.map((card) => {
                const isRed =
                  card.cardType === "red" || card.type === "red_card";
                return (
                  <div
                    key={card.id}
                    className="flex items-center gap-2 rounded bg-white/5 px-2.5 py-1 font-normal text-gray-200"
                  >
                    <span className="text-gray-400">({card.minute})</span>
                    <span className="font-medium">{card.player}</span>
                    <span
                      className={`inline-block h-3.5 w-2.5 rounded-sm ${
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
